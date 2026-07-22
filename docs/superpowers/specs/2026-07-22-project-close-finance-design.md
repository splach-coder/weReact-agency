# Project Close to Finance Design

## Objective

Connect project delivery and agency finance so closing a project records its confirmed value as paid revenue exactly once.

## Business Rule

For WeReact, a project is closed only after delivery is complete and the full agreed amount has been received. The project budget is therefore the final paid amount when its status changes to `launched`.

## Workflow

1. A team member enters the confirmed project budget while managing delivery.
2. The project cannot move to `launched` without a positive confirmed budget.
3. Closing the project and creating its finance entry happen in one database transaction.
4. Finance receives one paid income entry linked to the project and client, dated on the closing day.
5. The dashboard and finance page immediately include the revenue.
6. Repeated saves or retries cannot create duplicate revenue.

## Data Integrity

- Add a finance entry source that distinguishes automatically generated project revenue from manual transactions.
- Enforce one automatic revenue entry per project with a database uniqueness constraint.
- Perform project completion and revenue creation inside the secured project RPC, not as separate browser requests.
- Reject completion when the confirmed budget is missing or zero.
- Keep the closed project amount immutable through the project editor. Corrections use an explicit finance adjustment so history remains visible.
- Reopening a project does not remove money already received.

## Existing Data

A migration backfills one paid project revenue entry for every existing `launched` project with a positive budget that does not already have one. The transaction date uses the project's latest recorded update date.

## Interface

- The final project action states that it will close the project and record payment.
- The confirmation includes the amount being recorded.
- A completed project displays its recorded payment and a direct link to Finance.
- Finance identifies automatic rows by project name and keeps them separate from manual expense or adjustment entries.

## Error Handling

- Missing budget: block completion with a specific message.
- Concurrent update: preserve the current optimistic-lock response.
- Revenue insertion failure: roll back project completion so CRM and Finance cannot disagree.
- Duplicate retry: reuse the existing linked revenue entry instead of inserting another.

## Verification

- Unit tests cover the completion requirement and finance presentation.
- Migration tests verify the unique project revenue constraint, atomic insertion, and backfill.
- Full test, lint, and Cloudflare production builds must pass.
- Production verification checks the protected CRM and Finance routes after deployment.
