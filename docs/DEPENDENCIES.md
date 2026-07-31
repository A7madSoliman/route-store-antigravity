# Dependency Selection

## 1. Purpose and decision boundary

This document records milestone D08. It selects the minimum packages needed by the architecture in `docs/ARCHITECTURE.md`; it does not install packages, change configuration, or create application or test code.

Evidence was reviewed on 2026-07-31 from the installed Next.js 16 documentation, official project documentation, and npm registry metadata. Approved versions are explicit reviewed ranges rather than the unbounded `latest` tag. The lockfile produced by D09 will record the exact installed versions.

## 2. Existing dependency audit

The repository has no `engines` field in `package.json`. The inspected workstation uses Node `24.12.0` and npm `11.19.0`. Installed Next.js `16.2.12` declares Node `>=20.9.0`, but the selected development tools have narrower requirements documented below.

| Existing direct package | Classification | Declared | Lockfile | Current purpose | D08 action |
|---|---|---:|---:|---|---|
| `next` | Runtime | `16.2.12` | `16.2.12` | App Router framework and server runtime | Keep unchanged |
| `react` | Runtime | `19.2.4` | `19.2.4` | Component runtime and Server/Client Component APIs | Keep unchanged |
| `react-dom` | Runtime | `19.2.4` | `19.2.4` | React DOM and form-status APIs | Keep unchanged |
| `@tailwindcss/postcss` | Development | `^4` | `4.3.3` | Tailwind PostCSS integration | Keep unchanged |
| `@types/node` | Development | `^20` | `20.19.43` | Node TypeScript declarations; the installed version satisfies Vite 8's `^20.19.0` peer range | Keep unchanged; deployment/runtime policy remains D10 |
| `@types/react` | Development | `^19` | `19.2.17` | React TypeScript declarations | Keep unchanged |
| `@types/react-dom` | Development | `^19` | `19.2.3` | React DOM TypeScript declarations | Keep unchanged |
| `eslint` | Development | `^9` | `9.39.5` | Static analysis | Keep unchanged |
| `eslint-config-next` | Development | `16.2.12` | `16.2.12` | Next.js and TypeScript ESLint rules | Keep unchanged |
| `tailwindcss` | Development | `^4` | `4.3.3` | Design-token and utility CSS generation | Keep unchanged |
| `typescript` | Development | `^5` | `5.9.3` | Strict static typing | Keep unchanged |

There is no direct runtime validator, form manager, unit/component runner, DOM test environment, interaction test helper, browser test runner, accessibility scanner, HTTP client, state library, icon package, authentication framework, or CSS component framework.

Review note: `npm ls --depth=0` reports five undeclared, extraneous WASM-support directories under the local `node_modules` tree (`@emnapi/core`, `@emnapi/runtime`, `@emnapi/wasi-threads`, `@napi-rs/wasm-runtime`, and `@tybys/wasm-util`). They are absent from `package.json` and `package-lock.json`, are not D08-approved dependencies, and were neither added nor removed by this milestone. D09 must rely on the reviewed manifest/lockfile and report whether its reproducible installation removes these local leftovers.

## 3. Evaluation summary

### 3.1 Runtime response and input validation

| Candidate | Capability and trade-off | Decision |
|---|---|---|
| Zod 4 | Runtime parsing, type inference, structured issues, zero dependencies, and direct examples in the installed Next.js form guide. Its official requirements are TypeScript 5.5+ with strict mode. | **Approved** as the single added runtime dependency |
| Valibot 1 | Runtime parsing and type inference with a smaller tree-shaken bundle. It is compatible with TypeScript 5 and is a responsible alternative. | Rejected for this project because validation stays server-only, so its bundle advantage does not offset a second API/learning choice |
| Manual type guards | No package and full control. | Rejected as the default because 33 third-party contracts would require repetitive traversal, error paths, and separately maintained inferred types |
| TypeScript or Next.js alone | TypeScript types disappear at runtime; Next.js does not provide a native third-party JSON schema validator. | Not suitable for the required `unknown` response boundary |

