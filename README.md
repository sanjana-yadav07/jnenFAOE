# SAATH (साथ)
### AI-Assisted Wellbeing Monitoring & Trauma-Informed Decision Support for Atrocity Survivors

> **Hackathon Prototype Notice**: SAATH is an assistive decision-support platform engineered for demonstration and evaluation purposes. The Stress Vulnerability Index (SVI) is an operational wellbeing metric and **not** a clinical or psychiatric diagnosis. All clinical, legal, police dispatch, and relocation actions strictly require **human-in-the-loop** review and authorization.

---

## 1. Overview

**SAATH** (*Support After Atrocity, Trauma & Healing*) is an AI-powered, trauma-informed digital support platform designed to assist complainants and victims of atrocities (such as cases under the Scheduled Castes and Scheduled Tribes Prevention of Atrocities Act) throughout the lifecycle of investigation, court trials, compensation disbursement, and social rehabilitation.

Victims in sensitive legal proceedings often suffer from prolonged isolation, witness intimidation, court adjournment fatigue, and psychological distress. SAATH bridges the critical gap between administrative legal systems and continuous, gentle mental health monitoring.

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│  Survivor App   │ ────> │  Backend & AI   │ ────> │ Counsellor Hub  │
│ (Text/Voice/SMS)│       │(SVI/Trends/ML)  │       │(Review/Action)  │
└─────────────────┘       └─────────────────┘       └─────────────────┘
         │                         │                         │
         ▼                         ▼                         ▼
   Voluntary Daily          Non-Diagnostic           Human-in-the-Loop
   Wellness Signals       Longitudinal Signals     Institutional Relief
```

---

## 2. Key Capabilities

### 🕊️ Survivor Journey & Self-Care
- **Zero-Friction Access**: Connect using a canonical case docket identifier without intrusive phone/OTP barriers.
- **Multi-Tier Consent**: Granular, revocable consent controls for general wellbeing monitoring, free-text analysis, voice acoustic analysis, and behavioural indicators.
- **Multimodal Check-ins**: Express emotional state through quick mood ratings, guided multi-dimension sliders (sleep, fear, intrusion, social connection), text journaling, or voluntary audio voice check-ins.
- **Crisis Interruption**: Automatic crisis safety screening (in English, Hindi, and Hinglish) that immediately pauses standard flows to surface 24x7 toll-free national helplines (**Tele-MANAS `14416`**, **KIRAN `1800-599-0019`**, and **National Emergency `112`**).
- **Grounding Tools**: Interactive 4-7-8 breathing pacer, 5-4-3-2-1 sensory grounding, *Just Stay* safe quiet room, and encrypted local *Hope Vault*.

### 🧠 AI / ML & Longitudinal Monitoring
- **Stress Vulnerability Index (SVI)**: A 0–100 continuous operational indicator computed from longitudinal self-reports, sleep quality, fear, avoidance, and engagement continuity.
- **Indicator Tagging**: Detects named emotional signals (`trauma`, `fear`, `depression`, `intimidation_signal`, `social_isolation`) across English, Hindi (Devanagari), and romanized Hinglish with clause-level negation handling.
- **Voice Prosodic & Acoustic Analysis**: Extracts objective speech features (speaking pace in WPM, pause duration metrics, pitch mean/variance, and vocal energy dynamics) from voluntary audio check-ins.
- **Longitudinal Trajectory**: Evaluates multi-observation trends (`worsening`, `improving`, `stable`) relative to the survivor's personal baseline. Requires $\ge 2$ data points; returns `insufficient_evidence` otherwise.
- **Monitoring Scheduler**: `POST /api/v1/monitoring/process-due` processes Day 0/3/7/14 reminder intervals with 24-hour rate limiting/deduplication and stale check-in alerting.
- **Sahayak Assistant**: Grounded conversational guide providing supportive dialog and factual case status lookup without hallucination.

### 🛡️ Institutional Relief & Counsellor Ecosystem
- **Counsellor Workstation**: Dedicated dashboard for assigned counsellors showing real-time triage priority (`CRITICAL`, `HIGH`, `MODERATE`, `LOW`), longitudinal SVI graphs, acoustic indicators, and direct survivor messaging.
- **Witness Protection & Relocation Management**: Formal multi-state workflow (`REQUESTED` $\rightarrow$ `UNDER_REVIEW` $\rightarrow$ `APPROVED` $\rightarrow$ `ASSIGNED` $\rightarrow$ `IN_PROGRESS` $\rightarrow$ `COMPLETED` / `REJECTED`) with officer assignment, safehouse facility tiers, and audit logs.
- **Institutional Recommendations**: Deterministic risk-based mapping for DLSA legal aid, medical care, financial compensation tracking, and police protection.
- **Administrative Governance**: Multi-tier role-based access control (RBAC) with strict server-side geographic scoping for District, State, and National nodal officers.

---

## 3. Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 16 (App Router, Turbopack), React 19, TypeScript 5, Tailwind CSS 4, Recharts, Framer Motion, Lucide React, Zustand |
| **Backend** | Node.js, Express 5, TypeScript 5, Zod schema validation, JWT authentication, Pino logging, Multer, Helmet, Vitest, Supertest |
| **ML Engine (`ml_api_share`)** | Python 3, FastAPI, Uvicorn, Scikit-learn (Joblib gradient boosting models), Librosa / SoundFile, Transformers / Regex NLP |
| **Data & Persistence** | PostgreSQL / Supabase schema migrations, structured in-memory fallback with synthetic demonstration dataset |

---

## 4. Repository Structure

```
SAATH/
├── README.md                          # Project overview and quickstart guide
├── PRODUCT_SPECIFICATION.md           # Comprehensive technical and functional specification
├── saath-frontend/                    # Next.js 16 Web Application
│   ├── app/                           # App router pages (survivor, counsellor, admin, landing)
│   ├── components/                    # Reusable UI components, charts, and modal dialogs
│   ├── services/                      # Typed frontend API clients (case, ai, hope-vault)
│   ├── store/                         # Zustand global state management
│   └── types/                         # Shared TypeScript interfaces
├── saath-backend/                     # Node.js & Express 5 API Server
│   ├── src/
│   │   ├── app.ts                     # Core API routes and business logic
│   │   ├── services/                  # ML client, indicator tagging, recommendations, sahayak
│   │   ├── db/                        # In-memory store and synthetic case database
│   │   ├── middleware/                # JWT auth, rate limiting, and RBAC guards
│   │   └── types/                     # Domain types and interfaces
│   ├── tests/                         # Vitest integration and unit test suite
│   └── supabase/migrations/           # PostgreSQL migration scripts
└── ml_api_share/                      # Standalone Python FastAPI ML service
    └── ml_api_share/                  # FastAPI app, joblib models, and feature extractors
