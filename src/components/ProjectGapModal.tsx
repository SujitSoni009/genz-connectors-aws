import React from 'react';
import { Project } from '../types';
import { Sparkles, AlertTriangle, CheckCircle, X, Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProjectGapModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectGapModal: React.FC<ProjectGapModalProps> = ({ project, isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen || !project) return null;

  const analysis = project.gapAnalysis;

  const handleFindMatches = () => {
    onClose();
    navigate(`/who-should-i-meet?projectId=${project.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-[#262b36] bg-[#15181e] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#232730] px-6 py-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Amazon Bedrock Project Intelligence</h3>
              <p className="text-xs text-zinc-400">Context & Gap Evaluation for "{project.name}"</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-200 p-1 rounded-md hover:bg-zinc-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Current Capabilities vs Missing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl bg-[#0c0e12] border border-[#232730] p-4">
              <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono flex items-center gap-1.5 mb-3">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                Current Capabilities
              </h4>
              <ul className="space-y-1.5 text-xs text-zinc-300">
                {project.currentCapabilities.map((cap, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    {cap}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-[#0c0e12] border border-[#232730] p-4">
              <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono flex items-center gap-1.5 mb-3">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                Declared Needs
              </h4>
              <ul className="space-y-1.5 text-xs text-zinc-300">
                {project.declaredNeeds.map((need, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    {need}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Detailed Bedrock Gap Analysis */}
          {analysis && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider font-mono flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                Identified Technical & Usability Gaps
              </h4>
              <div className="space-y-2.5">
                {analysis.technicalGaps.map((gap, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#0c0e12] border border-[#232730] text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-zinc-100 flex items-center gap-1.5">
                        <span className="text-amber-400">{gap.missingCapability}</span>
                        <span className="text-[10px] text-zinc-400 font-mono">({gap.area})</span>
                      </span>
                      <span
                        className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full ${
                          gap.priority === 'high'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {gap.priority} priority
                      </span>
                    </div>
                    <p className="text-zinc-400 text-xs leading-relaxed">{gap.reason}</p>
                    <div className="pt-1 flex items-center gap-1.5 text-[11px] text-zinc-400">
                      <span className="text-zinc-400 font-mono">Recommended Role:</span>
                      <span className="text-amber-300 font-medium">{gap.suggestedRole}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Disclaimer */}
          <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800 text-[11px] text-zinc-400">
            Note: Bedrock evaluations are suggestions based strictly on supplied project data. No personal facts or unverified capabilities are hallucinated.
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#232730] px-6 py-4 bg-[#0e1014] flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-zinc-700 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleFindMatches}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-xs transition-colors shadow-sm"
          >
            <Users className="h-4 w-4" />
            Find Matching Collaborators
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
