import { TrendingUp, TrendingDown, Tag, Trash2 } from 'lucide-react';

interface CardTransacaoProps {
  id?: string | number;
  tipo: 'entrada' | 'saida';
  titulo: string;
  valor: string;
  categoria: string;
  data: string;
  bancoNome?: string;
  onDelete?: (id: string) => void;
}

export function CardTransacao({ id, tipo, titulo, valor, categoria, data, bancoNome, onDelete }: CardTransacaoProps) {
  const isEntrada = tipo === 'entrada';
  
  return (
    <div className="flex items-center justify-between p-4 transition-colors border bg-surface/40 border-border/80 rounded-2xl hover:bg-surface/70">
      
      <div className="flex items-center gap-4">
        {/* Ícone com fundo arredondado */}
        <div className={`flex items-center justify-center w-12 h-12 rounded-full shrink-0 ${
          isEntrada ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
        }`}>
          {isEntrada ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
        </div>
        
        {/* Textos */}
        <div className="flex flex-col">
          <span className="font-medium text-white text-md">{titulo}</span>
          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-500">
            <Tag className="w-3 h-3" />
            <span>{categoria}</span>
            {bancoNome && (
              <>
                <span>•</span>
                <span>{bancoNome}</span>
              </>
            )}
            <span>•</span>
            <span>{data}</span>
          </div>
        </div>
      </div>

      {/* Valor e Ação de Excluir */}
      <div className="flex items-center gap-3">
        <span className={`font-mono font-bold ${isEntrada ? 'text-success' : 'text-danger'}`}>
          {isEntrada ? '+ ' : '- '}{valor}
        </span>

        {onDelete && id && (
          <button
            type="button"
            onClick={() => onDelete(String(id))}
            className="p-2 text-gray-500 transition-colors rounded-lg hover:text-danger hover:bg-danger/10"
            title="Excluir transação"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      
    </div>
  );
}
