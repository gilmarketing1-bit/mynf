'use client';

import { useState } from 'react';
import Link from 'next/link';

// ── DADOS MOCK ───────────────────────────────────────────────────────────────
const notasMock = [
  { id: '1', numero: '000001', data: '2026-02-19', tomador: 'Empresa Alpha Ltda', servico: '17.06', valor: 1500.00, status: 'EMITIDA', regime: 'SIMPLES', pago: true, formaPagamento: 'PIX' },
  { id: '2', numero: '000002', data: '2026-02-19', tomador: 'Beta Consultoria ME', servico: '17.01', valor: 3200.00, status: 'EMITIDA', regime: 'PRESUMIDO', pago: false, formaPagamento: 'BOLETO' },
  { id: '3', numero: '000003', data: '2026-02-18', tomador: 'Gama Tecnologia SA', servico: '17.06', valor: 800.00, status: 'REJEITADA', regime: 'REAL', pago: false, formaPagamento: null },
  { id: '4', numero: '000004', data: '2026-02-17', tomador: 'Delta Saude Ltda', servico: '4.03', valor: 5000.00, status: 'CANCELADA', regime: 'SIMPLES', pago: false, formaPagamento: null },
  { id: '5', numero: '000005', data: '2026-02-17', tomador: 'Epsilon Adv Associados', servico: '17.14', valor: 2100.00, status: 'EMITIDA', regime: 'PRESUMIDO', pago: true, formaPagamento: 'PIX' },
  { id: '6', numero: '000006', data: '2026-02-16', tomador: 'Zeta Engenharia Ltda', servico: '7.01', valor: 8500.00, status: 'EMITIDA', regime: 'REAL', pago: false, formaPagamento: 'BOLETO' },
  { id: '7', numero: '000007', data: '2026-02-15', tomador: 'Eta Clinica ME', servico: '4.01', valor: 1200.00, status: 'EMITIDA', regime: 'SIMPLES', pago: true, formaPagamento: 'CARTAO' },
];

const historicoMock = [
  { mes: 'Set/25', faturado: 4200, recebido: 4200, cancelado: 0, notas: 8 },
  { mes: 'Out/25', faturado: 6800, recebido: 5900, cancelado: 900, notas: 12 },
  { mes: 'Nov/25', faturado: 5100, recebido: 5100, cancelado: 0, notas: 9 },
  { mes: 'Dez/25', faturado: 9200, recebido: 7800, cancelado: 1400, notas: 17 },
  { mes: 'Jan/26', faturado: 7400, recebido: 6200, cancelado: 1200, notas: 14 },
  { mes: 'Fev/26', faturado: 16500, recebido: 4800, cancelado: 800, notas: 21 },
];

const clientesMock = [
  { nome: 'Empresa Alpha Ltda', regime: 'SIMPLES', ativo: true, totalMes: 1500, totalAno: 18000, notas: 12, ultimaNota: '2026-02-19', pago: true },
  { nome: 'Beta Consultoria ME', regime: 'PRESUMIDO', ativo: true, totalMes: 3200, totalAno: 38400, notas: 8, ultimaNota: '2026-02-19', pago: false },
  { nome: 'Gama Tecnologia SA', regime: 'REAL', ativo: true, totalMes: 800, totalAno: 9600, notas: 5, ultimaNota: '2026-02-18', pago: false },
  { nome: 'Delta Saude Ltda', regime: 'SIMPLES', ativo: false, totalMes: 0, totalAno: 5000, notas: 2, ultimaNota: '2026-01-10', pago: false },
  { nome: 'Epsilon Adv Associados', regime: 'PRESUMIDO', ativo: true, totalMes: 2100, totalAno: 25200, notas: 10, ultimaNota: '2026-02-17', pago: true },
  { nome: 'Zeta Engenharia Ltda', regime: 'REAL', ativo: true, totalMes: 8500, totalAno: 102000, notas: 15, ultimaNota: '2026-02-16', pago: false },
  { nome: 'Theta Comercio Ltda', regime: 'SIMPLES', ativo: false, totalMes: 0, totalAno: 2400, notas: 1, ultimaNota: '2025-12-05', pago: false },
];

