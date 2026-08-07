import { ElementType } from 'react';
import { CardOrcamento } from '@/components/financer/CardOrcamento';

// Interface que define o formato de cada meta
interface Meta {
  id: number | string;
  categoria: string;
  gastoAtual: number;
  limiteMaximo: number;
  icon: ElementType;
}

interface ListaLimitesCategoriaProps {
  metas: Meta[];
}

export function ListaLimitesCategoria({ metas }: ListaLimitesCategoriaProps) {
  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
      
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-white">Limites por Categoria</h2>
        <span className="text-xs font-medium px-2 py-1 bg-surface border border-border rounded-md text-gray-400">
          {metas.length} metas ativas
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {metas.map((meta) => (
          <CardOrcamento 
            key={meta.id}
            categoria={meta.categoria}
            gastoAtual={meta.gastoAtual}
            limiteMaximo={meta.limiteMaximo}
            icon={meta.icon}
          />
        ))}
      </div>
    </div>
  );
}