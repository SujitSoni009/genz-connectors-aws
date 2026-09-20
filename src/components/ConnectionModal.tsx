import React, { useState, useEffect, useRef } from 'react';
import { Profile, Project } from '../types';
import { Sparkles, Send, Edit3, X, ShieldCheck, Check } from 'lucide-react';
import { apiClient } from '../services/apiClient';

interface ConnectionModalProps {
  candidate: Profile | null;
  activeProject?: Project;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (candidateName: string) => void;
}

export const ConnectionModal: React.FC<ConnectionModalProps> = ({
  candidate,
  activeProject,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [sending, setSending] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && candidate) {
      setLoadingDraft(true);
      setIsEditing(false);
      apiClient
        .getIntroductionDraft(candidate.userId, activeProject?.id)
        .then((draft) => {
          setMessage(draft);
          setLoadingDraft(false);
        })
        .catch(() => {
          setMessage(
            `Hi ${candidate.name.split(' ')[0]}, I'm building ${
              activeProject ? activeProject.name : 'a new product'
            }. I noticed your background in ${candidate.skills.slice(0, 2).join(' and ')} and think our skills could complement each other. Would love to connect!`
          );
          setLoadingDraft(false);
        });
    }
  }, [isOpen, candidate, activeProject]);

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus textarea when editing is turned on
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  if (!isOpen || !candidate) return null;

  const candidateFirstName = candidate.name.split(' ')[0];

  const handleSendConnection = async () => {
    setSending(true);
    try {
      await apiClient.sendConnectionRequest(
        candidate.userId,
        message,
        activeProject ? `Project: ${activeProject.name}` : 'General Collaboration'
      );
      setSending(false);
      onSuccess(candidate.name);
      onClose();
    } catch (err) {
      console.error('Failed to send connection request:', err);
      setSending(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="connect-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="w-full max-w-lg rounded-2xl border border-[#262b36] bg-[#14171d] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#20242c] px-6 py-4 bg-[#101318]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 id="connect-modal-title" className="text-sm font-bold text-white">
                You're about to connect with {candidateFirstName}
              </h2>
              <p className="text-[11px] text-zinc-400">
                Review the AI-generated intro before sending. No messages are sent automatically.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="text-zinc-400 hover:text-white p-2 rounded-xl hover:bg-zinc-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* Recipient summary card */}
          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-[#0c0e12] border border-[#20242c]">
            <img
              src={
                candidate.avatarUrl ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
              }
              alt={candidate.name}
              className="h-11 w-11 rounded-xl object-cover ring-1 ring-zinc-700/80 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="truncate min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-white truncate">{candidate.name}</p>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                  {candidate.currentIntent}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 truncate mt-0.5">{candidate.headline}</p>
            </div>
          </div>

          {/* Context note */}
          <div className="flex items-center gap-2 text-xs text-zinc-400 px-1">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>
              Connection context:{' '}
              <strong className="text-zinc-200">
                {activeProject ? activeProject.name : 'Mutual Complementarity'}
              </strong>
            </span>
          </div>

          {/* Message preview / editing */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="connection-message-input"
                className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5"
              >
                <Sparkles className="h-3 w-3 text-amber-400" />
                AI-Generated Introduction
              </label>

              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors py-1 px-2 rounded-lg hover:bg-amber-500/10"
              >
                <Edit3 className="h-3 w-3" />
                {isEditing ? 'Done Editing' : 'Edit message'}
              </button>
            </div>

            {loadingDraft ? (
              <div className="h-28 rounded-xl bg-[#0c0e12] border border-[#20242c] flex items-center justify-center text-xs text-zinc-400">
                <Sparkles className="h-4 w-4 animate-spin text-amber-400 mr-2" />
                Generating context-aware introduction...
              </div>
            ) : isEditing ? (
              <textarea
                id="connection-message-input"
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full rounded-xl bg-[#0c0e12] border border-amber-500/50 p-3 text-xs text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all resize-none leading-relaxed"
              />
            ) : (
              <div className="p-4 rounded-xl bg-[#0c0e12] border border-[#20242c] text-xs text-zinc-200 leading-relaxed italic">
                "{message}"
              </div>
            )}

            <p className="text-[10px] text-zinc-400 px-1">
              You can personalize this note before sending.
            </p>
          </div>
        </div>

        {/* Modal Footer with explicit actions */}
        <div className="flex flex-wrap items-center justify-end gap-2.5 border-t border-[#20242c] px-6 py-4 bg-[#101318]">
          <button
            type="button"
            onClick={onClose}
            disabled={sending}
            className="px-4 py-2 rounded-xl border border-zinc-700 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 min-h-[40px]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 rounded-xl border border-zinc-700 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition-colors min-h-[40px]"
          >
            {isEditing ? 'Preview message' : 'Edit message'}
          </button>

          <button
            type="button"
            onClick={handleSendConnection}
            disabled={sending || loadingDraft}
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-all shadow-sm disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 min-h-[40px]"
          >
            {sending ? (
              <>Sending...</>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                Send connection
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
