'use client';

import Link from 'next/link';

export default function LoginPage() {
  return (
    <section className="bg-slate-50 min-h-screen">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-screen">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-sm">NF</span>
          </div>
          <span className="text-2xl font-bold text-slate-900">myNF</span>
        </div>

        {/* Card */}
        <div className="w-full bg-white rounded-2xl shadow-lg p-8 max-w-md">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Entrar na sua conta</h1>
          <p className="text-slate-500 text-sm mb-6">Emita NFS-e em menos de 60 segundos</p>

          <form className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                placeholder="voce@empresa.com.br"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Senha
                </label>
                <Link href="/esqueci-senha" className="text-sm text-primary-600 hover:underline">
                  Esqueci minha senha
                </Link>
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              Entrar
            </button>
          </form>

          <p className="text-sm text-slate-500 text-center mt-6">
            Não tem conta?{' '}
            <Link href="/registro" className="text-primary-600 font-medium hover:underline">
              Criar conta grátis
            </Link>
          </p>
        </div>

      </div>
    </section>
  );
}