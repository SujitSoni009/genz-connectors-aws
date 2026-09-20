import React, { useState, useEffect } from 'react';
import {
  User,
  Sparkles,
  Edit3,
  Check,
  Plus,
  X,
  Shield,
  MapPin,
  Clock,
  Briefcase,
  Layers,
  Heart,
} from 'lucide-react';
import { apiClient } from '../services/apiClient';
import { Profile, Project, Event } from '../types';
import { mockEvents } from '../data/mockData';

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    async function load() {
      const [p, projs] = await Promise.all([
        apiClient.getMyProfile(),
        apiClient.getMyProjects(),
      ]);
      setProfile(p);
      setProjects(projs);
    }
    load();
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    await apiClient.updateMyProfile(profile);
    setIsEditing(false);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const addTag = (field: 'skills' | 'canOffer' | 'lookingFor' | 'interests') => {
    if (!profile || !tagInput.trim()) return;
    const current = profile[field] || [];
    if (!current.includes(tagInput.trim())) {
      setProfile({ ...profile, [field]: [...current, tagInput.trim()] });
    }
    setTagInput('');
  };

  const removeTag = (field: 'skills' | 'canOffer' | 'lookingFor' | 'interests', tag: string) => {
    if (!profile) return;
    const current = profile[field] || [];
    setProfile({ ...profile, [field]: current.filter((t) => t !== tag) });
  };

  if (!profile) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {savedToast && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs shadow-2xl flex items-center gap-2">
          <Check className="h-4 w-4 text-emerald-400" />
          Profile updated successfully!
        </div>
      )}

      {/* Header Profile Banner */}
      <div className="rounded-2xl border border-[#232730] bg-[#15181e] p-6 sm:p-8 shadow-xl relative">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <img
              src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={profile.name}
              className="h-20 w-20 rounded-2xl object-cover ring-2 ring-zinc-700"
              referrerPolicy="no-referrer"
            />
            <div className="space-y-1">
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="p-1.5 rounded-lg bg-[#0c0e12] border border-zinc-700 text-sm text-white font-bold"
                  />
                  <input
                    type="text"
                    value={profile.headline}
                    onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                    className="p-1.5 rounded-lg bg-[#0c0e12] border border-zinc-700 text-xs text-zinc-300 w-full"
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-extrabold text-white">{profile.name}</h1>
                  <p className="text-xs text-zinc-300 font-medium">{profile.headline}</p>
                </>
              )}

              <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-zinc-400">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono text-[11px]">
                  {profile.currentIntent}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <Clock className="h-3 w-3" />
                  {profile.availability}
                </span>
                <span>·</span>
                <span className="text-zinc-400 font-mono text-[11px]">{profile.experience}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-colors shadow-sm self-start"
          >
            {isEditing ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Save Changes
              </>
            ) : (
              <>
                <Edit3 className="h-3.5 w-3.5" />
                Edit Profile
              </>
            )}
          </button>
        </div>

        {/* Bio */}
        <div className="mt-6 pt-5 border-t border-zinc-800/80">
          <span className="text-xs font-mono uppercase text-zinc-400 block mb-1">About & Bio</span>
          {isEditing ? (
            <textarea
              rows={3}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-[#0c0e12] border border-zinc-800 text-xs text-white"
            />
          ) : (
            <p className="text-xs text-zinc-300 leading-relaxed">{profile.bio}</p>
          )}
        </div>
      </div>

      {/* CORE COMPLEMENTARITY PROFILES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Can Offer */}
        <div className="rounded-2xl border border-[#232730] bg-[#15181e] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Check className="h-4 w-4 text-emerald-400" />
              What I Can Offer
            </h3>
          </div>
          <p className="text-xs text-zinc-400">
            Skills and capabilities you provide to collaborators and hackathon teams:
          </p>
          <ul className="space-y-2 text-xs text-zinc-300">
            {profile.canOffer.map((offer, i) => (
              <li key={i} className="flex items-center gap-2 p-2 rounded-lg bg-[#0c0e12] border border-zinc-800">
                <span className="text-emerald-400">•</span>
                <span>{offer}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Looking For */}
        <div className="rounded-2xl border border-amber-500/30 bg-[#15181e] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-400" />
              What I Am Looking For
            </h3>
          </div>
          <p className="text-xs text-zinc-400">
            The complementary skills, roles, and expertise you are searching for:
          </p>
          <ul className="space-y-2 text-xs text-zinc-300">
            {profile.lookingFor.map((need, i) => (
              <li key={i} className="flex items-center gap-2 p-2 rounded-lg bg-[#0c0e12] border border-amber-500/20">
                <span className="text-amber-400">•</span>
                <span className="text-amber-200">{need}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* SKILLS & INTERESTS */}
      <div className="rounded-2xl border border-[#232730] bg-[#15181e] p-6 space-y-4">
        <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono">
          Technical & Design Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {profile.skills.map((s) => (
            <span
              key={s}
              className="px-3 py-1 rounded-lg bg-[#0c0e12] border border-zinc-800 text-xs text-zinc-200"
            >
              {s}
            </span>
          ))}
        </div>

        <div className="pt-4 border-t border-zinc-800/80">
          <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono mb-2">
            Domain Interests
          </h3>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((interest) => (
              <span
                key={interest}
                className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-400"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* EVENT PARTICIPATION & LOCATION SHARING */}
      <div className="rounded-2xl border border-[#232730] bg-[#15181e] p-6 space-y-4">
        <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono">
          Active Events & Communities
        </h3>
        <div className="space-y-2">
          {mockEvents
            .filter((e) => profile.events.includes(e.id))
            .map((ev) => (
              <div
                key={ev.id}
                className="p-3.5 rounded-xl bg-[#0c0e12] border border-zinc-800 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-semibold text-white">{ev.name}</p>
                  <p className="text-zinc-400 text-[11px] mt-0.5">{ev.venue} · {ev.city}</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Registered Attendee
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
