import { useState } from 'react';
import { X, Target, Tag, Save } from 'lucide-react';
import { InputSelect } from '@/components/ui/InputSelect';

interface ModalNovaMetaProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ModalNovaMeta({ isOpen, onClose }: ModalNovaMetaProps) {
  const [categoria, setCategoria] = useState('');
  const [valor, setValor] = useState('');

  // Se o modal não estiver aberto, não renderiza nada na tela
  if (!isOpen) return null;

  return (
    // CAMADA DE FUNDO (Cobre a tela toda, escurece e desfoque)
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      
      {/* A JANELA DO MODAL */}
      <div className="w-full max-w-md border shadow-2xl bg-surface border-border/80 rounded-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between p-5 border-b border-border/50 bg-[#18181b]/50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand/10 text-brand">
              <Target className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-white">Novo Limite de Gasto</h2>
          </div>
          
          <button 
            onClick={onClose}
            className="p-2 transition-colors rounded-lg text-gray-400 hover:text-white hover:bg-border/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo do Modal (Formulário) */}
        <div className="flex flex-col gap-6 p-6">
          
          <InputSelect 
            label="Para qual categoria?"
            icon={Tag}
            placeholder="Selecione a categoria..."
            value={categoria}
            onClick={() => console.log('Abre lista de categorias dentro do modal')}
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">
              Qual o teto máximo mensal?
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <span className="font-mono text-gray-500">R$</span>
              </div>
              <input 
                type="text" 
                placeholder="0,00"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                className="w-full py-3 pl-12 pr-4 font-mono text-xl text-white transition-colors border rounded-xl bg-[#18181b] border-border focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/50 placeholder:text-gray-600"
              />
            </div>
          </div>

        </div>

        {/* Rodapé do Modal (Botões) */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-border/50 bg-[#18181b]/50 rounded-b-2xl">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium transition-colors text-gray-400 hover:text-white"
          >
            Cancelar
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-background bg-brand rounded-xl hover:bg-brand/90 transition-colors shadow-[0_0_15px_rgba(251,169,76,0.3)]">
            <Save className="w-4 h-4" />
            Salvar Meta
          </button>
        </div>

      </div>
    </div>
  );
}