Sources: installed `node_modules/next/dist/docs/01-app/02-guides/forms.md`, [Zod documentation](https://zod.dev/), [Valibot introduction](https://valibot.dev/guides/introduction/), and reviewed npm metadata for Zod `4.4.3` and Valibot `1.4.2`.

### 3.2 Forms

Use native HTML forms, React 19 `useActionState`, React DOM `useFormStatus`, and Next.js Server Actions. Apply only verified native constraints such as requiredness or `type="email"`, then validate all submitted `FormData` again on the server with Zod.

React Hook Form `7.83.0` declares React 19 compatibility, but it is not approved. The planned sign-in, sign-up, recovery, profile, security, and address forms do not yet demonstrate client-side orchestration that native forms and Server Actions cannot handle. Adding it would enlarge Client Component boundaries and duplicate server-owned state and validation. Reopen `ARCH-005` only if a later form demonstrates a specific unmet requirement.

### 3.3 Unit and component testing

Use Vitest with the React plugin, jsdom, and Testing Library. This follows the installed Next.js Vitest guide. Vitest covers pure modules and synchronous Server/Client Components; async Server Components remain browser/E2E subjects as required by the installed Next.js guidance.

Declare Vite directly because `@vitejs/plugin-react` `6.0.5` requires Vite 8. Declare `@testing-library/dom` directly because it is a peer of React Testing Library and user-event, even though npm could otherwise place it transitively. No convenience-only matcher package is required; Vitest assertions plus semantic Testing Library queries are sufficient initially.

### 3.4 Browser and accessibility testing

Use Playwright for routed flows, authentication behavior, responsive projects, and Chromium/Firefox/WebKit coverage. It is selected over Cypress because the project already has a separate unit/component stack and Playwright supplies the focused multi-browser E2E role with less overlapping component-test infrastructure.

Use `@axe-core/playwright` for repeatable automated WCAG-oriented checks in T02. Automated scans detect only some issues; manual keyboard, focus, screen-reader, contrast, reduced-motion, and touch checks remain required by `docs/UI_SPEC.md`.

Sources: installed Next.js Vitest, Playwright, and Cypress guides; [Vitest guide](https://vitest.dev/guide/), [Testing Library user-event guide](https://testing-library.com/docs/user-event/intro/), [Playwright installation guide](https://playwright.dev/docs/intro), and [Playwright accessibility guide](https://playwright.dev/docs/accessibility-testing).

## 4. Approved runtime dependency

| Package | Approved range | Purpose | First required | Compatibility evidence | Server/client impact | Why existing tools are insufficient | Rejected alternatives |
|---|---:|---|---|---|---|---|---|
| `zod` | `^4.4.3` | Parse unknown API responses, server environment input, and Server Action input; infer validated wire types before adapters run | D10 for environment validation; C01 for API response validation | Zod 4 is stable, supports TypeScript 5.5+ strict mode, has zero dependencies, and matches installed TypeScript `5.9.3`; the installed Next.js form guide demonstrates Zod for server validation | Runtime package, but imports are restricted to `.server.ts` schema/environment/action modules guarded by `server-only`; no client-bundle inclusion is approved | TypeScript and Next.js do not validate untrusted JSON at runtime | Valibot is viable but its client bundle advantage is irrelevant here; manual guards are too repetitive and drift-prone |

Zod is the only newly approved production dependency.

## 5. Approved development dependencies

All packages in this section are test/build-time tools and must not be imported by application runtime modules.

| Package | Approved range | Purpose | First required | Compatibility evidence | Bundle/runtime impact | Why existing tools are insufficient | Rejected alternative |
|---|---:|---|---|---|---|---|---|
| `vitest` | `^4.1.10` | Unit and synchronous component test runner | C00 | Supports Node `^20`, `^22`, or `>=24`; current Node is `24.12.0`; supports Vite 6–8 | Development only; no application bundle impact | No test runner or test script exists | Jest would require a second transformation/configuration path without a project-specific benefit |
| `vite` | `^8.0.0` | Explicit Vite peer for the React test plugin and Vitest configuration | C00 | Requires Node `^20.19.0` or `>=22.12.0`; current Node qualifies; installed `@types/node` `20.19.43` satisfies its peer range | Development only | Relying on peer auto-installation would hide a direct toolchain contract | A transitive-only Vite is less explicit and less reproducible |
| `@vitejs/plugin-react` | `^6.0.5` | React JSX transformation for Vitest | C00 | Requires Vite 8; React Compiler/Babel peers are optional | Development only | The installed Next.js Vitest guide uses the React plugin for React tests | Manual JSX transform configuration adds maintenance without benefit |
| `jsdom` | `^29.1.1` | Browser-like DOM for component tests | C00 | Supports Node `^20.19.0`, `^22.13.0`, or `>=24.0.0`; current Node qualifies | Development only; no real-browser guarantee | Node does not provide the DOM needed by React component tests | happy-dom is not needed; jsdom is the documented Next.js path and offers sufficient fidelity |
| `@testing-library/react` | `^16.3.2` | Render React components and query them through accessible semantics | C00 | Peers support React/React DOM 18 or 19 and the installed React typings | Development only | React DOM alone provides no ergonomic user-focused component test API | Raw DOM/container assertions encourage implementation-coupled tests |
| `@testing-library/dom` | `^10.4.1` | Direct semantic DOM query layer and shared peer | C00 | Satisfies React Testing Library's `^10` peer and user-event's `>=7.21.4` peer | Development only | It is a required peer contract and should not be hidden as a transitive dependency | Transitive-only declaration is less explicit and can drift |
| `@testing-library/user-event` | `^14.6.1` | Realistic pointer, keyboard, focus, and form interaction tests | C00 | Requires a compatible Testing Library DOM peer; `10.4.1` qualifies | Development only | `fireEvent` dispatches isolated events and does not model complete user interactions | Use `fireEvent` only for behavior user-event cannot express |
| `vite-tsconfig-paths` | `^6.1.1` | Resolve the existing `@/*` TypeScript path in Vitest | C00 | Supports Vite through its declared peer; Vite 8 is approved directly | Development only | Vitest/Vite does not automatically apply every TypeScript path mapping | Repeating aliases manually in test configuration would duplicate `tsconfig.json` |
| `@playwright/test` | `^1.62.1` | E2E tests for App Router routes, async Server Components, authentication, responsive behavior, and multi-browser navigation | C00 | Package requires Node `>=20`; official current guidance supports maintained Node 22/24/26 lines; current Node `24.12.0` qualifies; Next declares a compatible Playwright peer | Development only; browser binaries are installed separately | jsdom cannot validate routing, browser layout, Server Components, or end-to-end session behavior | Cypress overlaps the component stack and is not needed for this focused E2E role |
| `@axe-core/playwright` | `^4.12.1` | Automated common accessibility-rule scans within Playwright | T02 | Peers on `playwright-core >=1`; `@playwright/test` supplies the matching Playwright core and the package depends on axe-core `~4.12.1` | Development only | Semantic queries and manual review alone do not provide repeatable automated rule scans | No axe package would reduce automated coverage; automation still does not replace manual QA |

## 6. Decisions to use no additional package

- **Forms:** no React Hook Form or alternative form manager. Use native forms, Server Actions, `useActionState`, `useFormStatus`, verified HTML constraints, and server-side Zod.
- **HTTP:** no Axios or generic client. Native server-side `fetch` satisfies the D07 transport contract.
- **Server state:** no TanStack Query. Server Components load source data and Server Actions refresh it; no client cache requirement is confirmed.
- **Global state:** no Redux, Zustand, or equivalent. No confirmed cross-feature client state requires it.
- **Authentication:** no Auth.js or other authentication framework. The third-party API and unresolved token/session semantics do not match an assumed provider contract.
- **Icons:** no icon package. `docs/UI_SPEC.md` requires local inline SVG React components.
- **CSS/UI:** no component framework or CSS-in-JS library. Tailwind 4 and documented shared components cover the approved design.
- **DOM matchers:** no `@testing-library/jest-dom` initially. Semantic queries and Vitest assertions cover the planned minimum.
- **Coverage:** no Vitest coverage provider until T00 defines a concrete coverage requirement or threshold.
- **Canvas:** no `canvas`; jsdom marks it optional and no approved test needs canvas rendering.
- **Session/deployment:** no sealing, session-store, monitoring, or deployment adapter package until F06, D10, and the deployment decision supply requirements.

Any later addition must identify the unmet need and reopen `ARCH-007` before installation.

## 7. D09 installation commands

These commands are documentation for milestone D09. Do not execute them during D08.

```powershell
npm install "zod@^4.4.3"
npm install --save-dev "vitest@^4.1.10" "vite@^8.0.0" "@vitejs/plugin-react@^6.0.5" "jsdom@^29.1.1" "@testing-library/react@^16.3.2" "@testing-library/dom@^10.4.1" "@testing-library/user-event@^14.6.1" "vite-tsconfig-paths@^6.1.1" "@playwright/test@^1.62.1" "@axe-core/playwright@^4.12.1"
npm exec playwright install
```

In a compatible Linux CI environment, browser installation may instead require:

```powershell
npm exec playwright install --with-deps
```

D09 must run the runtime and development installs as separate reviewed commands, inspect the resulting manifest and lockfile, review peer/audit output, and verify reproducible installation before adding configuration or tests in their owning milestone.

## 8. Compatibility and maintenance risks

- The selected development stack is verified against current Node `24.12.0`, not merely Next.js's lower Node `>=20.9.0` floor. D10 must record the supported project/deployment Node line.
- jsdom `30.0.1` requires Node `^22.22.2`, `^24.15.0`, or `>=26`; it is not compatible with current Node `24.12.0`. The approved `^29.1.1` range stays below major 30 and supports current Node.
- Playwright browser binaries are version-coupled, sizable, and installed separately. D09/CI must cache or install the browsers matching the lockfile package version.
- Vite is declared directly so the React plugin's Vite 8 peer is visible. D09 must reject unexpected peer resolution rather than silently broadening versions.
- Vitest/jsdom do not support meaningful unit coverage of all async Server Components. Those flows belong in Playwright per the installed Next.js guidance.
- axe finds only automatically detectable issues. Manual accessibility testing remains mandatory.
- jsdom's optional canvas peer is intentionally absent; tests must mock or avoid canvas behavior unless a later approved feature proves the need.

## 9. Open questions

These questions do not block D08 because no approved package depends on their answer:

- D10 must select and document the development/deployment Node policy and environment-variable contract.
- F06 and the session architecture must determine whether a sealing or server-side session-store package is necessary.
- T00 must decide whether a numeric coverage threshold justifies a Vitest coverage provider.
- Deployment/CI work must decide how Playwright browser binaries and Linux system dependencies are cached or installed.
- A later canvas-backed feature must reopen the optional canvas decision rather than inheriting jsdom's peer automatically.

## 10. D08 acceptance record

- [x] One runtime package and ten development packages have explicit purposes, classifications, reviewed ranges, compatibility evidence, first-use milestones, bundle effects, and alternatives.
- [x] Native React/Next forms are selected without a form-management package.
- [x] Unit, component, interaction, browser, and automated accessibility responsibilities are covered without duplicating their roles.
- [x] Unnecessary state, HTTP, icon, CSS, authentication, matcher, coverage, canvas, and deployment packages are rejected or deferred.
- [x] Future D09 commands use reviewed versions and contain no `latest` tag.
- [x] No package, manifest, lockfile, configuration, application code, or test file changes during D08.
