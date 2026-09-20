import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Recommendation, Profile } from '../types';
import {
  Sparkles,
  MapPin,
  UserPlus,
  Check,
  Eye,
  X,
  ArrowUpDown,
  Clock,
  ChevronDown,
} from 'lucide-react';

interface RecommendationCardProps {
  recommendation: Recommendation;
  candidateProfile: Profile;
  currentUserProfile?: Profile | null;
  onConnect: (candidate: Profile) => void;
  onDismiss?: (recommendationId: string) => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  candidateProfile,
  currentUserProfile,
  onConnect,
  onDismiss,
}) => {
  const [dismissed, setDismissed] = useState(false);
  const [expandedSummary, setExpandedSummary] = useState(false);

  if (dismissed) return null;

  const candidateFirstName = candidateProfile.name.split(' ')[0];

  // Derive mutual offerings
  const youOffer = currentUserProfile?.canOffer?.length
    ? currentUserProfile.canOffer.slice(0, 3)
    : currentUserProfile?.skills?.length
    ? currentUserProfile.skills.slice(0, 3)
    : ['Java', 'Spring Boot', 'AWS Architecture'];

  const theyOffer = candidateProfile.canOffer?.length
    ? candidateProfile.canOffer.slice(0, 3)
    : candidateProfile.skills.slice(0, 3);

  // Proximity display string
  const proximityText =
    recommendation.approximateDistance &&
    recommendation.approximateDistance !== 'Distance unavailable'
      ? recommendation.approximateDistance
      : 'Distance unavailable';

  return (
    <div className="relative group rounded-2xl border border-[#20242c] bg-[#14171d] hover:border-zinc-700/80 transition-all duration-200 p-5 sm:p-6 shadow-md hover:shadow-xl flex flex-col justify-between">
      <div>
        {/* Top: Avatar, Name, Role, Intent Badge & Proximity */}
        <div className="flex items-start justify-between gap-3.5 pb-4 border-b border-[#1f232b]">
          <div className="flex items-start gap-3.5">
            <Link
              to={`/profile/${candidateProfile.userId}`}
              className="relative shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-xl"
            >
              <img
                src={
                  candidateProfile.avatarUrl ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                }
                alt={candidateProfile.name}
                className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl object-cover ring-1 ring-zinc-700/80 group-hover:ring-amber-500/50 transition-all"
                referrerPolicy="no-referrer"
              />
              {candidateProfile.availability.includes('Available') && (
                <span
                  className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-[#14171d]"
                  title="Available now"
                />
              )}
            </Link>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  to={`/profile/${candidateProfile.userId}`}
                  className="font-bold text-white hover:text-amber-400 transition-colors text-base sm:text-lg truncate tracking-tight"
                >
                  {candidateProfile.name}
                </Link>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800/90 text-zinc-300 border border-zinc-700/70">
                  {candidateProfile.currentIntent}
                </span>
              </div>

              <p className="text-xs text-zinc-400 mt-0.5 font-medium line-clamp-1">
                {candidateProfile.headline}
              </p>

              {/* Context Proximity & Status */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1.5 text-[11px] text-zinc-400">
                <span
                  className={`inline-flex items-center gap-1 font-medium ${
                    proximityText !== 'Distance unavailable' ? 'text-emerald-400' : 'text-zinc-500'
                  }`}
                >
                  <MapPin className="h-3 w-3 shrink-0" />
                  {proximityText}
                </span>
                <span className="text-zinc-600">·</span>
                <span className="text-zinc-300">Same event</span>
                <span className="text-zinc-600">·</span>
                <span className="text-zinc-400">{candidateProfile.availability}</span>
              </div>
            </div>
          </div>

          {/* Dismiss button */}
          {onDismiss && (
            <button
              type="button"
              onClick={() => {
                setDismissed(true);
                onDismiss(recommendation.id);
              }}
              className="text-zinc-500 hover:text-zinc-300 p-1.5 rounded-lg hover:bg-zinc-800 transition-colors shrink-0"
              title="Not interested"
              aria-label="Dismiss candidate"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Middle: "WHY THIS PERSON?" (VISUALLY DOMINANT COMPLEMENTARITY EXPLANATION) */}
        <div className="mt-4 rounded-xl bg-[#0c0e12] border border-[#1f232b] p-3.5 sm:p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-400 font-mono uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              Why this person?
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">
              Complementarity
            </span>
          </div>

          {/* Primary Complementarity Narrative */}
          {recommendation.recommendationSummary && (
            <p className="text-xs text-zinc-200 leading-relaxed font-normal">
              {recommendation.recommendationSummary}
            </p>
          )}

          {/* Complementarity reason bullets */}
          <ul className="space-y-1.5 text-xs text-zinc-300 pt-0.5">
            {recommendation.reasons.slice(0, 3).map((reason, idx) => (
              <li key={idx} className="flex items-start gap-2 leading-relaxed">
                <span className="text-amber-400 font-bold shrink-0 mt-0.5">✓</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* MUTUAL VALUE / COMPLEMENTARY EXCHANGE (YOU OFFER vs THEY OFFER) */}
        <div className="mt-3.5 rounded-xl bg-[#101318] border border-[#1e222a] p-3 space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {/* YOU OFFER */}
            <div className="p-2.5 rounded-lg bg-[#0c0e12] border border-[#20242c]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold block mb-1">
                YOU OFFER
              </span>
              <p className="text-zinc-200 font-medium text-xs leading-snug">
                {youOffer.join(' · ')}
              </p>
            </div>

            {/* THEY OFFER */}
            <div className="p-2.5 rounded-lg bg-[#0c0e12] border border-[#20242c]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold block mb-1">
                THEY OFFER
              </span>
              <p className="text-zinc-200 font-medium text-xs leading-snug">
                {theyOffer.join(' · ')}
              </p>
            </div>
          </div>

          {/* Proximity & Context Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 px-1 text-[11px] text-zinc-400">
            <span className="text-zinc-300 font-medium flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Same event
            </span>
            <span className="text-zinc-400">
              {proximityText !== 'Distance unavailable' ? `Approx. ${proximityText}` : 'On-site'}
            </span>
            <span className="text-emerald-400 font-medium">
              {candidateProfile.availability}
            </span>
          </div>
        </div>

        {/* Candidate Raw Skills (Compact & Subtle) */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[10px] font-mono uppercase text-zinc-400 mr-1">Skills:</span>
          {candidateProfile.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="px-2 py-0.5 rounded-md bg-[#0c0e12] text-zinc-300 border border-zinc-800 text-[11px]"
            >
              {skill}
            </span>
          ))}
          {candidateProfile.skills.length > 4 && (
            <span className="text-[10px] text-zinc-400 font-mono">
              +{candidateProfile.skills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Bottom Actions: Clear visual hierarchy */}
      <div className="mt-5 pt-3.5 border-t border-[#1f232b] flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          {/* Primary CTA: Connect */}
          <button
            type="button"
            onClick={() => onConnect(candidateProfile)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 min-h-[40px]"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Connect
          </button>

          {/* Secondary CTA: View Profile */}
          <Link
            to={`/profile/${candidateProfile.userId}`}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-zinc-200 hover:text-white text-xs border border-zinc-700/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 min-h-[40px]"
          >
            <Eye className="h-3.5 w-3.5" />
            View Profile
          </Link>
        </div>

        {/* Not Interested action */}
        {onDismiss && (
          <button
            type="button"
            onClick={() => {
              setDismissed(true);
              onDismiss(recommendation.id);
            }}
            className="text-xs text-zinc-400 hover:text-zinc-300 py-1.5 px-2 rounded-lg hover:bg-zinc-800/40 transition-colors"
          >
            Not interested
          </button>
        )}
      </div>
    </div>
  );
};
