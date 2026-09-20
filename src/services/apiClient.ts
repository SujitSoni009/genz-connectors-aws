import { Connection, Event, Profile, Project, Recommendation, User, Message } from '../types';
import {
  CURRENT_USER_ID,
  mockConnections,
  mockEvents,
  mockMessages,
  mockProfiles,
  mockProjects,
  mockUsers,
} from '../data/mockData';
import {
  analyzeProjectGaps,
  generateIntroductionDraft,
  generateRecommendations,
} from './recommendationEngine';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false';

// Client-side in-memory state with localStorage caching for instant reactivity in mock mode
const STORAGE_KEY_PROFILES = 'genz_connectors_profiles';
const STORAGE_KEY_PROJECTS = 'genz_connectors_projects';
const STORAGE_KEY_CONNECTIONS = 'genz_connectors_connections';
const STORAGE_KEY_MESSAGES = 'genz_connectors_messages';
const STORAGE_KEY_CURRENT_USER_ID = 'genz_connectors_current_user_id';

function loadFromStorage<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn(`Failed reading ${key} from storage:`, e);
  }
  return defaultVal;
}

function saveToStorage<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.warn(`Failed saving ${key} to storage:`, e);
  }
}

// In-memory data store initialized from storage or defaults
let profilesData: Profile[] = loadFromStorage(STORAGE_KEY_PROFILES, mockProfiles);
let projectsData: Project[] = loadFromStorage(STORAGE_KEY_PROJECTS, mockProjects);
let connectionsData: Connection[] = loadFromStorage(STORAGE_KEY_CONNECTIONS, mockConnections);
let messagesData: Message[] = loadFromStorage(STORAGE_KEY_MESSAGES, mockMessages);
let currentUserId = loadFromStorage(STORAGE_KEY_CURRENT_USER_ID, CURRENT_USER_ID);

