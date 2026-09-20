export type IntentType =
  | 'Find collaborator'
  | 'Find teammate'
  | 'Find cofounder'
  | 'Find mentor'
  | 'Find researcher'
  | 'Find customer'
  | 'Find internship/job opportunity'
  | 'Learn'
  | 'Teach'
  | 'Network';

export type AvailabilityStatus = 'Available now' | 'Available this weekend' | 'Part-time' | 'Full-time' | 'Busy';

export type LocationSharingMode = 'OFF' | 'During This Event' | 'Always';

export interface PrivacyPreferences {
  profileVisibility: 'public' | 'event_only' | 'connections_only';
  skillsVisibility: boolean;
  projectVisibility: boolean;
  intentVisibility: boolean;
  locationSharing: LocationSharingMode;
  allowDirectIntroductions: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  name: string;
  headline: string;
  bio: string;
  skills: string[];
  interests: string[];
  experience: string; // e.g. 'Senior', 'Intermediate', 'Student'
  canOffer: string[];
  lookingFor: string[];
  currentIntent: IntentType;
  availability: AvailabilityStatus;
  events: string[]; // event IDs
  projects: string[]; // project IDs
  privacyPreferences: PrivacyPreferences;
  avatarUrl?: string;
  city?: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

export interface ProjectGap {
  area: string;
  missingCapability: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  suggestedRole: string;
}

export interface ProjectAnalysis {
  projectId: string;
  currentCapabilities: string[];
  technicalGaps: ProjectGap[];
  collaborationNeeds: string[];
  suggestedRoles: string[];
  analyzedAt: string;
}

export interface Project {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  technologies: string[];
  currentCapabilities: string[];
  declaredNeeds: string[];
  projectStage: 'Idea' | 'Prototype' | 'In Progress' | 'Beta' | 'Launched';
  domain: string;
  teamMembers: string[];
  eventId?: string;
  createdAt: string;
  updatedAt: string;
  gapAnalysis?: ProjectAnalysis;
}

export interface RecommendationReason {
  point: string;
  detail?: string;
}

export interface Recommendation {
  id: string;
  requesterId: string;
  candidateId: string;
  projectId?: string;
  eventId?: string;
  reasons: string[];
  complementaryCapabilities: string[];
  sharedContext: string[];
  candidateOffers: string[];
  candidateNeeds: string[];
  recommendationSummary: string;
  approximateDistance?: string; // e.g. "Approx. 320 m away"
  createdAt: string;
}

export type ConnectionStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'BLOCKED';

export interface Connection {
  id: string;
  requesterId: string;
  recipientId: string;
  status: ConnectionStatus;
  message: string;
  context?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  venue: string;
  city: string;
  startTime: string;
  endTime: string;
  organizer: string;
  participantsCount: number;
  tags: string[];
}

export interface EventPresence {
  userId: string;
  eventId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  areaLabel?: string;
}

export interface Message {
  id: string;
  connectionId: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
}
