'use client';

import { useState } from 'react';
import Link from 'next/link';

const notasMock = [
  { id: '1', numero: '000001', data: '19/02/2026', tomador: 'Empresa Alpha Ltda', servico: '17.06', valor: 1500.00, status: 'EMITIDA' },
  { id: '2', numero: '000002', data: '19/02/2026', tomador: 'Beta Consultoria ME', servico: '17.01', valor: 3200.00, status: 'EMITIDA' },
  { id: '3', numero: '000003', data: '18/02/2026', tomador: 'Gama Tecnologia SA', servico: '17.06', valor: 800.00, status: 'REJEITADA' },
  { id: '4', numero: '000004', data: '17/02/2026', tomador: 'Delta Saude Ltda', servico: '4.03', valor: 5000.00, status: 'CANCELADA' },
  { id: '5', numero: '000005', data: '17/02/2026', tomador: 'Epsilon Adv Associados', servico: '17.14', valor: 2100.00, status: 'EMITIDA' },
];

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  EMITIDA:   { label: 'Emitida',    color: 'bg-green-100 text-green-700' },
  REJEITADA: { label: 'Rejeitada',  color: 'bg-red-100 text-red-700' },
  CANCELADA: { label: 'Cancelada',  color: 'bg-slate-100 text-slate-500 line-through' },
  RASCUNHO:  { label: 'Rascunho',   color: 'bg-slate-100 text-slate-600' },
  PROCESSANDO:{ label: 'Processando', color: 'bg-yellow-100 text-yellow-700' },
};

export default function NotasPage() {
  const [filtroStatus, setFiltroStatus] = useState('TODAS');
  const [busca, setBusca] = useState('');
  const [notaSelecionada, setNotaSelecionada] = useState<typeof notasMock[0] | null>(null);

  const notasFiltradas = notasMock.filter(n => {
    const matchStatus = filtroStatus === 'TODAS' || n.status === filtroStatus;
    const matchBusca = n.tomador.toLowerCase().includes(busca.toLowerCase()) || n.numero.includes(busca);
    return matchStatus && matchBusca;
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <header className="bg-white border-b border-slate-200 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-slate-500 hover:text-slate-700 text-sm">← Voltar</Link>
          <h1 className="font-bold text-slate-900">Notas Emitidas</h1>
        </div>
        <Link href="/notas/nova"
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors">
          + Nova Nota
        </Link>
      </header>

      {/* Filtros */}
      <div className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="max-w-4xl mx-auto space-y-3">
          <input
            type="text"
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Buscar por tomador ou número da nota..."
            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex gap-2 overflow-x-auto pb-1">
            {['TODAS', 'EMITIDA', 'REJEITADA', 'CANCELADA', 'RASCUNHO'].map(s => (
              <button key={s} onClick={() => setFiltroStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  filtroStatus === s ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}>
                {s === 'TODAS' ? 'Todas' : STATUS_CONFIG[s]?.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">

        {notasFiltradas.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
            <p className="text-4xl mb-3">📄</p>
            <p className="font-medium text-slate-900 mb-1">Nenhuma nota encontrada</p>
            <p className="text-slate-500 text-sm mb-4">Tente outro filtro ou emita sua primeira nota</p>
            <Link href="/notas/nova"
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors">
              Emitir nota
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {notasFiltradas.map(nota => (
              <div key={nota.id}
                onClick={() => setNotaSelecionada(notaSelecionada?.id === nota.id ? null : nota)}
                className="bg-white rounded-2xl border border-slate-100 px-4 py-4 cursor-pointer hover:border-indigo-200 hover:shadow-sm transition-all">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-indigo-600 text-xs font-bold">NF</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900 truncate">{nota.tomador}</p>
                      <p className="text-xs text-slate-400">Nº {nota.numero} · {nota.data} · Serv. {nota.servico}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${STATUS_CONFIG[nota.status]?.color}`}>
                      {STATUS_CONFIG[nota.status]?.label}
                    </span>
                    <span className="font-semibold text-slate-900 text-sm">
                      R$ {nota.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Detalhe expandido */}
                {notaSelecionada?.id === nota.id && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-slate-400 text-xs">Tomador</p>
                        <p className="font-medium text-slate-900">{nota.tomador}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs">Número NFS-e</p>
                        <p className="font-medium text-slate-900">{nota.numero}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs">Valor bruto</p>
                        <p className="font-medium text-slate-900">R$ {nota.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs">Data emissão</p>
                        <p className="font-medium text-slate-900">{nota.data}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button className="flex-1 border border-slate-200 text-slate-700 text-xs font-medium py-2 rounded-xl hover:bg-slate-50 transition-colors">
                        📄 Ver PDF
                      </button>
                      <button className="flex-1 border border-slate-200 text-slate-700 text-xs font-medium py-2 rounded-xl hover:bg-slate-50 transition-colors">
                        ✉️ Reenviar e-mail
                      </button>
                      {nota.status === 'EMITIDA' && (
                        <button className="flex-1 border border-red-200 text-red-600 text-xs font-medium py-2 rounded-xl hover:bg-red-50 transition-colors">
                          ✕ Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Totalizador */}
        {notasFiltradas.length > 0 && (
          <div className="mt-4 bg-white rounded-2xl border border-slate-100 px-4 py-3 flex justify-between items-center">
            <span className="text-sm text-slate-500">{notasFiltradas.length} nota{notasFiltradas.length > 1 ? 's' : ''}</span>
            <span className="font-semibold text-slate-900 text-sm">
              Total: R$ {notasFiltradas.reduce((acc, n) => acc + n.valor, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        )}
      </div>

      {/* Nav mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around py-2 z-10">
        {[
          { label: 'Início', href: '/dashboard' },
          { label: 'Nova Nota', href: '/notas/nova' },
          { label: 'Notas', href: '/notas' },
          { label: 'Config', href: '/empresas/configuracao' },
        ].map(item => (
          <Link key={item.href} href={item.href} className="flex flex-col items-center text-xs text-slate-500 hover:text-indigo-600 py-1 px-3">
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}