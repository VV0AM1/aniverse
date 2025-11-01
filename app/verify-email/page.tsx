import VerifyClient from "./verify-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { ok?: string; reason?: string };
}) {
  const ok = searchParams?.ok === "1";
  const reason = searchParams?.reason ?? null;

  return <VerifyClient ok={ok} reason={reason} />;
}