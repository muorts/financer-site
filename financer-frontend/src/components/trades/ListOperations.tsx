import { useState } from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { TradeDetalhado, ModalDetalhesOperacao } from './OperationDetails';

interface ListaOperacoesAtivasProps {
  trades: TradeDetalhado[];
}

export function ListaOperacoesAtivas({ trades }: ListaOperacoesAtivasProps) {
  // Controle do Modal
  const [tradeSelecionado, setTradeSelecionado] = useState<TradeDetalhado | null>(null);

  // Função simulando o "Save" do Modal (No futuro, vai bater no seu banco de dados)
  const handleSalvarEdicao = (tradeId: string, novasEntradas: any[]) => {
    console.log(`Salvando trade ${tradeId} com as novas entradas:`, novasEntradas);
    // Aqui você chamaria a API e faria um setTrades para atualizar a tela
    // ...
  };

  return (
    <>
      <div className="flex flex-col p-6 border bg-surface/40 border-border/80 rounded-2xl shadow-sm mt-2">
        <h2 className="text-sm font-medium tracking-wider uppercase text-gray-400 mb-4 flex items-center gap-2">
          <ArrowRightLeft className="w-4 h-4" />
          Operações em Andamento ({trades.length})
        </h2>
        
        {trades.length === 0 ? (
          <div className="p-6 text-center border rounded-xl bg-[#18181b]/30 border-border/50">
            <p className="text-sm text-gray-500">Nenhuma operação em andamento no momento.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {trades.map(trade => {
              const isLucro = trade.lucro > 0;
              const isPerca = trade.lucro < 0;
              const corValor = isLucro ? 'text-success' : isPerca ? 'text-danger' : 'text-gray-300';
              const sinal = isLucro ? '+' : '';

              // Calcula o número de casas envolvidas olhando as entradas
              const casasNomes = Array.from(new Set(trade.entradas.map(e => e.casa))).join(' / ');

              return (
                <div 
                  key={trade.id} 
                  onClick={() => setTradeSelecionado(trade)}
                  className="flex items-center justify-between p-4 border rounded-xl bg-[#18181b]/50 border-border/50 hover:bg-[#18181b] hover:border-gray-600 transition-colors cursor-pointer group"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-white text-sm group-hover:text-brand transition-colors">{trade.jogo}</span>
                    <span className="text-xs text-gray-400 mt-0.5">
                      {casasNomes} • <span className="text-brand">{trade.mercado}</span>
                    </span>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <span className={`font-mono font-bold ${corValor}`}>
                      {sinal}{trade.lucro.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium">
                      Inv: {trade.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* RENDERIZA O MODAL (Fica invisível até ter um tradeSelecionado) */}
      <ModalDetalhesOperacao 
        trade={tradeSelecionado}
        isOpen={!!tradeSelecionado}
        onClose={() => setTradeSelecionado(null)}
        onSave={handleSalvarEdicao}
      />
    </>
  );
}