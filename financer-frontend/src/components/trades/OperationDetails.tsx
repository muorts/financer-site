import { useState, useEffect } from 'react';
import { Swords, ShieldCheck, CheckCircle2 } from 'lucide-react';
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
  valor: number; // Total Investido
  entradas: EntradaTrade[];
}

interface ModalDetalhesOperacaoProps {
  trade: TradeDetalhado | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (tradeId: string, novasEntradas: EntradaTrade[]) => void;
  onResolve: (tradeId: string, valorRecebido: number, lucroLiquido: number) => void; // <-- Nova Função!
}

export function ModalDetalhesOperacao({ trade, isOpen, onClose, onSave, onResolve }: ModalDetalhesOperacaoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [entradasEditadas, setEntradasEditadas] = useState<EntradaTrade[]>([]);
  
  // Estados para Finalizar a Operação
  const [isResolving, setIsResolving] = useState(false);
  const [valorRecebidoInput, setValorRecebidoInput] = useState('');

  useEffect(() => {
    if (trade) {
      setEntradasEditadas(trade.entradas);
      setIsEditing(false);
      setIsResolving(false); // Reseta a tela de resolver ao abrir novo trade
      setValorRecebidoInput('');
    }
  }, [trade, isOpen]);

  if (!isOpen || !trade) return null;

  const handleAtualizarEntrada = (id: string, campo: 'odd' | 'stake', valor: string) => {
    setEntradasEditadas(prev => prev.map(ent => ent.id === id ? { ...ent, [campo]: Number(valor) } : ent));
  };

  const handleSalvar = () => {
    onSave(trade.id, entradasEditadas);
    setIsEditing(false);
  };

  const handleConfirmarResolucao = () => {
    const valorRecebido = parseFloat(valorRecebidoInput.replace(',', '.')) || 0;
    const lucroLiquidoFinal = valorRecebido - trade.valor; // O cálculo mestre: Recebido - Investido
    
    onResolve(trade.id, valorRecebido, lucroLiquidoFinal);
  };

  // Cálculos dinâmicos da tela de resolução
  const numRecebido = parseFloat(valorRecebidoInput.replace(',', '.')) || 0;
  const lucroFinalDinamico = numRecebido - trade.valor;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-[#18181b] border border-border/80 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
        
        <CabecalhoModalOperacao 
          titulo={trade.jogo}
          subtitulo={trade.mercado}
          onClose={onClose}
        />

        <div className="flex flex-col p-5 gap-4 max-h-[50vh] overflow-y-auto">
          {entradasEditadas.map((entrada, index) => {
            const isPrincipal = entrada.tipo === 'principal';
            const Icone = isPrincipal ? Swords : ShieldCheck;
            const corTema = isPrincipal ? 'text-brand border-brand/20 bg-brand/5' : 'text-gray-300 border-gray-600/30 bg-[#18181b]/50';

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

        {/* ALTERNÂNCIA ENTRE O RODAPÉ NORMAL E O PAINEL DE RESOLUÇÃO */}
        {isResolving ? (
          <div className="flex flex-col p-5 border-t border-brand/30 bg-brand/5 animate-in slide-in-from-bottom-2 gap-4">
            <h3 className="text-sm font-bold text-brand flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Finalizar Operação
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-gray-400">Total Investido (Custo)</label>
                <div className="w-full py-2.5 px-3 text-lg font-mono text-gray-500 bg-[#18181b]/50 border border-border/50 rounded-xl">
                  {trade.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-brand">Total Recebido (Retorno)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 font-mono text-gray-400">R$</span>
                  <input 
                    type="number" 
                    placeholder="0.00"
                    value={valorRecebidoInput}
                    onChange={(e) => setValorRecebidoInput(e.target.value)}
                    className="w-full py-2.5 pl-9 pr-3 text-lg font-bold font-mono text-white bg-[#18181b] border border-brand/50 rounded-xl outline-none focus:border-brand shadow-[0_0_10px_rgba(var(--brand),0.1)]"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2 pt-4 border-t border-brand/20">
              <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-400">Lucro Líquido Real</span>
                <span className={`text-xl font-bold font-mono ${lucroFinalDinamico >= 0 ? 'text-success' : 'text-danger'}`}>
                  {lucroFinalDinamico > 0 ? '+' : ''}{lucroFinalDinamico.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsResolving(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  Voltar
                </button>
                <button 
                  onClick={handleConfirmarResolucao}
                  disabled={!valorRecebidoInput}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-bold bg-success text-background rounded-xl shadow-[0_0_10px_rgba(34,197,94,0.3)] hover:bg-success/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle2 className="w-4 h-4" /> Confirmar Baixa
                </button>
              </div>
            </div>
          </div>
        ) : (
          <RodapeModalOperacao 
            lucro={trade.lucro}
            isEditing={isEditing}
            onEditToggle={setIsEditing}
            onSave={handleSalvar}
            onResolveToggle={() => setIsResolving(true)}
          />
        )}

      </div>
    </div>
  );
}