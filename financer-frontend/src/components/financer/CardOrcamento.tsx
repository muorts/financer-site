import { ElementType } from 'react';

interface CardOrcamentoProps {
  categoria: string;
  gastoAtual: number;
  limiteMaximo: number;
  icon: ElementType;
}

export function CardOrcamento({ categoria, gastoAtual, limiteMaximo, icon: Icone }: CardOrcamentoProps) {
  // Matemática do progresso (limitado a 100% para a barra não vazar da tela)
  const percentualCru = (gastoAtual / limiteMaximo) * 100;
  const percentualVisual = Math.min(percentualCru, 100);

  // Lógica de cores inteligente
  let corBarra = 'bg-brand'; // Padrão (Saudável)
  let corTexto = 'text-brand';
  let statusTexto = 'Dentro do limite';

  if (percentualCru >= 100) {
    corBarra = 'bg-danger shadow-[0_0_10px_rgba(247,90,104,0.5)]'; // Vermelho com glow se estourar
    corTexto = 'text-danger';
    statusTexto = 'Limite excedido!';
  } else if (percentualCru >= 80) {
    corBarra = 'bg-orange-500'; // Laranja se estiver perto do fim
    corTexto = 'text-orange-500';
    statusTexto = 'Atenção, quase no limite';
  }

  // Formatador rápido para Reais
  const formatarBRL = (valor: number) => 
    valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="flex flex-col p-5 transition-colors border rounded-xl bg-[#18181b]/50 border-border/50 hover:bg-[#18181b]">
      
      {/* Cabeçalho do Card */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 border rounded-xl bg-surface text-gray-400 border-border">
            <Icone className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white">{categoria}</span>
            <span className="text-xs text-gray-500">{statusTexto}</span>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className={`font-mono font-bold ${corTexto}`}>
            {formatarBRL(gastoAtual)}
          </span>
          <span className="text-xs text-gray-500">
            de {formatarBRL(limiteMaximo)}
          </span>
        </div>
      </div>

      {/* Barra de Progresso */}
      <div className="w-full h-3 overflow-hidden rounded-full bg-background border border-border/50">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ease-out ${corBarra}`}
          style={{ width: `${percentualVisual}%` }}
        />
      </div>
      
    </div>
  );
}