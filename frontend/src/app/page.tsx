import Link from 'next/link';

export default async function HomePage(): Promise<JSX.Element> {
  let health = 'indisponível';

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'}/health`, { cache: 'no-store' });
    const json = (await response.json()) as { status?: string };
    health = json.status ?? 'desconhecido';
  } catch {
    health = 'offline';
  }

  return (
    <main>
      <h1>MYNF — Plataforma NFS-e</h1>
      <p>Status da API: <strong>{health}</strong></p>
      <p>Ambiente inicial para Oracle Cloud Free Tier.</p>
      <ul>
        <li><Link href="/login">Login</Link></li>
        <li><Link href="/dashboard">Dashboard</Link></li>
      </ul>
    </main>
  );
}
