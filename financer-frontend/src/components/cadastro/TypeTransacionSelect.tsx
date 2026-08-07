import { TrendingUp, TrendingDown } from 'lucide-react';

interface SeletorTipoTransacaoProps {
  tipo: 'entrada' | 'saida';
  onChange: (tipo: 'entrada' | 'saida') => void;
}

export function SeletorTipoTransacao({ tipo, onChange }: SeletorTipoTransacaoProps) {
  return (
    <div className="flex gap-4 p-1 bg-[#18181b] border border-border rounded-xl">
      <button
        onClick={() => onChange('entrada')}
        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all duration-300 ${
          tipo === 'entrada' 
            ? 'bg-success text-background shadow-md' 
            : 'text-gray-500 hover:text-white'
        }`}
      >
        <TrendingUp className="w-4 h-4" /> Entrou Dinheiro
      </button>
      
      <button
        onClick={() => onChange('saida')}
        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all duration-300 ${
          tipo === 'saida' 
            ? 'bg-danger text-background shadow-md' 
            : 'text-gray-500 hover:text-white'
        }`}
      >
        <TrendingDown className="w-4 h-4" /> Saiu Dinheiro
      </button>
    </div>
  );
}