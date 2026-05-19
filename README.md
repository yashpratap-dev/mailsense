# MailSense — AI-Powered Email Triage & Automation Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React.js-18-61DAFB?logo=react)](https://react.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Redis](https://img.shields.io/badge/Redis-Caching-DC382D?logo=redis)](https://redis.io/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/yashpratap-dev/mailsense/pulls)

> An AI-powered email management platform that automatically categorizes, prioritizes, and drafts replies for incoming emails — streamlining triage workflows for individuals and small businesses.

---

## 🚀 Features

- **AI Email Categorization** — Classifies emails into Promotions, Spam, Priority, and custom labels using LLM inference
- **Cold Email Blocker** — Detects and auto-archives/deletes cold outreach emails with configurable AI scoring thresholds
- **Smart Reply Generation** — Context-aware AI reply drafts powered by LLM integration
- **Bulk Unsubscribe** — Scans newsletters and one-click unsubscribes from unwanted senders
- **AI Email Summarization** — Condensed summaries of long email threads
- **Sentiment Analysis** — Flags urgent or negative-tone emails for priority attention
- **Grammar & Tone Check** — AI-assisted email composition with grammar checking
- **Scheduled Email Sending** — Schedule emails for optimal delivery times
- **Redis-based Rate Limiting** — Reliable AI inference pipeline with Redis caching and rate control
- **JWT-Secured APIs** — All REST endpoints protected with JWT authentication
- **Dark Mode** — Full light/dark theme support

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js, Next.js 15, Tailwind CSS, JavaScript |
| **Authentication** | JWT Authentication, OAuth2 (Google), Auth0 |
| **AI / LLM** | LLM Integration, Prompt Engineering, Structured Outputs |
| **Caching & Rate Limiting** | Redis (Upstash) |
| **Email API** | Gmail API (Google OAuth2) |
| **Scheduling** | Node-cron, Scheduled Tasks |
| **Deployment** | Vercel, GitHub Actions (CI/CD) |

---

## 🏗 Architecture Highlights

- **Asynchronous processing pipeline** with Redis-based rate limiting for email ingestion and AI inference
- **Prompt engineering** tuned to produce consistent, structured LLM outputs (classification, scoring, reply generation)
- **REST API design** with JWT authentication and role-based access control
- **Responsive React dashboard** with filtering, search, bulk actions, and real-time updates

---

## ⚙️ Getting Started

### Prerequisites

- Node.js 18+
- Redis instance (Upstash recommended)
- Google Cloud Console project with Gmail API enabled
- Auth0 account

### Installation

```bash
# Clone the repository
git clone https://github.com/yashpratap-dev/mailsense.git
cd mailsense

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your API keys (see Environment Variables section below)

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🔑 Environment Variables

Create a `.env.local` file with the following:

```env
# Auth0
AUTH0_SECRET=
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=

# Google OAuth2 / Gmail API
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# AI / LLM
OPENAI_API_KEY=

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Database
MONGODB_URI=
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/              # REST API routes (JWT-secured)
│   │   ├── ai/           # LLM endpoints (summarize, classify, reply, grammar)
│   │   ├── auth/         # Google OAuth2 + Gmail integration
│   │   ├── messages/     # Email actions (send, delete, mark read)
│   │   ├── Rules/        # AI rules engine (cold email, categories, labels)
│   │   └── Schedule/     # Scheduled email sending
│   ├── components/       # Shared UI components (Navbar, etc.)
│   ├── dashboard/        # Main inbox dashboard
│   ├── settings/         # User settings & feature toggles
│   └── rules/            # Rules configuration UI
├── components/           # Landing page components
└── lib/                  # Shared utilities (auth, email fetching)
```

---

## 🤝 Contributing

Pull requests are welcome! Please open an issue first to discuss major changes.

---

## 📄 License

[MIT](LICENSE) © 2025 Yash Pratap Singh
