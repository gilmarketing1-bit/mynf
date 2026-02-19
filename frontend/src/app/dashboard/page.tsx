'use client';

import Link from 'next/link';

// ── DADOS MOCK ──────────────────────────────────────────────────────────────
const notasMock = [
  { id: '1', numero: '000001', data: '2026-02-19', tomador: 'Empresa Alpha Ltda', servico: '17.06', valor: 1500.00, status: 'EMITIDA', regime: 'SIMPLES', pago: true },
  { id: '2', numero: '000002', data: '2026-02-19', tomador: 'Beta Consultoria ME', servico: '17.01', valor: 3200.00, status: 'EMITIDA', regime: 'PRESUMIDO', pago: false },
  { id: '3', numero: '000003', data: '2026-02-18', tomador: 'Gama Tecnologia SA', servico: '17.06', valor: 800.00, status: 'REJEITADA', regime: 'REAL', pago: false },
  { id: '4', numero: '000004', data: '2026-02-17', tomador: 'Delta Saude Ltda', servico: '4.03', valor: 5000.00, status: 'CANCELADA', regime: 'SIMPLES', pago: false },
  { id: '5', numero: '000005', data: '2026-02-17', tomador: 'Epsilon Adv Associados', servico: '17.14', valor: 2100.00, status: 'EMITIDA', regime: 'PRESUMIDO', pago: true },
  { id: '6', numero: '000006', data: '2026-02-16', tomador: 'Zeta Engenharia Ltda', servico: '7.01', valor: 8500.00, status: 'EMITIDA', regime: 'REAL', pago: false },
  { id: '7', numero: '000007', data: '2026-02-15', tomador: 'Eta Clinica ME', servico: '4.01', valor: 1200.00, status: 'EMITIDA', regime: 'SIMPLES', pago: true },
];

const graficoMock = [
  { mes: 'Set', valor: 4200, emitidas: 8 },
  { mes: 'Out', valor: 6800, emitidas: 12 },
  { mes: 'Nov', valor: 5100, emitidas: 9 },
  { mes: 'Dez', valor: 9200, emitidas: 17 },
  { mes: 'Jan', valor: 7400, emitidas: 14 },
  { mes: 'Fev', valor: 12600, emitidas: 21 },
];

const clientesMock = [
  { nome: 'Empresa Alpha Ltda', ativo: true, ultimaNota: '2026-02-19' },
  { nome: 'Beta Consultoria ME', ativo: true, ultimaNota: '2026-02-19' },
  { nome: 'Gama Tecnologia SA', ativo: true, ultimaNota: '2026-02-18' },
  { nome: 'Delta Saude Ltda', ativo: false, ultimaNota: '2026-01-10' },
  { nome: 'Epsilon Adv Associados', ativo: true, ultimaNota: '2026-02-17' },
  { nome: 'Zeta Engenharia Ltda', ativo: true, ultimaNota: '2026-02-16' },
  { nome: 'Theta Comercio Ltda', ativo: false, ultimaNota: '2025-12-05' },
];

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  EMITIDA:    { label: 'Emitida',     color: 'bg-green-100 text-green-700' },
  REJEITADA:  { label: 'Rejeitada',   color: 'bg-red-100 text-red-700' },
  CANCELADA:  { label: 'Cancelada',   color: 'bg-slate-100 text-slate-500' },
  RASCUNHO:   { label: 'Rascunho',    color: 'bg-slate-100 text-slate-600' },
  PROCESSANDO:{ label: 'Processando', color: 'bg-yellow-100 text-yellow-700' },
};

const REGIME_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  SIMPLES:  { label: 'Simples Nacional', color: 'text-indigo-700', bg: 'bg-indigo-500' },
  PRESUMIDO:{ label: 'Lucro Presumido',  color: 'text-violet-700', bg: 'bg-violet-500' },
  REAL:     { label: 'Lucro Real',       color: 'text-cyan-700',   bg: 'bg-cyan-500' },
};

