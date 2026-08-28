import { ElementType, ReactNode } from 'react';
import { Trash2 } from 'lucide-react';
import { SeletorCasaAposta } from './CasaSelection';
import { InputCotacaoValor } from './MiniImputOdd';

interface BlocoOperacaoProps {
  titulo: string;
  icone: ElementType;
  tema?: 'brand' | 'orange' | 'gray' | 'success';
  onRemove?: () => void;
  oddPlaceholder?: string;
  valorLabel?: string;
  valorPlaceholder?: string;
  children?: ReactNode;

  // ==========================================
  // NOVAS PROPS (A ponte de dados!)
  // ==========================================
  casaId?: string;
  onChangeCasa?: (id: string) => void;
  odd?: string;
  onChangeOdd?: (valor: string) => void;
  stake?: string;
  onChangeStake?: (valor: string) => void;
}

export function BlocoOperacao({
  titulo,
  icone: Icon,
  tema = 'brand',
  onRemove,
  oddPlaceholder,
  valorLabel,
  valorPlaceholder,
  children,
  // Recebendo as novas props
  casaId,
  onChangeCasa,
  odd,
  onChangeOdd,
  stake,
  onChangeStake
}: BlocoOperacaoProps) {
  
  // Mapa de estilos baseado no tema escolhido
  const cores = {
    brand: { border: 'border-brand/20', bg: 'bg-brand/5', badgeText: 'text-brand' },
    orange: { border: 'border-orange-500/20', bg: 'bg-orange-500/5', badgeText: 'text-orange-500' },
    gray: { border: 'border-gray-600/30', bg: 'bg-[#18181b]/30', badgeText: 'text-gray-300' },
    success: { border: 'border-success/20', bg: 'bg-success/5', badgeText: 'text-success' },
  }[tema];

  return (
    <div className={`flex flex-col gap-4 p-5 rounded-2xl border ${cores.border} ${cores.bg} relative mt-3 animate-in fade-in slide-in-from-top-2`}>
      
      {/* BADGE (Etiqueta no topo) */}
      <span className={`absolute -top-3 left-4 px-2 py-0.5 text-xs font-bold ${cores.badgeText} bg-surface border ${cores.border} rounded-md flex items-center gap-1`}>
        <Icon className="w-3 h-3" /> {titulo}
      </span>
      
      {/* BOTÃO DE REMOVER (Só aparece se passar a função onRemove) */}
      {onRemove && (
        <button 
          onClick={onRemove}
          className="absolute -top-3 right-4 p-1 text-gray-500 bg-surface border border-border rounded-md hover:text-danger hover:border-danger/50 hover:bg-danger/10 transition-colors group"
          title="Remover esta cobertura"
        >
          <Trash2 className="w-3 h-3 group-hover:scale-110 transition-transform" />
        </button>
      )}
      
      {/* LIGANDO OS FIOS DO SELETOR DA CASA */}
      <SeletorCasaAposta 
        tema={tema} 
        value={casaId} 
        onChange={onChangeCasa} 
      />
      
      {/* LIGANDO OS FIOS DAS ODDS E VALORES */}
      <InputCotacaoValor 
        tema={tema}
        oddPlaceholder={oddPlaceholder}
        valorLabel={valorLabel}
        valorPlaceholder={valorPlaceholder}
        oddValue={odd}
        onChangeOdd={onChangeOdd}
        stakeValue={stake}
        onChangeStake={onChangeStake}
      />

      {/* ÁREA PARA CONTEÚDO EXTRA */}
      {children}

    </div>
  );
}