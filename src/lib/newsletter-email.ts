import { siteConfig } from '@/config/site';

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character);
}

function messageHtml(message: string) {
  return message.split(/\n{2,}/).map((paragraph) => `<p style="margin:0 0 18px;color:#3f4740;font-size:16px;line-height:1.7;">${escapeHtml(paragraph).replace(/\n/g, '<br />')}</p>`).join('');
}

export function buildNewsletterEmail(input: { subject: string; preview: string; message: string; unsubscribeToken: string }) {
  const unsubscribeUrl = `${siteConfig.url}/unsubscribe?token=${encodeURIComponent(input.unsubscribeToken)}`;
  return `<!doctype html><html lang="en"><body style="margin:0;background:#f3f4ef;color:#182019;font-family:Arial,Helvetica,sans-serif;">
    <span style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(input.preview)}</span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4ef;"><tr><td align="center" style="padding:34px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;">
        <tr><td style="padding:0 0 24px;border-bottom:1px solid #cad3c5;"><a href="${siteConfig.url}" style="color:#3a5a40;font-size:25px;font-weight:800;text-decoration:none;">&middot;wereact&middot;</a></td></tr>
        <tr><td style="padding:38px 0 22px;"><p style="margin:0 0 13px;color:#3a5a40;font-size:11px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;">Notes from the studio</p><h1 style="margin:0;color:#182019;font-size:30px;line-height:1.2;">${escapeHtml(input.subject)}</h1></td></tr>
        <tr><td style="padding:0 0 28px;">${messageHtml(input.message)}</td></tr>
        <tr><td style="padding:22px 0;border-top:1px solid #cad3c5;color:#687069;font-size:12px;line-height:1.6;">WeReact agency · Marrakech, Morocco<br />Web design, SEO, and digital experiences built to convert.<br /><a href="${unsubscribeUrl}" style="color:#3a5a40;">Unsubscribe</a> from these occasional notes.</td></tr>
      </table>
    </td></tr></table>
  </body></html>`;
}
