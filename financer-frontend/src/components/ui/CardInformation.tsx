import { ElementType, ReactNode } from 'react';
import { Info } from 'lucide-react';

interface CardInformacaoProps {
  titulo: string;
  descricao: string | ReactNode; // Aceita texto puro ou elementos HTML/Links
  icone?: ElementType;
  tema?: 'brand' | 'success' | 'warning' | 'danger' | 'gray';
}

export function CardInformacao({
  titulo,
  descricao,
  icone: Icon = Info,
  tema = 'brand'
}: CardInformacaoProps) {
  
  // Mapeamento dinâmico de cores baseado no tema
  const cores = {
    brand: { wrapper: 'border-brand/20 bg-brand/5', iconBg: 'bg-brand/10 text-brand' },
    success: { wrapper: 'border-success/20 bg-success/5', iconBg: 'bg-success/10 text-success' },
    warning: { wrapper: 'border-orange-500/20 bg-orange-500/5', iconBg: 'bg-orange-500/10 text-orange-500' },
    danger: { wrapper: 'border-danger/20 bg-danger/5', iconBg: 'bg-danger/10 text-danger' },
    gray: { wrapper: 'border-gray-600/30 bg-[#18181b]/30', iconBg: 'bg-gray-800 text-gray-400' },
  }[tema];

  return (
    <div className={`flex gap-4 p-5 rounded-2xl border shadow-sm ${cores.wrapper}`}>
      <div className={`p-2 h-fit rounded-lg mt-1 ${cores.iconBg}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-bold text-white">{titulo}</h3>
        <p className="text-sm text-gray-400 leading-relaxed">
          {descricao}
        </p>
      </div>
    </div>
  );
}