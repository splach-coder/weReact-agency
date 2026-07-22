# Agency Operations Dashboard Implementation Plan

## 1. Data and Domain

- [x] Add finance, newsletter campaign, and unsubscribe database migration with RLS.
- [x] Add typed dashboard, finance, and newsletter domain helpers.
- [x] Add failing tests for metrics, validation, and migration security, then implement them.

## 2. Authenticated Shell

- [x] Replace the single header with a reusable desktop sidebar and mobile navigation.
- [x] Preserve the public wordmark, authenticated member identity, and sign-out behavior.
- [x] Add active route states and accessible navigation controls.

## 3. Overview

- [x] Make `/admin` the agency overview.
- [x] Query leads, projects, newsletter counts, and finance entries safely.
- [x] Build compact metrics, priorities, pipeline distribution, cashflow, and recent activity.

## 4. Pipeline

- [x] Move the existing operational CRM dashboard to `/admin/pipeline` without changing its workflows.
- [x] Update revalidation and links for the new route.

## 5. Newsletter

- [x] Build the subscriber and campaign page.
- [x] Add server-side campaign validation, branded Resend delivery, batching, and campaign logs.
- [x] Add secure unsubscribe route and subscriber status controls.

## 6. Finance

- [x] Build finance summary, monthly cashflow, transaction composer, and ledger.
- [x] Add authenticated create/update actions with server validation.

## 7. Polish and Verification

- [x] Complete responsive CRM styling in the existing color system.
- [x] Run unit tests, TypeScript, ESLint, production build, and diff checks.
- [x] Verify desktop and mobile screens in a real browser.
