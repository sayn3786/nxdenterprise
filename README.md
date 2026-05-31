# NXD Enterprise — AI-Powered Payment Infrastructure Website

> **Live:** [https://sayn3786.github.io/nxdenterprise/](https://sayn3786.github.io/nxdenterprise/)

The website acts as an autonomous presales, HR, and admin agent — finding clients, answering product questions, estimating effort, drafting proposals, and booking demos — before a human NXD team member needs to step in.

## What It Does

| Agent Capability | How |
|---|---|
| 🤖 AI Solution Advisor | Domain chat bot — SWIFT, ISO 20022, AML, sanctions, competitor comparisons |
| 📊 Requirement Analyser | NLP maps free-text requirements → components, person-weeks, timeline, cost |
| 📄 Proposal Builder | Generates tailored proposal with engagement model, delivery scope, investment |
| 📅 Demo Booking | Interactive calendar + time-slot picker → confirms demo with custom agenda |
| 💼 Engagement Models | Product Licence · Managed Implementation · Resource Augmentation |
| ⚡ Solutions by Challenge | 6 pain-led tabs: ISO 20022, AML/Sanctions, Archival, Workflow, SWIFT CSP, Blockchain |

## Products

| Product | Description |
|---|---|
| Message Interface | MT/MX parsing, field mapping, ISO 20022 routing |
| Archival Vault | Immutable SWIFT/payment message archival (regulatory-grade) |
| Payment Workflow | Visual no-code STP orchestration engine |
| Anti Money Laundering | ML-based AML transaction monitoring + SAR/STR automation |
| Sanction Screening | Sub-50ms OFAC/UN/EU/local real-time screening |
| RBAC | Maker-checker, 4-eyes approval, compliance case management |

## Project Structure

```
nxdenterprise/
├── index.html                  # Single-page app (all features)
├── assets/
│   ├── css/style.css           # All styles (CSS variables, grid, animations)
│   ├── js/app.js               # All interactivity (analyser, proposal, calendar, chat KB)
│   └── images/
│       ├── logo.svg            # NXD Enterprise logo
│       └── favicon.svg         # Browser favicon
├── .github/workflows/
│   └── deploy.yml              # Auto-deploy to GitHub Pages on push to main
├── .nojekyll                   # Bypass Jekyll processing
└── README.md
```

## Enable GitHub Pages

1. **Repo → Settings → Pages**
2. **Source → GitHub Actions**
3. Push to `main` — site is live automatically at `https://sayn3786.github.io/nxdenterprise/`

## Tech Stack

- Pure HTML5 / CSS3 / Vanilla JS — zero build step, zero dependencies
- Inter font (Google Fonts) + Font Awesome 6 icons
- IntersectionObserver scroll animations
- GitHub Pages + GitHub Actions CI/CD

---
**NXD Enterprise** · [ysantosh3786@gmail.com](mailto:ysantosh3786@gmail.com)