const REGIME_CONFIG: Record<string, { label: string; color: string; bg: string; light: string }> = {
  SIMPLES:  { label: 'Simples Nacional', color: 'text-indigo-700', bg: 'bg-indigo-500', light: 'bg-indigo-100' },
  PRESUMIDO:{ label: 'Lucro Presumido',  color: 'text-violet-700', bg: 'bg-violet-500', light: 'bg-violet-100' },
  REAL:     { label: 'Lucro Real',       color: 'text-cyan-700',   bg: 'bg-cyan-500',   light: 'bg-cyan-100' },
};

const PAGAMENTO_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  PIX:    { label: 'PIX',    color: 'text-emerald-700', bg: 'bg-emerald-500' },
  BOLETO: { label: 'Boleto', color: 'text-amber-700',   bg: 'bg-amber-500' },
  CARTAO: { label: 'Cartão', color: 'text-violet-700',  bg: 'bg-violet-500' },
};

function formatBRL(v: number) {
  return v.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

function BarraHorizontal({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="w-full bg-slate-100 rounded-full h-2 mt-1">
      <div className={`h-2 rounded-full transition-all ${color}`} style={{ width: `${Math.min(pct, 100)}%` }} />
    </div>
  );
}

type Aba = 'visaogeral' | 'clientes' | 'pagamentos' | 'regime';

export default function RelatoriosPage() {
  const [aba, setAba] = useState<Aba>('visaogeral');
  const [periodo, setPeriodo] = useState('mes');

  const emitidas = notasMock.filter(n => n.status === 'EMITIDA');
  const totalFaturado = emitidas.reduce((a, n) => a + n.valor, 0);
  const totalRecebido = emitidas.filter(n => n.pago).reduce((a, n) => a + n.valor, 0);
  const totalPendente = totalFaturado - totalRecebido;
  const ticketMedio = emitidas.length > 0 ? totalFaturado / emitidas.length : 0;
  const taxaRecebimento = totalFaturado > 0 ? (totalRecebido / totalFaturado) * 100 : 0;

  // Por forma de pagamento
  const formas = ['PIX', 'BOLETO', 'CARTAO'];
  const porForma = formas.map(f => ({
    forma: f,
    valor: emitidas.filter(n => n.formaPagamento === f).reduce((a, n) => a + n.valor, 0),
    qtd: emitidas.filter(n => n.formaPagamento === f).length,
    recebido: emitidas.filter(n => n.formaPagamento === f && n.pago).reduce((a, n) => a + n.valor, 0),
  }));
  const maxForma = Math.max(...porForma.map(f => f.valor), 1);

  // Por regime
  const regimes = ['SIMPLES', 'PRESUMIDO', 'REAL'];
  const porRegime = regimes.map(r => ({
    regime: r,
    valor: emitidas.filter(n => n.regime === r).reduce((a, n) => a + n.valor, 0),
    qtd: emitidas.filter(n => n.regime === r).length,
    recebido: emitidas.filter(n => n.regime === r && n.pago).reduce((a, n) => a + n.valor, 0),
  }));
  const maxRegime = Math.max(...porRegime.map(r => r.valor), 1);

  // Clientes
  const clientesAtivos = clientesMock.filter(c => c.ativo);
  const clientesInativos = clientesMock.filter(c => !c.ativo);
  const semFaturamento = clientesAtivos.filter(c => c.totalMes === 0);
  const maxClienteValor = Math.max(...clientesMock.map(c => c.totalAno), 1);

  // Historico max
  const maxHist = Math.max(...historicoMock.map(h => h.faturado), 1);

  const abas: { key: Aba; label: string }[] = [
    { key: 'visaogeral', label: 'Visão Geral' },
    { key: 'clientes',   label: 'Clientes' },
    { key: 'pagamentos', label: 'Formas de Pagamento' },
    { key: 'regime',     label: 'Regime Tributário' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <header className="bg-white border-b border-slate-200 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-slate-500 hover:text-slate-700 text-sm">← Voltar</Link>
          <h1 className="font-bold text-slate-900">Relatórios & BI</h1>
        </div>
        <select value={periodo} onChange={e => setPeriodo(e.target.value)}
          className="px-3 py-1.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="mes">Fevereiro 2026</option>
          <option value="trimestre">Último trimestre</option>
          <option value="ano">2026</option>
        </select>
      </header>

      {/* Abas */}
      <div className="bg-white border-b border-slate-200 px-4">
        <div className="max-w-6xl mx-auto flex gap-1 overflow-x-auto">
          {abas.map(a => (
            <button key={a.key} onClick={() => setAba(a.key)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                aba === a.key ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}>
              {a.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* ── VISÃO GERAL ─────────────────────────────────────────── */}
        {aba === 'visaogeral' && (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Faturado', value: `R$ ${formatBRL(totalFaturado)}`, sub: `${emitidas.length} notas emitidas`, color: 'from-indigo-500 to-indigo-600' },
                { label: 'Total Recebido', value: `R$ ${formatBRL(totalRecebido)}`, sub: `${taxaRecebimento.toFixed(0)}% de taxa de recebimento`, color: 'from-emerald-500 to-emerald-600' },
                { label: 'A Receber', value: `R$ ${formatBRL(totalPendente)}`, sub: 'Pendente de pagamento', color: 'from-amber-500 to-orange-500' },
                { label: 'Ticket Médio', value: `R$ ${formatBRL(ticketMedio)}`, sub: 'Por nota emitida', color: 'from-violet-500 to-violet-600' },
              ].map(k => (
                <div key={k.label} className={`bg-gradient-to-br ${k.color} rounded-2xl p-4 lg:p-5 text-white`}>
                  <p className="text-white/70 text-xs mb-2">{k.label}</p>
                  <p className="text-xl lg:text-2xl font-bold">{k.value}</p>
                  <p className="text-white/70 text-xs mt-1">{k.sub}</p>
                </div>
              ))}
            </div>

            {/* Gráfico histórico */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <h2 className="font-semibold text-slate-900 mb-2">Histórico — Faturado vs Recebido</h2>
              <p className="text-xs text-slate-400 mb-4">Últimos 6 meses</p>
              <div className="space-y-3">
                {historicoMock.map(h => (
                  <div key={h.mes}>
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span className="font-medium text-slate-700">{h.mes}</span>
                      <span>{h.notas} notas · R$ {formatBRL(h.faturado)}</span>
                    </div>
                    <div className="relative h-5 bg-slate-100 rounded-lg overflow-hidden">
                      <div className="absolute left-0 top-0 h-full bg-indigo-200 rounded-lg"
                        style={{ width: `${(h.faturado / maxHist) * 100}%` }} />
                      <div className="absolute left-0 top-0 h-full bg-emerald-500 rounded-lg"
                        style={{ width: `${(h.recebido / maxHist) * 100}%` }} />
                    </div>
                    {h.cancelado > 0 && (
                      <p className="text-xs text-red-400 mt-0.5">R$ {formatBRL(h.cancelado)} cancelado</p>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-indigo-200" />
                  <span className="text-xs text-slate-500">Faturado</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs text-slate-500">Recebido</span>
                </div>
              </div>
            </div>

            {/* Taxa recebimento + MRR */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                <h2 className="font-semibold text-slate-900 mb-4">Taxa de Recebimento</h2>
                <div className="flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#e2e8f0" strokeWidth="12" />
                      <circle cx="60" cy="60" r="50" fill="none" stroke="#10b981" strokeWidth="12"
                        strokeDasharray={`${taxaRecebimento * 3.14} 314`}
                        strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-slate-900">{taxaRecebimento.toFixed(0)}%</span>
                      <span className="text-xs text-slate-400">recebido</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="bg-emerald-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-emerald-600">Recebido</p>
                    <p className="font-bold text-emerald-700">R$ {formatBRL(totalRecebido)}</p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-amber-600">Pendente</p>
                    <p className="font-bold text-amber-700">R$ {formatBRL(totalPendente)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                <h2 className="font-semibold text-slate-900 mb-1">Projeção Anual</h2>
                <p className="text-xs text-slate-400 mb-4">Baseado no faturamento médio mensal</p>
                {(() => {
                  const mediaMensal = historicoMock.reduce((a, h) => a + h.faturado, 0) / historicoMock.length;
                  const projecao = mediaMensal * 12;
                  const melhorMes = historicoMock.reduce((a, h) => h.faturado > a.faturado ? h : a);
                  return (
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-slate-500">Média mensal</p>
                        <p className="text-2xl font-bold text-slate-900">R$ {formatBRL(mediaMensal)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Projeção 12 meses</p>
                        <p className="text-2xl font-bold text-indigo-600">R$ {formatBRL(projecao)}</p>
                      </div>
                      <div className="bg-indigo-50 rounded-xl p-3">
                        <p className="text-xs text-indigo-600">Melhor mês: <strong>{melhorMes.mes}</strong> — R$ {formatBRL(melhorMes.faturado)}</p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </>
        )}

        {/* ── CLIENTES ────────────────────────────────────────────── */}
        {aba === 'clientes' && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Clientes ativos', value: clientesAtivos.length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: 'Clientes inativos', value: clientesInativos.length, color: 'text-slate-500', bg: 'bg-slate-50' },
                { label: 'Sem nota no mês', value: semFaturamento.length, color: 'text-amber-600', bg: 'bg-amber-50' },
                { label: 'Total de clientes', value: clientesMock.length, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              ].map(k => (
                <div key={k.label} className={`${k.bg} rounded-2xl p-4 border border-slate-100`}>
                  <p className="text-slate-500 text-xs mb-2">{k.label}</p>
                  <p className={`text-3xl font-bold ${k.color}`}>{k.value}</p>
                </div>
              ))}
            </div>

            {semFaturamento.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <p className="text-amber-800 font-medium text-sm mb-2">Clientes ativos sem faturamento este mês</p>
                <div className="space-y-1">
                  {semFaturamento.map(c => (
                    <div key={c.nome} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                      <span className="text-sm text-amber-700">{c.nome} — última nota: {c.ultimaNota}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h2 className="font-semibold text-slate-900">Ranking de Clientes — Ano</h2>
              </div>
              <div className="divide-y divide-slate-100">
                {[...clientesMock].sort((a, b) => b.totalAno - a.totalAno).map((c, i) => (
                  <div key={c.nome} className="px-5 py-4">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          i === 0 ? 'bg-yellow-100 text-yellow-700' :
                          i === 1 ? 'bg-slate-100 text-slate-600' :
                          i === 2 ? 'bg-orange-100 text-orange-600' : 'bg-slate-50 text-slate-400'
                        }`}>{i + 1}</span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">{c.nome}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-xs px-1.5 py-0.5 rounded ${REGIME_CONFIG[c.regime].light} ${REGIME_CONFIG[c.regime].color}`}>
                              {REGIME_CONFIG[c.regime].label}
                            </span>
                            <span className={`text-xs ${c.ativo ? 'text-emerald-600' : 'text-slate-400'}`}>
                              {c.ativo ? 'Ativo' : 'Inativo'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-slate-900">R$ {formatBRL(c.totalAno)}</p>
                        <p className="text-xs text-slate-400">{c.notas} notas</p>
                      </div>
                    </div>
                    <BarraHorizontal pct={(c.totalAno / maxClienteValor) * 100} color={REGIME_CONFIG[c.regime].bg} />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── PAGAMENTOS ──────────────────────────────────────────── */}
        {aba === 'pagamentos' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {porForma.map(f => (
                <div key={f.forma} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${PAGAMENTO_CONFIG[f.forma].color} bg-opacity-10`}>
                      {PAGAMENTO_CONFIG[f.forma].label}
                    </span>
                    <span className="text-xs text-slate-400">{f.qtd} nota{f.qtd !== 1 ? 's' : ''}</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 mb-1">R$ {formatBRL(f.valor)}</p>
                  <p className="text-xs text-slate-400 mb-3">
                    {f.valor > 0 ? ((f.valor / totalFaturado) * 100).toFixed(0) : 0}% do total faturado
                  </p>
                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <div className={`h-2.5 rounded-full ${PAGAMENTO_CONFIG[f.forma].bg}`}
                      style={{ width: `${maxForma > 0 ? (f.valor / maxForma) * 100 : 0}%` }} />
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-xs">
                    <span className="text-emerald-600">Recebido: R$ {formatBRL(f.recebido)}</span>
                    <span className="text-amber-600">Pendente: R$ {formatBRL(f.valor - f.recebido)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <h2 className="font-semibold text-slate-900 mb-4">Distribuição por Forma de Pagamento</h2>
              <div className="flex items-end gap-4 h-40">
                {porForma.map(f => (
                  <div key={f.forma} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs text-slate-500">{formatBRL(f.valor / 1000)}k</span>
                    <div className="w-full relative" style={{ height: `${maxForma > 0 ? (f.valor / maxForma) * 130 : 8}px`, minHeight: '8px' }}>
                      <div className={`w-full h-full rounded-t-xl ${PAGAMENTO_CONFIG[f.forma].bg} opacity-80`} />
                    </div>
                    <span className="text-xs font-medium text-slate-600">{PAGAMENTO_CONFIG[f.forma].label}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── REGIME TRIBUTÁRIO ───────────────────────────────────── */}
        {aba === 'regime' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {porRegime.map(r => (
                <div key={r.regime} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                  <div className={`inline-flex px-2 py-1 rounded-lg text-xs font-semibold mb-3 ${REGIME_CONFIG[r.regime].light} ${REGIME_CONFIG[r.regime].color}`}>
                    {REGIME_CONFIG[r.regime].label}
                  </div>
                  <p className="text-2xl font-bold text-slate-900 mb-1">R$ {formatBRL(r.valor)}</p>
                  <p className="text-xs text-slate-400 mb-3">
                    {r.qtd} nota{r.qtd !== 1 ? 's' : ''} · {r.valor > 0 ? ((r.valor / totalFaturado) * 100).toFixed(0) : 0}% do total
                  </p>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 mb-3">
                    <div className={`h-2.5 rounded-full ${REGIME_CONFIG[r.regime].bg}`}
                      style={{ width: `${maxRegime > 0 ? (r.valor / maxRegime) * 100 : 0}%` }} />
                  </div>
                  <div className="pt-3 border-t border-slate-100 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-emerald-600">Recebido</span>
                      <span className="font-medium text-emerald-600">R$ {formatBRL(r.recebido)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-amber-600">Pendente</span>
                      <span className="font-medium text-amber-600">R$ {formatBRL(r.valor - r.recebido)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">ISS estimado (2%)</span>
                      <span className="font-medium text-slate-600">R$ {formatBRL(r.valor * 0.02)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
              <h2 className="font-semibold text-slate-900 mb-4">Clientes por Regime</h2>
              <div className="space-y-3">
                {regimes.map(r => {
                  const clientes = clientesMock.filter(c => c.regime === r);
                  return (
                    <div key={r} className="flex items-center gap-4">
                      <span className={`text-xs font-medium w-36 flex-shrink-0 ${REGIME_CONFIG[r].color}`}>
                        {REGIME_CONFIG[r].label}
                      </span>
                      <div className="flex-1">
                        <div className="flex gap-1">
                          {clientes.map(c => (
                            <div key={c.nome} title={c.nome}
                              className={`h-8 rounded-lg flex-1 flex items-center justify-center ${REGIME_CONFIG[r].bg} ${c.ativo ? 'opacity-100' : 'opacity-30'}`}>
                              <span className="text-white text-xs font-bold truncate px-1">
                                {c.nome.split(' ')[0]}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 flex-shrink-0">{clientes.length} cliente{clientes.length !== 1 ? 's' : ''}</span>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-slate-400 mt-3">Opacidade reduzida = cliente inativo</p>
            </div>
          </>
        )}

      </div>

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