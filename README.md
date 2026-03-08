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
2. Run workspace tasks from the repository root (`pnpm dev`, `pnpm lint`, `pnpm test`)

## Repository Layout
- `apps/api/` — NestJS backend API service
- `apps/web/` — Next.js frontend application
- `docs/agent-governance/` → AI agent roles, guardrails, and project execution governance
- `docs/architecture/` → architectural design documents and system structure definitions
- `docs/archive/` → historical or superseded documents retained for traceability
- `docs/runbooks/` → operational procedures for development, deployment, and maintenance
- `docs/specs/` → product scope definitions and feature specifications
- `packages/` — shared packages and configuration
