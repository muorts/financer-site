import { ElementType } from 'react';
import { CardOrcamento } from '@/components/financer/CardOrcamento';

export interface Meta {
  id: number | string;
  categoria: string;
  gastoAtual: number;
  limiteMaximo: number;
  icon: ElementType;
}

interface ListaLimitesCategoriaProps {
  metas: Meta[];
  onDelete?: (id: string) => void;
}

export function ListaLimitesCategoria({ metas, onDelete }: ListaLimitesCategoriaProps) {
  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
      
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-white">Limites por Categoria</h2>
        <span className="text-xs font-medium px-2 py-1 bg-surface border border-border rounded-md text-gray-400">
          {metas.length} metas ativas
        </span>
      </div>

      {metas.length === 0 ? (
        <p className="text-sm text-gray-500 py-6 text-center">
          Nenhuma meta definida para este mês ainda. Clique em &quot;Nova Meta&quot; abaixo para criar!
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {metas.map((meta) => (
            <CardOrcamento 
              key={meta.id}
              id={meta.id}
              categoria={meta.categoria}
              gastoAtual={meta.gastoAtual}
              limiteMaximo={meta.limiteMaximo}
              icon={meta.icon}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
