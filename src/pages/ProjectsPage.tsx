import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderGit2,
  Plus,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Layers,
  CheckCircle,
  Users,
  Calendar,
} from 'lucide-react';
import { apiClient } from '../services/apiClient';
import { Project, Event } from '../types';
import { ProjectGapModal } from '../components/ProjectGapModal';
import { mockEvents } from '../data/mockData';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isGapModalOpen, setIsGapModalOpen] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  useEffect(() => {
    apiClient.getMyProjects().then(setProjects);
  }, []);

  const handleTriggerAnalysis = async (proj: Project) => {
    setAnalyzingId(proj.id);
    try {
      const updated = await apiClient.analyzeProject(proj.id);
      setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setSelectedProject(updated);
      setIsGapModalOpen(true);
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzingId(null);
    }
  };

  const activeEvent = mockEvents[0];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="border-b border-[#1f232b] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold mb-1">
            BUILDS & CAPABILITY GAPS
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <FolderGit2 className="h-7 w-7 text-amber-400" />
            Projects
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Manage your project goals, tech stack, and missing roles so the complementarity engine
            can recommend exact matches.
          </p>
        </div>
        <Link
          to="/projects/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-colors shadow-sm min-h-[40px]"
        >
          <Plus className="h-4 w-4" />
          Create New Project
        </Link>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="rounded-2xl border border-[#1f232b] bg-[#14171d] hover:border-zinc-700/80 p-6 shadow-sm space-y-4 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-3.5">
              {/* Top: Stage, Domain, Event & Analysis trigger */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {proj.projectStage}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {proj.domain}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white mt-2 tracking-tight">{proj.name}</h2>
                </div>

                <button
                  type="button"
                  onClick={() => handleTriggerAnalysis(proj)}
                  disabled={analyzingId === proj.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium transition-colors shrink-0"
                >
                  <Sparkles
                    className={`h-3.5 w-3.5 ${analyzingId === proj.id ? 'animate-spin' : ''}`}
                  />
                  {analyzingId === proj.id ? 'Analyzing...' : 'Analyze Gaps'}
                </button>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">{proj.description}</p>

              {/* Technologies */}
              <div>
                <span className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                  Technologies
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {proj.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded-md bg-[#0c0e12] border border-zinc-800 text-[11px] text-zinc-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Needs / Missing Roles */}
              <div className="rounded-xl bg-[#0c0e12] border border-[#1f232b] p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Declared Project Needs
                  </span>
                  {proj.gapAnalysis && (
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Evaluated
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {proj.declaredNeeds.map((need) => (
                    <span
                      key={need}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[11px] font-medium"
                    >
                      {need}
                    </span>
                  ))}
                </div>
              </div>

              {/* Event Context */}
              <div className="flex items-center gap-2 text-xs text-zinc-400 pt-1">
                <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                <span>
                  Affiliated Event: <strong className="text-zinc-300">{activeEvent.name}</strong>
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3.5 border-t border-[#1f232b] flex items-center justify-between gap-3">
              <Link
                to={`/projects/${proj.id}`}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                Project Details
                <ArrowRight className="h-3 w-3" />
              </Link>
              <Link
                to={`/who-should-i-meet?projectId=${proj.id}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-colors shadow-sm min-h-[38px]"
              >
                Find Collaborators
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <ProjectGapModal
        project={selectedProject}
        isOpen={isGapModalOpen}
        onClose={() => setIsGapModalOpen(false)}
      />
    </div>
  );
};
