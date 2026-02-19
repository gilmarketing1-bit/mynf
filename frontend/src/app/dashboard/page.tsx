'use client';

import Link from 'next/link';

const notasMock = [
  { id: '1', numero: '000001', data: '2026-02-19', tomador: 'Empresa Alpha Ltda', servico: '17.06', valor: 1500.00, status: 'EMITIDA' },
  { id: '2', numero: '000002', data: '2026-02-19', tomador: 'Beta Consultoria ME', servico: '17.01', valor: 3200.00, status: 'EMITIDA' },
  { id: '3', numero: '000003', data: '2026-02-18', tomador: 'Gama Tecnologia SA', servico: '17.06', valor: 800.00, status: 'REJEITADA' },
  { id: '4', numero: '000004', data: '2026-02-17', tomador: 'Delta Saude Ltda', servico: '4.03', valor: 5000.00, status: 'CANCELADA' },
  { id: '5', numero: '000005', data: '2026-02-17', tomador: 'Epsilon Adv Associados', servico: '17.14', valor: 2100.00, status: 'EMITIDA' },
];

const graficoMock = [
  { mes: 'Set', valor: 4200 },
  { mes: 'Out', valor: 6800 },
  { mes: 'Nov', valor: 5100 },
  { mes: 'Dez', valor: 9200 },
  { mes: 'Jan', valor: 7400 },
  { mes: 'Fev', valor: 12600 },
];

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  EMITIDA:    { label: 'Emitida',     color: 'bg-green-100 text-green-700' },
  REJEITADA:  { label: 'Rejeitada',   color: 'bg-red-100 text-red-700' },
  CANCELADA:  { label: 'Cancelada',   color: 'bg-slate-100 text-slate-500' },
  RASCUNHO:   { label: 'Rascunho',    color: 'bg-slate-100 text-slate-600' },
  PROCESSANDO:{ label: 'Processando', color: 'bg-yellow-100 text-yellow-700' },
};

function formatData(iso: string) {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export default function DashboardPage() {
  const hoje = '2026-02-19';
  const mesAtual = '2026-02';

  const notasHoje = notasMock.filter(n => n.data === hoje && n.status === 'EMITIDA').length;
  const faturamentoMes = notasMock
    .filter(n => n.data.startsWith(mesAtual) && n.status === 'EMITIDA')
    .reduce((acc, n) => acc + n.valor, 0);
  const aliquotaPadrao = 0.02;
  const issRecolhido = faturamentoMes * aliquotaPadrao;
  const notasErro = notasMock.filter(n => n.status === 'REJEITADA').length;

  const maxValor = Math.max(...graficoMock.map(g => g.valor));
  const ultimasNotas = [...notasMock].reverse().slice(0, 4);

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', active: true },
    { label: 'Emitir Nota', href: '/notas/nova', active: false },
    { label: 'Notas Emitidas', href: '/notas', active: false },
    { label: 'Clientes', href: '/clientes', active: false },
    { label: 'Relatorios', href: '/relatorios', active: false },
    { label: 'Configuracoes', href: '/empresas/configuracao', active: false },
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
              <p className="text-xs text-slate-500 truncate">gil@empresa.com.br</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="lg:ml-64 p-4 lg:p-8 pb-24">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 lg:mb-8">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-500 text-sm">Fevereiro 2026</p>
          </div>
          <Link href="/notas/nova"
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-4 py-2 lg:px-5 lg:py-2.5 rounded-xl text-sm transition-colors">
            + Nova Nota
          </Link>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5 mb-6 lg:mb-8">
          <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-slate-100">
            <p className="text-slate-500 text-xs lg:text-sm mb-2">Notas emitidas hoje</p>
            <p className="text-2xl lg:text-3xl font-bold text-slate-900">{notasHoje}</p>
            <p className="text-xs text-slate-400 mt-1">{formatData(hoje)}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-slate-100">
            <p className="text-slate-500 text-xs lg:text-sm mb-2">Faturamento do mes</p>
            <p className="text-2xl lg:text-3xl font-bold text-slate-900">
              R$ {faturamentoMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-green-600 mt-1">Notas emitidas</p>
          </div>
          <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-slate-100">
            <p className="text-slate-500 text-xs lg:text-sm mb-2">ISS estimado</p>
            <p className="text-2xl lg:text-3xl font-bold text-slate-900">
              R$ {issRecolhido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-slate-400 mt-1">Aliquota 2% padrao</p>
          </div>
          <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-slate-100">
            <p className="text-slate-500 text-xs lg:text-sm mb-2">Notas com erro</p>
            <p className={`text-2xl lg:text-3xl font-bold ${notasErro > 0 ? 'text-red-600' : 'text-slate-900'}`}>
              {notasErro}
            </p>
            {notasErro > 0
              ? <Link href="/notas?status=REJEITADA" className="text-xs text-red-500 hover:underline mt-1 block">Ver e corrigir</Link>
              : <p className="text-xs text-green-600 mt-1">Tudo certo</p>
            }
          </div>
        </div>

        {/* Grafico de faturamento */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 lg:p-6 mb-6 lg:mb-8">
          <h2 className="font-semibold text-slate-900 mb-4">Faturamento — ultimos 6 meses</h2>
          <div className="flex items-end gap-2 h-32">
            {graficoMock.map(g => (
              <div key={g.mes} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-slate-500 hidden sm:block">
                  {(g.valor / 1000).toFixed(1)}k
                </span>
                <div
                  className="w-full bg-indigo-500 rounded-t-lg transition-all hover:bg-indigo-600"
                  style={{ height: `${(g.valor / maxValor) * 100}%`, minHeight: '4px' }}
                />
                <span className="text-xs text-slate-500">{g.mes}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between">
            <span className="text-xs text-slate-400">Total periodo</span>
            <span className="text-sm font-semibold text-slate-900">
              R$ {graficoMock.reduce((a, g) => a + g.valor, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Ultimas notas */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="px-4 lg:px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Ultimas notas emitidas</h2>
            <Link href="/notas" className="text-sm text-indigo-600 hover:underline">Ver todas</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {ultimasNotas.map(nota => (
              <div key={nota.id} className="px-4 lg:px-6 py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-indigo-600 text-xs font-bold">NF</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{nota.tomador}</p>
                    <p className="text-xs text-slate-400">No. {nota.numero} · {formatData(nota.data)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`px-2 py-0.5 rounded-lg text-xs font-medium hidden sm:block ${STATUS_CONFIG[nota.status]?.color}`}>
                    {STATUS_CONFIG[nota.status]?.label}
                  </span>
                  <span className="text-sm font-semibold text-slate-900">
                    R$ {nota.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 lg:px-6 py-3 border-t border-slate-100">
            <Link href="/notas" className="text-sm text-indigo-600 hover:underline">
              Ver todas as notas
            </Link>
          </div>
        </div>

      </main>

      {/* Nav mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around py-2 z-10">
        {[
          { label: 'Inicio', href: '/dashboard' },
          { label: 'Nova Nota', href: '/notas/nova' },
          { label: 'Notas', href: '/notas' },
          { label: 'Config', href: '/empresas/configuracao' },
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