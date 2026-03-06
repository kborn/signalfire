# signalfire
AI-governed, production-grade project template.

## What this repo is
This repository is intentionally structured to support **AI-accelerated implementation** while preserving **human architectural authority**.

Start here:
- `docs/agent-governance/project-context.md`
- `docs/agent-governance/decisions.md`
- `docs/agent-governance/progress.md`
- `docs/agent-governance/ai-usage.md`

## Quick start
1. Copy `.env.example` → `.env` (if needed)
2. Run workspace tasks from the repository root (`npm run dev`, `npm run lint`, `npm run test`)

## AI session start
- IDE chat: prompt `read AGENTS.md`
- ChatGPT Staff Engineer: prompt `read .ai/session/START_AS_STAFF_ENGINEER.md`
- ChatGPT Chief Strategist: prompt `read .ai/session/START_AS_CHIEF_STRATEGIST.md`
- ChatGPT PM: prompt `read .ai/session/START_AS_PM.md`
- Reference guide: `.ai/session/README.md`

## Repository Layout
- `apps/api/` — NestJS backend API service
- `apps/web/` — Next.js frontend application
- `docs/agent-governance/` → AI agent roles, guardrails, and project execution governance
- `docs/architecture/` → architectural design documents and system structure definitions
- `docs/archive/` → historical or superseded documents retained for traceability
- `docs/runbooks/` → operational procedures for development, deployment, and maintenance
- `docs/specs/` → product scope definitions and feature specifications
- `packages/` — shared packages and configuration