function formatData(iso: string) {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function MiniBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1">
      <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function DashboardPage() {
  const hoje = '2026-02-19';
  const mesAtual = '2026-02';

  const emitidas = notasMock.filter(n => n.status === 'EMITIDA');
  const notasHoje = notasMock.filter(n => n.data === hoje && n.status === 'EMITIDA').length;
  const faturamentoMes = emitidas.filter(n => n.data.startsWith(mesAtual)).reduce((a, n) => a + n.valor, 0);
  const issEstimado = faturamentoMes * 0.02;
  const notasErro = notasMock.filter(n => n.status === 'REJEITADA').length;

  // Contas a receber
  const totalEmitido = emitidas.reduce((a, n) => a + n.valor, 0);
  const totalRecebido = emitidas.filter(n => n.pago).reduce((a, n) => a + n.valor, 0);
  const totalAReceber = totalEmitido - totalRecebido;
  const pctRecebido = totalEmitido > 0 ? (totalRecebido / totalEmitido) * 100 : 0;

  // Por regime
  const regimes = ['SIMPLES', 'PRESUMIDO', 'REAL'];
  const faturamentoPorRegime = regimes.map(r => ({
    regime: r,
    valor: emitidas.filter(n => n.regime === r).reduce((a, n) => a + n.valor, 0),
    qtd: emitidas.filter(n => n.regime === r).length,
  }));
  const maxRegime = Math.max(...faturamentoPorRegime.map(r => r.valor), 1);

  // Clientes
  const clientesAtivos = clientesMock.filter(c => c.ativo).length;
  const clientesInativos = clientesMock.filter(c => !c.ativo).length;
  const semFaturamento = clientesMock.filter(c => c.ativo && !notasMock.find(n => n.tomador === c.nome && n.data.startsWith(mesAtual)));

  // Grafico
  const maxValor = Math.max(...graficoMock.map(g => g.valor));
  const ultimasNotas = [...notasMock].filter(n => n.status === 'EMITIDA').slice(0, 5);

  const navItems = [
    { label: 'Dashboard',     href: '/dashboard',              active: true },
    { label: 'Emitir Nota',   href: '/notas/nova',             active: false },
    { label: 'Notas Emitidas',href: '/notas',                  active: false },
    { label: 'Clientes',      href: '/clientes',               active: false },
    { label: 'Relatórios',    href: '/relatorios',             active: false },
    { label: 'Configurações', href: '/empresas/configuracao',  active: false },
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
            className="hidden lg:block bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors">
            + Nova Nota
          </Link>
        </div>

        {/* Alerta erro */}
        {notasErro > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-700 text-sm font-medium">{notasErro} nota{notasErro > 1 ? 's' : ''} rejeitada{notasErro > 1 ? 's' : ''} — requer atenção</span>
            </div>
            <Link href="/notas" className="text-red-600 text-xs font-semibold hover:underline">Ver e corrigir</Link>
          </div>
        )}

        {/* KPIs principais */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-4 lg:p-5 text-white">
            <p className="text-indigo-200 text-xs mb-2">Notas emitidas hoje</p>
            <p className="text-3xl font-bold">{notasHoje}</p>
            <p className="text-indigo-200 text-xs mt-1">{formatData(hoje)}</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-4 lg:p-5 text-white">
            <p className="text-emerald-100 text-xs mb-2">Faturamento do mês</p>
            <p className="text-2xl font-bold">R$ {faturamentoMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <p className="text-emerald-100 text-xs mt-1">Notas emitidas</p>
          </div>
          <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl p-4 lg:p-5 text-white">
            <p className="text-violet-200 text-xs mb-2">ISS estimado</p>
            <p className="text-2xl font-bold">R$ {issEstimado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <p className="text-violet-200 text-xs mt-1">Alíquota 2% padrão</p>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-4 lg:p-5 text-white">
            <p className="text-amber-100 text-xs mb-2">A receber</p>
            <p className="text-2xl font-bold">R$ {totalAReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <p className="text-amber-100 text-xs mt-1">{(100 - pctRecebido).toFixed(0)}% pendente</p>
          </div>
        </div>

        {/* Linha 2 — Recebimentos + Clientes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">

          {/* Contas a receber */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-900">Contas a Receber</h2>
              <span className="text-xs text-slate-400">Fevereiro 2026</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Total faturado</span>
                <span className="font-semibold text-slate-900">R$ {totalEmitido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-emerald-600">Recebido</span>
                  <span className="font-semibold text-emerald-600">R$ {totalRecebido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div className="h-3 rounded-full bg-emerald-500 transition-all" style={{ width: `${pctRecebido}%` }} />
                </div>
                <p className="text-xs text-slate-400 mt-1">{pctRecebido.toFixed(0)}% recebido</p>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <span className="text-sm text-amber-600 font-medium">Pendente</span>
                <span className="font-bold text-amber-600">R$ {totalAReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
            {semFaturamento.length > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-500 font-medium mb-2">Clientes sem nota no mês:</p>
                {semFaturamento.map(c => (
                  <div key={c.nome} className="flex items-center gap-2 py-1">
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                    <span className="text-xs text-slate-600">{c.nome}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Clientes */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-900">Clientes</h2>
              <span className="text-xs text-slate-400">{clientesMock.length} total</span>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-emerald-600">Ativos</span>
                  <span className="font-bold text-emerald-600">{clientesAtivos}</span>
                </div>
                <MiniBar pct={(clientesAtivos / clientesMock.length) * 100} color="bg-emerald-500" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-slate-500">Inativos</span>
                  <span className="font-bold text-slate-500">{clientesInativos}</span>
                </div>
                <MiniBar pct={(clientesInativos / clientesMock.length) * 100} color="bg-slate-300" />
              </div>
              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs text-slate-500 font-medium mb-2">Sem nota este mês</p>
                <span className={`text-2xl font-bold ${semFaturamento.length > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
                  {semFaturamento.length}
                </span>
                <p className="text-xs text-slate-400">cliente{semFaturamento.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Linha 3 — Gráfico + Regimes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">

          {/* Gráfico faturamento */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-900">Faturamento — últimos 6 meses</h2>
              <span className="text-xs text-slate-400">R$ {graficoMock.reduce((a, g) => a + g.valor, 0).toLocaleString('pt-BR')}</span>
            </div>
            <div className="flex items-end gap-3 h-40">
              {graficoMock.map((g, i) => (
                <div key={g.mes} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-slate-500 hidden sm:block">
                    {(g.valor / 1000).toFixed(1)}k
                  </span>
                  <div className="w-full relative" style={{ height: `${(g.valor / maxValor) * 120}px`, minHeight: '8px' }}>
                    <div
                      className="w-full rounded-t-xl absolute bottom-0 transition-all"
                      style={{
                        height: '100%',
                        background: i === graficoMock.length - 1
                          ? 'linear-gradient(to top, #4f46e5, #818cf8)'
                          : 'linear-gradient(to top, #c7d2fe, #e0e7ff)',
                      }}
                    />
                  </div>
                  <span className="text-xs text-slate-500">{g.mes}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Por regime */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h2 className="font-semibold text-slate-900 mb-4">Por Regime Tributário</h2>
            <div className="space-y-4">
              {faturamentoPorRegime.map(r => (
                <div key={r.regime}>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-sm font-medium ${REGIME_CONFIG[r.regime].color}`}>
                      {REGIME_CONFIG[r.regime].label}
                    </span>
                    <span className="text-xs text-slate-500">{r.qtd} nota{r.qtd !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className={`h-2 rounded-full ${REGIME_CONFIG[r.regime].bg}`}
                      style={{ width: `${maxRegime > 0 ? (r.valor / maxRegime) * 100 : 0}%` }} />
                  </div>
                  <p className="text-xs text-slate-600 mt-1 font-medium">
                    R$ {r.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Últimas notas */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="px-4 lg:px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Últimas notas emitidas</h2>
            <Link href="/notas" className="text-sm text-indigo-600 hover:underline">Ver todas</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {ultimasNotas.map(nota => (
              <div key={nota.id} className="px-4 lg:px-6 py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${REGIME_CONFIG[nota.regime]?.bg || 'bg-indigo-500'}`}>
                    <span className="text-white text-xs font-bold">NF</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{nota.tomador}</p>
                    <p className="text-xs text-slate-400">No. {nota.numero} · {formatData(nota.data)} · {REGIME_CONFIG[nota.regime]?.label}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${nota.pago ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {nota.pago ? 'Pago' : 'Pendente'}
                  </span>
                  <span className="text-sm font-semibold text-slate-900">
                    R$ {nota.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 lg:px-6 py-3 border-t border-slate-100 flex justify-between items-center">
            <span className="text-xs text-slate-400">
              Total: R$ {ultimasNotas.reduce((a, n) => a + n.valor, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            <Link href="/notas" className="text-sm text-indigo-600 hover:underline">Ver todas as notas</Link>
          </div>
        </div>

      </main>

      {/* Nav mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around py-2 z-10">
        {[
          { label: 'Início', href: '/dashboard' },
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