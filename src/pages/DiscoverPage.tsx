import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Search,
  Filter,
  Users,
  Clock,
  Sparkles,
  ArrowRight,
  Eye,
  CheckCircle2,
  UserPlus,
} from 'lucide-react';
import { apiClient } from '../services/apiClient';
import { Profile, Event } from '../types';
import { mockEvents } from '../data/mockData';
import { ConnectionModal } from '../components/ConnectionModal';

export const DiscoverPage: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [myProfile, setMyProfile] = useState<Profile | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIntent, setSelectedIntent] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');

  // Connection modal state
  const [modalCandidate, setModalCandidate] = useState<Profile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const [allProfs, me, evts] = await Promise.all([
        apiClient.getAllProfiles(),
        apiClient.getMyProfile(),
        apiClient.getEvents(),
      ]);
      setProfiles(allProfs);
      setMyProfile(me);
      setEvents(evts);
    }
    load();
  }, []);

  // Collect all unique skills for filter pill dropdown
  const allSkills = Array.from(new Set(profiles.flatMap((p) => p.skills))).sort();

  // Filter candidates
  const filteredProfiles = profiles.filter((p) => {
    // Exclude current user
    if (myProfile && p.userId === myProfile.userId) return false;

    // Search query matches name, headline, skills, canOffer, or lookingFor
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = `${p.name} ${p.headline} ${p.skills.join(' ')} ${p.canOffer.join(
        ' '
      )} ${p.lookingFor.join(' ')} ${p.interests.join(' ')}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }

    if (selectedIntent !== 'all' && p.currentIntent !== selectedIntent) return false;
    if (selectedSkill !== 'all' && !p.skills.includes(selectedSkill)) return false;
    if (selectedEvent !== 'all' && !p.events.includes(selectedEvent)) return false;
    if (selectedAvailability !== 'all' && p.availability !== selectedAvailability) return false;

    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      {toastMessage && (
        <div
          role="alert"
          className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4"
        >
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1f232b] pb-6">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold mb-1">
            DIRECTORY & ATTENDEES
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Compass className="h-7 w-7 text-amber-400" />
            Discover Builders
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Browse verified event participants by skills, availability, and collaboration intent.
          </p>
        </div>
        <Link
          to="/who-should-i-meet"
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-colors shadow-sm min-h-[40px]"
        >
          <Sparkles className="h-4 w-4" />
          Who Should I Meet?
        </Link>
      </div>

      {/* SEARCH AND COMPACT FILTERS */}
      <div className="rounded-2xl border border-[#1f232b] bg-[#14171d] p-5 space-y-4 shadow-sm">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by skill or capability (e.g. React, Java, Healthcare, UI/UX, AWS)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0c0e12] border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors min-h-[42px]"
          />
        </div>

        {/* Filter Dropdowns in clean 4-col grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
              Filter by Skill
            </label>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#0c0e12] border border-zinc-800 text-xs text-white focus:outline-none focus:border-amber-500 min-h-[42px]"
            >
              <option value="all">All Skills</option>
              {allSkills.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
              Current Intent
            </label>
            <select
              value={selectedIntent}
              onChange={(e) => setSelectedIntent(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#0c0e12] border border-zinc-800 text-xs text-white focus:outline-none focus:border-amber-500 min-h-[42px]"
            >
              <option value="all">All Intents</option>
              <option value="Find collaborator">Find collaborator</option>
              <option value="Find teammate">Find teammate</option>
              <option value="Find cofounder">Find cofounder</option>
              <option value="Find mentor">Find mentor</option>
              <option value="Network">Network</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
              Event Attendance
            </label>
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#0c0e12] border border-zinc-800 text-xs text-white focus:outline-none focus:border-amber-500 min-h-[42px]"
            >
              <option value="all">All Events</option>
              {mockEvents.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-zinc-400 mb-1">
              Availability
            </label>
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#0c0e12] border border-zinc-800 text-xs text-white focus:outline-none focus:border-amber-500 min-h-[42px]"
            >
              <option value="all">All Availabilities</option>
              <option value="Available now">Available now</option>
              <option value="Available this weekend">Available this weekend</option>
              <option value="Part-time">Part-time</option>
            </select>
          </div>
        </div>
      </div>

      {/* DISCOVER GRID */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-mono uppercase text-zinc-400">
            Showing {filteredProfiles.length} verified candidate profiles
          </p>
        </div>

        {filteredProfiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredProfiles.map((candidate) => {
              const commonEvent = mockEvents.find((e) => candidate.events.includes(e.id));
              return (
                <div
                  key={candidate.id}
                  className="rounded-2xl border border-[#1f232b] bg-[#14171d] hover:border-zinc-700/80 p-5 sm:p-6 space-y-4 transition-all duration-200 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    {/* Top: Avatar & Info */}
                    <div className="flex items-start gap-3.5">
                      <Link to={`/profile/${candidate.userId}`} className="shrink-0">
                        <img
                          src={
                            candidate.avatarUrl ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                          }
                          alt={candidate.name}
                          className="h-12 w-12 rounded-xl object-cover ring-1 ring-zinc-700/80 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <Link
                            to={`/profile/${candidate.userId}`}
                            className="font-bold text-white hover:text-amber-400 text-base transition-colors truncate"
                          >
                            {candidate.name}
                          </Link>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700/80 shrink-0">
                            {candidate.currentIntent}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5 truncate font-medium">
                          {candidate.headline}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] text-zinc-400">
                          {commonEvent && (
                            <span className="text-zinc-300 truncate max-w-[180px]">
                              {commonEvent.name}
                            </span>
                          )}
                          <span>·</span>
                          <span className="flex items-center gap-1 text-emerald-400 font-medium">
                            <Clock className="h-3 w-3" />
                            {candidate.availability}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Skill chips */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {candidate.skills.slice(0, 5).map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded-md bg-[#0c0e12] border border-zinc-800 text-xs text-zinc-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Offers & Looking For summary */}
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-[#0c0e12] border border-[#1f232b]">
                        <span className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                          Can Offer:
                        </span>
                        <p className="text-zinc-300 text-xs line-clamp-2 leading-relaxed">
                          {candidate.canOffer.join(', ')}
                        </p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#0c0e12] border border-[#1f232b]">
                        <span className="text-[10px] font-mono uppercase text-amber-400 block mb-1">
                          Looking For:
                        </span>
                        <p className="text-zinc-300 text-xs line-clamp-2 leading-relaxed">
                          {candidate.lookingFor.join(', ')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="mt-4 pt-3.5 border-t border-[#1f232b] flex items-center justify-between gap-3">
                    <Link
                      to={`/profile/${candidate.userId}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View Profile
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setModalCandidate(candidate);
                        setIsModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-colors shadow-sm min-h-[40px]"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      Connect
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-14 rounded-2xl bg-[#14171d] border border-[#1f232b] p-8 space-y-3">
            <Users className="h-9 w-9 text-zinc-600 mx-auto" />
            <h3 className="text-sm font-bold text-white">No attendees match your search filters</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Try clearing your search query or choosing 'All Skills' to see everyone attending.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedIntent('all');
                setSelectedSkill('all');
                setSelectedEvent('all');
                setSelectedAvailability('all');
              }}
              className="mt-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Connection Approval Modal */}
      <ConnectionModal
        candidate={modalCandidate}
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
