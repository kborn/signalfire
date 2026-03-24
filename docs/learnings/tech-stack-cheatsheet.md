# SignalFire Tech Stack Cheat Sheet

## Package Managers

| Term     | What it is                                             | Java equivalent |
| -------- | ------------------------------------------------------ | --------------- |
| **npm**  | Node Package Manager - default Node.js package manager | Maven, Gradle   |
| **pnpm** | Performant npm - faster, disk-efficient, uses symlinks | -               |
| **yarn** | Another Node package manager (not used here)           | -               |

## Runtime & Language

| Term           | What it is                              | Java equivalent       |
| -------------- | --------------------------------------- | --------------------- |
| **Node.js**    | JavaScript runtime for server-side code | JVM                   |
| **Node**       | Short for Node.js                       | JVM                   |
| **TypeScript** | JavaScript with types                   | Java (both are typed) |
| **TS**         | Abbreviation for TypeScript             | -                     |

## Frameworks

| Term        | What it is                                                | Java equivalent          |
| ----------- | --------------------------------------------------------- | ------------------------ |
| **Next.js** | React framework for web apps (frontend + API routes)      | Spring Boot (full-stack) |
| **NestJS**  | Node.js backend framework (like Angular for backend)      | Spring                   |
| **React**   | UI library for building interfaces                        | JSF, Thymeleaf           |
| **Express** | Minimal Node.js web framework (NestJS uses it internally) | Servlet                  |

## Monorepo Tools

| Term                | What it is                                      | Java equivalent      |
| ------------------- | ----------------------------------------------- | -------------------- |
| **Turborepo**       | Build system for monorepos (task orchestration) | Gradle multi-project |
| **Turbopack**       | Next.js bundler (faster webpack alternative)    | -                    |
| **pnpm workspaces** | Native monorepo support in pnpm                 | Gradle multi-project |

## Testing

| Term          | What it is                                               | Java equivalent |
| ------------- | -------------------------------------------------------- | --------------- |
| **Jest**      | JavaScript test runner (used in API)                     | JUnit           |
| **Vitest**    | Fast test runner for Vite/Next.js (not yet added to web) | JUnit           |
| **Supertest** | HTTP testing for Node.js                                 | MockMvc         |

## Build Tools

| Term        | What it is                                         | Java equivalent |
| ----------- | -------------------------------------------------- | --------------- |
| **Vite**    | Fast dev server/bundler (Next.js uses Turbopack)   | -               |
| **Webpack** | Module bundler (Next.js older, now uses Turbopack) | Maven           |

## Linting & Formatting

| Term         | What it is                   | Java equivalent    |
| ------------ | ---------------------------- | ------------------ |
| **ESLint**   | JavaScript/TypeScript linter | Checkstyle         |
| **Prettier** | Code formatter               | google-java-format |
| **Husky**    | Git hook runner              | -                  |

## Database (Coming in Phase 1.5+)

| Term           | What it is          | Java equivalent |
| -------------- | ------------------- | --------------- |
| **PostgreSQL** | Relational database | PostgreSQL      |
| **Prisma**     | ORM (not yet added) | Hibernate       |

## Key Concepts

| Term           | What it is                                                 |
| -------------- | ---------------------------------------------------------- |
| **Monorepo**   | Single repo containing multiple projects (apps + packages) |
| **Workspace**  | pnpm concept for linking packages in a monorepo            |
| **App**        | Runnable application (web, api)                            |
| **Package**    | Shared library/code (in packages/ directory)               |
| **Task**       | Turbo term for a script command (dev, build, test, etc.)   |
| **Cache miss** | First time running a task (or changed) - slower            |
| **Cache hit**  | Re-running unchanged task - faster                         |

## Project Structure

```
signal-fire/                    # Root (monorepo)
├── apps/
│   ├── api/                    # NestJS backend (port 3001)
│   │   └── src/                # Source code
│   └── web/                    # Next.js frontend (port 3000)
│       └── src/app/            # Next.js app router pages
├── packages/                   # Shared code (future)
├── docs/                       # Documentation
├── turbo.json                  # Turborepo config
├── tsconfig.base.json          # Shared TypeScript config
└── .prettierrc                # Shared Prettier config
```

## Common Commands

| Command                   | What it does             |
| ------------------------- | ------------------------ |
| `pnpm install`            | Install all dependencies |
| `pnpm dev`                | Run dev servers (turbo)  |
| `pnpm build`              | Build both apps          |
| `pnpm format:check`       | Check formatting         |
| `pnpm format:write`       | Rewrite files to format  |
| `pnpm lint`               | Lint both apps           |
| `pnpm test`               | Run tests (turbo)        |
| `pnpm typecheck`          | TypeScript validation    |
| `pnpm --filter api <cmd>` | Run command only for api |
| `pnpm --filter web <cmd>` | Run command only for web |
