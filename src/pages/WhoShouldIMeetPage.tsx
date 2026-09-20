import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Sparkles,
  Users,
  Filter,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  Shield,
  Layers,
  MapPin,
  Clock,
  Briefcase,
  AlertCircle,
} from 'lucide-react';
import { apiClient } from '../services/apiClient';
import { Profile, Project, Recommendation, Event } from '../types';
import { RecommendationCard } from '../components/RecommendationCard';
import { ConnectionModal } from '../components/ConnectionModal';
import { mockProfiles } from '../data/mockData';

export const WhoShouldIMeetPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialProjectId = searchParams.get('projectId');

  const [myProfile, setMyProfile] = useState<Profile | null>(null);
  const [allProfiles, setAllProfiles] = useState<Profile[]>(mockProfiles);
  const [projects, setProjects] = useState<Project[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  // Filter & Context selections
  const [selectedProjectId, setSelectedProjectId] = useState<string>(initialProjectId || '');
  const [selectedEventId, setSelectedEventId] = useState<string>('evt-001');
  const [selectedIntent, setSelectedIntent] = useState<string>('');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');

  // Recommendation state
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pipelineStep, setPipelineStep] = useState<number>(0);
  const [pipelineMessage, setPipelineMessage] = useState<string>('');

  // Connection modal state
  const [modalCandidate, setModalCandidate] = useState<Profile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      const [prof, projs, evts, profs] = await Promise.all([
        apiClient.getMyProfile(),
        apiClient.getMyProjects(),
        apiClient.getEvents(),
        apiClient.getAllProfiles(),
      ]);
      setMyProfile(prof);
      setProjects(projs);
      setEvents(evts);
      setAllProfiles(profs);

      const activeProjId = initialProjectId || projs[0]?.id || '';
      setSelectedProjectId(activeProjId);
      setSelectedIntent(prof.currentIntent);

      runRecommendationPipeline(prof, activeProjId, 'evt-001');
    }
    init();
  }, [initialProjectId]);

  const runRecommendationPipeline = async (
    userProfile: Profile,
    projId: string,
    evtId: string
  ) => {
    setIsAnalyzing(true);
    setPipelineStep(1);
    setPipelineMessage('Understanding your project & filtering candidates...');

    // Progress through subtle numbered steps
    setTimeout(() => {
      setPipelineStep(2);
      setPipelineMessage('Analyzing complementary skills & intent...');
    }, 250);

    setTimeout(() => {
      setPipelineStep(3);
      setPipelineMessage('Synthesizing mutual complementarity reasoning...');
    }, 500);

    setTimeout(async () => {
      setPipelineStep(4);
      setPipelineMessage('Finalizing recommendations...');
      try {
        const recs = await apiClient.getWhoShouldIMeet(projId, evtId);
        setRecommendations(recs);
      } catch (e) {
        console.error('Pipeline error:', e);
      } finally {
        setIsAnalyzing(false);
        setPipelineStep(0);
        setPipelineMessage('');
      }
    }, 750);
  };

  const handleApplyFilters = () => {
    if (myProfile) {
      runRecommendationPipeline(myProfile, selectedProjectId, selectedEventId);
    }
  };

  const handleConnect = (candidate: Profile) => {
    setModalCandidate(candidate);
    setIsModalOpen(true);
  };

  const handleDismiss = (recId: string) => {
    setRecommendations((prev) => prev.filter((r) => r.id !== recId));
  };

  const activeProject = projects.find((p) => p.id === selectedProjectId);
  const activeEvent = events.find((e) => e.id === selectedEventId) || events[0];

  return (
    <div className="space-y-6 sm:space-y-7 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="alert"
          className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          {toastMessage}
        </div>
      )}

      {/* TOP: COMPACT APPLICATION HEADER */}
      <div className="space-y-1.5 border-b border-[#1f232b] pb-5">
        <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
          AI-POWERED NETWORKING
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Who should I meet?
          </h1>
          <button
            type="button"
            onClick={handleApplyFilters}
            disabled={isAnalyzing}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#14171d] hover:bg-zinc-800 text-zinc-300 hover:text-white border border-[#20242c] hover:border-zinc-700 text-xs font-medium transition-colors disabled:opacity-50 min-h-[38px] shadow-sm"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-amber-400 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing ? 'Re-evaluating...' : 'Re-evaluate recommendations'}
          </button>
        </div>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
          Discover people who complement what you're trying to accomplish based on your project, skills, and event context.
        </p>
      </div>

      {/* CONTEXT SECTION: Desktop 4-col, Tablet 2x2, Mobile 1-col */}
      <div className="rounded-2xl border border-[#1f232b] bg-[#14171d] p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-bold flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-amber-400" />
            Your Context
          </h2>
          <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline">
            Deterministic Constraints
          </span>
        </div>

        {/* 4-column layout on desktop, 2-col on tablet, 1-col on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Target Project */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5 font-medium">
              Target Project
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => {
                setSelectedProjectId(e.target.value);
                if (myProfile) {
                  runRecommendationPipeline(myProfile, e.target.value, selectedEventId);
                }
              }}
              className="w-full p-2.5 rounded-xl bg-[#0c0e12] border border-zinc-800 hover:border-zinc-700 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors min-h-[42px]"
            >
              <option value="">No specific project (General Profile)</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Event Context */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5 font-medium">
              Event Context
            </label>
            <select
              value={selectedEventId}
              onChange={(e) => {
                setSelectedEventId(e.target.value);
                if (myProfile) {
                  runRecommendationPipeline(myProfile, selectedProjectId, e.target.value);
                }
              }}
              className="w-full p-2.5 rounded-xl bg-[#0c0e12] border border-zinc-800 hover:border-zinc-700 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors min-h-[42px]"
            >
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.name}
                </option>
              ))}
            </select>
          </div>

          {/* Your Intent */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5 font-medium">
              Your Intent
            </label>
            <select
              value={selectedIntent}
              onChange={(e) => {
                setSelectedIntent(e.target.value);
                if (myProfile) {
                  runRecommendationPipeline(myProfile, selectedProjectId, selectedEventId);
                }
              }}
              className="w-full p-2.5 rounded-xl bg-[#0c0e12] border border-zinc-800 hover:border-zinc-700 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors min-h-[42px]"
            >
              <option value="Find collaborator">Find collaborator</option>
              <option value="Find teammate">Find teammate</option>
              <option value="Find cofounder">Find cofounder</option>
              <option value="Find mentor">Find mentor</option>
              <option value="Network">Network</option>
            </select>
          </div>

          {/* Availability */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5 font-medium">
              Availability
            </label>
            <select
              value={selectedAvailability}
              onChange={(e) => {
                setSelectedAvailability(e.target.value);
                if (myProfile) {
                  runRecommendationPipeline(myProfile, selectedProjectId, selectedEventId);
                }
              }}
              className="w-full p-2.5 rounded-xl bg-[#0c0e12] border border-zinc-800 hover:border-zinc-700 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors min-h-[42px]"
            >
              <option value="all">Any Availability</option>
              <option value="Available now">Available Now</option>
              <option value="Available this weekend">Available This Weekend</option>
              <option value="Part-time">Part-time</option>
            </select>
          </div>
        </div>

        {/* PROJECT NEEDS (Compact chips that wrap cleanly, no overflow) */}
        {activeProject && (
          <div className="pt-3 border-t border-[#1f232b]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold block mb-2">
              Project Needs:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {activeProject.declaredNeeds.map((need) => (
                <span
                  key={need}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/25 text-xs font-medium"
                >
                  {need}
                </span>
              ))}
              {activeProject.domain && (
                <span className="px-2.5 py-1 rounded-lg bg-[#0c0e12] text-zinc-300 border border-zinc-800 text-xs font-medium">
                  {activeProject.domain}
                </span>
              )}
            </div>
          </div>
        )}

        {/* SUBTLE PRIVACY INDICATOR (Directly in context) */}
        <div className="pt-2 flex items-center gap-2 text-xs text-zinc-400">
          <Shield className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <span>
            <strong className="text-zinc-300">Event-scoped privacy.</strong> Only mutually visible participants within the same event are considered.
          </span>
        </div>
      </div>

      {/* TWO-STAGE PROCESSING PIPELINE (Visually simplified and compact) */}
      <div className="rounded-xl bg-[#101318] border border-[#1e222a] p-3 sm:p-3.5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
            Two-Stage AI Processing Pipeline
          </span>
          {isAnalyzing && (
            <span className="text-xs text-amber-400 font-mono flex items-center gap-1.5 animate-pulse">
              <RefreshCw className="h-3 w-3 animate-spin" />
              {pipelineMessage}
            </span>
          )}
        </div>

        {/* 2-Step Compact Pipeline: 01 Candidate Filtering → 02 Context & Complementarity Analysis */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div
            className={`p-2.5 rounded-lg border transition-all flex items-center gap-2.5 ${
              isAnalyzing && pipelineStep <= 2
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                : 'bg-[#0c0e12] border-zinc-800/80 text-zinc-300'
            }`}
          >
            <span
              className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 ${
                isAnalyzing && pipelineStep <= 2
                  ? 'bg-amber-500 text-zinc-950'
                  : 'bg-zinc-800 text-zinc-300'
              }`}
            >
              01
            </span>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold block truncate">Candidate Filtering</span>
              <span className="text-[10px] text-zinc-400 truncate block">Event attendance & availability matching</span>
            </div>
          </div>

          <div
            className={`p-2.5 rounded-lg border transition-all flex items-center gap-2.5 ${
              isAnalyzing && pipelineStep > 2
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                : 'bg-[#0c0e12] border-zinc-800/80 text-zinc-300'
            }`}
          >
            <span
              className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 ${
                isAnalyzing && pipelineStep > 2
                  ? 'bg-amber-500 text-zinc-950'
                  : 'bg-zinc-800 text-zinc-300'
              }`}
            >
              02
            </span>
            <div className="min-w-0">
              <span className="text-[11px] font-semibold block truncate">Context & Complementarity Analysis</span>
              <span className="text-[10px] text-zinc-400 truncate block">Project needs resolution & reciprocal value</span>
            </div>
          </div>
        </div>
      </div>

      {/* RECOMMENDED CANDIDATES (MAIN CONTENT OF THE PAGE) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
              RECOMMENDED CANDIDATES
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              People you should meet
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
              Ranked by reciprocal complementarity for your project and intent.
            </p>
          </div>
          <span className="text-xs font-mono text-zinc-400 hidden sm:inline">
            {recommendations.length} recommendations
          </span>
        </div>

        {isAnalyzing ? (
          /* SKELETON / LOADING STATE */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {[1, 2].map((n) => (
              <div
                key={n}
                className="rounded-2xl border border-[#20242c] bg-[#14171d] p-6 space-y-4 animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-zinc-800" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-zinc-800 rounded w-1/3" />
                    <div className="h-3 bg-zinc-800/60 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-20 bg-zinc-800/40 rounded-xl" />
                <div className="h-12 bg-zinc-800/30 rounded-xl" />
              </div>
            ))}
          </div>
        ) : recommendations.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {recommendations.map((rec) => {
              const candidate =
                allProfiles.find((p) => p.userId === rec.candidateId) ||
                mockProfiles.find((p) => p.userId === rec.candidateId) ||
                allProfiles[0];
              return (
                <RecommendationCard
                  key={rec.id}
                  recommendation={rec}
                  candidateProfile={candidate}
                  currentUserProfile={myProfile}
                  onConnect={handleConnect}
                  onDismiss={handleDismiss}
                />
              );
            })}
          </div>
        ) : (
          /* POLISHED EMPTY STATE */
          <div className="text-center py-16 rounded-2xl bg-[#14171d] border border-[#1f232b] p-8 space-y-3">
            <Users className="h-10 w-10 text-zinc-600 mx-auto" />
            <h3 className="text-base font-bold text-white">No strong recommendations yet</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
              Try adjusting your project selection, intent, or availability filter above to explore more candidates.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedAvailability('all');
                if (myProfile) {
                  runRecommendationPipeline(myProfile, selectedProjectId, selectedEventId);
                }
              }}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-xl text-xs font-bold transition-colors shadow-sm"
            >
              Update my context
            </button>
          </div>
        )}
      </div>

      {/* Connection Approval Modal */}
      <ConnectionModal
        candidate={modalCandidate}
        activeProject={activeProject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(name) => {
          setToastMessage(`Connection request successfully sent to ${name}!`);
          setTimeout(() => setToastMessage(null), 4000);
        }}
      />
    </div>
  );
};
