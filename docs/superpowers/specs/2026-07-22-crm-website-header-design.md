# CRM Website Header Design

## Goal

Bring the public WeReact header's visual identity into the private CRM without importing the public full-screen menu or weakening the CRM's task-focused navigation.

## Header

- Use the exact `·wereact·` wordmark treatment from the public website as the primary home link.
- Keep the header sticky with the CRM's light glass background, subtle border, and blur.
- Remove the boxed `W` mark and the redundant "Client pipeline" subtitle.
- Keep a compact dashboard shortcut for returning to the pipeline.
- Show the signed-in member in a restrained identity block on desktop and hide secondary identity text on small phones.

## Sign Out

- Use a log-out icon with the clear label "Sign out".
- Style it as a quiet outlined command that gains the brand green on hover and focus.
- Preserve the existing Supabase sign-out behavior and redirect.
- Keep a minimum 44px touch target on phones.

## Responsive Behavior

- Desktop: wordmark left; dashboard, member identity, and sign out aligned right.
- Mobile: wordmark left; compact sign-out action right; dashboard and member details remain hidden to protect working width.
- No animated public menu overlay inside the CRM.

## Accessibility And Verification

- Keep explicit accessible labels and visible keyboard focus states.
- Verify the header at desktop and phone widths.
- Run the CRM tests, TypeScript, and focused lint checks.
