'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setToken } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setErro('');
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://mynf-production.up.railway.app/api'}/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Credenciais inválidas');
      setToken(data.accessToken);
      router.push('/dashboard');
    } catch (e: any) {
      setErro(e.message || 'Erro ao entrar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bg-slate-50 min-h-screen">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-screen">

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-sm">NF</span>
          </div>
          <span className="text-2xl font-bold text-slate-900">myNF</span>
        </div>

        <div className="w-full bg-white rounded-2xl shadow-lg p-8 max-w-md">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Entrar na sua conta</h1>
          <p className="text-slate-500 text-sm mb-6">Emita NFS-e em menos de 60 segundos</p>

          {erro && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
              {erro}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="voce@empresa.com.br"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>

          <p className="text-sm text-slate-500 text-center mt-6">
            Não tem conta?{' '}
            <a href="/registro" className="text-indigo-600 font-medium hover:underline">
              Criar conta grátis
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}