import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('uses the public WeReact wordmark and a professional CRM sign-out control', () => {
  const header = readFileSync(
    new URL('../app/admin/AdminHeader.tsx', import.meta.url),
    'utf8',
  );
  const signOut = readFileSync(
    new URL('../app/admin/SignOutButton.tsx', import.meta.url),
    'utf8',
  );

  assert.match(header, /&middot;wereact&middot;/);
  assert.doesNotMatch(header, /crm-brand__mark/);
  assert.match(signOut, /import \{ LogOut \} from 'lucide-react'/);
  assert.match(signOut, /<LogOut size=\{16\}/);
  assert.match(signOut, /className="crm-sign-out"/);
  assert.match(signOut, /auth\.signOut\(\)/);
});
