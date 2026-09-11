import { Trash2 } from 'lucide-react';
import { TradeDetalhado } from './OperationDetails';

interface CardOperacaoAtivaProps {
  trade: TradeDetalhado;
  onClick: () => void;
  onDelete: (tradeId: string, e: React.MouseEvent) => void;
}

export function CardOperacaoAtiva({ trade, onClick, onDelete }: CardOperacaoAtivaProps) {
  const isLucro = trade.lucro >= 0;
  const corValor = isLucro ? 'text-success' : 'text-danger';
  const sinal = trade.lucro > 0 ? '+' : '';
  const casasNomes = Array.from(new Set(trade.entradas.map(e => e.casa))).join(' / ');

  return (
    <div 
      onClick={onClick}
      className="flex items-center justify-between p-4 border rounded-xl bg-[#18181b]/50 border-border/50 hover:bg-[#18181b] hover:border-gray-600 transition-colors cursor-pointer group"
    >
      <div className="flex flex-col">
        <span className="font-bold text-white text-sm group-hover:text-brand transition-colors">{trade.jogo}</span>
        <span className="text-xs text-gray-400 mt-0.5">
          {casasNomes} • <span className="text-brand">{trade.mercado}</span>
        </span>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end">
          <span className={`font-mono font-bold ${corValor}`}>
            {sinal}{trade.lucro.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
          <span className="text-[10px] text-gray-500 font-medium">
            Inv: {trade.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </div>

        <button 
          onClick={(e) => onDelete(trade.id, e)}
          className="p-2 ml-1 text-gray-500 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 border border-transparent hover:border-danger/20"
          title="Excluir Operação"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}