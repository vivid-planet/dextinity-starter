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
- Mailpit (SMTP port 1025, web interface port 8025) - catches all mails sent in development

### Local Ports

- Admin: 8000
- API: 4000
- Site: 3000

### Code Quality

- ESLint with flat config format
- Prettier: 150 print width, 4 tab width
- Strict TypeScript enabled
- Pre-commit hooks via husky/lint-staged

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

### BFF Routes

Server-side logic that doesn't belong into the CMS API is implemented as Next.js route handlers in `site/src/app/[visibility]/[domain]/`. See `api/contact-form/route.ts` for an example: it validates the submitted values with zod and sends them as a mail with nodemailer, directly from the site instead of the API. In development, mails are caught by Mailpit.

### API Module Structure

Feature-based organization: `auth/`, `documents/`, `dam/`, `menus/`, `footers/`, `redirects/`, `healthcheck/`

### Admin Structure

Component-based with GraphQL mutations/queries co-located

### Site Structure

Next.js App Router conventions with pages in `app/`

## References

This project is derived from the [Dextinity Starter](https://github.com/vivid-planet/dextinity-starter) repo and may have diverged over time. When implementing or refactoring features, consult the starter for current best-practice patterns. The repo follows the same `api/`, `admin/`, `site/` structure, so equivalent files can be found at matching paths.

To browse the starter repo, use the GitHub API:

- List a directory: `https://api.github.com/repos/vivid-planet/dextinity-starter/contents/{path}`
- Fetch a file: `https://raw.githubusercontent.com/vivid-planet/dextinity-starter/main/{path}`

Dextinity documentation is available at https://cms-docs.dextinity.com/docs/ - search for relevant pages with `site:cms-docs.dextinity.com {topic}`.
