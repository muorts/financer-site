import { Target, Swords, RefreshCw, ListFilter } from 'lucide-react';

export type TipoFiltro = 'todos' | 'arbitragem' | 'missao' | 'conversao';

interface FiltroOperacoesProps {
  filtroAtivo: TipoFiltro;
  onChangeFiltro: (filtro: TipoFiltro) => void;
}

export function FiltroOperacoes({ filtroAtivo, onChangeFiltro }: FiltroOperacoesProps) {
  return (
    <div className="flex bg-[#18181b]/80 border border-border/50 rounded-lg p-1 gap-1">
      <button 
        onClick={() => onChangeFiltro('todos')}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${filtroAtivo === 'todos' ? 'bg-surface text-white shadow-sm border border-border/50' : 'text-gray-500 hover:text-white'}`}
      >
        <ListFilter className="w-3 h-3" /> Todos
      </button>
      <button 
        onClick={() => onChangeFiltro('arbitragem')}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${filtroAtivo === 'arbitragem' ? 'bg-surface text-brand shadow-sm border border-border/50' : 'text-gray-500 hover:text-brand'}`}
      >
        <Swords className="w-3 h-3" /> Arbitragem
      </button>
      <button 
        onClick={() => onChangeFiltro('missao')}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${filtroAtivo === 'missao' ? 'bg-surface text-orange-500 shadow-sm border border-border/50' : 'text-gray-500 hover:text-orange-500'}`}
      >
        <Target className="w-3 h-3" /> Missão
      </button>
      <button 
        onClick={() => onChangeFiltro('conversao')}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${filtroAtivo === 'conversao' ? 'bg-surface text-success shadow-sm border border-border/50' : 'text-gray-500 hover:text-success'}`}
      >
        <RefreshCw className="w-3 h-3" /> Giro
      </button>
    </div>
  );
}