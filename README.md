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

1. Install pnpm: `npm install -g pnpm`
2. Install dependencies: `pnpm install`
3. Start PostgreSQL (optional for now): `docker-compose up -d`
4. Run dev server: `pnpm dev`

## Commands

- `pnpm dev` - Start development servers (web + api)
- `pnpm build` - Build both apps
- `pnpm lint` - Lint both apps
- `pnpm typecheck` - TypeScript validation
- `pnpm test` - Run tests

## Ports

- Web: http://localhost:3000
- API: http://localhost:3001

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
