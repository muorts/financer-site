import { useState, useEffect } from 'react';
import { Swords, ShieldCheck, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { CabecalhoModalOperacao } from './PopUp_ui/Header';
import { ModalCamposOddStake } from './PopUp_ui/stake';
import { RodapeModalOperacao } from './PopUp_ui/Rodape';
import { calcularLucroProjetado } from '@/utils/calculadoraTrade';
import { SelectCasaComBusca } from '@/components/ui/InputSelectSearch';

export interface EntradaTrade {
  id: string;
  tipo: 'principal' | 'protecao';
  casa: string;
  odd: number;
  stake: number;
  casaAposta?: { id: string }; 
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
  onResolve: (tradeId: string, valorRecebido: number, lucroLiquido: number) => void;
}

export function ModalDetalhesOperacao({ trade, isOpen, onClose, onSave, onResolve }: ModalDetalhesOperacaoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [entradasEditadas, setEntradasEditadas] = useState<EntradaTrade[]>([]);
  const [isResolving, setIsResolving] = useState(false);
  
  // Como os IDs podem ser UUIDs do banco ou Numbers (resolução), mudamos para aceitar os dois
  const [dropdownAbertoId, setDropdownAbertoId] = useState<string | number | null>(null);
  const [casasOficiaisDB, setCasasOficiaisDB] = useState<any[]>([]); 
  const [casasVencedoras, setCasasVencedoras] = useState<any[]>([
    { id: Date.now(), casaNome: '', valor: '' }
  ]);

  useEffect(() => {
    fetch('http://localhost:8080/api/casas')
      .then(res => res.json())
      .then(dados => setCasasOficiaisDB(dados))
      .catch(err => console.error("Erro ao buscar casas do DB:", err));
  }, []);

  useEffect(() => {
    if (trade) {
      setEntradasEditadas(trade.entradas);
      setIsEditing(false);
      setIsResolving(false);
      setDropdownAbertoId(null);
      setCasasVencedoras([{ id: Date.now(), casaNome: '', valor: '' }]);
    }
  }, [trade, isOpen]);

  if (!isOpen || !trade) return null;

  const handleAtualizarEntradaNum = (id: string, campo: 'odd' | 'stake', valor: string) => {
    if (valor === '') {
      setEntradasEditadas(prev => prev.map(ent => ent.id === id ? { ...ent, [campo]: '' as any } : ent));
      return;
    }
    const numeroLimpo = parseFloat(valor.replace(',', '.'));
    const valorFinal = isNaN(numeroLimpo) ? valor : numeroLimpo;
    setEntradasEditadas(prev => prev.map(ent => ent.id === id ? { ...ent, [campo]: valorFinal } : ent));
  };

  const handleAtualizarEntradaStr = (id: string, campo: 'casa', valor: string) => {
    setEntradasEditadas(prev => prev.map(ent => ent.id === id ? { ...ent, [campo]: valor } : ent));
  };

  const handleAddNovaEntrada = () => {
    setEntradasEditadas([...entradasEditadas, {
      id: `temp-${Date.now()}`,
      tipo: 'protecao',
      casa: '',
      odd: '' as any,
      stake: '' as any
    }]);
  };

  const handleRemoveEntrada = (id: string) => setEntradasEditadas(prev => prev.filter(ent => ent.id !== id));

  const handleSalvar = () => {
    const temCasaVazia = entradasEditadas.some(ent => !ent.casa || ent.casa.trim() === '');
    if (temCasaVazia) return alert("Atenção: Selecione a Casa de Aposta em todas as proteções antes de salvar.");

    const entradasProntasParaOJava = entradasEditadas.map(ent => {
      const casaEncontradaNoBanco = casasOficiaisDB.find(c => c.nome.toLowerCase() === ent.casa.toLowerCase());
      return { ...ent, casaAposta: casaEncontradaNoBanco ? { id: casaEncontradaNoBanco.id } : undefined };
    });

    if (entradasProntasParaOJava.some(ent => !ent.casaAposta)) {
      return alert("Erro: Uma das casas não foi encontrada no banco de dados.");
    }

    onSave(trade.id, entradasProntasParaOJava);
    setIsEditing(false);
  };

  const isFreebet = trade.mercado.toLowerCase().includes('freebet');
  const entradasParaCalculo = entradasEditadas.map(ent => ({
    stake: Number(ent.stake) || 0,
    odd: Number(ent.odd) || 0,
    tipo: ent.tipo,
    isFreebet: ent.tipo === 'principal' ? isFreebet : false
  }));

  const lucroAoVivo = isEditing ? calcularLucroProjetado(entradasParaCalculo, trade.mercado, 0) : trade.lucro;

  const handleAddCasaVencedora = () => setCasasVencedoras([...casasVencedoras, { id: Date.now(), casaNome: '', valor: '' }]);
  const handleRemoveCasaVencedora = (id: number) => setCasasVencedoras(casasVencedoras.filter(c => c.id !== id));
  const updateCasaVencedora = (id: number, campo: string, valor: string) => setCasasVencedoras(prev => prev.map(c => c.id === id ? { ...c, [campo]: valor } : c));

  const totalRecebidoDinamico = casasVencedoras.reduce((acc, curr) => acc + (parseFloat(curr.valor.replace(',', '.')) || 0), 0);
  const lucroFinalDinamico = totalRecebidoDinamico - trade.valor;

  const handleConfirmarResolucao = () => {
    if (totalRecebidoDinamico <= 0) return alert("Insira o valor recebido nas casas vencedoras.");
    onResolve(trade.id, totalRecebidoDinamico, lucroFinalDinamico);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-[#18181b] border border-border/80 rounded-2xl shadow-2xl animate-in zoom-in-95 relative z-50 flex flex-col">
        
        <CabecalhoModalOperacao titulo={trade.jogo} subtitulo={trade.mercado} onClose={onClose} />

        <div className="flex flex-col p-5 gap-4 max-h-[50vh] overflow-y-auto custom-scrollbar">
          {entradasEditadas.map((entrada, index) => {
            const isPrincipal = entrada.tipo === 'principal';
            const Icone = isPrincipal ? Swords : ShieldCheck;
            const corTema = isPrincipal ? 'text-brand border-brand/20 bg-brand/5' : 'text-gray-300 border-gray-600/30 bg-[#18181b]/50';

            return (
              <div key={entrada.id} className={`flex flex-col p-4 border rounded-xl relative ${corTema} animate-in fade-in`}>
                <span className={`absolute -top-2.5 left-3 px-2 text-[10px] font-bold uppercase tracking-wider bg-[#18181b] border rounded-md flex items-center gap-1 ${isPrincipal ? 'text-brand border-brand/20' : 'text-gray-400 border-gray-600/30'}`}>
                  <Icone className="w-3 h-3" /> {isPrincipal ? 'Entrada Principal' : `Proteção`}
                </span>
                
                <div className="flex items-center justify-between mt-1 mb-2 gap-3">
                  {isEditing ? (
                    // AQUI ESTÁ O NOVO COMPONENTE NA TELA DE EDIÇÃO!
                    <div className="flex-1">
                      <SelectCasaComBusca 
                        value={entrada.casa}
                        casas={casasOficiaisDB}
                        onChange={(novoNome) => handleAtualizarEntradaStr(entrada.id, 'casa', novoNome)}
                        isOpen={dropdownAbertoId === entrada.id}
                        onToggle={() => setDropdownAbertoId(dropdownAbertoId === entrada.id ? null : entrada.id)}
                        onClose={() => setDropdownAbertoId(null)}
                      />
                    </div>
                  ) : (
                    <span className="text-sm font-bold text-white">{entrada.casa}</span>
                  )}

                  {isEditing && !isPrincipal && (
                    <button onClick={() => handleRemoveEntrada(entrada.id)} className="p-3 text-danger hover:bg-danger/10 rounded-xl transition-colors border border-transparent hover:border-danger/30" title="Excluir Entrada">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <ModalCamposOddStake 
                  odd={entrada.odd} stake={entrada.stake} isEditing={isEditing}
                  onOddChange={(valor) => handleAtualizarEntradaNum(entrada.id, 'odd', valor)}
                  onStakeChange={(valor) => handleAtualizarEntradaNum(entrada.id, 'stake', valor)}
                />
                
              </div>
            );
          })}

          {isEditing && (
            <button onClick={handleAddNovaEntrada} className="flex items-center justify-center gap-2 w-full py-3 mt-1 text-sm font-medium text-gray-400 border border-dashed border-border rounded-xl hover:text-white hover:border-gray-500 hover:bg-[#18181b]/50 transition-colors">
              <Plus className="w-4 h-4" /> Adicionar Nova Proteção
            </button>
          )}
        </div>

        {isResolving ? (
          <div className="flex flex-col p-5 border-t border-brand/30 bg-brand/5 rounded-b-2xl animate-in slide-in-from-bottom-2 gap-4">
            <h3 className="text-sm font-bold text-brand flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Onde o dinheiro caiu?
            </h3>
            
            <div className="flex flex-col gap-3">
              {casasVencedoras.map((casa, index) => (
                <div key={casa.id} className="flex items-end gap-2 relative z-[65]">
                  
                  {/* AQUI ESTÁ O NOVO COMPONENTE NA TELA DE RESOLUÇÃO! */}
                  <SelectCasaComBusca 
                    label={index === 0 ? "Casa de Aposta" : undefined}
                    value={casa.casaNome}
                    casas={casasOficiaisDB}
                    onChange={(novoNome) => updateCasaVencedora(casa.id, 'casaNome', novoNome)}
                    isOpen={dropdownAbertoId === casa.id}
                    onToggle={() => setDropdownAbertoId(dropdownAbertoId === casa.id ? null : casa.id)}
                    onClose={() => setDropdownAbertoId(null)}
                  />

                  <div className="w-[130px] relative">
                    {index === 0 && <label className="text-sm font-medium text-gray-300 block mb-2 opacity-0">Valor</label>}
                    <span className="absolute bottom-[13px] left-0 flex items-center pl-3 font-mono text-gray-400 text-sm">R$</span>
                    <input type="text" inputMode="decimal" placeholder="0,00" value={casa.valor} onChange={(e) => updateCasaVencedora(casa.id, 'valor', e.target.value)} className="w-full py-3 pl-9 pr-3 text-sm font-mono font-bold text-white bg-[#18181b] border border-border/80 rounded-xl outline-none focus:border-brand transition-colors" />
                  </div>

                  {index > 0 && (
                    <button onClick={() => handleRemoveCasaVencedora(casa.id)} className="mb-[2px] p-3 text-danger hover:bg-danger/10 rounded-xl transition-colors border border-transparent hover:border-danger/30">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button onClick={handleAddCasaVencedora} className="flex items-center gap-2 text-xs font-bold text-brand hover:text-brand/80 transition-colors w-fit mt-2">
              <Plus className="w-4 h-4" /> Adicionar Outra Casa (Duplo / Parcial)
            </button>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-brand/20">
              <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-400">Lucro Líquido Real</span>
                <span className={`text-xl font-bold font-mono ${lucroFinalDinamico >= 0 ? 'text-success' : 'text-danger'}`}>
                  {lucroFinalDinamico > 0 ? '+' : ''}{lucroFinalDinamico.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
              
              <div className="flex gap-3">
                <button onClick={() => setIsResolving(false)} className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">Voltar</button>
                <button onClick={handleConfirmarResolucao} disabled={totalRecebidoDinamico <= 0} className="flex items-center gap-2 px-5 py-2 text-sm font-bold bg-success text-background rounded-xl shadow-[0_0_10px_rgba(34,197,94,0.3)] hover:bg-success/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  <CheckCircle2 className="w-4 h-4" /> Confirmar Baixa
                </button>
              </div>
            </div>
          </div>
        ) : (
          <RodapeModalOperacao 
            lucro={lucroAoVivo} 
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