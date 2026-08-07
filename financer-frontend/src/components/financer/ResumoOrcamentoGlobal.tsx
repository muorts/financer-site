import { Target, AlertTriangle } from 'lucide-react';

interface ResumoOrcamentoGlobalProps {
  orcamentoTotal: number;
  gastoTotal: number;
  restanteGeral: number;
}

export function ResumoOrcamentoGlobal({ orcamentoTotal, gastoTotal, restanteGeral }: ResumoOrcamentoGlobalProps) {
  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 border bg-surface/40 border-border/80 rounded-2xl shadow-sm relative overflow-hidden">
      
      {/* Efeito de brilho de fundo bem sutil */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

      <div className="flex items-center gap-3 mb-2">
        <Target className="w-5 h-5 text-brand" />
        <h2 className="text-lg font-bold text-white">Orçamento Global do Mês</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-500">Teto Definido</span>
          <span className="text-2xl font-bold text-white mt-1">
            {orcamentoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </div>
        
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-500">Já Gasto</span>
          <span className="text-2xl font-bold text-danger mt-1">
            {gastoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </div>

        <div className="flex flex-col col-span-2 md:col-span-1 p-4 border rounded-xl bg-brand/10 border-brand/20">
          <span className="text-sm font-medium text-brand">Saldo Livre Restante</span>
          <span className="text-2xl font-bold text-brand mt-1">
            {restanteGeral > 0 
              ? restanteGeral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
              : 'R$ 0,00'}
          </span>
        </div>
      </div>

      {/* Alerta inteligente se o dinheiro acabar */}
      {restanteGeral < 0 && (
        <div className="flex items-center gap-2 p-3 mt-2 text-sm font-medium text-danger bg-danger/10 rounded-lg border border-danger/20">
          <AlertTriangle className="w-4 h-4" />
          Você ultrapassou seu orçamento global deste mês.
        </div>
      )}
    </div>
  );
}