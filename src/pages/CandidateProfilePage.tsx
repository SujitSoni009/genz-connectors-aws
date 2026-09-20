import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  UserPlus,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Check,
  Shield,
} from 'lucide-react';
import { apiClient } from '../services/apiClient';
import { Profile, Project } from '../types';
import { mockEvents, mockProfiles } from '../data/mockData';
import { ConnectionModal } from '../components/ConnectionModal';

export const CandidateProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<Profile | null>(null);
  const [myProfile, setMyProfile] = useState<Profile | null>(null);
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!id) return;
      const [cand, me, projs] = await Promise.all([
        apiClient.getProfileById(id),
        apiClient.getMyProfile(),
        apiClient.getMyProjects(),
      ]);
      setCandidate(cand || null);
      setMyProfile(me);
      setMyProjects(projs);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-xs text-zinc-400">
        Loading profile...
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="text-center py-16 space-y-3">
        <h2 className="text-lg font-bold text-white">Profile Not Found</h2>
        <Link to="/discover" className="text-xs text-amber-400 underline">
          Back to Discover
        </Link>
      </div>
    );
  }

  const activeProject = myProjects[0];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Header back bar */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            if (window.history.length > 1) {
              navigate(-1);
            } else {
              navigate('/who-should-i-meet');
            }
          }}
          className="p-1.5 rounded-lg bg-[#15181e] border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          title="Go back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <span className="text-xs font-mono uppercase text-zinc-400">Builder Profile</span>
      </div>

      {/* Candidate Profile Card */}
      <div className="rounded-2xl border border-[#232730] bg-[#15181e] p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <img
              src={candidate.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
              alt={candidate.name}
              className="h-20 w-20 rounded-2xl object-cover ring-2 ring-zinc-700"
              referrerPolicy="no-referrer"
            />
            <div className="space-y-1">
              <h1 className="text-2xl font-extrabold text-white">{candidate.name}</h1>
              <p className="text-xs text-zinc-300 font-medium">{candidate.headline}</p>

              <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-zinc-400">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono text-[11px]">
                  {candidate.currentIntent}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <Clock className="h-3 w-3" />
                  {candidate.availability}
                </span>
                <span>·</span>
                <span className="text-zinc-400 font-mono text-[11px]">{candidate.experience}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-colors shadow-md shrink-0"
          >
            <UserPlus className="h-4 w-4" />
            Connect & Propose Collaboration
          </button>
        </div>

        {/* Bio */}
        <div className="pt-4 border-t border-zinc-800/80">
          <span className="text-xs font-mono uppercase text-zinc-400 block mb-1">About</span>
          <p className="text-xs text-zinc-300 leading-relaxed">{candidate.bio}</p>
        </div>
      </div>

      {/* COMPLEMENTARITY SYNTHESIS WITH CURRENT LOGGED-IN USER */}
      {myProfile && (
        <div className="rounded-2xl border border-amber-500/30 bg-[#15181e] p-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-amber-400 font-semibold">
            <Sparkles className="h-4 w-4 text-amber-400" />
            Complementarity Analysis (You & {candidate.name.split(' ')[0]})
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#0c0e12] border border-[#232730] space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-emerald-400 font-semibold block">
                What {candidate.name.split(' ')[0]} Brings To You
              </span>
              <p className="text-zinc-300 text-xs">
                Proven capabilities in {candidate.skills.slice(0, 3).join(', ')}.
              </p>
              {activeProject && (
                <p className="text-zinc-400 text-[11px] pt-1">
                  Directly bridges declared needs for <strong>"{activeProject.name}"</strong>.
                </p>
              )}
            </div>

            <div className="p-4 rounded-xl bg-[#0c0e12] border border-[#232730] space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold block">
                What You Offer In Return
              </span>
              <p className="text-zinc-300 text-xs">
                You provide {myProfile.skills.slice(0, 3).join(', ')} expertise.
              </p>
              <p className="text-zinc-400 text-[11px] pt-1">
                Aligns with {candidate.name.split(' ')[0]}'s declared interest in backend and system architecture.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* OFFERS & LOOKING FOR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-[#232730] bg-[#15181e] p-6 space-y-3">
          <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Check className="h-4 w-4 text-emerald-400" />
            Can Offer
          </h3>
          <ul className="space-y-2 text-xs text-zinc-300">
            {candidate.canOffer.map((offer, i) => (
              <li key={i} className="flex items-center gap-2 p-2 rounded-lg bg-[#0c0e12] border border-zinc-800">
                <span className="text-emerald-400">•</span>
                <span>{offer}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-[#232730] bg-[#15181e] p-6 space-y-3">
          <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-amber-400" />
            Looking For
          </h3>
          <ul className="space-y-2 text-xs text-zinc-300">
            {candidate.lookingFor.map((need, i) => (
              <li key={i} className="flex items-center gap-2 p-2 rounded-lg bg-[#0c0e12] border border-zinc-800">
                <span className="text-amber-400">•</span>
                <span>{need}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* SKILLS */}
      <div className="rounded-2xl border border-[#232730] bg-[#15181e] p-6 space-y-3">
        <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono">
          Declared Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {candidate.skills.map((s) => (
            <span
              key={s}
              className="px-3 py-1 rounded-lg bg-[#0c0e12] border border-zinc-800 text-xs text-zinc-200"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Connection Modal */}
      <ConnectionModal
        candidate={candidate}
        activeProject={activeProject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={(name) => {
          setToastMessage(`Connection request sent to ${name}!`);
          setTimeout(() => setToastMessage(null), 4000);
        }}
      />
    </div>
  );
};
