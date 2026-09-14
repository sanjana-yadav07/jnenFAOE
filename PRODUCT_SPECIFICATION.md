# SAATH — Product & Technical Specification

**Document Version:** 1.0.0  
**Project:** SAATH (साथ) — Dynamic Mental Health Monitoring & Trauma-Informed Support System  
**Status:** Hackathon Submission Specification (Verified against Codebase)  

---

## 1. Product Overview & Vision

**SAATH** is an assistive, trauma-informed digital platform designed to provide continuous mental health monitoring, distress trajectory forecasting, and institutional support routing for complainants and victims of atrocities (specifically under statutes such as the SC/ST Prevention of Atrocities Act).

### Core Principles
1. **Consent First**: All monitoring, voice recording, and text analysis is voluntary, opt-in, and revocable.
2. **Operational, Non-Diagnostic Decision Support**: The Stress Vulnerability Index (SVI) is an operational triage signal, **never** a psychiatric diagnosis.
3. **Human-in-the-Loop**: High-impact institutional escalations (police protection, emergency relief, safehouse relocation, hospitalization) strictly require human counsellor review and authorization.
4. **Data Isolation & Anti-Surveillance**: Survivor self-expression spaces (such as the Hope Vault and Just Stay) do not trigger automatic law enforcement intervention.

---

## 2. Problem Statement

Survivors in sensitive criminal justice processes undergo acute and chronic stressors across multiple legal stages:
- **Investigation & FIR Stage**: Immediate physical danger, fear of retaliation, initial shock, and institutional confusion.
- **Trial & Court Hearing Stage**: Intimidation by accused parties, courtroom re-traumatization, travel stress, and adjournment fatigue.
- **Compensation & Relief Stage**: Bureaucratic documentation delays, financial desperation, and partial disbursals.
- **Rehabilitation Stage**: Prolonged social boycott, community displacement, and persistent trauma.

Traditional government grievance portals are static, administrative, and transaction-based. They do not monitor psychological deterioration or provide continuous trauma-informed care between court dates.

---

