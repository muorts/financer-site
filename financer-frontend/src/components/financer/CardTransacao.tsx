import { TrendingUp, TrendingDown, Tag } from 'lucide-react';

interface CardTransacaoProps {
  tipo: 'entrada' | 'saida';
  titulo: string;
  valor: string;
  categoria: string;
  data: string;
}

export function CardTransacao({ tipo, titulo, valor, categoria, data }: CardTransacaoProps) {
  const isEntrada = tipo === 'entrada';
  
  return (
    <div className="flex items-center justify-between p-4 transition-colors border bg-surface/40 border-border/80 rounded-2xl hover:bg-surface/70 active:scale-[0.98]">
      
      <div className="flex items-center gap-4">
        {/* Ícone com fundo arredondado */}
        <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
          isEntrada ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
        }`}>
          {isEntrada ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
        </div>
        
        {/* Textos */}
        <div className="flex flex-col">
          <span className="font-medium text-white text-md">{titulo}</span>
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
            <Tag className="w-3 h-3" />
            <span>{categoria}</span>
            <span>•</span>
            <span>{data}</span>
          </div>
        </div>
      </div>

      {/* Valor */}
      <span className={`font-mono font-bold ${isEntrada ? 'text-success' : 'text-danger'}`}>
        {isEntrada ? '+ ' : '- '}{valor}
      </span>
      
    </div>
  );
}