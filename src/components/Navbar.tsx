import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Users,
  FolderGit2,
  Compass,
  Shield,
  MapPin,
  ChevronDown,
  Check,
  RefreshCw,
  UserCheck,
  Menu,
  X,
  User,
  ArrowRight,
} from 'lucide-react';
import { apiClient } from '../services/apiClient';
import { mockProfiles, mockEvents } from '../data/mockData';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUserId = apiClient.getCurrentUserId();
  const currentProfile = mockProfiles.find((p) => p.userId === currentUserId) || mockProfiles[0];

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const activeEvent = mockEvents[0];

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: Sparkles },
    { label: 'Who Should I Meet?', path: '/who-should-i-meet', icon: Users, highlight: true },
    { label: 'Discover', path: '/discover', icon: Compass },
    { label: 'Projects', path: '/projects', icon: FolderGit2 },
    { label: 'Connections', path: '/connections', icon: UserCheck },
  ];

  // Close menus on outside click or escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setShowUserMenu(false);
        setMobileNavOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileNavOpen(false);
    setShowUserMenu(false);
  }, [location.pathname]);

  const handleSwitchUser = (userId: string) => {
    apiClient.setCurrentUserId(userId);
    setShowUserMenu(false);
    setMobileNavOpen(false);
    navigate(0); // Reload data for switched persona
  };

  const handleResetDemo = () => {
    apiClient.resetDemoData();
    setShowUserMenu(false);
    setMobileNavOpen(false);
    navigate('/dashboard');
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#20242c] bg-[#0c0e12]/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-lg py-1"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-white tracking-tight text-base sm:text-lg">
                GenZ Connectors
              </span>
              <span className="hidden sm:inline-block text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                AI Context
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Primary Navigation (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-150 flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                  isActive
                    ? 'bg-zinc-800/90 text-white shadow-sm border border-zinc-700/80 font-semibold'
                    : item.highlight
                    ? 'text-amber-400 hover:text-amber-300 hover:bg-amber-500/10'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${item.highlight && !isActive ? 'text-amber-400' : ''}`} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-amber-400 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Event Context & Profile Switcher */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Subtle Event Context Indicator */}
          <div
            title={`Active Event: ${activeEvent.name}`}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#15181e] border border-[#232730] text-[11px] text-zinc-300"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-400 hidden xl:inline">Event:</span>
            <span className="font-medium text-zinc-200 truncate max-w-[160px] xl:max-w-[200px]">
              {activeEvent.name}
            </span>
          </div>

          {/* Profile / Persona Switcher Trigger */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              id="persona-menu-button"
              aria-haspopup="dialog"
              aria-expanded={showUserMenu}
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 sm:px-2 sm:py-1 rounded-xl hover:bg-[#15181e] border border-transparent hover:border-[#232730] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <img
                src={currentProfile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={currentProfile.name}
                className="h-8 w-8 rounded-full object-cover ring-1 ring-zinc-700 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="hidden sm:block text-left leading-tight">
                <p className="text-xs font-semibold text-zinc-200 truncate max-w-[110px]">
                  {currentProfile.name.split(' ')[0]}
                </p>
                <p className="text-[10px] text-zinc-400 font-mono truncate max-w-[110px]">
                  {currentProfile.skills[0] || 'Builder'}
                </p>
              </div>
              <ChevronDown
                className={`h-3.5 w-3.5 text-zinc-400 transition-transform duration-200 ${
                  showUserMenu ? 'rotate-180 text-amber-400' : ''
                }`}
              />
            </button>

            {/* Desktop Persona Dropdown */}
            {showUserMenu && (
              <div className="hidden md:block absolute right-0 mt-2 w-80 rounded-2xl bg-[#15181e] border border-[#282d38] shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                {/* Header: Current Persona */}
                <div className="px-3 py-2.5 rounded-xl bg-[#0c0e12] border border-[#20242c]">
                  <p className="text-[10px] uppercase font-mono tracking-wider text-amber-400 font-semibold">
                    Current Persona
                  </p>
                  <p className="text-sm font-bold text-white mt-0.5">{currentProfile.name}</p>
                  <p className="text-xs text-zinc-300 font-mono mt-0.5">
                    {currentProfile.skills.slice(0, 2).join(' / ')}
                  </p>
                  <p className="text-[11px] text-zinc-400 truncate mt-0.5">{currentProfile.headline}</p>
                </div>

                {/* Quick actions */}
                <div className="py-2 space-y-0.5 border-b border-[#232730]">
                  <Link
                    to="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-colors"
                  >
                    <span>View & Edit Profile</span>
                    <ArrowRight className="h-3 w-3 text-zinc-500" />
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <Shield className="h-3.5 w-3.5 text-emerald-400" />
                      Privacy & Proximity
                    </span>
                    <ArrowRight className="h-3 w-3 text-zinc-500" />
                  </Link>
                </div>

                {/* Switch Persona section */}
                <div className="pt-2">
                  <div className="px-2 pb-1.5 flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-semibold">
                      Switch Test Persona
                    </span>
                    <span className="text-[10px] text-zinc-500">1-click switch</span>
                  </div>

                  <div className="max-h-56 overflow-y-auto space-y-1 pr-1">
                    {mockProfiles.map((p) => {
                      const isSelected = p.userId === currentUserId;
                      return (
                        <button
                          key={p.userId}
                          type="button"
                          onClick={() => handleSwitchUser(p.userId)}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left text-xs transition-colors min-h-[38px] ${
                            isSelected
                              ? 'bg-amber-500/10 border border-amber-500/30 text-amber-300'
                              : 'hover:bg-zinc-800/60 border border-transparent text-zinc-300'
                          }`}
                        >
                          <div className="truncate pr-2">
                            <p className="font-semibold text-white truncate text-xs">{p.name}</p>
                            <p className="text-[10px] text-zinc-400 truncate font-mono">
                              {p.skills.slice(0, 3).join(' · ')}
                            </p>
                          </div>
                          {isSelected && <Check className="h-3.5 w-3.5 text-amber-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Reset Demo State button */}
                <div className="pt-2 mt-2 border-t border-[#232730]">
                  <button
                    type="button"
                    onClick={handleResetDemo}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Reset Demo State
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            aria-label={mobileNavOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="lg:hidden p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE NAVIGATION DRAWER & PERSONA MODAL */}
      {mobileNavOpen && (
        <div className="lg:hidden border-b border-[#20242c] bg-[#111318] px-4 pt-3 pb-5 space-y-4 animate-in slide-in-from-top-2 duration-150">
          {/* Mobile Event Pill */}
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#0c0e12] border border-[#232730] text-xs text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-zinc-400 text-[11px]">Event:</span>
            <span className="font-medium text-white truncate">{activeEvent.name}</span>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-colors min-h-[44px] ${
                    isActive
                      ? 'bg-zinc-800 text-white font-semibold'
                      : item.highlight
                      ? 'text-amber-400 bg-amber-500/5 hover:bg-amber-500/10'
                      : 'text-zinc-300 hover:bg-zinc-800/60'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className={`h-4 w-4 ${item.highlight && !isActive ? 'text-amber-400' : ''}`} />
                    {item.label}
                  </span>
                  {isActive && <Check className="h-4 w-4 text-amber-400" />}
                </Link>
              );
            })}
          </nav>

          {/* Current Persona & Quick Switcher in Mobile Sheet */}
          <div className="pt-3 border-t border-zinc-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400 font-semibold">
                Current Persona: {currentProfile.name}
              </span>
              <Link to="/profile" className="text-xs text-zinc-400 hover:text-white">
                View Profile
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {mockProfiles.map((p) => (
                <button
                  key={p.userId}
                  type="button"
                  onClick={() => handleSwitchUser(p.userId)}
                  className={`p-2.5 rounded-xl text-left text-xs border transition-colors min-h-[44px] ${
                    p.userId === currentUserId
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-semibold'
                      : 'bg-[#0c0e12] border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <p className="truncate text-white text-xs">{p.name}</p>
                  <p className="truncate text-[10px] text-zinc-400">{p.skills[0]}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM SHEET FOR PERSONA (When clicking profile on mobile) */}
      {showUserMenu && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full bg-[#15181e] border-t border-[#262b36] rounded-t-3xl p-5 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <p className="text-[10px] uppercase font-mono tracking-wider text-amber-400 font-semibold">
                  Current Persona
                </p>
                <h3 className="text-base font-bold text-white mt-0.5">{currentProfile.name}</h3>
                <p className="text-xs text-zinc-400">{currentProfile.headline}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowUserMenu(false)}
                className="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-1.5">
              <Link
                to="/profile"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center justify-between p-3 rounded-xl bg-[#0c0e12] border border-zinc-800 text-xs text-zinc-200 font-medium min-h-[44px]"
              >
                <span>View & Edit My Profile</span>
                <ArrowRight className="h-4 w-4 text-zinc-400" />
              </Link>
              <Link
                to="/settings"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center justify-between p-3 rounded-xl bg-[#0c0e12] border border-zinc-800 text-xs text-zinc-200 font-medium min-h-[44px]"
              >
                <span className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-400" />
                  Privacy Preferences & Location Proximity
                </span>
                <ArrowRight className="h-4 w-4 text-zinc-400" />
              </Link>
            </div>

            <div className="pt-2">
              <p className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-semibold mb-2">
                Switch Persona
              </p>
              <div className="space-y-2">
                {mockProfiles.map((p) => {
                  const isSelected = p.userId === currentUserId;
                  return (
                    <button
                      key={p.userId}
                      type="button"
                      onClick={() => handleSwitchUser(p.userId)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors min-h-[44px] ${
                        isSelected
                          ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300'
                          : 'bg-[#0c0e12] border border-zinc-800 text-zinc-300'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-semibold text-white">{p.name}</p>
                        <p className="text-[11px] text-zinc-400">{p.skills.slice(0, 3).join(' · ')}</p>
                      </div>
                      {isSelected && <Check className="h-4 w-4 text-amber-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetDemo}
              className="w-full py-3 rounded-xl bg-zinc-800 text-xs text-zinc-300 hover:text-white font-medium flex items-center justify-center gap-2"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reset Demo State
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
