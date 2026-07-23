import { siteConfig } from '@/config/site';

export type InvoiceEmailLine = {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

export type InvoiceEmailInput = {
  invoiceNumber: string;
  clientName: string;
  projectName: string;
  issuedOn: string | null;
  dueOn: string | null;
  status: 'issued' | 'paid';
  total: number;
  notes: string;
  lines: InvoiceEmailLine[];
};

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  })[character] ?? character);
}

function money(value: number) {
  return new Intl.NumberFormat('en-MA', {
    style: 'currency',
    currency: 'MAD',
    minimumFractionDigits: 2,
  }).format(Number(value));
}

function date(value: string | null) {
  if (!value) return 'Not set';
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat('en-MA', {
    day: '2-digit', month: 'long', year: 'numeric', timeZone: 'UTC',
  }).format(parsed);
}

export function buildInvoiceEmail(input: InvoiceEmailInput) {
  const rows = input.lines.map((line) => `
    <tr>
      <td style="padding:13px 10px;border-bottom:1px solid #dce1d8;color:#182019;font-size:13px;">${escapeHtml(line.description)}</td>
      <td align="right" style="padding:13px 10px;border-bottom:1px solid #dce1d8;color:#687069;font-size:12px;">${Number(line.quantity).toFixed(2)}</td>
      <td align="right" style="padding:13px 10px;border-bottom:1px solid #dce1d8;color:#687069;font-size:12px;">${money(line.unitPrice)}</td>
      <td align="right" style="padding:13px 10px;border-bottom:1px solid #dce1d8;color:#182019;font-size:12px;font-weight:700;">${money(line.total)}</td>
    </tr>`).join('');

  const paymentCopy = input.status === 'paid'
    ? 'This invoice is marked as paid. Thank you.'
    : `The amount due is ${money(input.total)}. Reply to this email if you need payment details or any clarification.`;

  return {
    subject: `Invoice ${input.invoiceNumber} from WeReact agency`,
    html: `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f3f4ef;color:#182019;font-family:Arial,Helvetica,sans-serif;">
    <span style="display:none!important;max-height:0;overflow:hidden;opacity:0;">Invoice ${escapeHtml(input.invoiceNumber)} for ${escapeHtml(input.projectName)}</span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4ef;">
      <tr><td align="center" style="padding:30px 14px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:680px;background:#ffffff;border:1px solid #dce1d8;">
          <tr><td style="padding:25px 30px;border-bottom:1px solid #dce1d8;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
              <td><a href="${siteConfig.url}" style="color:#3a5a40;font-size:24px;font-weight:800;text-decoration:none;">&middot;wereact&middot;</a></td>
              <td align="right"><span style="color:#687069;font-size:10px;text-transform:uppercase;">Invoice</span><br><strong style="font-size:17px;">${escapeHtml(input.invoiceNumber)}</strong></td>
            </tr></table>
          </td></tr>
          <tr><td style="padding:34px 30px 24px;">
            <p style="margin:0 0 8px;color:#3a5a40;font-size:10px;font-weight:700;text-transform:uppercase;">Invoice ${input.status}</p>
            <h1 style="margin:0;font-size:28px;line-height:1.2;">Hello ${escapeHtml(input.clientName)},</h1>
            <p style="margin:15px 0 0;color:#59635b;font-size:15px;line-height:1.6;">Please find the invoice for <strong>${escapeHtml(input.projectName)}</strong> below.</p>
          </td></tr>
          <tr><td style="padding:0 30px 24px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f2;border-left:3px solid #3a5a40;">
              <tr><td style="padding:16px;"><span style="color:#687069;font-size:10px;text-transform:uppercase;">Issued</span><br><strong>${date(input.issuedOn)}</strong></td><td style="padding:16px;"><span style="color:#687069;font-size:10px;text-transform:uppercase;">Due</span><br><strong>${date(input.dueOn)}</strong></td><td align="right" style="padding:16px;"><span style="color:#687069;font-size:10px;text-transform:uppercase;">Total</span><br><strong style="color:#3a5a40;font-size:18px;">${money(input.total)}</strong></td></tr>
            </table>
          </td></tr>
          <tr><td style="padding:0 30px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
              <thead><tr><th align="left" style="padding:10px;color:#687069;background:#f4f6f2;font-size:10px;text-transform:uppercase;">Service</th><th align="right" style="padding:10px;color:#687069;background:#f4f6f2;font-size:10px;text-transform:uppercase;">Qty</th><th align="right" style="padding:10px;color:#687069;background:#f4f6f2;font-size:10px;text-transform:uppercase;">Unit price</th><th align="right" style="padding:10px;color:#687069;background:#f4f6f2;font-size:10px;text-transform:uppercase;">Total</th></tr></thead>
              <tbody>${rows}</tbody>
            </table>
          </td></tr>
          <tr><td style="padding:0 30px 30px;">
            <div style="padding:18px 20px;color:#ffffff;background:#3a5a40;font-size:14px;line-height:1.6;">${paymentCopy}</div>
            ${input.notes ? `<p style="margin:18px 0 0;color:#59635b;font-size:12px;line-height:1.6;"><strong>Notes:</strong> ${escapeHtml(input.notes)}</p>` : ''}
          </td></tr>
          <tr><td style="padding:22px 30px;border-top:1px solid #dce1d8;color:#687069;font-size:11px;line-height:1.6;">
            WeReact agency &middot; ${escapeHtml(siteConfig.business.addressDisplay)}<br>
            <a href="mailto:${siteConfig.business.email}" style="color:#3a5a40;">${siteConfig.business.email}</a> &middot; ${escapeHtml(siteConfig.business.phoneDisplay)}
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`,
  };
}
