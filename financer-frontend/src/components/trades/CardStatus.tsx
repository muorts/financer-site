import { ElementType } from 'react';

interface CardStatusProps {
  titulo: string;
  valor: number;
  icon: ElementType;
  variante?: 'brand' | 'orange' | 'success' | 'danger' | 'blue' | 'purple';
}

export function CardStatus({ titulo, valor, icon: Icon, variante = 'brand' }: CardStatusProps) {
  // Mapa de cores para o Tailwind não se perder na hora de compilar
  const corMap = {
    brand: 'text-brand bg-brand/10 border-brand/20',
    orange: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
    success: 'text-success bg-success/10 border-success/20',
    danger: 'text-danger bg-danger/10 border-danger/20',
    blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    purple: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
  };

  const corTema = corMap[variante];

  return (
    <div className="flex items-center gap-4 p-6 border bg-surface/40 border-border/80 rounded-2xl shadow-sm relative overflow-hidden">
      {/* Ícone gigante no fundo */}
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <Icon className="w-24 h-24" />
      </div>
      
      {/* Ícone em destaque */}
      <div className={`flex items-center justify-center w-14 h-14 rounded-2xl border ${corTema} z-10`}>
        <Icon className="w-7 h-7" />
      </div>
      
      {/* Textos */}
      <div className="flex flex-col z-10">
        <span className="text-sm font-medium text-gray-400">{titulo}</span>
        <span className="text-2xl font-bold font-mono text-white tracking-tight">
          {valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </span>
      </div>
    </div>
  );
}