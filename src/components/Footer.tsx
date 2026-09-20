import React from 'react';
import { Shield, Sparkles, Database, Cpu, Lock, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#232730] bg-[#0c0e12] text-zinc-400 text-xs py-10 mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <Sparkles className="h-4 w-4 text-amber-400" />
              GenZ Connectors
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-md">
              Context-Aware AI for Meaningful Human Connections. We identify complementary skills, project requirements, and event context so you meet the people you actually need to accomplish your goals.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#15181e] border border-zinc-800 text-[11px] text-zinc-300">
                <Cpu className="h-3 w-3 text-amber-400" />
                Amazon Bedrock Runtime
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#15181e] border border-zinc-800 text-[11px] text-zinc-300">
                <Database className="h-3 w-3 text-cyan-400" />
                Amazon DynamoDB Enhanced
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#15181e] border border-zinc-800 text-[11px] text-zinc-300">
                <Lock className="h-3 w-3 text-emerald-400" />
                Cognito JWT Security
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-zinc-200 font-medium mb-2.5 text-xs uppercase tracking-wider font-mono">
              Core Principles
            </h4>
            <ul className="space-y-1.5 text-xs text-zinc-400">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                Complementarity Over Similarity
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                Explain Why, Not Arbitrary %
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                Two-Stage Bedrock Retrieval
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                Consent-Based Event Proximity
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-zinc-200 font-medium mb-2.5 text-xs uppercase tracking-wider font-mono">
              Privacy & Navigation
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link to="/who-should-i-meet" className="text-zinc-400 hover:text-white transition-colors">
                  Who Should I Meet?
                </Link>
              </li>
              <li>
                <Link to="/discover" className="text-zinc-400 hover:text-white transition-colors">
                  Candidate Discovery
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-zinc-400 hover:text-white transition-colors">
                  Project Gap Analysis
                </Link>
              </li>
              <li>
                <Link to="/settings" className="text-zinc-400 hover:text-white transition-colors">
                  Privacy Preferences
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <p>© 2026 GenZ Connectors. Designed for hackathons, research labs, conferences, and startup ecosystems.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Shield className="h-3 w-3 text-emerald-500" />
              Zero Coordinates Exposed
            </span>
            <span>·</span>
            <span>No Unsolicited Messages</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
