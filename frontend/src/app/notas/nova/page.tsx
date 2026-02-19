'use client';

import { useState } from 'react';
import Link from 'next/link';

const steps = ['Tomador', 'Serviço', 'Valores', 'Revisão'];

export default function NovaNotaPage() {
  const [step, setStep] = useState(0);
  const [buscando, setBuscando] = useState(false);
  const [tomadorEncontrado, setTomadorEncontrado] = useState(false);
  const [form, setForm] = useState({
    cnpj: '', razaoSocial: '', email: '', endereco: '',
    descricao: '', codigoServico: '',
    valor: '', aliquotaIss: '2',
  });

  const update = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const formatCnpj = (v: string) => {
    const n = v.replace(/\D/g, '').slice(0, 14);
    return n.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
            .replace(/^(\d{2})(\d{3})(\d{3})(\d{4})$/, '$1.$2.$3/$4')
            .replace(/^(\d{2})(\d{3})(\d{3})$/, '$1.$2.$3')
            .replace(/^(\d{2})(\d{3})$/, '$1.$2')
            .replace(/^(\d{2})$/, '$1');
  };

  const buscarCnpj = async () => {
    const cnpjLimpo = form.cnpj.replace(/\D/g, '');
    if (cnpjLimpo.length !== 14) return alert('CNPJ deve ter 14 dígitos');
    setBuscando(true);
    setTomadorEncontrado(false);
    try {
      const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`);
      if (!res.ok) throw new Error('CNPJ não encontrado');
      const data = await res.json();
      setForm(prev => ({
        ...prev,
        razaoSocial: data.razao_social || '',
        email: prev.email,
        endereco: `${data.logradouro || ''}, ${data.numero || ''} — ${data.municipio || ''}/${data.uf || ''}`,
      }));
      setTomadorEncontrado(true);
    } catch {
      alert('CNPJ não encontrado na base da Receita Federal. Preencha os dados manualmente.');
    } finally {
      setBuscando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <header className="bg-white border-b border-slate-200 px-4 py-4 flex items-center gap-3">
        <Link href="/dashboard" className="text-slate-500 hover:text-slate-700 text-sm">← Voltar</Link>
        <h1 className="font-bold text-slate-900">Nova NFS-e</h1>
      </header>

      {/* Stepper */}
      <div className="bg-white border-b border-slate-200 px-4 py-4">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                i < step ? 'bg-green-500 text-white' :
                i === step ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-xs hidden sm:block ${i === step ? 'text-indigo-600 font-medium' : 'text-slate-400'}`}>{s}</span>
              {i < steps.length - 1 && <div className={`w-4 sm:w-10 h-px mx-1 ${i < step ? 'bg-green-400' : 'bg-slate-200'}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">

        {/* Passo 1 — Tomador */}
        {step === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
            <h2 className="font-semibold text-slate-900">Dados do Tomador</h2>

            {/* CNPJ + Buscar */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">CNPJ / CPF</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.cnpj}
                  onChange={e => { update('cnpj', formatCnpj(e.target.value)); setTomadorEncontrado(false); }}
                  placeholder="00.000.000/0001-00"
                  className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={buscarCnpj}
                  disabled={buscando}
                  className="px-4 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition-colors whitespace-nowrap"
                >
                  {buscando ? '...' : 'Buscar'}
                </button>
              </div>
            </div>

            {/* Badge de sucesso */}
            {tomadorEncontrado && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2">
                <span className="text-green-600 text-sm">✅ Dados encontrados na Receita Federal</span>
              </div>
            )}

            {/* Razão Social */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Razão Social / Nome</label>
              <input
                type="text"
                value={form.razaoSocial}
                onChange={e => update('razaoSocial', e.target.value)}
                placeholder="Empresa Ltda"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Endereço (readonly se veio da API) */}
            {form.endereco && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Endereço</label>
                <input
                  type="text"
                  value={form.endereco}
                  onChange={e => update('endereco', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">E-mail para envio da nota</label>
              <input
                type="email"
                value={form.email}
                onChange={e => update('email', e.target.value)}
                placeholder="financeiro@empresa.com.br"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}

        {/* Passo 2 — Serviço */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
            <h2 className="font-semibold text-slate-900">Descrição do Serviço</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Código do Serviço (LC 116)</label>
              <input
                type="text"
                value={form.codigoServico}
                onChange={e => update('codigoServico', e.target.value)}
                placeholder="Ex: 17.06"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Descrição do Serviço</label>
              <textarea
                value={form.descricao}
                onChange={e => update('descricao', e.target.value)}
                placeholder="Descreva o serviço prestado..."
                rows={4}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>
          </div>
        )}

        {/* Passo 3 — Valores */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
            <h2 className="font-semibold text-slate-900">Valores</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Valor do Serviço (R$)</label>
              <input
                type="number"
                value={form.valor}
                onChange={e => update('valor', e.target.value)}
                placeholder="0,00"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Alíquota ISS (%)</label>
              <select
                value={form.aliquotaIss}
                onChange={e => update('aliquotaIss', e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {['2', '2.5', '3', '4', '5'].map(v => <option key={v} value={v}>{v}%</option>)}
              </select>
            </div>
            {form.valor && (
              <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Valor do serviço</span>
                  <span className="font-medium">R$ {Number(form.valor).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">ISS ({form.aliquotaIss}%)</span>
                  <span className="font-medium text-orange-600">R$ {(Number(form.valor) * Number(form.aliquotaIss) / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-slate-200 pt-2">
                  <span className="font-semibold text-slate-900">Valor líquido</span>
                  <span className="font-bold text-green-600">R$ {(Number(form.valor) - Number(form.valor) * Number(form.aliquotaIss) / 100).toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Passo 4 — Revisão */}
        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
            <h2 className="font-semibold text-slate-900">Revisar e Emitir</h2>
            <div className="space-y-3">
              {[
                { label: 'Tomador', value: form.razaoSocial || '—' },
                { label: 'CNPJ/CPF', value: form.cnpj || '—' },
                { label: 'Endereço', value: form.endereco || '—' },
                { label: 'E-mail', value: form.email || '—' },
                { label: 'Serviço', value: form.codigoServico || '—' },
                { label: 'Descrição', value: form.descricao || '—' },
                { label: 'Valor', value: form.valor ? `R$ ${Number(form.valor).toFixed(2)}` : '—' },
                { label: 'ISS', value: `${form.aliquotaIss}%` },
              ].map(item => (
                <div key={item.label} className="flex justify-between py-2 border-b border-slate-100 last:border-0">
                  <span className="text-sm text-slate-500">{item.label}</span>
                  <span className="text-sm font-medium text-slate-900 text-right max-w-xs truncate">{item.value}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => alert('Em breve: integração com a prefeitura!')}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl transition-colors mt-4"
            >
              🚀 Emitir NFS-e
            </button>
          </div>
        )}

        {/* Navegação */}
        <div className="flex gap-3 mt-6">
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} className="flex-1 border border-slate-200 text-slate-700 font-semibold py-3 rounded-xl text-sm hover:bg-slate-50 transition-colors">
              ← Anterior