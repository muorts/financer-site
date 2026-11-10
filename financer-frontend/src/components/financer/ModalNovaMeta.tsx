import { useState } from 'react';
import Link from 'next/link';
import { X, Target, Tag, Save, Check } from 'lucide-react';
import { InputSelect } from '@/components/ui/InputSelect';
import { CategoriaDTO, getIconePorId, getClassesCor, parseValorMonetario } from '@/lib/util';

interface ModalNovaMetaProps {
  isOpen: boolean;
  onClose: () => void;
  categorias: CategoriaDTO[];
  onSalvar: (categoriaId: string, limiteMaximo: number) => Promise<void>;
}

export function ModalNovaMeta({ isOpen, onClose, categorias, onSalvar }: ModalNovaMetaProps) {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<CategoriaDTO | null>(null);
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const [valor, setValor] = useState('');
  const [salvando, setSalvando] = useState(false);

  if (!isOpen) return null;

  const handleConfirmar = async () => {
    const limite = parseValorMonetario(valor);
    if (!categoriaSelecionada || limite <= 0) return;

    setSalvando(true);
    try {
      await onSalvar(categoriaSelecionada.id, limite);
      setCategoriaSelecionada(null);
      setValor('');
      onClose();
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
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
          
          <div className="relative">
            <InputSelect 
              label="Para qual categoria?"
              icon={categoriaSelecionada ? getIconePorId(categoriaSelecionada.icone) : Tag}
              placeholder="Selecione a categoria..."
              value={categoriaSelecionada ? categoriaSelecionada.nome : ''}
              onClick={() => setDropdownAberto(!dropdownAberto)}
            />

            {dropdownAberto && (
              <div className="mt-2 max-h-52 overflow-y-auto rounded-xl border border-border bg-[#131316] p-2 shadow-xl flex flex-col gap-1">
                {categorias.length === 0 ? (
                  <div className="p-3 text-center text-sm text-gray-400">
                    Nenhuma categoria de saída encontrada.{' '}
                    <Link href="/financer/categorias" className="text-brand underline">
                      Criar categoria
                    </Link>
                  </div>
                ) : (
                  categorias.map((cat) => {
                    const IconeCat = getIconePorId(cat.icone);
                    const cores = getClassesCor(cat.cor);
                    const isSel = categoriaSelecionada?.id === cat.id;

                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setCategoriaSelecionada(cat);
                          setDropdownAberto(false);
                        }}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                          isSel ? 'bg-brand/15 border border-brand/40' : 'hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${cores.border} ${cores.bgSoft} ${cores.text}`}>
                            <IconeCat className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-medium text-white">{cat.nome}</span>
                        </div>
                        {isSel && <Check className="w-4 h-4 text-brand" />}
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>

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
          <button 
            onClick={handleConfirmar}
            disabled={salvando || !categoriaSelecionada || parseValorMonetario(valor) <= 0}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-background bg-brand rounded-xl hover:bg-brand/90 transition-colors shadow-[0_0_15px_rgba(251,169,76,0.3)] disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {salvando ? 'Salvando...' : 'Salvar Meta'}
          </button>
        </div>

      </div>
    </div>
  );
}
