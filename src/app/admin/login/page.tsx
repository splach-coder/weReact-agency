import { AdminLoginClient } from './AdminLoginClient';

type AdminLoginPageProps = {
  searchParams: Promise<{ error?: string | string[] }>;
};

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const params = await searchParams;
  const reason = Array.isArray(params.error) ? params.error[0] : params.error;

  return <AdminLoginClient reason={reason} />;
}
