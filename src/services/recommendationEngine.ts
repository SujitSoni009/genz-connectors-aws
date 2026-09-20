import { Profile, Project, Recommendation, Event } from '../types';
import { mockProfiles, mockProjects, mockEvents, CURRENT_USER_ID } from '../data/mockData';

export interface RecommendationQuery {
  requesterId: string;
  projectId?: string;
  intent?: string;
  eventId?: string;
  availabilityFilter?: string;
}

export interface CandidateScore {
  profile: Profile;
  stage1Score: number;
  matchedGaps: string[];
  matchedNeeds: string[];
  sharedContextItems: string[];
}

/**
 * Stage 1: Deterministic Candidate Retrieval
 * Filters candidates based on privacy, existing connections, and evaluates
 * initial complementarity signals (Project Gaps -> Candidate Skills, Candidate Needs -> User Offers).
 */
export function retrieveCandidates(
  requester: Profile,
  activeProject?: Project,
  eventId?: string,
  allProfiles: Profile[] = mockProfiles
): CandidateScore[] {
  // Exclude requester and users whose privacy prevents discovery
  const eligible = allProfiles.filter((p) => {
    if (p.userId === requester.userId) return false;
    if (p.privacyPreferences.profileVisibility === 'connections_only') return false;
    if (eventId && p.privacyPreferences.profileVisibility === 'event_only' && !p.events.includes(eventId)) {
      return false;
    }
    return true;
  });

  const projectGaps = activeProject?.declaredNeeds || requester.lookingFor || [];
  const requesterOffers = requester.canOffer.concat(activeProject?.currentCapabilities || []);

  const scoredCandidates: CandidateScore[] = eligible.map((candidate) => {
    let score = 0;
    const matchedGaps: string[] = [];
    const matchedNeeds: string[] = [];
    const sharedContextItems: string[] = [];

    // 1. Complementary Signal: Does Candidate provide what Requester Project Needs?
    for (const gap of projectGaps) {
      const gapWords = gap.toLowerCase().split(/\W+/).filter(Boolean);
      for (const skill of candidate.skills.concat(candidate.canOffer)) {
        const skillLower = skill.toLowerCase();
        if (gapWords.some((w) => w.length > 2 && skillLower.includes(w)) || gap.toLowerCase().includes(skillLower)) {
          if (!matchedGaps.includes(skill)) {
            matchedGaps.push(skill);
            score += 15;
          }
        }
      }
    }

    // 2. Complementary Signal: Does Requester provide what Candidate is Looking For?
    for (const need of candidate.lookingFor) {
      const needWords = need.toLowerCase().split(/\W+/).filter(Boolean);
      for (const offer of requesterOffers.concat(requester.skills)) {
        const offerLower = offer.toLowerCase();
        if (needWords.some((w) => w.length > 2 && offerLower.includes(w)) || need.toLowerCase().includes(offerLower)) {
          if (!matchedNeeds.includes(offer)) {
            matchedNeeds.push(offer);
            score += 12;
          }
        }
      }
    }

    // 3. Event Co-attendance Context
    if (eventId && candidate.events.includes(eventId)) {
      score += 10;
      const ev = mockEvents.find((e) => e.id === eventId);
      if (ev) sharedContextItems.push(`Both participating in ${ev.name}`);
    } else {
      const commonEvents = candidate.events.filter((e) => requester.events.includes(e));
      if (commonEvents.length > 0) {
        score += 8;
        sharedContextItems.push(`Co-attending ${commonEvents.length} mutual event(s)`);
      }
    }

    // 4. Intent Compatibility
    if (requester.currentIntent === candidate.currentIntent) {
      score += 6;
      sharedContextItems.push(`Aligned intent: "${candidate.currentIntent}"`);
    } else if (
      (requester.currentIntent === 'Find collaborator' && candidate.currentIntent === 'Find teammate') ||
      (requester.currentIntent === 'Find mentor' && candidate.canOffer.some((o) => o.toLowerCase().includes('mentor')))
    ) {
      score += 8;
      sharedContextItems.push(`Compatible intents: "${requester.currentIntent}" & "${candidate.currentIntent}"`);
    }

    // 5. Shared Domain Interests
    const sharedInterests = candidate.interests.filter((i) =>
      requester.interests.some((ri) => ri.toLowerCase() === i.toLowerCase() || (activeProject && activeProject.domain.toLowerCase().includes(i.toLowerCase())))
    );
    if (sharedInterests.length > 0) {
      score += sharedInterests.length * 4;
      sharedContextItems.push(`Shared interest in ${sharedInterests.join(', ')}`);
    }

    // 6. Availability Bonus
    if (candidate.availability === 'Available now' || candidate.availability === 'Available this weekend') {
      score += 4;
    }

    return {
      profile: candidate,
      stage1Score: score,
      matchedGaps,
      matchedNeeds,
      sharedContextItems,
    };
  });

  // Sort descending by Stage 1 deterministic complementarity score
  return scoredCandidates.sort((a, b) => b.stage1Score - a.stage1Score);
}

