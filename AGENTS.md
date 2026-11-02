# AGENTS.md

This file provides guidance to AI agents (Copilot, Cursor, Claude) when working with code in this repository.

## Keeping This File Up to Date

When making changes that affect project structure, commands, architecture, ports, conventions, or configuration, update the relevant section of this file to reflect the new state. This includes:

- Adding or removing packages/services
- Changing commands or scripts
- Introducing new patterns or conventions
- Modifying ports, environment files, or Docker services
- Updating tooling or linting configuration

## Project Overview

This is a monorepo containing a Dextinity project. It contains three main packages:

- **api/** - NestJS GraphQL backend with MikroORM/PostgreSQL
- **admin/** - React admin interface with Vite and MUI
- **site/** - Next.js frontend (App Router)

## Common Commands

**Important:** Always use the correct Node version before executing any npm command or ./install.sh. Run `nvm use` in the project root to do so.

### Setup

```bash
./install.sh                     # Full installation
```

Use `./install.sh` instead of `npm install` whenever you add, remove, or update dependencies in any `package.json` file.

### Development

```bash
npm run dev                      # Start all services via dev-pm
npx dev-pm status                # Show service status
npx dev-pm logs <service>        # Tail service logs
npx dev-pm restart <service>     # Restart a service
npx dev-pm shutdown              # Stop all services
```

#### Running multiple instances in parallel

To run several checkouts at once without host port collisions, assign a free port offset before starting:

```bash
npm run assign-ports            # find a free +100..+900 offset and write base+offset ports to .env.local
npm run dev
```

`assign-ports.mts` reads every `*_PORT` entry from `.env`, finds an offset where all ports are free, and writes the offset ports to `.env.local` (leaving `.env` untouched). It runs via Node's native TypeScript support (`node assign-ports.mts`), so no build or ts-node is needed.

Each script loads `.env.local` itself: the packages and the `dev:*` scripts run through `dotenv -e .env.local -e .env` (or with `.env.secrets`), and the `docker` script in `dev-pm.config.ts` sources `.env` and `.env.local` before `docker compose up`. Docker needs this because dev-pm doesn't pass the env files to its scripts, and Compose prefers real env vars over its `.env` file, so without it the containers would bind the base ports.

### Building

```bash
npm run build                    # Build all packages
npm --prefix api run build       # Build API (includes api-generator)
npm --prefix admin run build     # Build Admin
npm --prefix site run build      # Build Site
```

### Linting

```bash
npm run lint                     # Lint all packages
npm --prefix api run lint        # Lint API
npm --prefix admin run lint      # Lint Admin
npm --prefix site run lint       # Lint Site (includes stylelint)
```

### Linting and Formatting (Auto-fix)

```bash
npm run lint:fix                     # Auto-fix all packages
npm --prefix api run lint:fix        # Auto-fix API
npm --prefix admin run lint:fix      # Auto-fix Admin
npm --prefix site run lint:fix       # Auto-fix Site (includes stylelint)
```

These commands auto-fix import sorting, remove unused imports, and apply Prettier formatting. The root `lint:fix` also formats config files outside the packages.

### Testing (API only currently)

```bash
npm --prefix api run test                              # Run all tests
npm --prefix api run test -- src/path/to/file.spec.ts  # Run specific test file
npm --prefix api run test -- --testNamePattern="name"  # Run tests matching pattern
npm --prefix api run test:watch                        # Watch mode
```

### Database

```bash
npm --prefix api run db:migrate                   # Run migrations
npm --prefix api run fixtures                     # Load test fixtures
npm --prefix api run repl                         # Interactive REPL
npm --prefix api run mikro-orm migration:create   # Create new migration
```

### Code Generation

```bash
npm --prefix admin run admin-generator   # Execute admin generator. Generates grid and form react components based on .dextinityGen.ts(x) files
npm --prefix api run api-generator       # Execute api generator. Generates resolvers, DTOs, etc. for new entities with the @CrudGenerator decorator
```

## Architecture

### Package Structure

- `admin/src/` - React admin UI (App.tsx entry, documents/, footers/, dashboard/)
- `api/src/` - NestJS modules (auth/, documents/, page-tree/, menus/, content-generation/)
- `api/db/migrations/` - Database migrations
- `site/src/app/` - Next.js app router
- `site/src/middleware.ts` - Domain routing, CSP headers
- `site-configs/site-configs.ts` - Multi-tenant site configuration

### Package Independence

Each package has its own `node_modules` - this is not an npm workspace monorepo. Install dependencies per-package with `npm --prefix <package> install`.

### Path Aliases

All packages use `@src/*` to map to their local `src/` directory (configured in tsconfig.json).

### Multi-tenancy

The `site-configs/` directory manages site configurations, compiled into environment at build time.

### Docker Services

- PostgreSQL (port 5432)
- imgproxy (port 6080) - image optimization
- Jaeger (port 16686) - distributed tracing

### Local Ports

- Admin: 8000
- API: 4000
- Site: 3000

### Code Quality

- ESLint with flat config format
- Prettier: 150 print width, 4 tab width
- Strict TypeScript enabled
- Pre-commit hooks via husky/lint-staged
- AI code review via Greptile on opened, non-draft PRs (configured in `.greptile/config.json`, incl. ignored files and auto-approval rules)

## Configuration

### TypeScript

- API targets ES2017
- Admin uses ESNext with @emotion/react JSX transform
- Site targets ES5 for browser compatibility

### Linting Stack

- ESLint (flat config, .mjs files) using `@dextinity/eslint-config` presets
- Prettier
- stylelint for Site SCSS/CSS
- knip for unused exports detection

### Environment Files

- `.env` - Development defaults
- `.env.local` - Local overrides (not committed)
- `.env.site-configs` - Multi-tenant configuration

## Key Patterns

### Post-Change Workflow

After making code changes, always run `npm --prefix <package> run lint:fix` for each affected package. This auto-fixes import ordering, removes unused imports, and applies Prettier formatting. Run this before committing or presenting changes as complete.

### API Module Structure

Feature-based organization: `auth/`, `documents/`, `dam/`, `menus/`, `footers/`, `redirects/`, `healthcheck/`

### Admin Structure

Component-based with GraphQL mutations/queries co-located

### Site Structure

Next.js App Router conventions with pages in `app/`

## Comments

- Default to writing no comments. Only add a comment when the _why_ is non-obvious (hidden constraint, workaround, surprising invariant).
- Never write comments that restate _what_ the code does — the names should do that.
- Prefer descriptive identifiers over explanatory comments — comments drift out of sync with the code.
- Never reference the current task, ticket, or PR in comments — that context belongs in the PR description and rots in code.

## Pull Request Descriptions

- Fill in the pull request template (`.github/pull_request_template.md`) if the repository has one. Don't add sections beyond it, and delete the sections and instruction comments that don't apply.
- End the description with the task line as plain visible text, not as an HTML comment: `Task: …` (only when there is a task). Only the attribution may follow it.
- Add an attribution for the AI tool you used once, at the very end. For Claude Code, when a session link is available (`https://claude.ai/code/session_…`), use that as the attribution instead of the generic "Generated with Claude Code" line. Before updating an existing description, remove its attribution first so it never appears twice.
- Describe why the change is needed, not what changed. Never restate the diff: no file-by-file list of changes, no summary of the code the reviewer is about to read.
- Don't document how you arrived at the change: which files you read, which documentation you checked, which checks you ran to verify it. Only the outcome belongs in the description.
- Delete the "Example" section when a unit test is the example — the reviewer finds it in the diff, and a bare file path is worthless in the commit message. Fill it in only for an example the diff doesn't lead to, for instance where to find the change in the running Admin or Site, with a sentence on what it shows.
- Default to deleting "Further information". Add it only for something the reviewer needs in order to decide and can't get from the diff: an alternative you rejected, a related pull request, a link to a task or documentation. Adjacent problems you noticed and left out of scope belong in a follow-up task, not in the description.
- Keep the length proportional to the change. A one-line fix gets a paragraph, not a report.
- The description becomes the message of the squashed commit.
- After opening a pull request, always check its description and rewrite it to follow these rules, also when the pull request was created by a tool or UI that generated the description.

## Pull Request Comments

- When watching or driving a pull request, reply on GitHub only to comments and reviews from bots (e.g. Greptile, Claude Code Review, lint bots). Bot accounts end in `[bot]` or are review/CI tools.
- Never reply to comments or reviews from humans on GitHub. Report what you did, your proposals, and your questions to the user in the session instead of on the pull request.
- Only act on a human's feedback when it is a small, concrete change (e.g. a nit, a rename, a missing test). For conceptual feedback (design questions, alternative approaches, questions about why something was done), don't change any code: summarize it for the user and wait for their decision.

## References

This project is derived from the [Dextinity Starter](https://github.com/vivid-planet/dextinity-starter) repo and may have diverged over time. When implementing or refactoring features, consult the starter for current best-practice patterns. The repo follows the same `api/`, `admin/`, `site/` structure, so equivalent files can be found at matching paths.

To browse the starter repo, use the GitHub API:

- List a directory: `https://api.github.com/repos/vivid-planet/dextinity-starter/contents/{path}`
- Fetch a file: `https://raw.githubusercontent.com/vivid-planet/dextinity-starter/main/{path}`

Dextinity documentation is available at https://cms-docs.dextinity.com/docs/ - search for relevant pages with `site:cms-docs.dextinity.com {topic}`.
