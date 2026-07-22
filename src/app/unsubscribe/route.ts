import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('token') ?? '';
  if (!/^[0-9a-f-]{36}$/i.test(token)) return new NextResponse('Invalid unsubscribe link.', { status: 400 });
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return new NextResponse('Unable to update your subscription right now.', { status: 503 });
  const supabase = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
  const { error } = await supabase.from('newsletter_subscribers').update({ status: 'unsubscribed' }).eq('unsubscribe_token', token);
  if (error) return new NextResponse('Unable to update your subscription right now.', { status: 500 });
  return new NextResponse('<!doctype html><html><head><meta name="viewport" content="width=device-width"><title>Unsubscribed · WeReact</title></head><body style="margin:0;display:grid;min-height:100vh;place-items:center;background:#f3f4ef;color:#182019;font-family:Arial,sans-serif"><main style="max-width:520px;padding:32px"><a href="https://www.wereact.agency" style="color:#3a5a40;font-size:25px;font-weight:800;text-decoration:none">·wereact·</a><h1 style="margin:42px 0 12px;font-size:38px">You are unsubscribed.</h1><p style="color:#687069;line-height:1.6">You will no longer receive newsletter emails from WeReact.</p></main></body></html>', { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
