# Production Release and Rollback Checklist

This document defines the final go/no-go verification steps for deploying to production, post-deployment smoke testing, and the rollback procedure if a critical issue is discovered.

## 1. Pre-Release Go/No-Go Checklist

Before executing a deployment to the production environment, confirm the following:

- [ ] **Test Suites Pass:** All automated checks pass locally and in CI (`npm run lint`, `npx vitest run`, `npx playwright test`).
- [ ] **Build Succeeds:** The application builds successfully without errors (`npm run build`).
- [ ] **No Client-Side Secrets:** Bundle scanner confirms no private environment variables are exposed (`npm run scan:bundle`).
- [ ] **Environment Variables:** All required production variables are configured in the deployment environment:
  - `ECOMMERCE_API_BASE_URL` (Verified API host)
  - `APP_ORIGIN` (Production domain)
  - `SESSION_ENCRYPTION_KEY` (AES-256-GCM valid 32-byte key)
  - `NODE_ENV` (Set to `production`)
- [ ] **Security Headers:** The environment is configured to serve the Next.js application with standard security headers (HSTS, CSP, X-Frame-Options).
- [ ] **Data Migrations:** No frontend-coupled database schema migrations are pending (stateless frontend architecture).

## 2. Post-Deployment Smoke Verification

Immediately after the deployment is live, perform these manual sanity checks on the production URL:

1. **Homepage:** Load the homepage. Verify the hero image, featured categories, and new arrivals render correctly.
2. **Navigation:** Navigate through the main category links (e.g., Men's Fashion, Electronics). Ensure products list correctly.
3. **Product Detail:** Click on a product to view its details. Confirm price, images, and description load.
4. **Cart Initialization:** Add the product to the cart and view the cart. Confirm the product appears with the correct price. (Do not proceed to actual payment).
5. **Security Headers:** Open developer tools and verify the presence of `Strict-Transport-Security`, `Content-Security-Policy`, and `X-Frame-Options` headers on document requests.
6. **Error Tracking & Logging:** Check the production application logs to ensure no PII (emails, phone numbers) or secrets are being logged (enforced via `sanitizeLog`).

## 3. Zero-Downtime Rollback Procedure

If the post-deployment smoke test fails, or a critical incident is detected, execute the rollback procedure. Since the frontend is stateless and does not couple with database schemas, rollback is instantaneous via deployment reversion.

**Steps:**
1. **Identify the Previous Stable Version:** Locate the commit hash or deployment ID of the last known stable release.
2. **Initiate Revert/Redeploy:** In your hosting provider's dashboard (e.g., Vercel, Netlify, AWS Amplify), select the previous stable deployment and trigger a rollback or redeploy.
3. **Verify Rollback Status:** Wait for the rollback deployment to complete (should be nearly instant for edge/serverless platforms).
4. **Re-run Smoke Verification:** Execute the Post-Deployment Smoke Verification (Section 2) on the rolled-back version to ensure stability is restored.
5. **Incident Report:** Document the failure reason, affected users (if any), and the time to resolution in an incident report. Investigate the root cause locally before attempting a new release.