## 3. User Roles & Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                       NATIONAL ADMIN                        │
│                 (All-India Aggregate Trends)                │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                        STATE ADMIN                          │
│            (State-Level Anonymized Resource Metrics)        │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                       DISTRICT ADMIN                        │
│           (District Operational Triage & Nodal Queue)       │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                     ASSIGNED COUNSELLOR                     │
│         (Individual Case File, SVI Trends & Follow-ups)     │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│                          SURVIVOR                           │
│        (Docket Connect, Check-ins, Grounding, Safe Circle)  │
└─────────────────────────────────────────────────────────────┘
```

1. **Survivor / Complainant**: Connects via case docket identifier; access to check-ins, grounding tools, rights guide, Hope Vault, and assigned counsellor contact.
2. **Counsellor**: Manages assigned survivor caseload; reviews SVI trajectories, alerts, acoustic indicators; updates protection and relocation states; schedules follow-ups.
3. **District Admin**: District nodal officer monitoring aggregate distress distributions, pending protection requests, and counsellor caseload allocations.
4. **State Admin**: State-level oversight of compensation disbursal rates, inter-district relocation coordination, and welfare trends.
5. **National Admin**: National oversight across all states, aggregate reporting, and systemic policy insights.

---

## 4. Implemented User Journeys

### 4.1 Survivor Journey
1. **Landing & Case Connection**: Survivor lands on homepage $\rightarrow$ enters docket number (`NHAA-RJ-2026-004821` or `NHAA-DL-2026-001284`) $\rightarrow$ authenticated without requiring phone/OTP.
2. **Consent Review**: Configures 4 independent consent toggles (`wellbeing_monitoring`, `text_analysis`, `voice_analysis`, `behavioural_signals`).
3. **Daily Check-In**:
   - *Quick Check-In*: 1-to-5 mood selection.
   - *Dimensional Check-In*: 4 structured sliders (Sleep difficulty, Fear/safety, Intrusive thoughts, Social connection).
   - *Journaling / Voice Note*: Submits text or audio clip.
4. **Safety & Grounding**:
   - Accesses *Just Stay* sensory room or 4-7-8 breathing exercises.
   - Manages personal *Hope Vault* (affirmations, memories, photos stored encrypted locally).
   - Contacts emergency contacts through *Safe Circle*.
5. **Crisis Path**: If text/voice contains crisis keywords $\rightarrow$ instant crisis takeover overlay with one-tap connection to **Tele-MANAS (`14416`)**, **KIRAN (`1800-599-0019`)**, or **Emergency (`112`)**.

### 4.2 Counsellor Workflow
1. **Login & Triage Queue**: Logs in $\rightarrow$ views active alerts sorted by priority (`P1` Crisis $\rightarrow$ `P2` High Escalation $\rightarrow$ `P3` Stale Check-in).
2. **Case Detail Inspection**:
   - Views Stress Vulnerability Index (SVI) trajectory graph vs. personal baseline.
   - Listens to / reviews voluntary voice check-in transcripts and prosodic feature metrics.
   - Views sensitive legal milestones in the confidential *Full Case File*.
3. **Care & Security Action**:
   - Recommends grounding/stabilization exercises.
   - Coordinates Witness Protection or Relocation status transitions.
   - Schedules structured survivor follow-ups.
   - Sends direct supportive messages.

---

## 5. Functional Requirements Matrix

| ID | Requirement | Implemented Endpoint / UI | Status |
| :--- | :--- | :--- | :---: |
| **FR-01** | Zero-friction case docket connection | `POST /api/v1/cases/connect` | ✅ Verified |
| **FR-02** | Multi-tier granular consent management | `POST /api/v1/consents`, `GET /api/v1/consents` | ✅ Verified |
| **FR-03** | Multimodal check-in capture (mood, text, audio) | `POST /api/v1/check-ins/mood`, `/text`, `/voice` | ✅ Verified |
| **FR-04** | Clause-level emotional indicator tagging | `src/services/indicator-tags.ts` | ✅ Verified |
| **FR-05** | Crisis & self-harm safety screening | `immediateDangerPattern`, `CrisisInterrupt.tsx` | ✅ Verified |
| **FR-06** | Objective voice acoustic feature extraction | `POST /api/v1/check-ins/voice` | ✅ Verified |
| **FR-07** | Non-diagnostic SVI & recovery calculation | `src/services/ml.ts`, `computeMonitoringTrends()` | ✅ Verified |
| **FR-08** | Longitudinal trajectory & baseline comparison | `GET /api/v1/monitoring/trends`, `/distress` | ✅ Verified |
| **FR-09** | Automated due monitoring & reminder ladder | `POST /api/v1/monitoring/process-due` | ✅ Verified |
| **FR-10** | Stale check-in detection & counsellor alert | `src/services/checkin-freshness.ts` | ✅ Verified |
| **FR-11** | Deterministic institutional support recommendations | `src/services/recommendations.ts` | ✅ Verified |
| **FR-12** | Witness protection state machine & audit | `POST /api/v1/cases/:id/protection-status` | ✅ Verified |
| **FR-13** | Safehouse relocation state machine & audit | `POST /api/v1/cases/:id/relocation-status` | ✅ Verified |
| **FR-14** | Comprehensive chronological case timeline | `GET /api/v1/cases/:id/timeline` | ✅ Verified |
| **FR-15** | Direct survivor-counsellor messaging | `counsellorMessages` in store & UI | ✅ Verified |
| **FR-16** | Follow-up scheduling with survivor confirmation | `POST /api/v1/counsellor/follow-ups` | ✅ Verified |
| **FR-17** | Geographic RBAC scoping (District/State/National) | `src/services/admin-scope.ts` | ✅ Verified |
| **FR-18** | Aggregated administrative reports & analytics | `GET /api/v1/admin/reports`, `/trends` | ✅ Verified |

---

## 6. AI & ML Pipeline Specification

### 6.1 Multi-Signal Distress Engine (SVI)
The Stress Vulnerability Index ($SVI \in [0, 100]$) combines multiple operational dimensions:
$$SVI = w_{\text{self}} \cdot D_{\text{self}} + w_{\text{text}} \cdot D_{\text{text}} + w_{\text{voice}} \cdot D_{\text{voice}} + w_{\text{legal}} \cdot D_{\text{legal}}$$
- **Self-Reported Dimensions ($D_{\text{self}}$)**: Sleep disturbance, fear intensity, intrusive memory frequency, social withdrawal (1–5 Likert scaled to 0–100).
- **Text & Emotional Indicators ($D_{\text{text}}$)**: Lexicon-weighted intensity across tagged categories (`trauma`, `fear`, `depression`, `intimidation_signal`, `social_isolation`).
- **Voice Acoustic Signals ($D_{\text{voice}}$)**: Speaking rate deviations, elongated silent pause ratios, pitch instability, and vocal energy suppression.
- **Procedural Stressors ($D_{\text{legal}}$)**: Proximity to court hearing dates, pending compensation, repeated adjournments.

### 6.2 Emotional Indicator Lexicon & Negation
Supports English, Devanagari Hindi, and Romanized Hinglish:
- **Fear**: *"bahut dar lag raha hai"*, *"mujhe khatra lag raha"*, *"feeling terrified"*
- **Trauma**: *"woh haadsa baar baar yaad aata hai"*, *"flashbacks"*, *"nightmares"*
- **Depression**: *"kuch theek nahi hoga"*, *"umeed khatam"*, *"hopeless"*
- **Intimidation**: *"marne ki dhamki di"*, *"accused ke log ghar ke bahar"*, *"threatened"*
- **Social Isolation**: *"sabne akele chhod diya"*, *"kisi se baat nahi karni"*
- **Negation Guard**: Applies regex lookbehinds and clause boundaries (`nahi`, `not`, `mat`, `never`) so expressions like *"mujhe dar nahi lag raha"* are not falsely tagged.

### 6.3 Voice & Acoustic Analysis
- **Speaking Pace (WPM)**: Estimated from voiced audio segment durations.
- **Pause Metrics**: Ratio of silence duration vs. active voiced frames.
- **Pitch Statistics**: Fundamental frequency ($F_0$) mean and variance.
- **Energy Dynamics**: RMS energy variance across conversational frames.
- *Notice*: Voice analysis is non-diagnostic and serves only as a supplementary review signal for counsellors.

### 6.4 Longitudinal Trajectories & Baseline Guard
- **Minimum Data Requirement**: Requires $\ge 2$ observations to calculate a trend (`worsening`, `improving`, `stable`). If only 1 observation is present, the system returns `insufficient_evidence: true`.
- **Personal Baseline**: Derived from the average of the initial 2–4 check-in observations.

---

## 7. Protection & Relocation State Machine

```
              ┌───────────────┐
              │   REQUESTED   │
              └───────┬───────┘
                      │
              ┌───────▼───────┐
              │ UNDER_REVIEW  │
              └───────┬───────┘
                      │
        ┌─────────────┴─────────────┐
        ▼                           ▼
