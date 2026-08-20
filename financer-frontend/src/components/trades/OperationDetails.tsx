import { useState, useEffect } from 'react';
import { Swords, ShieldCheck } from 'lucide-react';
import { CabecalhoModalOperacao } from './PopUp_ui/Header';
import { ModalCamposOddStake } from './PopUp_ui/stake';
import { RodapeModalOperacao } from './PopUp_ui/Rodape';

export interface EntradaTrade {
  id: string;
  tipo: 'principal' | 'protecao';
  casa: string;
  odd: number;
  stake: number;
}

export interface TradeDetalhado {
  id: string;
  jogo: string;
  mercado: string;
  lucro: number;
  valor: number; 
  entradas: EntradaTrade[];
}

interface ModalDetalhesOperacaoProps {
  trade: TradeDetalhado | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (tradeId: string, novasEntradas: EntradaTrade[]) => void;
}

export function ModalDetalhesOperacao({ trade, isOpen, onClose, onSave }: ModalDetalhesOperacaoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [entradasEditadas, setEntradasEditadas] = useState<EntradaTrade[]>([]);

  useEffect(() => {
    if (trade) {
      setEntradasEditadas(trade.entradas);
      setIsEditing(false);
    }
  }, [trade, isOpen]);

  if (!isOpen || !trade) return null;

  const handleAtualizarEntrada = (id: string, campo: 'odd' | 'stake', valor: string) => {
    setEntradasEditadas(prev => 
      prev.map(ent => ent.id === id ? { ...ent, [campo]: Number(valor) } : ent)
    );
  };

  const handleSalvar = () => {
    onSave(trade.id, entradasEditadas);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-[#18181b] border border-border/80 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
        
        {/* 1. CABEÇALHO MODULAR */}
        <CabecalhoModalOperacao 
          titulo={trade.jogo}
          subtitulo={trade.mercado}
          onClose={onClose}
        />

        {/* 2. CORPO / LISTA DE ENTRADAS */}
        <div className="flex flex-col p-5 gap-4 max-h-[60vh] overflow-y-auto">
          {entradasEditadas.map((entrada, index) => {
            const isPrincipal = entrada.tipo === 'principal';
            const Icone = isPrincipal ? Swords : ShieldCheck;
            const corTema = isPrincipal 
              ? 'text-brand border-brand/20 bg-brand/5' 
              : 'text-gray-300 border-gray-600/30 bg-[#18181b]/50';

            return (
              <div key={entrada.id} className={`flex flex-col p-4 border rounded-xl relative ${corTema}`}>
                <span className={`absolute -top-2.5 left-3 px-2 text-[10px] font-bold uppercase tracking-wider bg-[#18181b] border rounded-md flex items-center gap-1 ${isPrincipal ? 'text-brand border-brand/20' : 'text-gray-400 border-gray-600/30'}`}>
                  <Icone className="w-3 h-3" />
                  {isPrincipal ? 'Entrada Principal' : `Proteção ${index}`}
                </span>

                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm font-bold text-white">{entrada.casa}</span>
                </div>

                <ModalCamposOddStake 
                  odd={entrada.odd}
                  stake={entrada.stake}
                  isEditing={isEditing}
                  onOddChange={(valor) => handleAtualizarEntrada(entrada.id, 'odd', valor)}
                  onStakeChange={(valor) => handleAtualizarEntrada(entrada.id, 'stake', valor)}
                />
              </div>
            );
          })}
        </div>

        {/* 3. RODAPÉ MODULAR */}
        <RodapeModalOperacao 
          lucro={trade.lucro}
          isEditing={isEditing}
          onEditToggle={setIsEditing}
          onSave={handleSalvar}
        />

      </div>
    </div>
  );
}