export const apiClient = {
  isMockMode: () => USE_MOCK_API,

  // --- AUTH ---
  getCurrentUserId: () => currentUserId,
  setCurrentUserId: (id: string) => {
    currentUserId = id;
    saveToStorage(STORAGE_KEY_CURRENT_USER_ID, id);
  },

  async login(email: string): Promise<{ token: string; user: User }> {
    if (USE_MOCK_API) {
      const user = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) || mockUsers[0];
      currentUserId = user.id;
      saveToStorage(STORAGE_KEY_CURRENT_USER_ID, user.id);
      return { token: 'mock-jwt-token-aditya', user };
    }
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) throw new Error('Failed to login');
    return res.json();
  },

  async register(name: string, email: string): Promise<{ token: string; user: User }> {
    if (USE_MOCK_API) {
      const newUser: User = {
        id: `usr-${Date.now()}`,
        name,
        email,
        createdAt: new Date().toISOString(),
      };
      mockUsers.push(newUser);
      currentUserId = newUser.id;
      saveToStorage(STORAGE_KEY_CURRENT_USER_ID, newUser.id);

      const newProfile: Profile = {
        id: `prf-${Date.now()}`,
        userId: newUser.id,
        name,
        headline: 'New Builder & Collaborator',
        bio: '',
        skills: [],
        interests: [],
        experience: 'Intermediate',
        canOffer: [],
        lookingFor: [],
        currentIntent: 'Find collaborator',
        availability: 'Available now',
        events: ['evt-001'],
        projects: [],
        privacyPreferences: {
          profileVisibility: 'public',
          skillsVisibility: true,
          projectVisibility: true,
          intentVisibility: true,
          locationSharing: 'During This Event',
          allowDirectIntroductions: true,
        },
      };
      profilesData.push(newProfile);
      saveToStorage(STORAGE_KEY_PROFILES, profilesData);

      return { token: 'mock-jwt-token-new', user: newUser };
    }

    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });
    if (!res.ok) throw new Error('Failed to register');
    return res.json();
  },

  // --- PROFILES ---
  async getMyProfile(): Promise<Profile> {
    if (USE_MOCK_API) {
      const profile = profilesData.find((p) => p.userId === currentUserId) || profilesData[0];
      return { ...profile };
    }
    const res = await fetch(`${API_BASE_URL}/profiles/me`);
    if (!res.ok) throw new Error('Failed to get profile');
    return res.json();
  },

  async getProfileById(userIdOrProfileId: string): Promise<Profile | undefined> {
    if (USE_MOCK_API) {
      const p = profilesData.find((item) => item.userId === userIdOrProfileId || item.id === userIdOrProfileId);
      return p ? { ...p } : undefined;
    }
    const res = await fetch(`${API_BASE_URL}/profiles/${userIdOrProfileId}`);
    if (!res.ok) return undefined;
    return res.json();
  },

  async updateMyProfile(updated: Partial<Profile>): Promise<Profile> {
    if (USE_MOCK_API) {
      const idx = profilesData.findIndex((p) => p.userId === currentUserId);
      if (idx !== -1) {
        profilesData[idx] = { ...profilesData[idx], ...updated };
      } else {
        const p: Profile = {
          id: `prf-${currentUserId}`,
          userId: currentUserId,
          name: updated.name || 'Anonymous Builder',
          headline: updated.headline || '',
          bio: updated.bio || '',
          skills: updated.skills || [],
          interests: updated.interests || [],
          experience: updated.experience || 'Mid',
          canOffer: updated.canOffer || [],
          lookingFor: updated.lookingFor || [],
          currentIntent: updated.currentIntent || 'Find collaborator',
          availability: updated.availability || 'Available now',
          events: updated.events || ['evt-001'],
          projects: updated.projects || [],
          privacyPreferences: updated.privacyPreferences || {
            profileVisibility: 'public',
            skillsVisibility: true,
            projectVisibility: true,
            intentVisibility: true,
            locationSharing: 'During This Event',
            allowDirectIntroductions: true,
          },
          ...updated,
        };
        profilesData.push(p);
      }
      saveToStorage(STORAGE_KEY_PROFILES, profilesData);
      return { ...(profilesData[idx !== -1 ? idx : profilesData.length - 1]) };
    }

    const res = await fetch(`${API_BASE_URL}/profiles/me`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  async getAllProfiles(): Promise<Profile[]> {
    if (USE_MOCK_API) {
      return [...profilesData];
    }
    const res = await fetch(`${API_BASE_URL}/discover`);
    if (!res.ok) throw new Error('Failed to get discover profiles');
    return res.json();
  },

  // --- PROJECTS ---
  async getMyProjects(): Promise<Project[]> {
    if (USE_MOCK_API) {
      return projectsData.filter((p) => p.ownerId === currentUserId);
    }
    const res = await fetch(`${API_BASE_URL}/projects/user/${currentUserId}`);
    if (!res.ok) throw new Error('Failed to get user projects');
    return res.json();
  },

  async getProjectById(id: string): Promise<Project | undefined> {
    if (USE_MOCK_API) {
      const p = projectsData.find((item) => item.id === id);
      return p ? { ...p } : undefined;
    }
    const res = await fetch(`${API_BASE_URL}/projects/${id}`);
    if (!res.ok) return undefined;
    return res.json();
  },

  async createProject(projectInput: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'ownerId'>): Promise<Project> {
    if (USE_MOCK_API) {
      const newProj: Project = {
        ...projectInput,
        id: `prj-${Date.now()}`,
        ownerId: currentUserId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        teamMembers: [currentUserId],
      };
      // Run gap analysis automatically
      newProj.gapAnalysis = analyzeProjectGaps(newProj);
      projectsData.push(newProj);
      saveToStorage(STORAGE_KEY_PROJECTS, projectsData);
      return newProj;
    }
    const res = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectInput),
    });
    if (!res.ok) throw new Error('Failed to create project');
    return res.json();
  },

  async analyzeProject(projectId: string): Promise<Project> {
    if (USE_MOCK_API) {
      const proj = projectsData.find((p) => p.id === projectId);
      if (!proj) throw new Error('Project not found');
      proj.gapAnalysis = analyzeProjectGaps(proj);
      proj.updatedAt = new Date().toISOString();
      saveToStorage(STORAGE_KEY_PROJECTS, projectsData);
      return { ...proj };
    }
    const res = await fetch(`${API_BASE_URL}/projects/${projectId}/analyze`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to analyze project');
    return res.json();
  },

  // --- HERO FEATURE: WHO SHOULD I MEET? & RECOMMENDATIONS ---
  async getWhoShouldIMeet(projectId?: string, eventId?: string): Promise<Recommendation[]> {
    if (USE_MOCK_API) {
      const myProfile = profilesData.find((p) => p.userId === currentUserId) || profilesData[0];
      const activeProj = projectId ? projectsData.find((p) => p.id === projectId) : projectsData.find((p) => p.ownerId === currentUserId);
      return generateRecommendations(myProfile, activeProj, eventId || 'evt-001', profilesData, 4);
    }
    const params = new URLSearchParams();
    if (projectId) params.append('projectId', projectId);
    if (eventId) params.append('eventId', eventId);
    const res = await fetch(`${API_BASE_URL}/recommendations/me?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to get recommendations');
    return res.json();
  },

  // --- CONNECTIONS ---
  async getConnections(): Promise<Connection[]> {
    if (USE_MOCK_API) {
      return connectionsData.filter((c) => c.requesterId === currentUserId || c.recipientId === currentUserId);
    }
    const res = await fetch(`${API_BASE_URL}/connections/me`);
    if (!res.ok) throw new Error('Failed to get connections');
    return res.json();
  },

  async getIntroductionDraft(candidateUserId: string, projectId?: string): Promise<string> {
    if (USE_MOCK_API) {
      const myProfile = profilesData.find((p) => p.userId === currentUserId) || profilesData[0];
      const candidateProfile = profilesData.find((p) => p.userId === candidateUserId);
      if (!candidateProfile) return 'Hi, I would love to connect and discuss potential collaboration!';
      const project = projectId ? projectsData.find((p) => p.id === projectId) : projectsData.find((p) => p.ownerId === currentUserId);
      const ev = mockEvents[0];
      return generateIntroductionDraft(myProfile, candidateProfile, project, ev);
    }
    const res = await fetch(`${API_BASE_URL}/connections/introduction?candidateId=${candidateUserId}`);
    if (!res.ok) throw new Error('Failed to get introduction draft');
    const data = await res.json();
    return data.draft;
  },

  async sendConnectionRequest(recipientId: string, message: string, context?: string): Promise<Connection> {
    if (USE_MOCK_API) {
      const newConn: Connection = {
        id: `conn-${Date.now()}`,
        requesterId: currentUserId,
        recipientId,
        status: 'PENDING',
        message,
        context: context || 'AWS Global Builders Hackathon 2026',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      connectionsData.push(newConn);
      saveToStorage(STORAGE_KEY_CONNECTIONS, connectionsData);

      // Create initial message
      const msg: Message = {
        id: `msg-${Date.now()}`,
        connectionId: newConn.id,
        senderId: currentUserId,
        receiverId: recipientId,
        content: message,
        timestamp: new Date().toISOString(),
      };
      messagesData.push(msg);
      saveToStorage(STORAGE_KEY_MESSAGES, messagesData);

      return newConn;
    }

    const res = await fetch(`${API_BASE_URL}/connections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipientId, message, context }),
    });
    if (!res.ok) throw new Error('Failed to send connection request');
    return res.json();
  },

  async updateConnectionStatus(connectionId: string, status: 'ACCEPTED' | 'REJECTED'): Promise<Connection> {
    if (USE_MOCK_API) {
      const conn = connectionsData.find((c) => c.id === connectionId);
      if (!conn) throw new Error('Connection not found');
      conn.status = status;
      conn.updatedAt = new Date().toISOString();
      saveToStorage(STORAGE_KEY_CONNECTIONS, connectionsData);
      return { ...conn };
    }
    const res = await fetch(`${API_BASE_URL}/connections/${connectionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update connection');
    return res.json();
  },

  // --- MESSAGES ---
  async getMessages(connectionId: string): Promise<Message[]> {
    if (USE_MOCK_API) {
      return messagesData.filter((m) => m.connectionId === connectionId);
    }
    const res = await fetch(`${API_BASE_URL}/messages/${connectionId}`);
    if (!res.ok) throw new Error('Failed to get messages');
    return res.json();
  },

  async sendMessage(connectionId: string, receiverId: string, content: string): Promise<Message> {
    if (USE_MOCK_API) {
      const msg: Message = {
        id: `msg-${Date.now()}`,
        connectionId,
        senderId: currentUserId,
        receiverId,
        content,
        timestamp: new Date().toISOString(),
      };
      messagesData.push(msg);
      saveToStorage(STORAGE_KEY_MESSAGES, messagesData);
      return msg;
    }
    const res = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ connectionId, receiverId, content }),
    });
    if (!res.ok) throw new Error('Failed to send message');
    return res.json();
  },

  // --- EVENTS ---
  async getEvents(): Promise<Event[]> {
    if (USE_MOCK_API) {
      return [...mockEvents];
    }
    const res = await fetch(`${API_BASE_URL}/events`);
    if (!res.ok) throw new Error('Failed to get events');
    return res.json();
  },

  async joinEvent(eventId: string): Promise<void> {
    if (USE_MOCK_API) {
      const myProfile = profilesData.find((p) => p.userId === currentUserId);
      if (myProfile && !myProfile.events.includes(eventId)) {
        myProfile.events.push(eventId);
        saveToStorage(STORAGE_KEY_PROFILES, profilesData);
      }
      return;
    }
    await fetch(`${API_BASE_URL}/events/${eventId}/join`, { method: 'POST' });
  },

  // --- RESET DEMO DATA ---
  resetDemoData: () => {
    localStorage.removeItem(STORAGE_KEY_PROFILES);
    localStorage.removeItem(STORAGE_KEY_PROJECTS);
    localStorage.removeItem(STORAGE_KEY_CONNECTIONS);
    localStorage.removeItem(STORAGE_KEY_MESSAGES);
    localStorage.removeItem(STORAGE_KEY_CURRENT_USER_ID);
    profilesData = [...mockProfiles];
    projectsData = [...mockProjects];
    connectionsData = [...mockConnections];
    messagesData = [...mockMessages];
    currentUserId = CURRENT_USER_ID;
  },
};
