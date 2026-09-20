import React, { useState, useEffect } from 'react';
import {
  Users,
  Check,
  X,
  MessageSquare,
  Sparkles,
  Send,
  Calendar,
  Clock,
  ArrowRight,
  Shield,
  Lightbulb,
  CheckCircle2,
} from 'lucide-react';
import { apiClient } from '../services/apiClient';
import { Connection, Message, Profile } from '../types';
import { mockProfiles, mockEvents } from '../data/mockData';

export const ConnectionsPage: React.FC = () => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [myUserId, setMyUserId] = useState('');
  const [filterTab, setFilterTab] = useState<'ALL' | 'PENDING' | 'CONNECTED'>('ALL');

  useEffect(() => {
    async function load() {
      const myId = apiClient.getCurrentUserId();
      setMyUserId(myId);
      const [conns, allProfs] = await Promise.all([
        apiClient.getConnections(),
        apiClient.getAllProfiles(),
      ]);
      setConnections(conns);
      setProfiles(allProfs);
      if (conns.length > 0) {
        setSelectedConnection(conns[0]);
        loadMessages(conns[0].id);
      }
    }
    load();
  }, []);

  const loadMessages = async (connId: string) => {
    const msgs = await apiClient.getMessages(connId);
    setMessages(msgs);
  };

  const handleSelectConnection = (conn: Connection) => {
    setSelectedConnection(conn);
    loadMessages(conn.id);
  };

  const handleUpdateStatus = async (connId: string, status: 'ACCEPTED' | 'REJECTED') => {
    const updated = await apiClient.updateConnectionStatus(connId, status);
    setConnections((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    if (selectedConnection?.id === connId) {
      setSelectedConnection(updated);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedConnection) return;

    const otherId =
      selectedConnection.requesterId === myUserId
        ? selectedConnection.recipientId
        : selectedConnection.requesterId;

    const newMsg = await apiClient.sendMessage(selectedConnection.id, otherId, messageInput.trim());
    setMessages([...messages, newMsg]);
    setMessageInput('');
  };

  const handleApplyFollowUpSuggestion = (text: string) => {
    setMessageInput(text);
  };

  const pendingConnections = connections.filter((c) => c.status === 'PENDING');
  const acceptedConnections = connections.filter((c) => c.status === 'ACCEPTED');

  const visibleConnections =
    filterTab === 'PENDING'
      ? pendingConnections
      : filterTab === 'CONNECTED'
      ? acceptedConnections
      : connections;

  const otherProfile = selectedConnection
    ? profiles.find(
        (p) =>
          p.userId ===
          (selectedConnection.requesterId === myUserId
            ? selectedConnection.recipientId
            : selectedConnection.requesterId)
      ) || mockProfiles[1]
    : null;

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="border-b border-[#1f232b] pb-5">
        <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold mb-1">
          NETWORK & THREADS
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Users className="h-7 w-7 text-amber-400" />
          Connections & Collaboration
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
          Manage mutual connection requests, ongoing project threads, and AI-suggested collaboration
          starters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[620px]">
        {/* LEFT COLUMN: CONNECTION LIST WITH CLEAR TABS */}
        <div className="rounded-2xl border border-[#1f232b] bg-[#14171d] p-4 sm:p-5 space-y-4 overflow-hidden flex flex-col shadow-sm">
          {/* Section Filter Tabs */}
          <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-[#0c0e12] border border-[#1f232b]">
            <button
              type="button"
              onClick={() => setFilterTab('ALL')}
              className={`py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filterTab === 'ALL'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              All ({connections.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('PENDING')}
              className={`py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filterTab === 'PENDING'
                  ? 'bg-amber-500/20 text-amber-300 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Pending ({pendingConnections.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('CONNECTED')}
              className={`py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filterTab === 'CONNECTED'
                  ? 'bg-emerald-500/20 text-emerald-300 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Connected ({acceptedConnections.length})
            </button>
          </div>

          {/* Connection cards list */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
            {visibleConnections.length === 0 ? (
              <div className="text-center py-12 text-xs text-zinc-500">
                No {filterTab.toLowerCase()} connections found.
              </div>
            ) : (
              visibleConnections.map((conn) => {
                const otherId = conn.requesterId === myUserId ? conn.recipientId : conn.requesterId;
                const other = profiles.find((p) => p.userId === otherId) || mockProfiles[1];
                const isSelected = selectedConnection?.id === conn.id;

                return (
                  <button
                    key={conn.id}
                    type="button"
                    onClick={() => handleSelectConnection(conn)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 min-h-[44px] ${
                      isSelected
                        ? 'border-amber-500/50 bg-[#0c0e12] shadow-sm'
                        : 'border-zinc-800/80 bg-[#101318] hover:border-zinc-700'
                    }`}
                  >
                    <img
                      src={
                        other.avatarUrl ||
                        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
                      }
                      alt={other.name}
                      className="h-10 w-10 rounded-xl object-cover ring-1 ring-zinc-700/80 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="truncate flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-bold text-white truncate">{other.name}</p>
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full shrink-0 ${
                            conn.status === 'ACCEPTED'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {conn.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 truncate mt-0.5">{other.headline}</p>

                      {/* Connection Context snippet */}
                      <p className="text-[10px] text-zinc-400 truncate mt-1 flex items-center gap-1">
                        <span className="text-zinc-500">Through:</span>
                        <span className="text-zinc-300 font-medium truncate">
                          {conn.context || 'AWS Global Builders Hackathon'}
                        </span>
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT 2 COLUMNS: ACTIVE THREAD & FOLLOW-UP ASSISTANT */}
        <div className="lg:col-span-2 rounded-2xl border border-[#1f232b] bg-[#14171d] flex flex-col justify-between overflow-hidden shadow-sm">
          {selectedConnection && otherProfile ? (
            <>
              {/* Chat Header with Connection Context */}
              <div className="p-4 sm:p-5 border-b border-[#1f232b] bg-[#101318] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={otherProfile.avatarUrl}
                    alt={otherProfile.name}
                    className="h-11 w-11 rounded-xl object-cover ring-1 ring-zinc-700/80 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <h2 className="font-bold text-white text-sm sm:text-base truncate">
                      {otherProfile.name}
                    </h2>
                    <p className="text-xs text-zinc-400 truncate">{otherProfile.headline}</p>

                    {/* Prominent Context Reinforcement */}
                    <div className="mt-1 flex items-center gap-1 text-[11px] text-zinc-400">
                      <span className="text-zinc-500 font-mono uppercase text-[9px]">
                        Connected through:
                      </span>
                      <span className="font-medium text-amber-300">
                        {selectedConnection.context || 'AI Healthcare Clinical Assistant'}
                      </span>
                      <span>·</span>
                      <span className="text-zinc-300">AWS Global Builders Hackathon</span>
                    </div>
                  </div>
                </div>

                {/* Status action buttons if pending */}
                {selectedConnection.status === 'PENDING' &&
                selectedConnection.recipientId === myUserId ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(selectedConnection.id, 'ACCEPTED')}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold transition-colors shadow-sm min-h-[38px]"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Accept
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(selectedConnection.id, 'REJECTED')}
                      className="p-2 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white transition-colors min-h-[38px]"
                      aria-label="Decline request"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {selectedConnection.status}
                  </span>
                )}
              </div>

              {/* Chat Messages Body */}
              <div className="p-5 flex-1 overflow-y-auto space-y-4 max-h-[360px]">
                {/* Introduction Context Card */}
                <div className="p-3.5 rounded-xl bg-[#0c0e12] border border-[#1f232b] text-xs text-zinc-300 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[10px] uppercase font-semibold">
                    <Sparkles className="h-3 w-3" />
                    Initial AI-Assisted Introduction
                  </div>
                  <p className="italic text-zinc-200 leading-relaxed">
                    "{selectedConnection.message}"
                  </p>
                  <p className="text-[10px] text-zinc-400 pt-1">
                    Sent with mutual consent via GenZ Connectors context matchmaking.
                  </p>
                </div>

                {messages.map((m) => {
                  const isMe = m.senderId === myUserId;
                  return (
                    <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-md rounded-2xl p-3.5 text-xs ${
                          isMe
                            ? 'bg-amber-500 text-zinc-950 font-medium rounded-br-none shadow-sm'
                            : 'bg-[#0c0e12] border border-zinc-800 text-zinc-200 rounded-bl-none'
                        }`}
                      >
                        <p className="leading-relaxed">{m.content}</p>
                        <span
                          className={`text-[9px] block mt-1 ${
                            isMe ? 'text-zinc-900 font-mono' : 'text-zinc-400 font-mono'
                          }`}
                        >
                          {new Date(m.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* AI Follow-Up Suggestion Strip */}
              <div className="p-3.5 bg-[#0e1116] border-t border-[#1f232b] space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                  <Lightbulb className="h-3.5 w-3.5" />
                  Contextual Follow-Up Starters:
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {[
                    `Are you free for 10 mins near the main hall to discuss our project needs?`,
                    `Would love to explore integrating your skills with our architecture.`,
                    `Let's sync up right after the keynote session!`,
                  ].map((sug, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleApplyFollowUpSuggestion(sug)}
                      className="text-left text-[11px] p-2 rounded-lg bg-[#14171d] hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/40 text-zinc-300 transition-colors"
                    >
                      "{sug}"
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Input Box */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-[#1f232b] bg-[#101318] flex gap-2.5"
              >
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder={`Send a message to ${otherProfile.name.split(' ')[0]}...`}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#0c0e12] border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 min-h-[42px]"
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 disabled:opacity-40 transition-colors shadow-sm min-h-[42px]"
                >
                  <Send className="h-3.5 w-3.5" />
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-zinc-500 p-8 text-center">
              Select a connection on the left to review messages and conversation starters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
