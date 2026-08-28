import { ElementType, ReactNode } from 'react';
import { Trophy, ShieldCheck, Plus } from 'lucide-react';
import { NameInput } from '@/components/ui/NameInput';
import { BlocoOperacao } from './OperationBlock';

// Expandimos a interface da Proteção para ela aguentar os dados reais
export interface Protecao {
  id: number;
  casaId?: string;
  odd?: string;
  stake?: string;
}

interface SecaoOperacaoProps {
  // Dados do Evento
  eventoNome: string;
  onChangeEvento: (nome: string) => void;
  eventoPlaceholder?: string;

  // Dados do Bloco Principal
  mainTitulo: string;
  mainIcon: ElementType;
  mainTema?: 'brand' | 'orange' | 'success' | 'gray';
  mainOddPlaceholder?: string;
  mainValorLabel?: string;
  mainValorPlaceholder?: string;
  childrenPrincipal?: ReactNode;

  // ==========================================
  // NOVAS PROPS: Estados da Entrada Principal
  // ==========================================
  mainCasaId?: string;
  onChangeMainCasa?: (id: string) => void;
  mainOdd?: string;
  onChangeMainOdd?: (valor: string) => void;
  mainStake?: string;
  onChangeMainStake?: (valor: string) => void;

  // Dados das Proteções
  protecoes: Protecao[];
  onAddProtecao: () => void;
  onRemoveProtecao: (id: number) => void;
  protecaoOddPlaceholder?: string;
  protecaoValorPlaceholder?: string;

  // ==========================================
  // NOVAS PROPS: Estados das Proteções
  // ==========================================
  onChangeProtecaoCasa?: (id: number, casaId: string) => void;
  onChangeProtecaoOdd?: (id: number, odd: string) => void;
  onChangeProtecaoStake?: (id: number, stake: string) => void;
}

export function SecaoOperacao({
  eventoNome,
  onChangeEvento,
  eventoPlaceholder = "ex: Palmeiras x Corinthians",
  
  mainTitulo,
  mainIcon,
  mainTema = 'brand',
  mainOddPlaceholder,
  mainValorLabel,
  mainValorPlaceholder,
  childrenPrincipal,

  // Recebendo os dados da entrada principal
  mainCasaId,
  onChangeMainCasa,
  mainOdd,
  onChangeMainOdd,
  mainStake,
  onChangeMainStake,

  protecoes,
  onAddProtecao,
  onRemoveProtecao,
  protecaoOddPlaceholder,
  protecaoValorPlaceholder,

  // Recebendo as funções das proteções
  onChangeProtecaoCasa,
  onChangeProtecaoOdd,
  onChangeProtecaoStake

}: SecaoOperacaoProps) {
  
  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2">
      
      {/* CAMPO DE NOME DO EVENTO */}
      <NameInput 
        label="Evento / Partida" 
        icon={Trophy}
        placeholder={eventoPlaceholder}
        value={eventoNome}
        onChange={(e) => onChangeEvento(e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* LADO ESQUERDO: BLOCO PRINCIPAL */}
        <BlocoOperacao 
          titulo={mainTitulo} 
          icone={mainIcon} 
          tema={mainTema} 
          oddPlaceholder={mainOddPlaceholder} 
          valorLabel={mainValorLabel}
          valorPlaceholder={mainValorPlaceholder}
          // Ligando os fios da Entrada Principal!
          casaId={mainCasaId}
          onChangeCasa={onChangeMainCasa}
          odd={mainOdd}
          onChangeOdd={onChangeMainOdd}
          stake={mainStake}
          onChangeStake={onChangeMainStake}
        >
          {childrenPrincipal}
        </BlocoOperacao>

        {/* LADO DIREITO: BLOCOS DE PROTEÇÃO */}
        <div className="flex flex-col gap-6">
          {protecoes.map((prot, index) => (
            <BlocoOperacao 
              key={prot.id}
              titulo={`Proteção ${index + 1}`}
              icone={ShieldCheck}
              tema="gray"
              oddPlaceholder={protecaoOddPlaceholder}
              valorPlaceholder={protecaoValorPlaceholder}
              onRemove={() => onRemoveProtecao(prot.id)}
              // Ligando os fios de cada Proteção individualmente!
              casaId={prot.casaId}
              onChangeCasa={(casaId) => onChangeProtecaoCasa && onChangeProtecaoCasa(prot.id, casaId)}
              odd={prot.odd}
              onChangeOdd={(odd) => onChangeProtecaoOdd && onChangeProtecaoOdd(prot.id, odd)}
              stake={prot.stake}
              onChangeStake={(stake) => onChangeProtecaoStake && onChangeProtecaoStake(prot.id, stake)}
            />
          ))}

          {/* BOTÃO DE ADICIONAR PROTEÇÃO */}
          <button 
            onClick={onAddProtecao} 
            className="flex items-center justify-center gap-2 w-full py-3 mt-1 text-sm font-medium text-gray-400 border border-dashed border-border rounded-2xl hover:text-white hover:border-gray-500 hover:bg-[#18181b]/50 transition-colors"
          >
            <Plus className="w-4 h-4" /> Adicionar Nova Cobertura
          </button>
        </div>

      </div>
    </div>
  );
}