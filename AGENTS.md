<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Sources of truth

Read only the sources relevant to the current task, but resolve questions using these responsibilities:

- `docs/API_INVENTORY.md` defines the known third-party API request surface and the limits of current response evidence. Do not add requests absent from it; response fields require verified evidence.
- `docs/PRD.md` defines product scope, exclusions, and functional acceptance criteria.
- `docs/ROUTES.md` defines approved application routes and conditional routes.
- `docs/DECISIONS.md` defines Confirmed, Resolved, Provisional, Open, Conditional, and Deferred decisions. Respect the current gate for each feature.
- `docs/TASKS.md` defines milestone dependencies and the vertical implementation order.
- `docs/UI_SPEC.md` defines reusable UI boundaries, design tokens, responsive behavior, asset ownership, states, accessibility, and deferred controls.
- `design/stitch/screenshots` is the primary visual source of truth. `design/stitch/DESIGN.md` provides design-system intent. `design/stitch/export` is measurement, layout, and art-direction reference only.

When sources address different concerns, API inventory, product scope, approved routes, and recorded decisions control functionality; screenshots control approved appearance. A visible screenshot control does not override a missing API capability, deferred decision, or absent route. Never treat exported Stitch code as approval evidence.

## Required task workflow

Before editing:

1. Run `git status --short` and treat existing changes as user-owned. Do not discard or rewrite unrelated work.
2. Read the current milestone or narrow task in `docs/TASKS.md`, including its dependencies and verification.
3. Inspect the relevant source, documentation, tests, configuration, and local framework guides.
4. Use Plan Mode before multi-file, architectural, dependency, routing, API-contract, or other cross-cutting work.

If the user request is not a named milestone, treat it as a narrow task and do not advance milestone status or begin adjacent work.

During the task:

- Implement one milestone or one narrowly scoped request at a time.
- Keep the change independently testable and committable.
- Do not refactor unrelated code, rename unrelated files, or broaden product scope.
- If new evidence changes a decision or milestone gate, update `docs/DECISIONS.md` or `docs/TASKS.md` only when that documentation change is in scope; otherwise report the needed update.

## Next.js and React rules

- This repository uses the App Router. Follow its layout, page, loading, error, route-handler, metadata, and Server/Client Component conventions.
- Apply the managed Next.js rule above to every framework change: open the specific installed guide needed for the API or convention, and do not rely on remembered or outdated behavior.
- Prefer Server Components. Add `"use client"` only when the component requires browser interaction, client state, effects, context, or browser-only APIs.
- Keep client boundaries as small as practical. Do not make an entire page client-side to support one interactive control.
- Keep tokens, private environment variables, authentication headers, and sensitive response data out of client bundles, serialized props, URLs, and browser logs.

## API and sensitive-data safety

- Never invent an endpoint, request field, response field, identifier meaning, permission, status code, error envelope, pagination shape, or query behavior.
- Do not call the live API unless the current `docs/TASKS.md` milestone explicitly authorizes verification. Anonymous inspection is limited to the listed public GET candidates; send no personal credentials or collection token.
- Use only verified response evidence and sanitized examples approved by the matching milestone. Keep assumptions visibly separate from confirmed facts.
- Never edit the raw Postman collection or reuse its credentials, tokens, personal data, or hardcoded identifiers. It is historical evidence, not a credential source.
- Protected verification must use the dedicated synthetic test account. If that account or a safety precondition is unavailable, stop and leave the behavior unresolved.
- Read only the dedicated account's own returned data. Mutate the account itself only when the milestone requires it, or mutate resources created for the current verification; take the required before-state snapshot and restore or clean up afterward.
- For protected-resource requests, use only IDs returned by the dedicated account's own/list flow. Never test another user's data, substitute another user ID, or attempt to bypass authorization.
- Admin endpoints remain disabled and absent from normal navigation unless `docs/DECISIONS.md` explicitly records that the authorization gate passed through an ordinarily issued role.
- Follow the checkout/order stop conditions in `docs/TASKS.md`; do not risk a real charge, fulfillment, or unsafe external side effect.
- Never commit or expose tokens, passwords, reset codes, cookies, personal emails, phone numbers, addresses, or unsanitized user/order identifiers.
- Never log secrets, authentication headers, raw sensitive payloads, or unredacted third-party errors. Redact before fixtures, documentation, telemetry, or debugging output.

## UI implementation rules

- Treat approved Stitch screenshots as visual truth. Use exported HTML/CSS only to clarify measurements, responsive hints, and layout; do not copy its generated JavaScript architecture, CDN setup, placeholder links, or remote-image architecture.
- Reuse the shared components, shells, primitives, and design tokens defined by `docs/UI_SPEC.md`. Do not create page-local variants without a documented need.
- Do not implement Deferred controls, unsupported behavior, or routes absent from `docs/ROUTES.md`.
- Product, gallery, category, brand, cart, wishlist, checkout, and order media must come from verified API response fields. Do not create local copies of API-driven commerce media.
- Localize only approved static marketing, decorative, logo, empty-state, and SVG assets described by `docs/UI_SPEC.md`. Do not require a local customer avatar without a verified source.
- Implement the documented desktop and mobile behavior. Do not infer unseen screens or treat rescaled screenshot pixels as CSS viewport dimensions.
- Model loading, empty, error, and ready states as mutually exclusive.
- Follow the keyboard, focus, labeling, contrast, reduced-motion, announcement, and touch-target requirements in `docs/UI_SPEC.md`.

## TypeScript and architecture rules

- Keep TypeScript strict mode enabled. Do not weaken compiler settings to make an implementation pass.
- Do not use `any` unless no safe type is practical. Document a narrow exception at the use site; record broader architectural exceptions in `docs/DECISIONS.md`.
- Separate third-party API transport, runtime response validation, domain adapters, and UI/presentation concerns.
- Do not call the third-party API from arbitrary presentational components. Route data and mutations through the approved server/API boundary once D07 resolves it.
- Do not add, replace, or upgrade dependencies unless the choice is approved in `docs/DECISIONS.md` and the current milestone authorizes installation.
- Do not invent the final folder structure before D07 resolves it. Once resolved, follow the recorded architecture rather than creating competing patterns.

## Validation

Inspect `package.json` before choosing commands. For an implementation task, run every relevant available check before marking it complete:

- Lint: `npm run lint`.
- Type check: use the repository's type-check script; while none exists and local `typescript` remains installed, use `npm exec tsc -- --noEmit`. Do not allow this command to fetch or install a package.
- Tests: run the project test script and targeted tests when such a script exists. If no script exists, report that instead of inventing one or installing a runner.
- Production build: `npm run build`.

Use narrower checks while iterating, then run the full relevant set for the completed implementation milestone. Documentation-only work may use documentation-specific structural checks instead of unrelated application builds. Do not install dependencies merely to make a validation command available. If a check cannot run or fails for a pre-existing/unrelated reason, report the command, result, and limitation; do not silently skip it or expand scope to fix unrelated failures.

After validation, run `git diff --check`, review the complete diff and any intended untracked files for accidental changes or secrets, and confirm final `git status --short` contains only intended changes.

## Completion response

Every completed Codex task must report:

- What changed.
- Files changed.
- Commands run and their results.
- Assumptions made.
- Remaining limitations or unverified behavior.
- Whether `docs/DECISIONS.md` or `docs/TASKS.md` needs an update.
- A recommended commit message.

Stop after the requested task. Do not begin the next milestone without a new user request.
