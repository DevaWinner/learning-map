# Project 1 (Finance): **SIMShield — Mobile Money Account-Takeover & Agent-Fraud Defense**

### Why this matters in Africa (real problem)

Mobile money fraud is rising, and **SIM-swap + impersonation/social engineering** are major drivers of account takeovers and wallet theft across Africa. INTERPOL’s Africa Cyberthreat Assessment flags **mobile money fraud (including SIM swap and telecom impersonation)** as widespread. ([Interpol][1])
Nigeria’s NCC has formal **SIM replacement guidelines** (process/verification requirements), but fraud still happens — making detection/response on the fintech side essential. ([ncc.gov.ng][2])
Research also highlights mobile money **social engineering attacks** and agent-related abuse patterns. ([SSRN][3])

### What makes this “not made everywhere”

Most fraud tools are built for card-heavy markets. This product is purpose-built for **African realities**:

- **Mobile money + agent networks + USSD** behaviors
- **SIM-swap / device-swap signals** as first-class features (telco-style risk)
- **Cross-entity fraud graphs** (agents ↔ wallets ↔ devices ↔ locations ↔ merchants)

### Product: what it does (B2B SaaS + API)

**Customers:** fintechs, MMOs, digital banks, aggregators, agent-network operators.

**Core modules**

1. **Account Takeover (ATO) Shield**

- Detect SIM-swap/device-swap risk, fast OTP hijack patterns, login anomalies
- “Step-up” actions: hold, extra verification, call-back, selfie-liveness, in-app secure confirmation

2. **Agent & Merchant Fraud Radar**

- Flags bogus agents, float manipulation patterns, reversal abuse, “cash-out mule funnels”
- Agent reputation scores + blacklisting workflows (useful because bogus agents are a known issue in practice) ([SSRN][3])

3. **Fraud Graph Engine (the moat)**

- Graph modeling catches coordinated fraud rings (mule networks) better than isolated rules
- Graph-based fraud detection is a serious modern approach in financial crime. ([spj.science.org][4])

4. **Case Management + Evidence Pack**

- Investigator console, timeline view, linked-entity graph, decision audit trail
- “Regulator-ready” exports (who/what/why actions were taken)

### Data you can start with (no partner needed initially)

- Public fraud datasets for pipeline + modeling patterns (then adapt to mobile money event schemas)
- Generate **synthetic mobile money event streams** (USSD, agent cash-in/out, SIM swap events, device changes, OTP requests) to simulate African flows
- Later (for real deployment): integrate partner events + limited labels + active learning

### Model approach (practical + strong)

- **Stage 1:** rules + heuristics (fast wins)
- **Stage 2:** gradient boosted trees / calibrated classifiers for transaction and login risk
- **Stage 3 (signature):** **graph model** / graph features for ring detection ([spj.science.org][4])
- Continuous learning + drift monitoring (fraud evolves fast)

### “Product-ready” architecture (what you’ll ship)

- **Event ingestion:** Kafka/Redpanda → feature pipeline
- **Feature store:** Postgres + Redis (hot features), or a proper feature store later
- **Model services:** FastAPI + Docker + versioned models
- **Console:** multi-tenant admin dashboard + RBAC + audit logs
- **Monitoring:** latency, false positives, drift, alerting
- Optional: align with emerging telecom APIs for SIM/device swap patterns (GSMA has been pushing standardized approaches to scam/fraud signals). ([GSMA][5])

### MVP → v1 roadmap (what “done” means)

- **MVP (8–10 weeks):** scoring API + dashboard + basic case management + rules + supervised model
- **v1 (10–16 weeks):** graph engine + agent risk + step-up decisioning + monitoring + exportable reports
- **Pilot-ready:** integrate with 1 fintech/MMO sandbox and show measurable reduction in loss/ATO

---

# Project 2 (Health + Computer Vision): **CerviCare — AI-Assisted Cervical Screening + Follow-up Tracker**

### Why this matters in Africa (real problem)

Cervical cancer outcomes in LMICs are heavily affected by **late detection** and gaps in screening/follow-up. WHO notes screening is essential and emphasizes high-performance testing, while acknowledging feasibility and access constraints. ([World Health Organization][6])
In many low-resource settings, **VIA (visual inspection with acetic acid)** is still used because HPV DNA testing may be harder to scale everywhere; quality varies and training is difficult to sustain. ([MDPI][7])
There’s also active global momentum toward **AI-assisted cervical screening**, including IARC’s **Cervical Cancer Image Bank** built explicitly to support AI algorithms, and IARC reporting AI tools that can outperform standard approaches in image-based screening contexts. ([IARC Screening][8])

### What makes this “not made everywhere”

Instead of “just a classifier,” you build the full **screen-to-treatment** product:

