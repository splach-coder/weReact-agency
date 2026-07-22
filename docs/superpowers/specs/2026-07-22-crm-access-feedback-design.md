# CRM Access Feedback Design

## Goal

Make unauthorized access unmistakable without exposing workspace details, and ensure authenticated phone users can always sign out.

## Login State

When `/admin/login` receives `?error=access`, show a persistent muted-red alert above the Google button. The alert uses a shield icon, the heading `Access denied`, and the message `This Google account is not approved for the WeReact workspace. Sign in with an authorized team account.` It uses `role="alert"` and does not reveal approved email addresses.

OAuth failures continue to show a concise sign-in error. The Google button remains available so the visitor can choose another account.

## Mobile Sign-Out

The sticky mobile CRM header gains a 44px icon-only sign-out button beside the current page label. It reuses the existing `SignOutButton` behavior and Lucide logout icon, with an accessible label and title. The desktop sidebar control remains unchanged.

## Verification

Automated tests assert the denied message and mobile sign-out control are present. The full test suite, lint, Cloudflare build, and mobile viewport are verified before deployment.
