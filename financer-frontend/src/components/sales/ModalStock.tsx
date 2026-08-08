import { useState } from 'react';
import { X, Wrench, BadgeDollarSign, Tag, Truck } from 'lucide-react';
import { NameInput } from '@/components/ui/NameInput';
import { InputSelect } from '@/components/ui/InputSelect';
import { useEffect } from 'react';

// MODAL 1: CUSTO EXTRA (Manutenção/Peças)
export function ModalCustoExtra({ isOpen, onClose, onSave }: { isOpen: boolean, onClose: () => void, onSave: (valor: number, desc: string) => void }) {
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm border shadow-2xl bg-surface border-border/80 rounded-2xl animate-in fade-in zoom-in-95">
        
        <div className="flex items-center justify-between p-5 border-b border-border/50 bg-[#18181b]/50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-500/10 text-orange-500">
              <Wrench className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-white">Adicionar Custo</h2>
          </div>
          <button onClick={onClose} className="p-2 transition-colors rounded-lg text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex flex-col gap-5 p-6">
          <NameInput label="Com o que você gastou?" icon={Tag} placeholder="ex: Película / Analógico" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Valor do Custo</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 font-mono text-gray-500">R$</span>
              <input type="text" placeholder="0,00" value={valor} onChange={(e) => setValor(e.target.value)} className="w-full py-3 pl-12 pr-4 font-mono text-white transition-colors border rounded-xl bg-[#18181b] border-border focus:border-orange-500 focus:outline-none" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-5 border-t border-border/50 bg-[#18181b]/50 rounded-b-2xl">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-400">Cancelar</button>
          <button onClick={() => onSave(parseFloat(valor.replace(',', '.')), descricao)} className="px-5 py-2 text-sm font-bold text-white bg-orange-500 rounded-xl hover:bg-orange-600">Somar ao Custo</button>
        </div>
      </div>
    </div>
  );
}

// MODAL 2: CONFIRMAR VENDA
export function ModalConfirmarVenda({ isOpen, onClose, onConfirm }: { isOpen: boolean, onClose: () => void, onConfirm: (dados: any) => void }) {
  const [valorVenda, setValorVenda] = useState('');
  const [plataforma, setPlataforma] = useState('OLX');
  const [taxas, setTaxas] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md border shadow-2xl bg-surface border-border/80 rounded-2xl animate-in fade-in zoom-in-95">
        
        <div className="flex items-center justify-between p-5 border-b border-border/50 bg-[#18181b]/50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand/10 text-brand">
              <BadgeDollarSign className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-white">Confirmar Venda</h2>
          </div>
          <button onClick={onClose} className="p-2 transition-colors rounded-lg text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex flex-col gap-5 p-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Valor Final da Venda</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 font-mono text-gray-500">R$</span>
              <input type="text" placeholder="0,00" value={valorVenda} onChange={(e) => setValorVenda(e.target.value)} className="w-full py-3 pl-12 pr-4 text-2xl font-bold font-mono text-white transition-colors border rounded-xl bg-[#18181b] border-border focus:border-brand focus:outline-none text-center" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">Vendido por onde?</label>
              <select value={plataforma} onChange={(e) => setPlataforma(e.target.value)} className="w-full py-3 px-4 text-white transition-colors border rounded-xl bg-[#18181b] border-border focus:border-brand outline-none cursor-pointer appearance-none">
                <option>OLX</option>
                <option>Mercado Livre</option>
                <option>Facebook</option>
                <option>Particular</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">Taxas / Frete (Opcional)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500"><Truck className="w-4 h-4" /></span>
                <input type="text" placeholder="R$ 0,00" value={taxas} onChange={(e) => setTaxas(e.target.value)} className="w-full py-3 pl-10 pr-4 font-mono text-white transition-colors border rounded-xl bg-[#18181b] border-border focus:border-brand outline-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-5 border-t border-border/50 bg-[#18181b]/50 rounded-b-2xl">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-400">Cancelar</button>
          <button onClick={() => onConfirm({ valorVenda, plataforma, taxas })} className="px-6 py-2.5 text-sm font-bold text-background bg-brand rounded-xl hover:bg-brand/90 shadow-[0_0_15px_rgba(var(--brand),0.3)]">Liquidar Item</button>
        </div>
      </div>
    </div>
  );
}

