import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FolderGit2, Plus, X, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { apiClient } from '../services/apiClient';
import { mockEvents } from '../data/mockData';

export const NewProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState('Healthcare & BioTech');
  const [stage, setStage] = useState<'Idea' | 'Prototype' | 'In Progress' | 'Beta' | 'Launched'>('In Progress');
  const [eventId, setEventId] = useState(mockEvents[0].id);

  const [technologies, setTechnologies] = useState<string[]>(['Java', 'Spring Boot', 'AWS']);
  const [currentCapabilities, setCurrentCapabilities] = useState<string[]>([
    'Backend microservices',
    'RESTful API architecture',
  ]);
  const [declaredNeeds, setDeclaredNeeds] = useState<string[]>([
    'React & Next.js frontend',
    'UI/UX design',
  ]);

  const [techInput, setTechInput] = useState('');
  const [capInput, setCapInput] = useState('');
  const [needInput, setNeedInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddTech = () => {
    if (techInput.trim() && !technologies.includes(techInput.trim())) {
      setTechnologies([...technologies, techInput.trim()]);
      setTechInput('');
    }
  };

  const handleAddCap = () => {
    if (capInput.trim() && !currentCapabilities.includes(capInput.trim())) {
      setCurrentCapabilities([...currentCapabilities, capInput.trim()]);
      setCapInput('');
    }
  };

  const handleAddNeed = () => {
    if (needInput.trim() && !declaredNeeds.includes(needInput.trim())) {
      setDeclaredNeeds([...declaredNeeds, needInput.trim()]);
      setNeedInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const created = await apiClient.createProject({
        name,
        description,
        domain,
        projectStage: stage,
        technologies,
        currentCapabilities,
        declaredNeeds,
        teamMembers: [],
        eventId,
      });
      setLoading(false);
      navigate(`/projects/${created.id}`);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      <div className="flex items-center gap-3 border-b border-[#232730] pb-5">
        <Link
          to="/projects"
          className="p-2 rounded-xl bg-[#15181e] border border-zinc-800 text-zinc-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Create New Project</h1>
          <p className="text-xs text-zinc-400">
            Define what you are building and what complementary teammates you need.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl border border-[#232730] bg-[#15181e] p-6 space-y-5">
          {/* Project Name */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">Project Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. AI Clinical Note Summarizer"
              className="w-full p-2.5 rounded-xl bg-[#0c0e12] border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">Project Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what the application does, its core architecture, and its intended users..."
              className="w-full p-2.5 rounded-xl bg-[#0c0e12] border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Domain & Stage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">Domain / Industry</label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="e.g. Healthcare, Developer Tools, Climate Tech"
                className="w-full p-2.5 rounded-xl bg-[#0c0e12] border border-zinc-800 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">Project Stage</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-[#0c0e12] border border-zinc-800 text-xs text-white"
              >
                <option value="Idea">Idea</option>
                <option value="Prototype">Prototype</option>
                <option value="In Progress">In Progress</option>
                <option value="Beta">Beta</option>
                <option value="Launched">Launched</option>
              </select>
            </div>
          </div>

          {/* Event affiliation */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">Associated Event / Hackathon</label>
            <select
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#0c0e12] border border-zinc-800 text-xs text-white"
            >
              {mockEvents.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.name} ({ev.city})
                </option>
              ))}
            </select>
          </div>

          {/* Technologies */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">Technologies Used</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                placeholder="Add technology (e.g. Java, Docker, Bedrock)..."
                className="flex-1 p-2 rounded-xl bg-[#0c0e12] border border-zinc-800 text-xs text-white"
              />
              <button
                type="button"
                onClick={handleAddTech}
                className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {technologies.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 text-xs text-zinc-200"
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => setTechnologies(technologies.filter((item) => item !== t))}
                  >
                    <X className="h-3 w-3 text-zinc-400 hover:text-white" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Current Capabilities */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Current Capabilities (What you already have built or covered)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={capInput}
                onChange={(e) => setCapInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCap())}
                placeholder="e.g. Backend API microservices, DynamoDB schema..."
                className="flex-1 p-2 rounded-xl bg-[#0c0e12] border border-zinc-800 text-xs text-white"
              />
              <button
                type="button"
                onClick={handleAddCap}
                className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {currentCapabilities.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 text-xs text-zinc-200"
                >
                  {c}
                  <button
                    type="button"
                    onClick={() => setCurrentCapabilities(currentCapabilities.filter((item) => item !== c))}
                  >
                    <X className="h-3 w-3 text-zinc-400 hover:text-white" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Declared Needs (CRITICAL FOR COMPLEMENTARITY MATCHING) */}
          <div>
            <label className="block text-xs font-medium text-amber-400 mb-1.5">
              Declared Project Needs / Missing Capabilities (Who you actually need)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={needInput}
                onChange={(e) => setNeedInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddNeed())}
                placeholder="e.g. React frontend engineer, clinical compliance reviewer..."
                className="flex-1 p-2 rounded-xl bg-[#0c0e12] border border-amber-500/40 text-xs text-white focus:border-amber-400"
              />
              <button
                type="button"
                onClick={handleAddNeed}
                className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-xl text-xs font-bold"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {declaredNeeds.map((n) => (
                <span
                  key={n}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs"
                >
                  {n}
                  <button
                    type="button"
                    onClick={() => setDeclaredNeeds(declaredNeeds.filter((item) => item !== n))}
                  >
                    <X className="h-3 w-3 text-amber-400 hover:text-white" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          <Link
            to="/projects"
            className="px-4 py-2 rounded-xl border border-zinc-700 text-xs font-medium text-zinc-300 hover:bg-zinc-800"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-colors shadow-sm disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            {loading ? 'Creating & Analyzing...' : 'Create & Run Bedrock Gap Analysis'}
          </button>
        </div>
      </form>
    </div>
  );
};
