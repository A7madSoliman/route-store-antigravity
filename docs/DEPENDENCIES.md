# Dependency Selection

## 1. Purpose and decision boundary

This document records milestone D08. It selects the minimum packages needed by the architecture in `docs/ARCHITECTURE.md`; it does not install packages, change configuration, or create application or test code.

Evidence was reviewed on 2026-07-31 from the installed Next.js 16 documentation, official project documentation, and npm registry metadata. Approved versions are explicit reviewed ranges or exact versions rather than the unbounded `latest` tag. The D09 lockfile records the exact installed versions.

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

Review note: D08 found five undeclared, extraneous WASM-support directories in the local `node_modules` tree. D09's reconciliation install removed the extraneous top-level state; the 2026-07-31 `npm ls --depth=0` result is clean and contains only declared direct packages.

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
| `vite` | `8.0.16` | Explicit Vite peer for the React test plugin and Vitest configuration | C00 | First Vite 8 release patched for all five advisories observed in D09; requires Node `^20.19.0` or `>=22.12.0`; current Node qualifies; Vitest accepts Vite 6–8 and `@vitejs/plugin-react` accepts Vite 8 | Development only | Relying on peer auto-installation would hide a direct toolchain contract | A transitive-only Vite is less explicit and less reproducible |
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
npm install --save-dev "vitest@^4.1.10" "@vitejs/plugin-react@^6.0.5" "jsdom@^29.1.1" "@testing-library/react@^16.3.2" "@testing-library/dom@^10.4.1" "@testing-library/user-event@^14.6.1" "vite-tsconfig-paths@^6.1.1" "@playwright/test@^1.62.1" "@axe-core/playwright@^4.12.1"
npm install --save-dev --save-exact "vite@8.0.16"
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

### 8.1 D09 security review

The 2026-07-31 remediation pinned direct development dependency Vite from `8.0.0` to `8.0.16`, which is inside D08's original Vite 8 range and is the first Vite 8 release patched for all five advisories observed during D09. The reconciliation install, clean top-level dependency tree, lint, and production build passed. Vite is not a source of the remaining findings.

The current `npm audit --json` metadata reports 12 high-severity vulnerable-package records. The production-only JSON audit reports three records: the direct Next package as an aggregate record and the two vulnerable packages it introduces. The 12 records collapse to five distinct underlying advisories: three for PostCSS, one for Sharp, and one for `brace-expansion`. In this run, npm's human-readable audit output listed only the three production records, so the JSON metadata is the source for the full-tree count and development records below.

#### Production findings

| Audit node | Installed version and path | Advisory evidence and safe floor | Runtime role and current reachability | Minimum safe remediation |
|---|---|---|---|---|
| `next` | Direct runtime dependency `next@16.2.12` | The audit node is an aggregate of the PostCSS and Sharp findings below; it has no separate advisory in this audit. npm's suggested `next@9.3.3` downgrade is incompatible with this Next 16 App Router and React 19 project. | Next is the application framework and server runtime. It cannot be removed without replacing the approved architecture. | A compatible stable Next release that resolves both transitive findings. |
| `postcss` | `next@16.2.12 → postcss@8.4.31`; Next pins this exact version | [GHSA-qx2v-qp2m-jg93](https://github.com/advisories/GHSA-qx2v-qp2m-jg93) is patched in `8.5.10`; [GHSA-6g55-p6wh-862q](https://github.com/advisories/GHSA-6g55-p6wh-862q) in `8.5.12`; [GHSA-r28c-9q8g-f849](https://github.com/advisories/GHSA-r28c-9q8g-f849) in `8.5.18`. The common safe floor is `8.5.18`. | Next uses PostCSS while processing application CSS during development/build. Current inputs are repository and dependency CSS; no request path accepting user-supplied CSS is present. The finding still affects the production dependency tree and build/CI trust boundary. | A stable Next release declaring PostCSS `>=8.5.18`; do not override Next's published dependency contract. |
| `sharp` | `next@16.2.12 → sharp@0.34.5`; installed optional runtime dependency | [GHSA-f88m-g3jw-g9cj](https://github.com/advisories/GHSA-f88m-g3jw-g9cj) affects versions below `0.35.0`; the patch floor is `0.35.0`. | Next uses Sharp for self-hosted image optimization. The current page passes only local SVGs to `next/image`, and `next.config.ts` has no remote image allowlist, so an untrusted decoder input is not currently evidenced. API raster media planned by `UI_SPEC.md` makes this relevant before catalog implementation. | A stable Next release declaring Sharp `>=0.35.0`; do not remove the image optimizer required by the intended media architecture. |

React `19.2.4`, React DOM `19.2.4`, Zod `4.4.3`, and Vite `8.0.16` do not introduce these production findings.

#### Development-only findings

The other nine audit records—`@eslint/config-array`, `@eslint/eslintrc`, `brace-expansion`, `eslint`, `eslint-config-next`, `eslint-plugin-import`, `eslint-plugin-jsx-a11y`, `eslint-plugin-react`, and `minimatch`—propagate from one advisory through ESLint and the lint plugins installed by `eslint-config-next`:

`eslint@9.39.5` or its plugins → `minimatch@3.1.5` → `brace-expansion@1.1.18`

[GHSA-mh99-v99m-4gvg](https://github.com/advisories/GHSA-mh99-v99m-4gvg) affects `brace-expansion <=5.0.7`; there is no patched 1.x release. ESLint `10.8.0` moves its own dependency path to a patched major, but the installed `eslint-plugin-import@2.32.0`, `eslint-plugin-jsx-a11y@6.10.2`, and `eslint-plugin-react@7.37.5` advertise support only through ESLint 9 and retain Minimatch 3 paths. Upgrading ESLint alone would violate peer contracts and would not remove every affected path. These records are absent from `npm audit --omit=dev` and cannot reach the application runtime. The current static lint configuration and CLI supply no untrusted glob input, but a malicious repository glob or lint-configuration change could still exhaust developer or CI memory. The risk remains documented rather than ignored.

#### Remediation decision and recheck gate

No stable, contract-compatible remediation is available on 2026-07-31. The project will wait for a stable Next release instead of using an automatic or forced audit fix, transitive override, prerelease framework, incompatible downgrade, dependency removal, suppression, or implicit risk acceptance. D09 therefore remains incomplete and D10 remains blocked.

Reopen the dependency decision only after a stable Next release simultaneously:

- declares PostCSS `>=8.5.18`;
- declares Sharp `>=0.35.0`;
- declares a React 19-compatible peer range and a Node engine satisfied by the project's Node 24 baseline;
- has a matching stable `eslint-config-next` release.

The future review must approve exact matching Next/ESLint-config versions, run a clean install and dependency-tree inspection, produce no high-severity production audit findings, and pass lint, `npm exec tsc -- --noEmit`, and production build. Remaining development-only findings may coexist with D09 completion only after their exact paths and reachability are rechecked and their disposition is explicitly recorded; this record grants no security exception.

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
