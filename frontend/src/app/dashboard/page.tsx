import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">

      {/* Topbar mobile */}
      <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">NF</span>
          </div>
          <span className="font-bold text-slate-900">myNF</span>
        </div>
        <button className="text-slate-600 text-sm font-medium">Menu</button>
      </header>

      {/* Sidebar desktop */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-screen w-64 bg-white border-r border-slate-200 flex-col">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-200">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">NF</span>
          </div>
          <span className="font-bold text-slate-900">myNF</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          {[
            { label: 'Dashboard', href: '/dashboard', active: true },
            { label: 'Emitir Nota', href: '/notas/nova', active: false },
            { label: 'Notas Emitidas', href: '/notas', active: false },
            { label: 'Clientes', href: '/clientes', active: false },
            { label: 'Relatórios', href: '/relatorios', active: false },
            { label: 'Configurações', href: '/configuracoes', active: false },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                item.active ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-slate-200">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 cursor-pointer">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-700 font-semibold text-xs">G</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">Gil</p>
              <p className="text-xs text-slate-500 truncate">gil@empresa.com.br</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="lg:ml-64 p-4 lg:p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 lg:mb-8">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-500 text-sm">Fevereiro 2026</p>
          </div>
          <Link
            href="/notas/nova"
            className="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-4 py-2 lg:px-5 lg:py-2.5 rounded-xl text-sm transition-colors"
          >
            + Nova Nota
          </Link>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5 mb-6 lg:mb-8">
          {[
            { label: 'Notas emitidas hoje', value: '0', color: 'text-slate-900' },
            { label: 'Faturamento do mês', value: 'R$ 0,00', color: 'text-slate-900' },
            { label: 'ISS recolhido', value: 'R$ 0,00', color: 'text-slate-900' },
            { label: 'Notas com erro', value: '0', color: 'text-danger-600' },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-slate-100">
              <p className="text-slate-500 text-xs lg:text-sm mb-2">{kpi.label}</p>
              <p className={`text-xl lg:text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Últimas notas */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
          <div className="px-4 lg:px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Últimas notas emitidas</h2>
            <Link href="/notas" className="text-sm text-primary-600 hover:underline">Ver todas</Link>
          </div>
          <div className="flex flex-col items-center justify-center py-12 lg:py-16 text-center px-4">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-slate-400 text-xl">📄</span>
            </div>
            <p className="text-slate-900 font-medium mb-1">Nenhuma nota emitida ainda</p>
            <p className="text-slate-500 text-sm mb-4">Comece emitindo sua primeira NFS-e</p>
            <Link
              href="/notas/nova"
              className="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-4 py-2 rounded-xl text-sm transition-colors"
            >
              Emitir primeira nota
            </Link>
          </div>
        </div>

        {/* Nav mobile bottom */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around py-2 z-10">
          {[
            { label: 'Início', href: '/dashboard' },
            { label: 'Nova Nota', href: '/notas/nova' },
            { label: 'Notas', href: '/notas' },
            { label: 'Config', href: '/configuracoes' },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="flex flex-col items-center text-xs text-slate-500 hover:text-primary-600 py-1 px-3">
              {item.label}
            </Link>
          ))}
        </nav>

      </main>
    </div>
  );
}