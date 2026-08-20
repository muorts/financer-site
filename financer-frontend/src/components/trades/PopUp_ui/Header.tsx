import { ElementType } from 'react';
import { Trophy, X } from 'lucide-react';

interface CabecalhoModalOperacaoProps {
  titulo: string;
  subtitulo: string;
  onClose: () => void;
  icone?: ElementType; // Permite passar um ícone customizado, mas tem um padrão
}

export function CabecalhoModalOperacao({ 
  titulo, 
  subtitulo, 
  onClose, 
  icone: Icon = Trophy 
}: CabecalhoModalOperacaoProps) {
  return (
    <div className="flex items-center justify-between p-5 border-b border-border/50 bg-surface/30">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-brand/10 text-brand">
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-base font-bold text-white leading-none">{titulo}</h2>
          <span className="text-xs text-brand mt-1">{subtitulo}</span>
        </div>
      </div>
      <button 
        onClick={onClose}
        className="p-2 text-gray-400 rounded-lg hover:bg-surface hover:text-white transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}