import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Users,
  FolderGit2,
  AlertTriangle,
  ArrowRight,
  UserPlus,
  Compass,
  CheckCircle,
  Clock,
  Layers,
  Plus,
} from 'lucide-react';
import { apiClient } from '../services/apiClient';
import { Profile, Project, Recommendation, Connection, Event } from '../types';
import { RecommendationCard } from '../components/RecommendationCard';
import { ConnectionModal } from '../components/ConnectionModal';
import { ProjectGapModal } from '../components/ProjectGapModal';
import { mockProfiles } from '../data/mockData';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Connection modal state
  const [modalCandidate, setModalCandidate] = useState<Profile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Project gap modal state
  const [isGapModalOpen, setIsGapModalOpen] = useState(false);

  // Success toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [myProf, myProjs, myConns, allEvents] = await Promise.all([
          apiClient.getMyProfile(),
          apiClient.getMyProjects(),
          apiClient.getConnections(),
          apiClient.getEvents(),
        ]);
        setProfile(myProf);
        setProjects(myProjs);
        const active = myProjs[0] || null;
        setActiveProject(active);
        setConnections(myConns);
        setEvents(allEvents);

        // Fetch top recommendations for this profile/project
        const recs = await apiClient.getWhoShouldIMeet(active?.id, allEvents[0]?.id);
        setRecommendations(recs);
      } catch (err) {
        console.error('Failed loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleConnect = (candidate: Profile) => {
    setModalCandidate(candidate);
    setIsModalOpen(true);
  };

  const handleConnectionSuccess = (candidateName: string) => {
    setToastMessage(`Connection request sent to ${candidateName}!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  if (loading || !profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-xs text-zinc-400">
        <Sparkles className="h-5 w-5 animate-spin text-amber-400 mr-2" />
        Synthesizing context and analyzing candidate graph...
      </div>
    );
  }

  const currentEvent = events[0];

  return (
    <div className="space-y-8 pb-16">
      {/* Toast alert */}
      {toastMessage && (
        <div
          role="alert"
          className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4"
        >
          <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
          {toastMessage}
        </div>
      )}

      {/* PRODUCT APP HEADER & ACTIVE CONTEXT SUMMARY */}
      <div className="rounded-2xl border border-[#1f232b] bg-[#14171d] p-5 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] font-mono text-amber-400 font-semibold">
              <Sparkles className="h-3 w-3" />
              Active Intent: {profile.currentIntent}
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Dashboard & Recommendation Hub
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Active persona: <strong className="text-zinc-200">{profile.name}</strong> · Event: <strong className="text-zinc-200">{currentEvent?.name || 'AWS Hackathon'}</strong> · Project: <strong className="text-zinc-200">{activeProject ? activeProject.name : 'General Profile'}</strong>
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <Link
              to="/who-should-i-meet"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-colors shadow-sm min-h-[40px]"
            >
              <Users className="h-3.5 w-3.5" />
              Who Should I Meet?
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Quick Context Summary Strip */}
        <div className="pt-4 border-t border-[#1f232b] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-[10px] font-mono uppercase text-zinc-400 block mb-0.5">
              Your Primary Stack
            </span>
            <span className="text-zinc-200 font-medium">{profile.skills.slice(0, 3).join(', ')}</span>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-zinc-400 block mb-0.5">
              Project Gaps
            </span>
            <span className="text-amber-300 font-medium">
              {activeProject?.declaredNeeds.slice(0, 2).join(' & ') || 'None declared'}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-zinc-400 block mb-0.5">
              Event Proximity
            </span>
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active on-site
            </span>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-zinc-400 block mb-0.5">
              Availability
            </span>
            <span className="text-zinc-200 font-medium">{profile.availability}</span>
          </div>
        </div>
      </div>

      {/* TWO COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT 2 COLS: TOP COMPLEMENTARY RECOMMENDATIONS */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" />
                People you should meet
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Complementarity-matched for your active project & intent
              </p>
            </div>
            <Link
              to="/who-should-i-meet"
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
            >
              View Full Pipeline
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {recommendations.slice(0, 3).map((rec) => {
              const candidate =
                mockProfiles.find((p) => p.userId === rec.candidateId) || mockProfiles[1];
              return (
                <RecommendationCard
                  key={rec.id}
                  recommendation={rec}
                  candidateProfile={candidate}
                  currentUserProfile={profile}
                  onConnect={handleConnect}
                />
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE PROJECT & GAPS, RECENT CONNECTIONS */}
        <div className="space-y-6">
          {/* Active Project & Gap Intelligence Card */}
          <div className="rounded-2xl border border-[#1f232b] bg-[#14171d] p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <FolderGit2 className="h-3.5 w-3.5 text-amber-400" />
                Active Project
              </h3>
              <Link
                to="/projects/new"
                className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <Plus className="h-3 w-3" />
                New
              </Link>
            </div>

            {activeProject ? (
              <div className="space-y-3">
                <div>
                  <h4 className="font-bold text-white text-sm">{activeProject.name}</h4>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                    {activeProject.description}
                  </p>
                </div>

                {/* Gap highlights */}
                <div className="rounded-xl bg-[#0c0e12] border border-[#1f232b] p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Bedrock Gap Analysis
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsGapModalOpen(true)}
                      className="text-[10px] text-zinc-400 hover:text-zinc-200 underline"
                    >
                      View Report
                    </button>
                  </div>
                  <ul className="space-y-1 text-xs text-zinc-300">
                    {activeProject.declaredNeeds.slice(0, 3).map((need, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-amber-400">•</span>
                        <span>
                          Needs: <strong className="text-zinc-200">{need}</strong>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <Link
                    to={`/projects/${activeProject.id}`}
                    className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    Manage Project Details
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setIsGapModalOpen(true)}
                    className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    Analyze Gaps
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-zinc-400">
                <p>No projects registered yet.</p>
                <Link to="/projects/new" className="mt-2 inline-block text-amber-400 underline">
                  Create your first project
                </Link>
              </div>
            )}
          </div>

          {/* Recent Connections Card */}
          <div className="rounded-2xl border border-[#1f232b] bg-[#14171d] p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-emerald-400" />
                Recent Connections
              </h3>
              <Link
                to="/connections"
                className="text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                View All ({connections.length})
              </Link>
            </div>

            {connections.length > 0 ? (
              <div className="space-y-2">
                {connections.slice(0, 3).map((conn) => {
                  const otherId =
                    conn.requesterId === profile.userId ? conn.recipientId : conn.requesterId;
                  const otherUser =
                    mockProfiles.find((p) => p.userId === otherId) || mockProfiles[3];
                  return (
                    <Link
                      key={conn.id}
                      to="/connections"
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-[#0c0e12] hover:bg-zinc-900/80 border border-[#1f232b] transition-colors"
                    >
                      <img
                        src={
                          otherUser.avatarUrl ||
                          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
                        }
                        alt={otherUser.name}
                        className="h-8 w-8 rounded-lg object-cover ring-1 ring-zinc-700/80 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="truncate flex-1 min-w-0">
                        <p className="text-xs font-medium text-white truncate">{otherUser.name}</p>
                        <p className="text-[10px] text-zinc-400 truncate">{conn.message}</p>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                        {conn.status}
                      </span>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-zinc-400 text-center py-4">No connections yet.</p>
            )}
          </div>

          {/* Quick Context Actions */}
          <div className="rounded-2xl border border-[#1f232b] bg-[#14171d] p-5 space-y-2 shadow-sm">
            <h4 className="text-xs font-mono uppercase text-zinc-400 font-semibold mb-2">
              Context Discovery
            </h4>
            <Link
              to="/discover"
              className="w-full flex items-center justify-between p-3 rounded-xl bg-[#0c0e12] hover:bg-zinc-900 border border-[#1f232b] text-xs text-zinc-300 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Compass className="h-4 w-4 text-amber-400" />
                Explore Attendee Directory
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-zinc-500" />
            </Link>
            <Link
              to="/settings"
              className="w-full flex items-center justify-between p-3 rounded-xl bg-[#0c0e12] hover:bg-zinc-900 border border-[#1f232b] text-xs text-zinc-300 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" />
                Privacy & Proximity Signals
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-zinc-500" />
            </Link>
          </div>
        </div>
      </div>

      {/* Connection Approval Modal */}
      <ConnectionModal
        candidate={modalCandidate}
        activeProject={activeProject || undefined}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleConnectionSuccess}
      />

      {/* Project Gap Analysis Modal */}
      <ProjectGapModal
        project={activeProject}
        isOpen={isGapModalOpen}
        onClose={() => setIsGapModalOpen(false)}
      />
    </div>
  );
};