// MODAL 3: EDITAR ITEM
export function ModalEditarItem({ 
  isOpen, 
  onClose, 
  onSave, 
  itemAtual 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onSave: (dadosAtualizados: any) => void,
  itemAtual: any
}) {
  const [nome, setNome] = useState('');
  const [status, setStatus] = useState('pronto');
  // Agora plataformas é um Array de strings, não mais uma string única
  const [plataformas, setPlataformas] = useState<string[]>([]);
  const [observacoes, setObservacoes] = useState('');

  // As opções pré-definidas que o sistema aceita
  const PLATAFORMAS_DISPONIVEIS = ['OLX', 'Mercado Livre', 'Facebook', 'Particular'];

  // Carrega os dados do item quando o modal abrir
  useEffect(() => {
    if (itemAtual) {
      setNome(itemAtual.nome);
      setStatus(itemAtual.status);
      setPlataformas(itemAtual.plataformas || []);
      setObservacoes(itemAtual.observacoes || '');
    }
  }, [itemAtual]);

  // Função para ligar/desligar uma plataforma com um clique
  const togglePlataforma = (plat: string) => {
    if (plataformas.includes(plat)) {
      setPlataformas(plataformas.filter(p => p !== plat));
    } else {
      setPlataformas([...plataformas, plat]);
    }
  };

  if (!isOpen || !itemAtual) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md border shadow-2xl bg-surface border-border/80 rounded-2xl animate-in fade-in zoom-in-95">
        
        <div className="flex items-center justify-between p-5 border-b border-border/50 bg-[#18181b]/50 rounded-t-2xl">
          <h2 className="font-bold text-white">Editar Detalhes do Item</h2>
          <button onClick={onClose} className="p-2 transition-colors rounded-lg text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-5 p-6">
          <NameInput 
            label="Nome do Item" 
            icon={Tag} 
            placeholder="Nome do produto" 
            value={nome} 
            onChange={(e) => setNome(e.target.value)} 
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Status no Estoque</label>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)} 
              className="w-full py-3 px-4 text-white transition-colors border rounded-xl bg-[#18181b] border-border focus:border-brand outline-none cursor-pointer appearance-none"
            >
              <option value="manutencao">Na Bancada / Manutenção</option>
              <option value="pronto">Pronto para Venda</option>
              <option value="anunciado">Já Anunciado</option>
            </select>
          </div>

          {/* NOVO SELETOR DE PLATAFORMAS (CHIPS CLICÁVEIS) */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Anunciado onde?</label>
            <div className="flex flex-wrap gap-2">
              {PLATAFORMAS_DISPONIVEIS.map((plat) => {
                const isAtivo = plataformas.includes(plat);
                
                return (
                  <button
                    key={plat}
                    type="button"
                    onClick={() => togglePlataforma(plat)}
                    className={`px-3 py-1.5 text-sm font-medium transition-all border rounded-lg ${
                      isAtivo 
                        ? 'bg-brand/20 border-brand text-brand' 
                        : 'bg-[#18181b] border-border text-gray-400 hover:text-white hover:border-gray-500'
                    }`}
                  >
                    {plat}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Observações Gerais</label>
            <textarea 
              rows={3}
              placeholder="Anotações sobre a condição, bateria, reparos..." 
              value={observacoes} 
              onChange={(e) => setObservacoes(e.target.value)} 
              className="w-full py-3 px-4 text-white transition-colors border rounded-xl bg-[#18181b] border-border focus:border-brand outline-none placeholder:text-gray-600 resize-none" 
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-5 border-t border-border/50 bg-[#18181b]/50 rounded-b-2xl">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-400">Cancelar</button>
          <button 
            onClick={() => onSave({ nome, status, plataformas, observacoes })} 
            className="px-6 py-2.5 text-sm font-bold text-background bg-brand rounded-xl hover:bg-brand/90 shadow-[0_0_15px_rgba(var(--brand),0.3)]"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}