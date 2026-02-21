'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';

function formatBRL(v: number) {
  return (v || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

const REGIME_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  SIMPLES:   { label: 'Simples Nacional', color: 'text-indigo-700', bg: 'bg-indigo-500' },
  PRESUMIDO: { label: 'Lucro Presumido',  color: 'text-violet-700', bg: 'bg-violet-500' },
  REAL:      { label: 'Lucro Real',       color: 'text-cyan-700',   bg: 'bg-cyan-500' },
};

function MiniBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1">
      <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${Math.min(pct, 100)}%` }} />
    </div>
  );
}

export default function DashboardPage() {
  const [dados, setDados] = useState<any>(null);
  const [notas, setNotas] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  Promise.all([
    apiFetch('/nfse/dashboard'),
    apiFetch('/nfse?limit=5'),
    apiFetch('/clients'),
  ]).then(([dashboard, notasData, clientesData]) => {
    setDados(dashboard);
    setNotas(Array.isArray(notasData) ? notasData.slice(0, 5) : []);
    setClientes(Array.isArray(clientesData) ? clientesData : []);
  }).catch(() => {
    setDados({});
    setNotas([]);
    setClientes([]);
  }).finally(() => setLoading(false));
}, []);

  const faturamento = parseFloat(dados?.faturamento_mes || 0);
  const issEstimado = parseFloat(dados?.iss_estimado || 0);
  const aReceber = parseFloat(dados?.total_pendente || 0);
  const recebido = parseFloat(dados?.total_recebido || 0);
  const totalEmitido = faturamento;
  const pctRecebido = totalEmitido > 0 ? (recebido / totalEmitido) * 100 : 0;
  const notasHoje = parseInt(dados?.emitidas_hoje || 0);
  const notasErro = parseInt(dados?.total_rejeitadas || 0);
  const clientesAtivos = clientes.filter(c => c.status === 'active').length;
  const clientesInativos = clientes.filter(c => c.status !== 'active').length;

  const navItems = [
    { label: 'Dashboard',      href: '/dashboard',             active: true },
    { label: 'Emitir Nota',    href: '/notas/nova',            active: false },
    { label: 'Notas Emitidas', href: '/notas',                 active: false },
    { label: 'Clientes',       href: '/clientes',              active: false },
    { label: 'Relatórios',     href: '/relatorios',            active: false },
    { label: 'Configurações',  href: '/empresas/configuracao', active: false },
  ];

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Topbar mobile */}
      <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">NF</span>
          </div>
          <span className="font-bold text-slate-900">myNF</span>
        </div>
        <Link href="/notas/nova" className="bg-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg">
          + Nota
        </Link>
      </header>

      {/* Sidebar desktop */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-screen w-64 bg-white border-r border-slate-200 flex-col">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-200">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">NF</span>
          </div>
          <span className="font-bold text-slate-900">myNF</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map(item => (
            <Link key={item.href} href={item.href}
              className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                item.active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'
              }`}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-slate-200">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 cursor-pointer">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-700 font-semibold text-xs">G</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">Gil</p>
              <p className="text-xs text-slate-500 truncate">gil@empresa.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="lg:ml-64 p-4 lg:p-8 pb-24">

        <div className="flex items-center justify-between mb-6 lg:mb-8">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-500 text-sm">{new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</p>
          </div>
          <Link href="/notas/nova"
            className="hidden lg:block bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors">
            + Nova Nota
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-slate-200 animate-pulse rounded-2xl h-28" />
            ))}
          </div>
        )}

        {!loading && (
          <>
            {/* Alerta rejeições */}
            {notasErro > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-red-700 text-sm font-medium">
                    {notasErro} nota{notasErro > 1 ? 's' : ''} rejeitada{notasErro > 1 ? 's' : ''} — requer atenção
                  </span>
                </div>
                <Link href="/notas" className="text-red-600 text-xs font-semibold hover:underline">Ver e corrigir</Link>
              </div>
            )}

            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-4 lg:p-5 text-white">
                <p className="text-indigo-200 text-xs mb-2">Notas emitidas hoje</p>
                <p className="text-3xl font-bold">{notasHoje}</p>
                <p className="text-indigo-200 text-xs mt-1">{new Date().toLocaleDateString('pt-BR')}</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-4 lg:p-5 text-white">
                <p className="text-emerald-100 text-xs mb-2">Faturamento do mês</p>
                <p className="text-2xl font-bold">R$ {formatBRL(faturamento)}</p>
                <p className="text-emerald-100 text-xs mt-1">{dados?.total_emitidas || 0} notas emitidas</p>
              </div>
              <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl p-4 lg:p-5 text-white">
                <p className="text-violet-200 text-xs mb-2">ISS estimado</p>
                <p className="text-2xl font-bold">R$ {formatBRL(issEstimado)}</p>
                <p className="text-violet-200 text-xs mt-1">Alíquota 2% padrão</p>
              </div>
              <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-4 lg:p-5 text-white">
                <p className="text-amber-100 text-xs mb-2">A receber</p>
                <p className="text-2xl font-bold">R$ {formatBRL(aReceber)}</p>
                <p className="text-amber-100 text-xs mt-1">{(100 - pctRecebido).toFixed(0)}% pendente</p>
              </div>
            </div>

            {/* Contas a receber + Clientes */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-slate-900">Contas a Receber</h2>
                  <span className="text-xs text-slate-400">{new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Total faturado</span>
                    <span className="font-semibold text-slate-900">R$ {formatBRL(totalEmitido)}</span>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-emerald-600">Recebido</span>
                      <span className="font-semibold text-emerald-600">R$ {formatBRL(recebido)}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3">
                      <div className="h-3 rounded-full bg-emerald-500 transition-all" style={{ width: `${pctRecebido}%` }} />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{pctRecebido.toFixed(0)}% recebido</p>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                    <span className="text-sm text-amber-600 font-medium">Pendente</span>
                    <span className="font-bold text-amber-600">R$ {formatBRL(aReceber)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-slate-900">Clientes</h2>
                  <span className="text-xs text-slate-400">{clientes.length} total</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-emerald-600">Ativos</span>
                      <span className="font-bold text-emerald-600">{clientesAtivos}</span>
                    </div>
                    <MiniBar pct={clientes.length > 0 ? (clientesAtivos / clientes.length) * 100 : 0} color="bg-emerald-500" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-slate-500">Inativos</span>
                      <span className="font-bold text-slate-500">{clientesInativos}</span>
                    </div>
                    <MiniBar pct={clientes.length > 0 ? (clientesInativos / clientes.length) * 100 : 0} color="bg-slate-300" />
                  </div>
                  {clientes.length === 0 && (
                    <div className="pt-2 border-t border-slate-100">
                      <p className="text-xs text-slate-400 text-center py-2">Nenhum cliente cadastrado</p>
                      <Link href="/clientes" className="block text-center text-xs text-indigo-600 hover:underline">
                        Cadastrar primeiro cliente
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Últimas notas */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
              <div className="px-4 lg:px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-semibold text-slate-900">Últimas notas emitidas</h2>
                <Link href="/notas" className="text-sm text-indigo-600 hover:underline">Ver todas</Link>
              </div>
              {notas.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <p className="text-slate-400 text-sm mb-3">Nenhuma nota emitida ainda</p>
                  <Link href="/notas/nova"
                    className="inline-block bg-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-indigo-600 transition-colors">
                    Emitir primeira nota
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {notas.map((nota: any) => (
                    <div key={nota.id} className="px-4 lg:px-6 py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${REGIME_CONFIG[nota.regime_tributario]?.bg || 'bg-indigo-500'}`}>
                          <span className="text-white text-xs font-bold">NF</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">{nota.tomador_nome || 'Tomador não informado'}</p>
                          <p className="text-xs text-slate-400">
                            No. {nota.numero_rps} · {new Date(nota.data_emissao).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${nota.pago ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {nota.pago ? 'Pago' : 'Pendente'}
                        </span>
                        <span className="text-sm font-semibold text-slate-900">
                          R$ {formatBRL(parseFloat(nota.valor_servico))}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Nav mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around py-2 z-10">
        {[
          { label: 'Início',    href: '/dashboard' },
          { label: 'Nova Nota', href: '/notas/nova' },
          { label: 'Notas',     href: '/notas' },
          { label: 'Config',    href: '/empresas/configuracao' },
        ].map(item => (
          <Link key={item.href} href={item.href}
            className="flex flex-col items-center text-xs text-slate-500 hover:text-indigo-600 py-1 px-3">
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}