```

---

## 5. Getting Started

### Prerequisites
- **Node.js**: v20.x or higher
- **npm**: v10.x or higher
- **Python**: 3.10+ (optional, if running the standalone ML API)

### 1. Backend Setup
```bash
cd saath-backend
npm install
npm test
npm run dev
```
*The backend starts at `http://localhost:4000` with pre-loaded synthetic case data.*

### 2. Frontend Setup
```bash
cd saath-frontend
npm install
npm run build
npm run dev
```
*The frontend starts at `http://localhost:3000`.*

### 3. ML Prediction Service (Optional)
```bash
cd ml_api_share/ml_api_share
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
export ML_API_KEY="your-ml-api-key"
python -m uvicorn app:app --host 0.0.0.0 --port 8000
```

---

## 6. Environment Configuration

### Backend (`saath-backend/.env.example`)
```ini
NODE_ENV=development
PORT=4000
CORS_ORIGINS=http://localhost:3000
DATA_MODE=memory
JWT_SECRET=replace-with-at-least-32-characters
ALLOW_DEV_STAFF_TOKEN=true
AI_PROVIDER=groq
AI_API_KEY=
GROQ_MODEL=
GEMINI_API_KEY=
GEMINI_MODEL=gemini-3-flash-preview
ML_SERVICE_URL=
ML_API_KEY=
```

### Frontend (`saath-frontend/.env.example`)
```ini
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## 7. Synthetic Demo Personas

For evaluation and testing without real personal data, the repository includes pre-configured synthetic cases:

| Persona / Role | Identifier / Email | Description |
| :--- | :--- | :--- |
| **Survivor (Active Case)** | `NHAA-RJ-2026-004821` | Active investigation stage, DLSA legal aid assigned, multiple check-in history |
| **Survivor (Trial Stage)** | `NHAA-DL-2026-001284` | Trial stage, court hearing scheduled, high threat perception, protection requested |
| **Assigned Counsellor** | `anjali@saath.com` / `saath123` | Assigned to South Delhi cases; full case file and follow-up dashboard |
| **District Admin** | `district.southdelhi@saath.gov.in` | Scoped strictly to South Delhi district statistics and case triage queues |

---

## 8. Hackathon Scope & Prototype Boundaries

| Feature | Current Prototype Status | Production Roadmap |
| :--- | :---: | :--- |
| **Web Check-ins (Text/Mood/Voice)** | ✅ Implemented & Working | End-to-end multi-platform sync |
| **Longitudinal SVI & Recovery Curves** | ✅ Implemented & Tested | Validated psychometric clinical trials |
| **Hindi/Hinglish Indicator Lexicon** | ✅ Implemented & Tested | Expanded regional Dravidian/Bengali NLP |
| **Relocation & Protection State Machine** | ✅ Implemented & Verified | Direct state police CAD API integrations |
| **SMS / IVRS Check-ins** | 🔄 Intentionally Simulated | Production Twilio/Exotel telecom gateways |
| **Database Persistence** | 🔄 In-Memory + Supabase SQL | Fully managed multi-region Postgres with HSM |

---

## 9. Ethics, Privacy & Safety Governance

1. **Non-Diagnostic Nature**: The Stress Vulnerability Index (SVI) is explicitly framed as an operational support metric. It does not replace psychiatric diagnosis or DSM/ICD assessments.
2. **Consent-Led**: Data collection is strictly opt-in. A missed check-in never raises SVI artificially; it reports `insufficient_evidence`.
3. **No Autonomous Decisions**: The system cannot order arrests, dispatch law enforcement, mandate hospitalization, or relocate survivors without human counsellor and judicial officer sign-off.
4. **Data Isolation**: Survivor identity data is separated from administrative reporting views; admin dashboards only display aggregated trends.

---

## 10. License & Acknowledgments

This project was built for the **Smart India Hackathon** to support victims of atrocities through compassionate, trauma-informed technology.
All case files and survivor identifiers in this repository are **100% synthetic** and contain no real personal identifiable information (PII).
