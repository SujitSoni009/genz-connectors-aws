import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ArrowLeft, Check, Plus, X, Shield, MapPin } from 'lucide-react';
import { apiClient } from '../services/apiClient';
import { IntentType, AvailabilityStatus, LocationSharingMode, Profile } from '../types';
import { mockEvents } from '../data/mockData';

const INTENT_OPTIONS: IntentType[] = [
  'Find collaborator',
  'Find teammate',
  'Find cofounder',
  'Find mentor',
  'Find researcher',
  'Find customer',
  'Find internship/job opportunity',
  'Learn',
  'Teach',
  'Network',
];

const AVAILABILITY_OPTIONS: AvailabilityStatus[] = [
  'Available now',
  'Available this weekend',
  'Part-time',
  'Full-time',
  'Busy',
];

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<Profile>>({
    name: '',
    headline: '',
    bio: '',
    skills: ['Java', 'Spring Boot', 'AWS'],
    experience: 'Senior (5+ years)',
    canOffer: ['Backend APIs', 'System Architecture'],
    lookingFor: ['React Developer', 'UI/UX Designer'],
    currentIntent: 'Find collaborator',
    interests: ['Healthcare AI', 'Generative Models'],
    events: [mockEvents[0].id],
    availability: 'Available now',
    privacyPreferences: {
      profileVisibility: 'public',
      skillsVisibility: true,
      projectVisibility: true,
      intentVisibility: true,
      locationSharing: 'During This Event',
      allowDirectIntroductions: true,
    },
  });

  const [customTagInput, setCustomTagInput] = useState('');

  useEffect(() => {
    apiClient.getMyProfile().then((p) => {
      if (p) setProfile(p);
    });
  }, []);

  const handleSaveAndNext = async () => {
    if (step < 10) {
      setStep(step + 1);
    } else {
      await apiClient.updateMyProfile(profile);
      navigate('/dashboard');
    }
  };

  const addTag = (field: 'skills' | 'canOffer' | 'lookingFor' | 'interests') => {
    if (!customTagInput.trim()) return;
    const current = profile[field] || [];
    if (!current.includes(customTagInput.trim())) {
      setProfile({ ...profile, [field]: [...current, customTagInput.trim()] });
    }
    setCustomTagInput('');
  };

  const removeTag = (field: 'skills' | 'canOffer' | 'lookingFor' | 'interests', val: string) => {
    const current = profile[field] || [];
    setProfile({ ...profile, [field]: current.filter((item) => item !== val) });
  };

  return (
    <div className="min-h-screen bg-[#0c0e12] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto w-full">
        {/* Progress header */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
            <span className="font-mono uppercase text-amber-400">Step {step} of 10</span>
            <span>{Math.round((step / 10) * 100)}% Completed</span>
          </div>
          <div className="w-full h-1.5 bg-[#15181e] rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 transition-all duration-300"
              style={{ width: `${(step / 10) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-[#232730] bg-[#15181e] p-6 sm:p-8 shadow-2xl">
          {/* STEP 1: Basic info */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">Step 1: Basic Information</h2>
              <p className="text-xs text-zinc-400">How do you introduce yourself to other builders?</p>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Your Name</label>
                <input
                  type="text"
                  value={profile.name || ''}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#0c0e12] border border-zinc-800 text-xs text-white"
                  placeholder="e.g. Alex Johnson"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Professional Headline</label>
                <input
                  type="text"
                  value={profile.headline || ''}
                  onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#0c0e12] border border-zinc-800 text-xs text-white"
                  placeholder="e.g. Senior Backend Engineer · Distributed Systems"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">Brief Bio</label>
                <textarea
                  value={profile.bio || ''}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-[#0c0e12] border border-zinc-800 text-xs text-white"
                  placeholder="Tell collaborators what you are building or passionate about..."
                />
              </div>
            </div>
          )}

          {/* STEP 2: Skills */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">Step 2: Core Skills</h2>
              <p className="text-xs text-zinc-400">Select or enter technical, design, or domain capabilities.</p>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={customTagInput}
                  onChange={(e) => setCustomTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag('skills'))}
                  className="flex-1 p-2.5 rounded-xl bg-[#0c0e12] border border-zinc-800 text-xs text-white"
                  placeholder="Add skill (e.g. React, Java, DynamoDB, UX)"
                />
                <button
                  type="button"
                  onClick={() => addTag('skills')}
                  className="px-3 py-2 bg-amber-500 text-black text-xs font-semibold rounded-xl"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {profile.skills?.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-800 text-xs text-zinc-200"
                  >
                    {s}
                    <button onClick={() => removeTag('skills', s)}>
                      <X className="h-3 w-3 text-zinc-400 hover:text-white" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Experience */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">Step 3: Experience Level</h2>
              <p className="text-xs text-zinc-400">What is your current background?</p>
              <div className="space-y-2">
                {['Student / Emerging Builder', 'Junior (1-2 yrs)', 'Mid-Level (3-5 yrs)', 'Senior (5+ yrs)', 'Principal / Architect', 'Founder / Domain Specialist'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setProfile({ ...profile, experience: lvl })}
                    className={`w-full p-3 text-left rounded-xl border text-xs flex items-center justify-between transition-colors ${
                      profile.experience === lvl
                        ? 'border-amber-500 bg-amber-500/10 text-white font-medium'
                        : 'border-zinc-800 bg-[#0c0e12] text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    {lvl}
                    {profile.experience === lvl && <Check className="h-4 w-4 text-amber-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: What I can offer */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">Step 4: What I Can Offer</h2>
              <p className="text-xs text-zinc-400">What specific superpowers do you bring to a project?</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customTagInput}
                  onChange={(e) => setCustomTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag('canOffer'))}
                  className="flex-1 p-2.5 rounded-xl bg-[#0c0e12] border border-zinc-800 text-xs text-white"
                  placeholder="e.g. Java Spring Boot microservices, DynamoDB schema design"
                />
                <button
                  type="button"
                  onClick={() => addTag('canOffer')}
                  className="px-3 py-2 bg-amber-500 text-black text-xs font-semibold rounded-xl"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {profile.canOffer?.map((item) => (
                  <span key={item} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-800 text-xs text-zinc-200">
                    {item}
                    <button onClick={() => removeTag('canOffer', item)}>
                      <X className="h-3 w-3 text-zinc-400 hover:text-white" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: What I am looking for */}
          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">Step 5: What I Am Looking For</h2>
              <p className="text-xs text-zinc-400">What skills or complementary collaborators do you need?</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customTagInput}
                  onChange={(e) => setCustomTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag('lookingFor'))}
                  className="flex-1 p-2.5 rounded-xl bg-[#0c0e12] border border-zinc-800 text-xs text-white"
                  placeholder="e.g. React & Next.js frontend, UI/UX clinical designer"
                />
                <button
                  type="button"
                  onClick={() => addTag('lookingFor')}
                  className="px-3 py-2 bg-amber-500 text-black text-xs font-semibold rounded-xl"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {profile.lookingFor?.map((item) => (
                  <span key={item} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-800 text-xs text-zinc-200">
                    {item}
                    <button onClick={() => removeTag('lookingFor', item)}>
                      <X className="h-3 w-3 text-zinc-400 hover:text-white" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: Current Intent */}
          {step === 6 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">Step 6: Current Intent</h2>
              <p className="text-xs text-zinc-400">Why are you actively networking right now?</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {INTENT_OPTIONS.map((intent) => (
                  <button
                    key={intent}
                    type="button"
                    onClick={() => setProfile({ ...profile, currentIntent: intent })}
                    className={`p-3 text-left rounded-xl border text-xs flex items-center justify-between transition-colors ${
                      profile.currentIntent === intent
                        ? 'border-amber-500 bg-amber-500/10 text-white font-medium'
                        : 'border-zinc-800 bg-[#0c0e12] text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    {intent}
                    {profile.currentIntent === intent && <Check className="h-3.5 w-3.5 text-amber-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 7: Interests */}
          {step === 7 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">Step 7: Domain Interests</h2>
              <p className="text-xs text-zinc-400">Which industries and technology topics excite you?</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customTagInput}
                  onChange={(e) => setCustomTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag('interests'))}
                  className="flex-1 p-2.5 rounded-xl bg-[#0c0e12] border border-zinc-800 text-xs text-white"
                  placeholder="e.g. Healthcare, GenAI, Web3, Distributed Systems"
                />
                <button
                  type="button"
                  onClick={() => addTag('interests')}
                  className="px-3 py-2 bg-amber-500 text-black text-xs font-semibold rounded-xl"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {profile.interests?.map((item) => (
                  <span key={item} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-800 text-xs text-zinc-200">
                    {item}
                    <button onClick={() => removeTag('interests', item)}>
                      <X className="h-3 w-3 text-zinc-400 hover:text-white" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* STEP 8: Events/Communities */}
          {step === 8 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">Step 8: Events & Communities</h2>
              <p className="text-xs text-zinc-400">Which active events are you participating in?</p>
              <div className="space-y-2.5">
                {mockEvents.map((ev) => {
                  const isSelected = profile.events?.includes(ev.id);
                  return (
                    <button
                      key={ev.id}
                      type="button"
                      onClick={() => {
                        const current = profile.events || [];
                        const updated = isSelected ? current.filter((id) => id !== ev.id) : [...current, ev.id];
                        setProfile({ ...profile, events: updated });
                      }}
                      className={`w-full p-3.5 text-left rounded-xl border text-xs flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/10 text-white'
                          : 'border-zinc-800 bg-[#0c0e12] text-zinc-300 hover:border-zinc-700'
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-white">{ev.name}</p>
                        <p className="text-[11px] text-zinc-400">{ev.venue} · {ev.city}</p>
                      </div>
                      {isSelected && <Check className="h-4 w-4 text-amber-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 9: Availability */}
          {step === 9 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">Step 9: Availability</h2>
              <p className="text-xs text-zinc-400">When are you ready to collaborate or hack?</p>
              <div className="space-y-2">
                {AVAILABILITY_OPTIONS.map((avail) => (
                  <button
                    key={avail}
                    type="button"
                    onClick={() => setProfile({ ...profile, availability: avail })}
                    className={`w-full p-3 text-left rounded-xl border text-xs flex items-center justify-between transition-colors ${
                      profile.availability === avail
                        ? 'border-amber-500 bg-amber-500/10 text-white font-medium'
                        : 'border-zinc-800 bg-[#0c0e12] text-zinc-300 hover:border-zinc-700'
                    }`}
                  >
                    {avail}
                    {profile.availability === avail && <Check className="h-4 w-4 text-amber-400" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 10: Privacy Preferences */}
          {step === 10 && (
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-400" />
                <h2 className="text-xl font-bold text-white">Step 10: Privacy Preferences</h2>
              </div>
              <p className="text-xs text-zinc-400">You remain in full control of your visibility and location signals.</p>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-2">Location Sharing Mode</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['OFF', 'During This Event', 'Always'] as LocationSharingMode[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() =>
                        setProfile({
                          ...profile,
                          privacyPreferences: {
                            ...(profile.privacyPreferences || {
                              profileVisibility: 'public',
                              skillsVisibility: true,
                              projectVisibility: true,
                              intentVisibility: true,
                              allowDirectIntroductions: true,
                              locationSharing: mode,
                            }),
                            locationSharing: mode,
                          },
                        })
                      }
                      className={`p-3 text-center rounded-xl border text-xs transition-colors ${
                        profile.privacyPreferences?.locationSharing === mode
                          ? 'border-amber-500 bg-amber-500/10 text-white font-semibold'
                          : 'border-zinc-800 bg-[#0c0e12] text-zinc-300 hover:border-zinc-700'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-zinc-400 mt-2 flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-emerald-400" />
                  When active, only approximate proximity (e.g. "Approx. 300 m away") is visible to co-attendees. Never exact coordinates.
                </p>
              </div>

              <div className="rounded-xl bg-[#0c0e12] border border-zinc-800 p-4 space-y-3">
                <label className="flex items-center justify-between text-xs text-zinc-300">
                  <span>Allow Direct AI Context Introductions</span>
                  <input
                    type="checkbox"
                    checked={profile.privacyPreferences?.allowDirectIntroductions ?? true}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        privacyPreferences: {
                          ...(profile.privacyPreferences as any),
                          allowDirectIntroductions: e.target.checked,
                        },
                      })
                    }
                    className="rounded border-zinc-700 text-amber-500 focus:ring-0"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-8 pt-4 border-t border-[#232730] flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-zinc-700 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={handleSaveAndNext}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-colors shadow-sm"
            >
              {step === 10 ? 'Finish & Launch Dashboard' : 'Continue'}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
