# GenZ Connectors

> **Context-Aware AI for Meaningful Human Connections**  
> Discover who you should meet based on intent, project requirements, skill complementarity, and mutual value.

---

## Overview & Core Philosophy

**GenZ Connectors** is an intelligent networking and connection discovery platform designed for builders, hackathon participants, founders, and students. Unlike conventional networking tools that match people simply by identical keywords or vanity titles, GenZ Connectors focuses on **deep reciprocal complementarity**:

- **What you offer vs. What they offer**
- **What you need vs. What they need**
- **Live project gaps & architecture requirements**
- **Current builder intent** (finding co-founders, teammates, collaborators, or mentors)
- **Shared event context and availability**
- **Privacy-first, event-scoped proximity signals** (never raw coordinates)
- **Human-in-the-loop connection introductions** (AI generates the draft, but the user reviews and edits before sending)

---

## Current Implementation Status

This repository is organized into two primary layers:

### 1. Implemented & Operational in Preview (Frontend & Simulation Engine)
- **Framework**: React 18+ with TypeScript and Vite.
- **Styling**: Tailwind CSS with custom styling, typography, and dark theme.
- **Single Global Navigation Header**: Unified navigation bar across all routes, featuring an active event badge, 1-click persona switcher, and privacy shortcut.
- **"Who Should I Meet?" Workspace (`/who-should-i-meet`)**:
  - Interactive context bar for Project selection, Event context, Intent selection, and Availability filtering.
  - Two-Stage AI Processing Pipeline indicator (Stage 1: Deterministic Filtering → Stage 2: Context & Complementarity Reasoning).
  - Reciprocal Complementarity Cards displaying:
    - Overall match score (percentage)
    - Complementarity breakdown (e.g. *Frontend & UI/UX (You need) ↔ Backend & Architecture (They need)*)
    - "Why you should connect" mutual reasoning explanation
    - Approximate event-scoped distance badge respecting user privacy preferences
    - Direct "Connect" flow with pre-drafted context-aware icebreakers
- **Human-in-the-Loop Connection Modal**:
  - Displays Bedrock-generated icebreaker tailored to both profiles and the active project.
  - Allows the user to inspect, edit, or regenerate the introduction before sending.
  - Records the connection in the reactive local state store.
- **Project Detail & AI Gap Analysis (`/projects/:id`)**:
  - Live analysis of project tech stack and declared needs against current team capabilities.
  - Generates recommended skills to recruit and complementary candidate suggestions.
- **Builder Profiles (`/builders/:id`)**:
  - Detailed builder cards showing what they can offer, what they are looking for, current projects, and shared events.
- **Privacy & System Settings (`/settings`)**:
  - Location sharing scope controls (`OFF`, `During This Event`, `Always`).
  - Privacy toggles for skills, project gaps, and Bedrock introductions.
  - Target architecture verification dashboard and 1-click demo data reset.
- **Local Reactive Data Store (`src/services/apiClient.ts`)**:
  - Full CRUD simulation with localStorage persistence for profiles, projects, connections, and messages.

### 2. AWS Target Architecture & Integration Guide (Production Backend)
The application is pre-architected to seamlessly connect to AWS cloud services when deployed:
- **Amazon Bedrock**:
  - Used for Stage 2 complementarity evaluation, mutual value synthesis, and personalized connection icebreakers.
  - Bedrock model IDs: `anthropic.claude-3-haiku-20240307-v1:0` or `amazon.titan-text-express-v1`.
- **Amazon DynamoDB**:
  - Single-table design for `Profiles`, `Projects`, `Connections`, `Events`, and `Messages`.
  - Partition Key (PK) and Sort Key (SK) pattern with Global Secondary Indexes (GSIs) for event attendance and skill lookup.
- **Amazon Cognito**:
  - User pool authentication, JWT verification, and event registration attributes.
- **AWS API Gateway & AWS Lambda / Spring Boot**:
  - RESTful API gateway routing requests to containerized microservices or serverless functions.

---

## Environment Variables

Configure the following environment variables in `.env` (or via environment injection):

| Variable | Default | Description |
|---|---|---|
| `VITE_USE_MOCK_API` | `true` | When set to `true`, the frontend runs in standalone prototype mode with rich seed data and local persistence. Set to `false` to connect to a live backend. |
| `VITE_API_BASE_URL` | `http://localhost:8080/api` | The base URL of the live backend API gateway. |
| `GEMINI_API_KEY` | *(Managed via Settings)* | Cloud service key for server-side AI features. |
| `APP_URL` | *(Auto-injected)* | Host URL of the deployed web application. |

---

## Running the Application Locally

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

The application runs on `http://localhost:3000`.

---

## Two-Stage Recommendation Architecture

```
User Context & Active Project
             │
             ▼
┌────────────────────────────────────────┐
│ Stage 1: Deterministic Filtering       │
│  - Filter by event attendance          │
│  - Check availability matching         │
│  - Exclude self & existing connections │
│  - Respect privacy preferences         │
└──────────────────┬─────────────────────┘
                   │ Candidate Set
                   ▼
┌────────────────────────────────────────┐
│ Stage 2: Complementarity Reasoning     │
│  - Match Project Needs ↔ Candidate Skills
│  - Match User Offers ↔ Candidate Needs │
│  - Synthesize reciprocal value statement│
│  - Calculate approximate event proximity│
└──────────────────┬─────────────────────┘
                   │
                   ▼
  Ranked Complementary Matches & Icebreakers
```

---

## Verification & Test Scenarios

The included seed dataset supports instant testing across diverse personas:

1. **Aditya Rao (You)**: Backend engineer (Java, Spring Boot, AWS, Kafka) building an *AI Clinical Note Summarizer* and looking for a Frontend & UI/UX engineer.
2. **Maya Lin**: UI/UX Designer & React developer (Next.js, Figma, Tailwind) looking for a Backend / Cloud engineer.
3. **Elena Rostova**: BioTech ML Researcher (Python, PyTorch, FHIR) looking for distributed systems & cloud deployment engineers.
4. **David Kim**: Mobile & Full-stack Engineer (React Native, iOS, Go) building decentralized identity solutions.
5. **Priya Patel**: Cloud Architect & DevOps Specialist (AWS, Kubernetes, Terraform) looking for AI/ML founders.

Switch personas seamlessly using the profile switcher located in the top-right user menu.
