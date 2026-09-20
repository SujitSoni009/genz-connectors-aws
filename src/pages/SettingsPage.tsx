import React, { useState, useEffect } from 'react';
import {
  Shield,
  MapPin,
  Lock,
  Check,
  Cpu,
  Database,
  Radio,
  RefreshCw,
  Eye,
  Bell,
} from 'lucide-react';
import { apiClient } from '../services/apiClient';
import { Profile, LocationSharingMode, PrivacyPreferences } from '../types';

export const SettingsPage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [privacy, setPrivacy] = useState<PrivacyPreferences>({
    profileVisibility: 'public',
    skillsVisibility: true,
    projectVisibility: true,
    intentVisibility: true,
    locationSharing: 'During This Event',
    allowDirectIntroductions: true,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    apiClient.getMyProfile().then((p) => {
      if (p) {
        setProfile(p);
        setPrivacy(p.privacyPreferences);
      }
    });
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    await apiClient.updateMyProfile({ privacyPreferences: privacy });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo state back to default hackathon dataset?')) {
      apiClient.resetDemoData();
      window.location.reload();
    }
  };

  if (!profile) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      {saved && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs shadow-2xl flex items-center gap-2">
          <Check className="h-4 w-4 text-emerald-400" />
          Privacy & context settings saved!
        </div>
      )}

      {/* Header */}
      <div className="border-b border-[#232730] pb-5">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Shield className="h-7 w-7 text-emerald-400" />
          Privacy & System Settings
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Configure how your context is shared, adjust proximity signals, and verify AWS architecture status.
        </p>
      </div>

      {/* LOCATION & EVENT PROXIMITY SETTINGS */}
      <div className="rounded-2xl border border-[#232730] bg-[#15181e] p-6 space-y-5 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-emerald-400 font-semibold">
          <MapPin className="h-4 w-4" />
          Event Proximity & Location Sharing
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          Location is an optional signal designed strictly for on-site co-attendee discovery. Your exact GPS coordinates are NEVER broadcast or exposed to other users or frontends. When enabled, calculations use backend Haversine distance and display only blurred approximations (e.g., "Approx. 320 m away").
        </p>

        <div className="space-y-3">
          <label className="block text-xs font-medium text-zinc-300">Location Sharing Scope</label>
          <div className="grid grid-cols-3 gap-3">
            {(['OFF', 'During This Event', 'Always'] as LocationSharingMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setPrivacy({ ...privacy, locationSharing: mode })}
                className={`p-3.5 text-center rounded-xl border text-xs transition-all ${
                  privacy.locationSharing === mode
                    ? 'border-amber-500 bg-amber-500/10 text-white font-bold'
                    : 'border-zinc-800 bg-[#0c0e12] text-zinc-300 hover:border-zinc-700'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
          <div className="rounded-xl bg-[#0c0e12] border border-zinc-800 p-3 text-xs text-zinc-400 flex items-center justify-between">
            <span>Current Discovery Badge:</span>
            <span className="font-mono text-emerald-400">
              {privacy.locationSharing === 'OFF'
                ? 'Distance unavailable'
                : 'Approx. 320 m away · Near Workshop Area'}
            </span>
          </div>
        </div>
      </div>

      {/* VISIBILITY & PRIVACY PREFERENCES */}
      <div className="rounded-2xl border border-[#232730] bg-[#15181e] p-6 space-y-5 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-zinc-300 font-semibold">
          <Lock className="h-4 w-4 text-amber-400" />
          Visibility & Consent Controls
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">Profile Visibility</label>
            <select
              value={privacy.profileVisibility}
              onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.value as any })}
              className="w-full p-2.5 rounded-xl bg-[#0c0e12] border border-zinc-800 text-xs text-white"
            >
              <option value="public">Public (Visible across platform)</option>
              <option value="event_only">Event Attendees Only (Strictly co-attendees)</option>
              <option value="connections_only">Connections Only (Hidden from discovery)</option>
            </select>
          </div>

          <div className="rounded-xl bg-[#0c0e12] border border-zinc-800 p-4 space-y-3">
            <label className="flex items-center justify-between text-zinc-300 cursor-pointer">
              <span>Display Declared Skills in Search Directory</span>
              <input
                type="checkbox"
                checked={privacy.skillsVisibility}
                onChange={(e) => setPrivacy({ ...privacy, skillsVisibility: e.target.checked })}
                className="rounded border-zinc-700 text-amber-500 focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between text-zinc-300 cursor-pointer">
              <span>Display Project Gaps to Complementary Matches</span>
              <input
                type="checkbox"
                checked={privacy.projectVisibility}
                onChange={(e) => setPrivacy({ ...privacy, projectVisibility: e.target.checked })}
                className="rounded border-zinc-700 text-amber-500 focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between text-zinc-300 cursor-pointer">
              <span>Allow Direct Introductions via Bedrock AI</span>
              <input
                type="checkbox"
                checked={privacy.allowDirectIntroductions}
                onChange={(e) => setPrivacy({ ...privacy, allowDirectIntroductions: e.target.checked })}
                className="rounded border-zinc-700 text-amber-500 focus:ring-0"
              />
            </label>
          </div>
        </div>
      </div>

      {/* SYSTEM ARCHITECTURE & DEMO STATE */}
      <div className="rounded-2xl border border-[#232730] bg-[#15181e] p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between text-xs font-mono uppercase text-zinc-400">
          <span className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-cyan-400" />
            Target Architecture & Integration Status
          </span>
          <span className="text-[10px] text-amber-400 font-mono lowercase">
            {apiClient.isMockMode() ? 'local prototype / mock engine' : 'live cloud api'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#0c0e12] border border-zinc-800">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block">AI Service</span>
            <span className="text-white font-semibold">Amazon Bedrock</span>
            <span className="text-[10px] text-amber-400 block mt-0.5">
              {apiClient.isMockMode() ? 'Architecture Ready (Simulated)' : 'Connected'}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#0c0e12] border border-zinc-800">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block">Database</span>
            <span className="text-white font-semibold">Amazon DynamoDB</span>
            <span className="text-[10px] text-amber-400 block mt-0.5">
              {apiClient.isMockMode() ? 'Schema Configured (Local Cache)' : 'Connected'}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#0c0e12] border border-zinc-800">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block">Auth Layer</span>
            <span className="text-white font-semibold">Amazon Cognito</span>
            <span className="text-[10px] text-amber-400 block mt-0.5">
              {apiClient.isMockMode() ? 'Auth Ready (Local Tokens)' : 'Connected'}
            </span>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs transition-colors"
          >
            <RefreshCw className="h-3 w-3" />
            Reset Demo Dataset
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-colors shadow-sm"
          >
            <Check className="h-4 w-4" />
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
