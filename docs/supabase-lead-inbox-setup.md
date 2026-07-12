# Supabase Lead Inbox Setup

WeReact stores contact-form leads in Supabase so they can be managed in the private Supabase Table Editor. No public dashboard is exposed by the website.

1. Create a free Supabase project at [supabase.com](https://supabase.com).
2. Open **SQL Editor**, paste `supabase/migrations/20260712_create_leads.sql`, and run it once.
3. In **Project Settings → API**, copy the project URL and the `service_role` key.
4. Add these server-only variables in Vercel for Production, Preview, and Development:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

5. In **Table Editor → leads**, manage each lead by changing `status` and adding `notes`.

The service-role key must never be prefixed with `NEXT_PUBLIC_` and must never be placed in client-side code.

## WhatsApp Automation Later

The `whatsapp` column is ready for future automation. Before auto-messaging, connect a WhatsApp Business provider such as Meta WhatsApp Cloud API or Twilio, use an approved template, and send only to clients who supplied their WhatsApp number for follow-up.
