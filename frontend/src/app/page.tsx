import Link from 'next/link';

export default async function HomePage(): Promise<JSX.Element> {
  let health = 'desconhecido';
  let healthOk = false;

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'https://mynf-production.up.railway.app/api';
    const response = await fetch(`${apiUrl}/health`, { cache: 'no-store' });
    const json = (await response.json()) as { status?: string };
    health = json.status ?? 'desconhecido';
    healthOk = health === 'ok';
  } catch {
    health = 'offline';
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-2xl mb-6">
          <span className="text-white text-2xl font-bold">NF</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-1">myNF</h1>
        <p className="text-slate-500 text-sm mb-8">Plataforma de Emissão de NFS-e</p>
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-8 ${
          healthOk ? 'bg-success-50 text-success-600' : 'bg-danger-50 text-danger-600'
        }`}>
          <span className={`w-2 h-2 rounded-full ${healthOk ? 'bg-success-500' : 'bg-danger-500'}`} />
          API {health}
        </div>
        <div className="flex flex-col gap-3">
          <Link href="/login" className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-xl transition-colors">
            Entrar
          </Link>
          <Link href="/dashboard" className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition-colors">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
