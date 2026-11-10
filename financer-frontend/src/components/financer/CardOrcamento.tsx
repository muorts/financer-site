import { ElementType } from 'react';
import { Trash2 } from 'lucide-react';

interface CardOrcamentoProps {
  id?: string | number;
  categoria: string;
  gastoAtual: number;
  limiteMaximo: number;
  icon: ElementType;
  onDelete?: (id: string) => void;
}

export function CardOrcamento({ id, categoria, gastoAtual, limiteMaximo, icon: Icone, onDelete }: CardOrcamentoProps) {
  // Matemática do progresso (limitado a 100% para a barra não vazar da tela)
  const percentualCru = limiteMaximo > 0 ? (gastoAtual / limiteMaximo) * 100 : 0;
  const percentualVisual = Math.min(percentualCru, 100);

  // Lógica de cores inteligente
  let corBarra = 'bg-brand'; // Padrão (Saudável)
  let corTexto = 'text-brand';
  let statusTexto = 'Dentro do limite';

  if (percentualCru >= 100) {
    corBarra = 'bg-danger shadow-[0_0_10px_rgba(247,90,104,0.5)]';
    corTexto = 'text-danger';
    statusTexto = 'Limite excedido!';
  } else if (percentualCru >= 80) {
    corBarra = 'bg-orange-500';
    corTexto = 'text-orange-500';
    statusTexto = 'Atenção, quase no limite';
  }

  const formatarBRL = (valor: number) => 
    valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="flex flex-col p-5 transition-colors border rounded-xl bg-[#18181b]/50 border-border/50 hover:bg-[#18181b]">
      
      {/* Cabeçalho do Card */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 border rounded-xl bg-surface text-gray-400 border-border">
            <Icone className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white">{categoria}</span>
            <span className="text-xs text-gray-500">{statusTexto}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className={`font-mono font-bold ${corTexto}`}>
              {formatarBRL(gastoAtual)}
            </span>
            <span className="text-xs text-gray-500">
              de {formatarBRL(limiteMaximo)}
            </span>
          </div>

          {onDelete && id && (
            <button
              type="button"
              onClick={() => onDelete(String(id))}
              className="p-2 transition-colors border rounded-lg bg-surface border-border hover:border-danger/50 text-gray-500 hover:text-danger"
              title="Excluir meta"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Barra de Progresso */}
      <div className="w-full h-3 overflow-hidden rounded-full bg-background border border-border/50">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ease-out ${corBarra}`}
          style={{ width: `${percentualVisual}%` }}
        />
      </div>
      
    </div>
  );
}
