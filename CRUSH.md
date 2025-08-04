# CRUSH.md

Project: React + TypeScript + Vite (also Lit entry via index-lit.html)

Build/run/lint
- Install: pnpm i
- Dev (React): pnpm dev
- Dev (Lit demo): pnpm dev:lit
- Build (React): pnpm build
- Build (Lit): pnpm build:lit
- Preview build: pnpm preview
- Typecheck only: pnpm -s tsc -b
- Lint all: pnpm lint
- Fix lint (if configured): pnpm -s eslint . --fix
- Tests: none configured; add vitest/jest before using. Single test example (after adding vitest): pnpm vitest run path/to/file.test.ts

Code style
- Language: TS 5.x, ES2020 modules ("type":"module"). Prefer .ts/.tsx; avoid any; enable strict types.
- Imports: relative for intra-src ("./" or "../"), absolute only if tsconfig paths added; keep side-effect imports separate; group std/lib, external, internal; no default-export unless component/module warrants it.
- React: function components, hooks-first, obey eslint-plugin-react-hooks rules; memoize expensive values with useMemo/useCallback when needed; no class components.
- Lit: components under components/* and app-element.ts; use lit-html templating; keep reactive properties typed; avoid DOM queries when reactive bindings suffice.
- Naming: PascalCase for components/types, camelCase for vars/functions, UPPER_SNAKE for const enums/env; files kebab-case or PascalCase for React components.
- Formatting: Prettier not configured—follow ESLint; 2-space indent; single quotes; semicolons; trailing commas where valid.
- State/data: keep global/shared in contexts/hooks (see contexts/GamepadContext.tsx, hooks/); avoid prop drilling; derive state when possible.
- Errors: throw Error with messages; prefer Result-like returns or exceptions over silent fails; guard external inputs; never swallow catch—log and rethrow or handle.
- Async: use async/await; wrap awaits in try/catch; cancel timers/RAF/subscriptions in useEffect cleanup.
- UI: colocate styles (Page.css, component css); avoid inline large styles; prefer CSS modules or scoped styles when using Lit.

Tooling
- ESLint: extends @eslint/js + typescript-eslint; plugins: react-hooks, react-refresh; fix violations before commit.
- Vite: dev server via pnpm dev; env via import.meta.env; avoid exposing secrets.

Notes
- No test runner present. If adding Vitest: pnpm add -D vitest @vitest/ui jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom; add scripts: "test","test:watch"; run single: pnpm vitest path/to/test.ts --watch