┌───────────────┐           ┌───────────────┐
│   APPROVED    │           │   REJECTED    │
└───────┬───────┘           └───────────────┘
        │
┌───────▼───────┐
│   ASSIGNED    │ (Security Officer / Safehouse Tier Assigned)
└───────┬───────┘
        │
┌───────▼───────┐
│  IN_PROGRESS  │ (Patrol Active / Transit Underway)
└───────┬───────┘
        │
┌───────▼───────┐
│   COMPLETED   │
└───────────────┘
```

- **Endpoints**:
  - `POST /api/v1/cases/:id/protection-request`
  - `POST /api/v1/cases/:id/protection-status`
  - `GET /api/v1/cases/:id/protection-requests`
  - `POST /api/v1/cases/:id/relocation-request`
  - `POST /api/v1/cases/:id/relocation-status`
  - `GET /api/v1/cases/:id/relocation-requests`
- **Metadata**: Officer ID (e.g., `INSP-DELHI-402`), Facility Type (`Safehouse`, `Govt Shelter`, `Hostel`), Security Tier (`High`, `Moderate`, `Standard`), notes, and immutable audit logs.

---

## 8. Monitoring Scheduler & Cadence Ladder

- **Endpoint**: `POST /api/v1/monitoring/process-due`
- **Follow-up Cadence**:
  - **Day 0**: Welcome & initial baseline orientation check-in.
  - **Day 3**: Post-incident / early case check-in.
  - **Day 7**: Weekly stabilization review.
  - **Day 14**: Bi-weekly ongoing support follow-up.
- **Deduplication Key**: Rate-limited via `notifications:reminders:${victimToken}` to ensure reminders are never duplicated within 24 hours.
- **Stale Check-in Alerting**: If a survivor with `riskLevel >= MODERATE` has not logged a check-in for $> 7$ days, an automated counsellor alert is generated.

---

## 9. Institutional Recommendation Layer

Maps operational risk level and case stage deterministically to institutional support categories:

| Support Category | Trigger Criteria | Action Pathway |
| :--- | :--- | :--- |
| **Counselling** | SVI $\ge 45$ or `MODERATE`+ Risk | Assign specialized trauma counsellor |
| **Legal Aid** | Trial stage or FIR registered | Direct referral to DLSA / Legal Services |
| **Medical Assistance** | Injury reported or sleep $< 2/5$ | Primary Health Centre referral |
| **Police Protection** | Intimidation signal or `HIGH` Risk | Witness Protection Scheme escalation |
| **Safe Relocation** | Threat to residence or `CRITICAL` | Nodal officer safehouse transfer |
| **Emergency Relief** | Crisis trigger or imminent threat | One-tap Tele-MANAS (`14416`) & `112` |

---

## 10. Database Schema & Architecture

The database architecture is implemented via Supabase/PostgreSQL migrations (`supabase/migrations/`) with complete in-memory fallback support (`DATA_MODE=memory`):

1. `cases`: Core docket, incident category, stage, FIR details, hearing dates, protection/relocation statuses.
2. `survivor_sessions`: Anonymous session tokens and consent records.
3. `consents`: Granular consent history and revocation timestamps.
4. `check_ins`: Mood, dimensional scores, text, audio references, and computed SVI results.
5. `monitoring_profiles`: Baselines, longitudinal moving averages, cadence milestones.
6. `alerts`: Triage priority (`P1`–`P4`), resolution status (`NEW`, `ACKNOWLEDGED`, `RESOLVED`), and resolution notes.
7. `protection_requests` / `relocation_requests`: Full state machine transition logs and officer assignments.
8. `case_timeline_events`: Unified chronological audit trail.

---

## 11. End-to-End Demo & Verification Flow

For hackathon judges and evaluators, the complete working flow can be demonstrated as follows:

1. **Survivor Docket Connect**:
   - Open `/connect-case` $\rightarrow$ Enter docket `NHAA-RJ-2026-004821` $\rightarrow$ Access Survivor Dashboard.
2. **Submit Multimodal Check-in**:
   - Go to `/survivor/check-in` $\rightarrow$ Select dimensional ratings $\rightarrow$ Submit text journaling.
   - SVI and emotional indicator tags (`fear`, `trauma`) are extracted.
3. **Grounding & Hope Vault**:
   - Visit `/survivor/just-stay` and `/survivor/hope-vault` $\rightarrow$ Add an encrypted personal entry.
4. **Crisis Interruption Demo**:
   - Enter crisis keyword in check-in $\rightarrow$ Instant crisis interrupt modal appears with Tele-MANAS `14416`.
5. **Counsellor Review**:
   - Go to `/staff-login` $\rightarrow$ Sign in as `anjali@saath.com` / `saath123`.
   - Open case `NHAA-RJ-2026-004821` $\rightarrow$ View SVI & Recovery trajectory graph.
   - View *Voice Check-ins & Acoustic Review* card.
6. **Witness Protection & Relocation Actions**:
   - Click *Update Protection* $\rightarrow$ Select `IN_PROGRESS` $\rightarrow$ Assign `INSP-DELHI-402` $\rightarrow$ Save.
   - Changes immediately reflect in case file and the *Comprehensive Case Lifecycle Timeline*.
7. **Administrative Scoping**:
   - Sign in as `district.southdelhi@saath.gov.in` $\rightarrow$ Verify server-side geographic scoping strictly limits view to South Delhi.

---

## 12. Honest Prototype Limitations & Non-Goals

### Current Prototype Scope
- **SMS & IVRS**: Telecom provider integrations are currently implemented as simulated provider mocks for hackathon evaluation.
- **Clinical Scope**: SVI is an operational wellbeing metric and **not** a validated diagnostic tool.
- **No Autonomous Authority**: The platform cannot order arrests, dispatch emergency responders automatically, or mandate relocation without human sign-off.
