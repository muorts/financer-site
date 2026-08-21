import { ElementType, ButtonHTMLAttributes } from 'react';

interface BotaoAcaoTabelaProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icone: ElementType;
  variante?: 'default' | 'ativo' | 'perigo';
}

export function BotaoAcaoTabela({ 
  icone: Icon, 
  variante = 'default', 
  disabled, 
  ...props 
}: BotaoAcaoTabelaProps) {
  
  let estilo = '';

  if (disabled) {
    estilo = 'opacity-20 border-border cursor-not-allowed text-gray-600';
  } else if (variante === 'ativo') {
    estilo = 'bg-brand text-background border-brand shadow-sm scale-105';
  } else if (variante === 'perigo') {
    estilo = 'border-danger/30 text-danger bg-danger/10 hover:bg-danger/20';
  } else {
    estilo = 'text-gray-500 border-border hover:text-white';
  }

  return (
    <button
      type="button"
      disabled={disabled}
      className={`p-1.5 rounded-lg border transition-all ${estilo}`}
      {...props}
    >
      <Icon className="w-3.5 h-3.5" />
    </button>
  );
}