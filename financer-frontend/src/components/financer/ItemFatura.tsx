import { ElementType } from 'react';
import { ChevronRight } from 'lucide-react';

interface ItemFaturaProps {
  descricao: string;
  data: string;
  valor: string;
  parcelas: string;
  icon: ElementType;
}

export function ItemFatura({ descricao, data, valor, parcelas, icon: Icone }: ItemFaturaProps) {
  return (
    <div className="flex items-center justify-between p-4 transition-colors border rounded-xl bg-[#18181b]/50 border-border/50 hover:bg-[#18181b] cursor-pointer">
      
      {/* Esquerda: Ícone e Detalhes */}
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-10 h-10 border rounded-full bg-surface text-gray-400 border-border">
          <Icone className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-white">{descricao}</span>
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
            <span>{data}</span>
            <span>•</span>
            <span>{parcelas}</span>
          </div>
        </div>
      </div>

      {/* Direita: Valor e Seta */}
      <div className="flex items-center gap-3">
        <span className="font-mono font-medium text-white">{valor}</span>
        <ChevronRight className="w-4 h-4 text-gray-600" />
      </div>

    </div>
  );
}