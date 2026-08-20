import { ArrowRightLeft, Gift, CircleDollarSign } from 'lucide-react';

// Exportamos o tipo para garantir que o TypeScript ajude na página principal
export type TipoOperacao = 'arbitragem' | 'freebet' | 'lucro';

interface SeletorTipoOperacaoProps {
  tipoAtual: TipoOperacao;
  onChange: (tipo: TipoOperacao) => void;
}

export function SeletorTipoOperacao({ tipoAtual, onChange }: SeletorTipoOperacaoProps) {
  return (
    <div className="flex p-1 bg-[#18181b]/80 border border-border/50 rounded-2xl">
      <button
        onClick={() => onChange('arbitragem')}
        className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-all ${
          tipoAtual === 'arbitragem' 
            ? 'bg-surface text-brand shadow-sm border border-border/50' 
            : 'text-gray-400 hover:text-white hover:bg-surface/30'
        }`}
      >
        <ArrowRightLeft className="w-4 h-4" />
        Arbitragem / PA
      </button>
      
      <button
        onClick={() => onChange('freebet')}
        className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-all ${
          tipoAtual === 'freebet' 
            ? 'bg-surface text-orange-500 shadow-sm border border-border/50' 
            : 'text-gray-400 hover:text-white hover:bg-surface/30'
        }`}
      >
        <Gift className="w-4 h-4" />
        Freebets
      </button>

      <button
        onClick={() => onChange('lucro')}
        className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl transition-all ${
          tipoAtual === 'lucro' 
            ? 'bg-surface text-success shadow-sm border border-border/50' 
            : 'text-gray-400 hover:text-white hover:bg-surface/30'
        }`}
      >
        <CircleDollarSign className="w-4 h-4" />
        Lançar Lucro
      </button>
    </div>
  );
}