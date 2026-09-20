import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FolderGit2,
  Sparkles,
  ArrowLeft,
  Users,
  CheckCircle,
  AlertTriangle,
  Layers,
  ArrowRight,
  Shield,
  Clock,
} from 'lucide-react';
import { apiClient } from '../services/apiClient';
import { Project } from '../types';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (id) {
      apiClient.getProjectById(id).then((p) => {
        setProject(p || null);
        setLoading(false);
      });
    }
  }, [id]);

  const handleAnalyze = async () => {
    if (!project) return;
    setAnalyzing(true);
    try {
      const updated = await apiClient.analyzeProject(project.id);
      setProject(updated);
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-xs text-zinc-400">
        Loading project details...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-16 space-y-3">
        <h2 className="text-lg font-bold text-white">Project Not Found</h2>
        <Link to="/projects" className="text-xs text-amber-400 underline">
          Back to Projects
        </Link>
      </div>
    );
  }

  const analysis = project.gapAnalysis;

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="border-b border-[#232730] pb-6">
        <div className="flex items-center gap-3 mb-3">
          <Link
            to="/projects"
            className="p-1.5 rounded-lg bg-[#15181e] border border-zinc-800 text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <span className="text-xs font-mono uppercase text-zinc-400">Project Overview</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{project.name}</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                {project.projectStage}
              </span>
            </div>
            <p className="text-xs text-zinc-400">{project.domain}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#15181e] hover:bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-medium transition-colors disabled:opacity-50"
            >
              <Sparkles className={`h-3.5 w-3.5 text-amber-400 ${analyzing ? 'animate-spin' : ''}`} />
              {analyzing ? 'Analyzing via Bedrock...' : 'Analyze Project Gaps'}
            </button>
            <Link
              to={`/who-should-i-meet?projectId=${project.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-colors shadow-sm"
            >
              <Users className="h-4 w-4" />
              Find Collaborators
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Description & Technologies */}
      <div className="rounded-2xl border border-[#232730] bg-[#15181e] p-6 space-y-4">
        <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono">
          Project Summary
        </h3>
        <p className="text-sm text-zinc-300 leading-relaxed">{project.description}</p>

        <div className="pt-2">
          <span className="text-xs font-mono uppercase text-zinc-400 block mb-2">Technology Stack:</span>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 rounded-lg bg-[#0c0e12] border border-zinc-800 text-xs text-zinc-300"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Current Capabilities vs Declared Needs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-[#232730] bg-[#15181e] p-6 space-y-3">
          <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            Current Capabilities
          </h3>
          <p className="text-xs text-zinc-400">Capabilities provided by current team:</p>
          <ul className="space-y-2 text-xs text-zinc-200">
            {project.currentCapabilities.map((cap, i) => (
              <li key={i} className="flex items-start gap-2 p-2 rounded-lg bg-[#0c0e12] border border-zinc-800">
                <span className="text-emerald-400 mt-0.5">•</span>
                <span>{cap}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-amber-500/30 bg-[#15181e] p-6 space-y-3">
          <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            Declared Project Needs
          </h3>
          <p className="text-xs text-zinc-400">Missing capabilities required to succeed:</p>
          <ul className="space-y-2 text-xs text-zinc-200">
            {project.declaredNeeds.map((need, i) => (
              <li key={i} className="flex items-start gap-2 p-2 rounded-lg bg-[#0c0e12] border border-amber-500/20">
                <span className="text-amber-400 mt-0.5">•</span>
                <span className="text-amber-200">{need}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* BEDROCK PROJECT INTELLIGENCE GAP REPORT */}
      {analysis && (
        <div className="rounded-2xl border border-[#232730] bg-[#15181e] p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#232730] pb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Amazon Bedrock Gap Analysis Report</h3>
                <p className="text-[11px] text-zinc-400">Analyzed at {new Date(analysis.analyzedAt).toLocaleTimeString()}</p>
              </div>
            </div>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Bedrock Evaluated
            </span>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase text-zinc-300 tracking-wider">Identified Technical Gaps:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.technicalGaps.map((gap, i) => (
                <div key={i} className="p-4 rounded-xl bg-[#0c0e12] border border-[#232730] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{gap.missingCapability}</span>
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                        gap.priority === 'high'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {gap.priority} priority
                    </span>
                  </div>
                  <p className="text-zinc-400 leading-relaxed text-[11px]">{gap.reason}</p>
                  <div className="pt-1 text-[11px] text-zinc-300">
                    <span className="text-zinc-400 font-mono">Suggested Role: </span>
                    <strong className="text-amber-300">{gap.suggestedRole}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick CTA to match based on these exact gaps */}
          <div className="rounded-xl bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-white">Find People To Close These Gaps</p>
              <p className="text-[11px] text-zinc-400">
                Run the two-stage recommendation engine specifically tuned to resolve these requirements.
              </p>
            </div>
            <Link
              to={`/who-should-i-meet?projectId=${project.id}`}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-colors shrink-0"
            >
              Who Should I Meet For This Project?
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