/**
 * Stage 2: AI Bedrock Complementarity & Gap Reasoning
 * Takes top candidates and evaluates exact complementarity narratives.
 * Explains WHY Person X should meet Person Y, mutual value, and specific collaboration points.
 */
export function generateRecommendations(
  requester: Profile,
  activeProject?: Project,
  eventId?: string,
  allProfiles: Profile[] = mockProfiles,
  topN = 4
): Recommendation[] {
  const stage1Candidates = retrieveCandidates(requester, activeProject, eventId, allProfiles);
  const topCandidates = stage1Candidates.slice(0, topN);

  const activeEvent = mockEvents.find((e) => e.id === eventId) || mockEvents[0];

  return topCandidates.map((candidateScore, idx) => {
    const candidate = candidateScore.profile;
    const reasons: string[] = [];
    const compCaps: string[] = [];

    // Construct precise, human-understandable "Why you should meet" bullet points
    if (activeProject) {
      if (candidateScore.matchedGaps.length > 0) {
        reasons.push(`Your project "${activeProject.name}" needs ${candidateScore.matchedGaps.slice(0, 2).join(' & ')}.`);
        reasons.push(`${candidate.name.split(' ')[0]} has proven experience in ${candidateScore.matchedGaps.join(', ')}.`);
        compCaps.push(...candidateScore.matchedGaps);
      } else {
        reasons.push(`${candidate.name.split(' ')[0]} offers capabilities in ${candidate.canOffer.slice(0, 2).join(' and ')}.`);
      }

      if (candidateScore.matchedNeeds.length > 0) {
        reasons.push(`${candidate.name.split(' ')[0]} is explicitly looking for ${candidateScore.matchedNeeds.slice(0, 2).join(' / ')} collaboration.`);
        reasons.push(`You provide ${requester.skills.slice(0, 3).join(', ')} capabilities.`);
      }

      // Check if domain interests align
      const relatedInterests = candidate.interests.filter(i =>
        activeProject.domain.toLowerCase().includes(i.toLowerCase()) ||
        activeProject.description.toLowerCase().includes(i.toLowerCase())
      );
      if (relatedInterests.length > 0) {
        reasons.push(`${candidate.name.split(' ')[0]} has high interest in ${relatedInterests.join(' & ')}.`);
      }
    } else {
      if (candidateScore.matchedGaps.length > 0) {
        reasons.push(`You are looking for ${requester.lookingFor.slice(0, 2).join(', ')}.`);
        reasons.push(`${candidate.name.split(' ')[0]} specializes in ${candidateScore.matchedGaps.join(', ')}.`);
      }
      if (candidateScore.matchedNeeds.length > 0) {
        reasons.push(`${candidate.name.split(' ')[0]} needs ${candidateScore.matchedNeeds.slice(0, 2).join(', ')}.`);
        reasons.push(`You can offer ${requester.canOffer.slice(0, 2).join(', ')}.`);
      }
    }

    // Event context
    if (candidate.events.includes(activeEvent.id)) {
      reasons.push(`Both attending ${activeEvent.name}.`);
    }

    // Approximate distance simulation (only if both users enabled location during this event)
    let approximateDistance = 'Distance unavailable';
    if (
      requester.privacyPreferences.locationSharing !== 'OFF' &&
      candidate.privacyPreferences.locationSharing !== 'OFF' &&
      candidate.events.includes(activeEvent.id)
    ) {
      // Deterministic approximate distance based on candidate index
      const distances = ['Approx. 320 m away · Near Workshop Area', 'Approx. 550 m away · Main Hall', 'Approx. 800 m away · Hack Lounge'];
      approximateDistance = distances[idx % distances.length];
    }

    // Recommendation summary
    const summary = `${candidate.name} is a high-complementarity match for "${activeProject?.name || 'your work'}", bridging your missing ${compCaps.slice(0, 2).join(' & ') || 'capabilities'} while benefiting from your ${requester.skills.slice(0, 2).join(' and ')} expertise.`;

    return {
      id: `rec-${candidate.id}-${Date.now()}`,
      requesterId: requester.userId,
      candidateId: candidate.userId,
      projectId: activeProject?.id,
      eventId: activeEvent.id,
      reasons,
      complementaryCapabilities: compCaps.length > 0 ? compCaps : candidate.skills.slice(0, 3),
      sharedContext: candidateScore.sharedContextItems,
      candidateOffers: candidate.canOffer,
      candidateNeeds: candidate.lookingFor,
      recommendationSummary: summary,
      approximateDistance,
      createdAt: new Date().toISOString(),
    };
  });
}

