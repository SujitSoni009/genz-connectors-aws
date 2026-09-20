import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Users,
  Shield,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
  MapPin,
  MessageSquare,
  Lock,
  GitMerge,
  Target,
  Terminal,
  Activity,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-16 pb-16">
      {/* HERO SECTION */}
      <section className="relative pt-4 sm:pt-8 pb-12 overflow-hidden">
        <div className="mx-auto max-w-5xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#15181e] border border-[#262b36] text-xs text-zinc-300 font-mono">
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            Context-Aware AI for Meaningful Human Connections
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Meet the people you <span className="text-amber-400">actually need</span>.
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg text-zinc-400 font-normal leading-relaxed">
            GenZ Connectors understands your intent, project, and needs to help you discover people who genuinely complement what you're building. Not just people similar to you, but the exact collaborators who complete your vision.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/who-should-i-meet"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm transition-all shadow-md hover:scale-[1.02]"
            >
              <Users className="h-4 w-4" />
              Find My Connections
            </Link>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#15181e] hover:bg-[#1a1f28] text-zinc-300 hover:text-white border border-[#262b36] font-medium text-sm transition-colors"
            >
              See How It Works
            </a>
          </div>

          {/* CONCEPTUAL FLOW */}
          <div className="mt-16 pt-10 border-t border-zinc-800/80">
            <p className="text-xs uppercase font-mono tracking-widest text-zinc-400 mb-6">
              The Context-Aware Engine Loop
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 max-w-4xl mx-auto">
              {[
                { label: 'YOUR INTENT', desc: 'Find collaborator, cofounder, mentor' },
                { label: 'YOUR PROJECT', desc: 'Declared needs & capabilities' },
                { label: 'AI GAP ANALYSIS', desc: 'Bedrock detects missing pieces' },
                { label: 'WHO TO MEET', desc: 'Ranked by true complementarity' },
                { label: 'CONNECTION', desc: 'AI introduction with your consent' },
              ].map((step, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#15181e] border border-[#232730] text-center flex flex-col justify-between">
                  <span className="text-[10px] font-mono font-bold text-amber-400 mb-1">0{idx + 1}</span>
                  <h4 className="text-xs font-bold text-white mb-1">{step.label}</h4>
                  <p className="text-[11px] text-zinc-400">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM & SOLUTION SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-[#232730] bg-[#0f1116]">
        <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs uppercase font-mono text-red-400">
              <Activity className="h-3.5 w-3.5" />
              The Problem With Modern Networking
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Traditional apps match you with people who are <span className="line-through text-zinc-500">just like you</span>.
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              If you are a Java backend engineer, traditional algorithms match you with five more Java backend engineers. But when you are building an AI healthcare assistant, you don't need another Java engineer—you need React frontend expertise, UI/UX workflow designers, and clinical domain insight.
            </p>
            <div className="rounded-xl bg-[#15181e] border border-zinc-800 p-4 text-xs text-zinc-400 space-y-2">
              <div className="text-zinc-300 font-semibold">Typical Flawed Result:</div>
              <p>Match 94% · "Both of you know Java." → <strong className="text-red-400">Zero project synergy.</strong></p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs uppercase font-mono text-emerald-400">
              <Sparkles className="h-3.5 w-3.5" />
              The GenZ Connectors Solution
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              We match you with people who <span className="text-emerald-400">complement your goals</span>.
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              GenZ Connectors evaluates project gaps, mutual value, event participation, and real intent. It recognizes that Person A needs React while Person B has React and needs Java backend APIs.
            </p>
            <div className="rounded-xl bg-[#15181e] border border-amber-500/30 p-4 text-xs text-zinc-300 space-y-2">
              <div className="text-amber-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                Context-Aware Complementarity:
              </div>
              <p>Person A provides Java/Spring Boot. Person B provides React & UI/UX. Both attend the same hackathon. <strong className="text-amber-300">Perfect collaboration.</strong></p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS / HERO FEATURE DEMO */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[#232730]">
        <div className="mx-auto max-w-5xl text-center space-y-4 mb-12">
          <span className="text-xs uppercase font-mono tracking-widest text-amber-400">Hero Experience</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            "Who Should I Meet?"
          </h2>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto">
            Not arbitrary percentage scores. We provide structured, human-readable explanations answering "Why This Person?"
          </p>
        </div>

        {/* Live-style Recommendation Card Sample */}
        <div className="max-w-2xl mx-auto rounded-2xl border border-zinc-700 bg-[#15181e] p-6 shadow-2xl space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500/30 to-orange-500/20 border border-amber-500/40 flex items-center justify-center font-bold text-lg text-amber-300">
                RS
              </div>
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  Rahul Sharma
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                    Find collaborator
                  </span>
                </h3>
                <p className="text-xs text-zinc-400">Frontend Engineer & UI/UX Specialist · Design Systems</p>
                <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" />
                  Approx. 320 m away · Near Workshop Area · Available now
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-[#0c0e12] border border-[#232730] p-4 text-xs space-y-2">
            <p className="font-semibold text-amber-400 uppercase tracking-wide flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              Why you should meet Rahul:
            </p>
            <ul className="space-y-1.5 text-zinc-300">
              <li className="flex items-start gap-2">
                <span className="text-amber-400">•</span>
                <span>Your project <strong>"AI Healthcare Assistant"</strong> needs <strong>React</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400">•</span>
                <span>Rahul has proven <strong>React and UI/UX design</strong> experience.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400">•</span>
                <span>Rahul is looking for <strong>Java / Spring Boot backend</strong> collaboration.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400">•</span>
                <span>You provide the required <strong>Java and AWS cloud</strong> expertise.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400">•</span>
                <span>Both of you are attending <strong>AWS Global Builders Hackathon 2026</strong>.</span>
              </li>
            </ul>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-zinc-400 font-mono">Stage 2: Amazon Bedrock Verified</span>
            <Link
              to="/who-should-i-meet"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-colors"
            >
              Try In Interactive Demo
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* PRIVACY & SECURITY SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-[#232730] bg-[#0c0e12]">
        <div className="mx-auto max-w-5xl">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs uppercase font-mono tracking-widest text-emerald-400">Strict Privacy Principles</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Your Consent is Always Required</h2>
            <p className="text-xs text-zinc-400 max-w-xl mx-auto">
              We never track users continuously, never broadcast exact GPS coordinates, and never send messages without explicit human approval.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-[#15181e] border border-[#232730] space-y-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                <MapPin className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold text-white">Approximate Proximity Only</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Raw coordinates are calculated on the backend via the Haversine formula and never sent to clients. The UI only ever sees blurred approximations like "Approx. 300 m away".
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#15181e] border border-[#232730] space-y-2">
              <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
                <Lock className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold text-white">Zero Autonomous Messages</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                AI drafts personalized introduction notes based on mutual project synergies, but no communication is dispatched until you review, edit, and click "Approve & Send".
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#15181e] border border-[#232730] space-y-2">
              <div className="h-8 w-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3">
                <Cpu className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold text-white">Two-Stage AI Efficiency</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                We do not dump entire databases into LLM context windows. Stage 1 executes deterministic filtering; Stage 2 sends only the top candidate set to Bedrock, minimizing cost and latency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* USE CASES & LONG TERM VISION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-[#232730] bg-[#0f1116]">
        <div className="mx-auto max-w-5xl">
          <div className="text-center space-y-3 mb-10">
            <span className="text-xs uppercase font-mono tracking-widest text-zinc-400">Scale Beyond Hackathons</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Built For Every Collaborative Ecosystem</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {[
              { title: 'Hackathons', desc: 'Rapid team formation' },
              { title: 'Conferences', desc: 'Targeted hallway tracks' },
              { title: 'Universities', desc: 'Interdisciplinary research' },
              { title: 'Startups', desc: 'Technical cofounder discovery' },
              { title: 'Workshops', desc: 'Complementary pair learning' },
              { title: 'Mentorship', desc: 'Context-aligned advisors' },
              { title: 'Research Labs', desc: 'Cross-institution papers' },
              { title: 'Dev Communities', desc: 'Project-first networking' },
            ].map((uc, i) => (
              <div key={i} className="p-4 rounded-xl bg-[#15181e] border border-zinc-800">
                <p className="font-semibold text-zinc-200 text-xs">{uc.title}</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[#232730] text-center bg-[#0c0e12]">
        <div className="mx-auto max-w-2xl space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to discover who you should meet?
          </h2>
          <p className="text-sm text-zinc-400">
            Explore the live prototype, review Bedrock project gap analysis, and experience context-driven networking right now.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm transition-colors shadow-md"
            >
              Launch Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/who-should-i-meet"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#15181e] hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 text-sm font-medium transition-colors"
            >
              Who Should I Meet?
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
