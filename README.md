# Library System

A small library management UI built as a **technical test / take-home assignment**. It lets a user browse the catalog, search for a book by title/author/ISBN, borrow an available book, and return a book they currently have checked out.

> ⚠️ **This is a tech test, not a production app.** It was built quickly to demonstrate approach and code style within a limited scope. See [Notes on scope & next steps](#notes-on-scope--next-steps) below for the shortcuts that were taken on purpose and what a team would likely want to change before shipping this for real.

## Tech stack

- **[React 19](https://react.dev/)** + **[TypeScript](https://www.typescriptlang.org/)**
- **[Vite](https://vite.dev/)** as the build tool / dev server
- **[React Router](https://reactrouter.com/)** for routing
- **[TanStack Query](https://tanstack.com/query)** for data fetching/caching
- **[Tailwind CSS v4](https://tailwindcss.com/)** for styling
- **[Axios](https://axios-http.com/)** wrapped in a small custom fetch helper
- **[goey-toast](https://www.npmjs.com/package/goey-toast)** for toast notifications
- **[@tabler/icons-react](https://tabler.io/icons)** for icons
- **[Oxlint](https://oxc.rs/)** for linting
- **[Bun](https://bun.sh/)** as the package manager (a `bun.lock` is committed; the CI pipeline uses Bun too)

## Getting started

### Prerequisites

- [Bun](https://bun.sh/) installed (or substitute `npm`/`pnpm`/`yarn`, adjusting commands accordingly)

### Install dependencies

```bash
bun install
```

### Configure environment variables

Copy the sample env file and adjust as needed:

```bash
cp .env.sample .env
```

| Variable           | Description                                                                 |
| ------------------ | ----------------------------------------------------------------------------- |
| `VITE_API_URL`      | Base URL of a backend API (not currently wired up — see notes below)        |
| `VITE_ASSETS_DIR`   | Base path/URL for static assets                                              |

### Run the app in development

```bash
bun run dev
```

This starts the Vite dev server (with HMR) at the URL printed in the terminal.

### Build for production

```bash
bun run build
```

Type-checks the project (`tsc -b`) and builds optimized static assets into `dist/`.

### Preview the production build locally

```bash
bun run preview
```

### Lint

```bash
bun run lint
```

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the app with Bun and publishes `dist/` to **GitHub Pages**.

## Project structure

```
src/
├── _mock/            # In-memory fake "database" (books, borrowings, users) used by the mock API
├── assets/           # Static images/icons imported directly by components
├── components/
│   ├── books/        # Feature components: BookCard, SearchBook, MyBorrowings
│   ├── layout/        # App-wide layout pieces (Navbar)
│   └── shared/        # Generic, reusable UI (Icon, LoadingSpinner)
├── lib/               # Low-level helpers (axios wrapper, toast helper)
├── pages/             # Route-level views (BooksPage, NotFoundPage)
├── routes/
│   ├── components/   # Router-related components (e.g. RouterLink)
│   └── hooks/         # Thin wrappers around React Router hooks (useRouter, usePathname, useParams, useSearchParams)
├── services/          # API layer consumed by components/pages (currently backed by the mock data)
├── types/             # Shared TypeScript types/interfaces (Book, Borrowing)
├── utils/             # Small, isolated utility functions
├── App.tsx            # Root component: layout + route definitions
├── global-config.ts   # Reads env vars into a single typed CONFIG object
└── main.tsx           # App entry point
```

The idea behind this layout is a light **feature + layer split**: `pages` are composed of `components/<feature>`, which call into `services`, which (today) read from `_mock`. Generic/cross-cutting code lives in `lib`, `utils`, and `routes`.

## Notes on scope & next steps

This project was intentionally kept small and self-contained for the purpose of the test. A real team taking this further would likely want to revisit:

- **Real backend, not mock data** — `src/services/api.ts` currently simulates network calls against an in-memory array (`src/_mock/db.ts`) instead of calling an actual API, even though `VITE_API_URL`/`axios`/`fetchWrapper` are already wired up and ready for it.
- **Authentication** — `src/utils/current-user.ts` hardcodes a single logged-in user ID with a `TODO` comment; there's no real auth/session flow.
- **Automated tests** — there are no unit/integration/e2e tests yet.
- **Error handling & edge cases** — error states are minimal (e.g. simple inline messages); things like retries, offline handling, and empty/loading states throughout could be more fleshed out.
- **Pagination / larger datasets** — the book list assumes a small, fully-loaded catalog; this won't scale as-is.
- **Design system** — styling is plain Tailwind utility classes with no shared design tokens or component library.
- **State management** — TanStack Query handles server state for now; if the app grows, client-side state (filters, multi-step flows, etc.) may need a dedicated solution.
- **Accessibility & i18n** — not audited yet.

In short: the goal here was to show a clean, working slice of the feature set within the time available, not a finished product. There's a clear and intentional runway to grow this into something more robust depending on where the team wants to take it.
