'use client';

import { useState } from 'react';
import Link from 'next/link';

const steps = ['CNPJ', 'Fiscal', 'RPS', 'Certificado', 'Serviços'];

export default function ConfiguracaoEmpresaPage() {
  const [step, setStep] = useState(0);
  const [buscando, setBuscando] = useState(false);
  const [form, setForm] = useState({
    // Passo 1
    cnpj: '', razaoSocial: '', nomeFantasia: '', email: '', telefone: '',
    logradouro: '', numero: '', complemento: '', bairro: '', cep: '', municipio: '', uf: '',
    situacao: '', ativa: true,
    // Passo 2
    regimeTributario: '', inscricaoMunicipal: '', aliquotaIss: '2',
    // Passo 3
    rpsSerieAtual: '1', rpsNumeroAtual: '0', ultimaNfse: '0',
    // Passo 4
    certificadoNome: '', certificadoSenha: '', certificadoValidade: '',
    // Passo 5
    servicoPrincipalCodigo: '', servicoPrincipalDescricao: '',
  });

  const update = (field: string, value: string | boolean) =>
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
    try {
      const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`);
      if (!res.ok) throw new Error('não encontrado');
      const data = await res.json();
      const situacao = (data.descricao_situacao_cadastral || '').toUpperCase();
      setForm(prev => ({
        ...prev,
        razaoSocial: data.razao_social || '',
        nomeFantasia: data.nome_fantasia || '',
        email: data.email || '',
        telefone: data.ddd_telefone_1 || '',
        logradouro: [data.descricao_tipo_logradouro, data.logradouro].filter(Boolean).join(' '),
        numero: data.numero || '',
        complemento: data.complemento || '',
        bairro: data.bairro || '',
        cep: (data.cep || '').replace(/^(\d{5})(\d{3})$/, '$1-$2'),
        municipio: data.municipio || '',
        uf: data.uf || '',
        situacao,
        ativa: situacao === 'ATIVA',
        regimeTributario: data.qualificacao_do_responsavel || '',
      }));
    } catch {
      alert('CNPJ não encontrado. Preencha os dados manualmente.');
    } finally {
      setBuscando(false);
    }
  };

  const inputClass = "w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";
  const inputFilledClass = "w-full px-4 py-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1";

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <header className="bg-white border-b border-slate-200 px-4 py-4 flex items-center gap-3">
        <Link href="/dashboard" className="text-slate-500 hover:text-slate-700 text-sm">← Voltar</Link>
        <h1 className="font-bold text-slate-900">Configuração da Empresa</h1>
      </header>

      {/* Stepper */}
      <div className="bg-white border-b border-slate-200 px-4 py-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                i < step ? 'bg-green-500 text-white' :
                i === step ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-xs hidden sm:block ${i === step ? 'text-indigo-600 font-medium' : 'text-slate-400'}`}>{s}</span>
              {i < steps.length - 1 && <div className={`w-4 sm:w-8 h-px mx-1 ${i < step ? 'bg-green-400' : 'bg-slate-200'}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Passo 1 — CNPJ */}
        {step === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
            <h2 className="font-semibold text-slate-900">Dados da Empresa Prestadora</h2>
            <p className="text-slate-500 text-sm">Esta é a empresa que vai emitir as notas fiscais.</p>

            <div>
              <label className={labelClass}>CNPJ</label>
              <div className="flex gap-2">
                <input type="text" value={form.cnpj}
                  onChange={e => update('cnpj', formatCnpj(e.target.value))}
                  placeholder="00.000.000/0001-00"
                  className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                <button onClick={buscarCnpj} disabled={buscando}
                  className="px-4 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 text-white font-semibold rounded-xl text-sm transition-colors whitespace-nowrap">
                  {buscando ? '...' : 'Buscar'}
                </button>
              </div>
            </div>

            {form.situacao && (
              form.ativa
                ? <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2">
                    <span className="text-green-700 text-sm font-medium">✅ Empresa ATIVA na Receita Federal</span>
                  </div>
                : <div className="bg-red-50 border border-red-300 rounded-xl px-4 py-3">
                    <p className="text-red-700 text-sm font-semibold">⛔ Empresa com restrição</p>
                    <p className="text-red-600 text-xs mt-1">Situação: {form.situacao}</p>
                  </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={labelClass}>Razão Social</label>
                <input type="text" value={form.razaoSocial} onChange={e => update('razaoSocial', e.target.value)}
                  placeholder="Empresa Ltda" className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Nome Fantasia</label>
                <input type="text" value={form.nomeFantasia} onChange={e => update('nomeFantasia', e.target.value)}
                  placeholder="Nome comercial" className={inputFilledClass} />
              </div>
              <div>
                <label className={labelClass}>E-mail</label>
                <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                  placeholder="contato@empresa.com.br" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Telefone</label>
                <input type="text" value={form.telefone} onChange={e => update('telefone', e.target.value)}
                  placeholder="(62) 99999-9999" className={inputFilledClass} />
              </div>
            </div>

            {form.logradouro && (
              <div className="space-y-3 pt-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Endereço</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className={labelClass}>Logradouro</label>
                    <input type="text" value={form.logradouro} onChange={e => update('logradouro', e.target.value)} className={inputFilledClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Número</label>
                    <input type="text" value={form.numero} onChange={e => update('numero', e.target.value)} className={inputFilledClass} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Complemento</label>
                  <input type="text" value={form.complemento} onChange={e => update('complemento', e.target.value)}
                    placeholder="Apto, Sala, Bloco..." className={inputFilledClass} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Bairro</label>
                    <input type="text" value={form.bairro} onChange={e => update('bairro', e.target.value)} className={inputFilledClass} />
                  </div>
                  <div>
                    <label className={labelClass}>CEP</label>
                    <input type="text" value={form.cep} onChange={e => update('cep', e.target.value)} className={inputFilledClass} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className={labelClass}>Município</label>
                    <input type="text" value={form.municipio} onChange={e => update('municipio', e.target.value)} className={inputFilledClass} />
                  </div>
                  <div>
                    <label className={labelClass}>UF</label>
                    <input type="text" value={form.uf} onChange={e => update('uf', e.target.value)} className={inputFilledClass} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Passo 2 — Fiscal */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
            <h2 className="font-semibold text-slate-900">Dados Fiscais</h2>
            <p className="text-slate-500 text-sm">Informações necessárias para a emissão de NFS-e.</p>

            <div>
              <label className={labelClass}>Regime Tributário</label>
              <select value={form.regimeTributario} onChange={e => update('regimeTributario', e.target.value)} className={inputClass}>
                <option value="">Selecione...</option>
                <option value="MEI">MEI — Microempreendedor Individual</option>
                <option value="SIMPLES">Simples Nacional</option>
                <option value="PRESUMIDO">Lucro Presumido</option>
                <option value="REAL">Lucro Real</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Inscrição Municipal</label>
              <input type="text" value={form.inscricaoMunicipal}
                onChange={e => update('inscricaoMunicipal', e.target.value)}
                placeholder="Ex: 123456-7"
                className={inputClass} />
              <p className="text-xs text-slate-400 mt-1">Número de cadastro na prefeitura — obrigatório para emitir NFS-e</p>
            </div>

            <div>
              <label className={labelClass}>Alíquota ISS padrão (%)</label>
              <select value={form.aliquotaIss} onChange={e => update('aliquotaIss', e.target.value)} className={inputClass}>
                {['2', '2.5', '3', '4', '5'].map(v => (
                  <option key={v} value={v}>{v}% {v === '2' ? '(MEI/Simples — mínimo legal)' : ''}</option>
                ))}
              </select>
              <p className="text-xs text-slate-400 mt-1">Será pré-preenchido automaticamente em cada emissão</p>
            </div>
          </div>
        )}

        {/* Passo 3 — RPS */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
            <h2 className="font-semibold text-slate-900">Sequência de RPS</h2>
            <p className="text-slate-500 text-sm">Configure a numeração para continuar de onde parou em outros sistemas.</p>

            <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3">
              <p className="text-indigo-700 text-sm font-medium">ℹ️ O que é RPS?</p>
              <p className="text-indigo-600 text-xs mt-1">Recibo Provisório de Serviços — número sequencial obrigatório que identifica cada nota emitida. A série deve ser numérica (ex: 1).</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Série RPS</label>
                <input type="text" value={form.rpsSerieAtual}
                  onChange={e => update('rpsSerieAtual', e.target.value.replace(/\D/g, ''))}
                  placeholder="1"
                  className={inputClass} />
                <p className="text-xs text-slate-400 mt-1">Somente números (obrigatório desde 01/01/2026)</p>
              </div>
              <div>
                <label className={labelClass}>Número atual do RPS</label>
                <input type="number" value={form.rpsNumeroAtual}
                  onChange={e => update('rpsNumeroAtual', e.target.value)}
                  placeholder="0"
                  className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>Número da última NFS-e emitida (outro sistema)</label>
              <input type="number" value={form.ultimaNfse}
                onChange={e => update('ultimaNfse', e.target.value)}
                placeholder="0 (se nunca emitiu)"
                className={inputClass} />
              <p className="text-xs text-slate-400 mt-1">Deixe 0 se esta é sua primeira emissão no myNF</p>
            </div>

            {form.rpsNumeroAtual && (
              <div className="bg-slate-50 rounded-xl px-4 py-3">
                <p className="text-slate-600 text-sm">Sua próxima NFS-e será a de número <span className="font-bold text-indigo-600">{Number(form.rpsNumeroAtual) + 1}</span></p>
              </div>
            )}
          </div>
        )}

        {/* Passo 4 — Certificado */}
        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
            <h2 className="font-semibold text-slate-900">Certificado Digital</h2>
            <p className="text-slate-500 text-sm">Necessário para assinar e transmitir as notas à prefeitura.</p>

            <div className="border-2 border-dashed border-indigo-200 rounded-2xl p-8 text-center hover:border-indigo-400 transition-colors cursor-pointer"
              onClick={() => document.getElementById('pfx-upload')?.click()}>
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🔐</span>
              </div>
              <p className="font-medium text-slate-700">
                {form.certificadoNome || 'Clique para selecionar o certificado .pfx'}
              </p>
              <p className="text-slate-400 text-xs mt-1">Formato A1 (.pfx) — ICP-Brasil</p>
              <input id="pfx-upload" type="file" accept=".pfx,.p12" className="hidden"
                onChange={e => update('certificadoNome', e.target.files?.[0]?.name || '')} />
            </div>

            {form.certificadoNome && (
              <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2">
                <span className="text-green-700 text-sm font-medium">✅ {form.certificadoNome}</span>
              </div>
            )}

            <div>
              <label className={labelClass}>Senha do certificado</label>
              <input type="password" value={form.certificadoSenha}
                onChange={e => update('certificadoSenha', e.target.value)}
                placeholder="••••••••"
                className={inputClass} />
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
              <p className="text-amber-700 text-xs">🔒 O certificado é criptografado com AES-256 antes de ser armazenado. A senha nunca é salva em texto plano.</p>
            </div>
          </div>
        )}

        {/* Passo 5 — Serviços */}
        {step === 4 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
            <h2 className="font-semibold text-slate-900">Serviço Principal</h2>
            <p className="text-slate-500 text-sm">Defina o serviço que você mais emite — será pré-preenchido em cada nova nota.</p>

            <div>
              <label className={labelClass}>Código do Serviço (LC 116)</label>
              <input type="text" value={form.servicoPrincipalCodigo}
                onChange={e => update('servicoPrincipalCodigo', e.target.value)}
                placeholder="Ex: 17.06 — Suporte técnico"
                className={inputClass} />
            </div>

            <div>
              <label className={labelClass}>Descrição padrão do serviço</label>
              <textarea value={form.servicoPrincipalDescricao}
                onChange={e => update('servicoPrincipalDescricao', e.target.value)}
                placeholder="Ex: Prestação de serviços de tecnologia da informação..."
                rows={3}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
              <p className="text-xs text-slate-400 mt-1">Será pré-preenchido no campo de descrição de cada nova nota</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3">
              <p className="text-green-700 text-sm font-medium">Tudo pronto!</p>
              <p className="text-green-600 text-xs mt-1">Após salvar, você poderá emitir NFS-e em menos de 60 segundos.</p>
            </div>
          </div>
        )}

        {/* Navegação */}
        <div className="flex gap-3 mt-6">
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)}
              className="flex-1 border border-slate-200 text-slate-700 font-semibold py-3 rounded-xl text-sm hover:bg-slate-50 transition-colors">
              ← Anterior
            </button>
          )}
          {step < steps.length - 1 && (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={step === 0 && form.situacao !== '' && !form.ativa}
              className="flex-1 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm transition-colors">
              Próximo →
            </button>
          )}
          {step === steps.length - 1 && (
            <button
              onClick={() => alert('Em breve: salvar configuração no banco!')}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl text-sm transition-colors">
              ✅ Salvar Configuração
            </button>
          )}
        </div>

      </div>
    </div>
  );
}