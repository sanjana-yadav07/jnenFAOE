# SAATH API

All responses use `{ success, data, request_id }`; failures use `{ success:false, error:{code,message}, request_id }`.

`POST /cases/verify` and `POST /cases/connect` accept `{ "reference_id":"NHAA-RJ-2026-004821" }`. Connection creates the survivor session and returns only a safe case summary from `src/db/synthetic-cases.json`. There is no OTP authentication.

Protected survivor APIs: `GET /cases/:id`, `GET /cases/:id/timeline`, `POST/GET /consents`, `POST /check-ins/mood|text|voice`, and `GET /monitoring/baseline|distress|recovery|trends`. Consents are independently versioned and revocable: `wellbeing_monitoring`, `text_analysis`, `voice_analysis`, and `behavioural_signals`. A missing check-in returns `state: "insufficient_evidence"`, never a raised Stress Vulnerability Index (SVI).

### Stress Vulnerability Index (SVI) & Operational Wellbeing Model
- **Stress Vulnerability Index (SVI)**: A 0 to 100 continuous operational indicator derived from longitudinal self-reported check-ins, sleep quality, fear, avoidance, and engagement continuity.
- **Operational Non-Diagnostic Notice**: SVI is strictly an operational wellbeing signal for case support and triage prioritization. SVI is NOT a clinical diagnosis, psychiatric evaluation, or DSM/ICD classification, and does not imply a mental health disorder.
- **Risk Level (Triage Tier)**: Categorized as `LOW`, `MODERATE`, `HIGH`, or `CRITICAL` solely for counsellor workflow queueing and response time prioritization. Risk Level is an operational triage tier, not a diagnostic assessment.
- **Data Model Compatibility**: The internal database and API fields (`distress_score`, `distressScore`, `baselineDistressScore`, `currentDistressScore`) remain preserved for stability, while all client-facing presentation surfaces the unified `Stress Vulnerability Index (SVI)` terminology.

TAARA uses `POST /ai/taara`; supportive recommendations use `POST /ai/recommend`. A crisis signal creates a P1 human-review alert. The service makes no autonomous clinical, legal, police, hospitalization, or relocation decision.

Staff APIs are role-gated: `GET /alerts`, `POST /alerts/:id/acknowledge|assign|resolve`, and `GET /admin/trends`. Admin output is aggregated only and never exposes individual survivor SVI values or identities.
