import Link from 'next/link';

export default async function HomePage(): Promise<JSX.Element> {
  let health = 'desconhecido';

  try {
    const response = await fetch('http://localhost:3001/api/health', { cache: 'no-store' });
    const json = (await response.json()) as { status?: string };
    health = json.status ?? 'desconhecido';
  } catch {
    health = 'offline';
  }

  return (
    <main>
      <h1>myNF — Plataforma NFS-e</h1>
      <p>Status da API: <strong>{health}</strong></p>
      <p>Ambiente inicial para Oracle Cloud Free Tier.</p>
      <ul>
        <li><Link href="/login">Login</Link></li>
        <li><Link href="/dashboard">Dashboard</Link></li>
      </ul>
    </main>
  );
}