/**
 * Generates an AI-crafted introduction message draft for approval before sending.
 */
export function generateIntroductionDraft(
  requester: Profile,
  candidate: Profile,
  activeProject?: Project,
  event?: Event
): string {
  const candidateFirstName = candidate.name.split(' ')[0];
  const myKeySkills = requester.skills.slice(0, 2).join(' and ');
  const candidateComplement = candidate.skills.slice(0, 2).join(' and ');

  if (activeProject) {
    return `Hi ${candidateFirstName}, I'm building "${activeProject.name}" using ${myKeySkills}. I noticed your impressive background in ${candidateComplement} and shared interest in ${candidate.interests[0] || 'innovative tech'}. I believe our skills could strongly complement each other on this project. Are you free to connect or discuss for a few minutes at ${event?.name || 'the event'}?`;
  }

  return `Hi ${candidateFirstName}, I saw your work in ${candidateComplement} at ${event?.name || 'our community'}. I'm focusing on ${requester.canOffer[0] || myKeySkills} and looking to collaborate. I'd love to connect and share notes on what we're both building!`;
}

/**
 * Bedrock Project Gap Analysis Simulator
 */
export function analyzeProjectGaps(project: Project): Project['gapAnalysis'] {
  const caps = project.currentCapabilities.map(c => c.toLowerCase());
  const techs = project.technologies.map(t => t.toLowerCase());

  const hasFrontend = techs.some(t => ['react', 'vue', 'angular', 'next.js', 'svelte'].includes(t)) ||
                     caps.some(c => c.includes('frontend') || c.includes('ui'));
  const hasBackend = techs.some(t => ['java', 'spring', 'python', 'node', 'go'].includes(t)) ||
                    caps.some(c => c.includes('backend') || c.includes('api'));
  const hasDesign = caps.some(c => c.includes('design') || c.includes('ux') || c.includes('ui'));
  const hasCloud = techs.some(t => ['aws', 'gcp', 'azure', 'docker'].includes(t)) ||
                   caps.some(c => c.includes('cloud') || c.includes('infrastructure'));

  const gaps = [];
  const collabs = [];
  const roles = [];

  if (!hasFrontend) {
    gaps.push({
      area: 'Frontend Client Architecture',
      missingCapability: 'Modern Interactive UI / React',
      reason: 'The project features solid backend endpoints but lacks a modern, accessible web client for users.',
      priority: 'high' as const,
      suggestedRole: 'Senior React Developer',
    });
    collabs.push('Interactive web UI implementation');
    roles.push('Frontend Engineer');
  }

  if (!hasDesign) {
    gaps.push({
      area: 'Product Experience & Usability',
      missingCapability: 'UI/UX Clinical & User Flow Design',
      reason: 'No dedicated design system or user journey wireframes have been declared for complex interactions.',
      priority: 'high' as const,
      suggestedRole: 'UI/UX Product Designer',
    });
    collabs.push('Figma wireframes & design system creation');
    roles.push('Product Designer');
  }

  if (project.domain.toLowerCase().includes('health') || project.name.toLowerCase().includes('health')) {
    gaps.push({
      area: 'Domain Compliance & Workflow Validation',
      missingCapability: 'Healthcare Domain & HIPAA Compliance Insight',
      reason: 'Healthcare software demands strict data privacy adherence and real clinical workflow validation.',
      priority: 'medium' as const,
      suggestedRole: 'Clinical Informatician / Advisor',
    });
    collabs.push('Clinical workflow review & compliance safeguards');
    roles.push('Healthcare Domain Specialist');
  }

  if (!hasCloud && !hasBackend) {
    gaps.push({
      area: 'Backend Infrastructure',
      missingCapability: 'Scalable Microservices & Cloud Storage',
      reason: 'Client-side code needs secure server-side APIs and structured cloud databases.',
      priority: 'high' as const,
      suggestedRole: 'Backend Cloud Engineer',
    });
  }

  return {
    projectId: project.id,
    currentCapabilities: project.currentCapabilities,
    technicalGaps: gaps,
    collaborationNeeds: collabs,
    suggestedRoles: roles,
    analyzedAt: new Date().toISOString(),
  };
}