- **Quality control** (bad lighting/blur/angle detection) + guided capture
- **Triage + referral** workflow that fits African primary care realities
- **Follow-up tracking** (the biggest silent failure point): appointments, treatment completion, re-screen reminders
- Works with **smartphone cervicography** + optional remote consultation (tele-mentor)

### Product: what it does (clinic app + program dashboard)

**Users:** nurses/community health workers, supervising clinicians, program managers (NGOs / ministries).

**Core modules**

1. **Guided Cervix Capture (Mobile App)**

- On-screen guidance + auto-checks for focus/lighting/framing before accepting an image
- Offline-first capture for low-connectivity clinics

2. **AI Triage (Decision Support, not “final diagnosis”)**

- Outputs: **Negative / Suspect / Needs Review / Unusable**
- Confidence + “why” heatmap for clinician trust
- The model supports VIA-style screening contexts where performance variability is an issue ([MDPI][7])

3. **Tele-Review Queue**

- Flagged cases sent to remote specialists (compressed images, low bandwidth)
- Structured second-opinion workflow + audit trail

4. **Follow-up & Treatment Tracker**

- Patient pathway: screen → triage → referral → treatment → re-screen
- SMS/WhatsApp reminders, missed-visit flags, cohort reports

5. **Program Analytics**

- Screening coverage, positivity rate, follow-up completion, turnaround time
- Heatmaps by region/facility (helps public health decisions)

### Data you can realistically use

- Start with public/curated cervical image resources designed to support AI evaluation.
  - **IARC Cervical Cancer Image Bank** exists specifically for AI algorithm development/evaluation. ([IARC Screening][8])

- Augment with open cytology datasets for auxiliary training (Pap smear images are easier to find publicly), while keeping your main product centered on **real-world cervix images**. ([Kaggle][9])
- For product readiness, you’ll eventually need a **local data partnership** (even small) to validate performance on African device types, lighting, and clinic workflows.

### Model approach (strong + practical)

- **Stage A:** image quality model (reject garbage input)
- **Stage B:** lesion localization / attention (weakly supervised or segmentation-lite)
- **Stage C:** triage classifier (calibrated) + uncertainty estimation
- **Safety layer:** thresholds that prefer “Needs Review” over risky false negatives

### Product-ready governance (this is critical in health)

Follow WHO guidance on **ethics and governance of AI for health** and deploy as decision support with clear intended-use statements, privacy controls, and monitoring. ([World Health Organization][10])

### MVP → v1 roadmap (what “done” means)

- **MVP (8–10 weeks):** capture app + quality checks + basic triage + patient registry + simple dashboard
- **v1 (10–16 weeks):** tele-review workflow + follow-up automation + analytics + model monitoring + multilingual UI
- **Pilot-ready:** deploy to 1–3 clinics and prove improved follow-up completion + reduced time-to-review

---

## If you want to pick the “strongest two” right now

If your goal is employability + real-world value:

- **Finance:** SIMShield (fraud/ATO/agent) — employers love “risk + production + graphs”.
- **Health:** CerviCare (screen-to-follow-up) — shows CV + workflow + ethical deployment discipline.


[1]: https://www.interpol.int/content/download/23094/file/INTERPOL_Africa_Cyberthreat_Assessment_Report_2025.pdf?utm_source=chatgpt.com "INTERPOL AFRICA CYBERTHREAT ASSESSMENT ..."
[2]: https://www.ncc.gov.ng/media/144/view?utm_source=chatgpt.com "GUIDELINES ON SIM REPLACEMENT"
[3]: https://papers.ssrn.com/sol3/Delivery.cfm/5257020.pdf?abstractid=5257020&mirid=1&utm_source=chatgpt.com "Mobile Money Social Engineering Attacks in African ..."
[4]: https://spj.science.org/doi/10.34133/icomputing.0146?utm_source=chatgpt.com "Graph Learning-Empowered Financial Fraud Detection"
[5]: https://www.gsma.com/newsroom/?p=21746&utm_source=chatgpt.com "Mobile and Banking Industries Join Forces to Fight Fraud"
[6]: https://www.who.int/news-room/fact-sheets/detail/cervical-cancer?utm_source=chatgpt.com "Cervical cancer"
[7]: https://www.mdpi.com/1660-4601/21/7/878?utm_source=chatgpt.com "An Implementation Evaluation of the Smartphone ..."
[8]: https://screening.iarc.fr/cervicalimagebank.php?utm_source=chatgpt.com "IARC Cervical Cancer Image Bank"
[9]: https://www.kaggle.com/datasets/prahladmehandiratta/cervical-cancer-largest-dataset-sipakmed?utm_source=chatgpt.com "Cervical Cancer largest dataset (SipakMed)"
[10]: https://www.who.int/publications/i/item/9789240029200?utm_source=chatgpt.com "Ethics and governance of artificial intelligence for health"
