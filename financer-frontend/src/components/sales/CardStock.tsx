import { useState } from 'react';
import { 
  ChevronDown, ChevronUp, Package, Tag, 
  Wrench, CheckCircle2, Megaphone, Plus, BadgeDollarSign, Pencil
} from 'lucide-react';

interface CardEstoqueProps {
  item: any;
  onAddCusto: (id: string) => void;
  onVender: (id: string) => void;
  onEditar: (id: string) => void; // <--- NOVA PROP AQUI
}

export function CardEstoque({ item, onAddCusto, onVender, onEditar }: CardEstoqueProps) {
  const [obsAberta, setObsAberta] = useState(false);

  const renderBadge = (status: string) => {
    switch (status) {
      case 'manutencao':
        return <span className="flex items-center gap-1 px-2 py-1 text-xs font-bold text-red-500 bg-red-500/10 rounded-md border border-red-500/20"><Wrench className="w-3 h-3" /> Na Bancada</span>;
      case 'pronto':
        return <span className="flex items-center gap-1 px-2 py-1 text-xs font-bold text-yellow-500 bg-yellow-500/10 rounded-md border border-yellow-500/20"><CheckCircle2 className="w-3 h-3" /> Pronto</span>;
      case 'anunciado':
        return <span className="flex items-center gap-1 px-2 py-1 text-xs font-bold text-success bg-success/10 rounded-md border border-success/20"><Megaphone className="w-3 h-3" /> Anunciado</span>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col overflow-hidden transition-all border bg-surface/40 border-border/80 rounded-2xl shadow-sm hover:border-gray-600/50">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col gap-3 p-5 border-b border-border/50 bg-[#18181b]/30">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 border rounded-xl bg-surface text-gray-400 border-border">
              <Package className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <h3 className="font-bold text-white text-md">{item.nome}</h3>
              <div className="flex items-center gap-2 mt-1">
                {renderBadge(item.status)}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-1">
            {/* BOTÃO DE EDITAR ADICIONADO AQUI */}
            <button 
              onClick={() => onEditar(item.id)}
              className="p-1.5 transition-colors border rounded-lg bg-surface border-border hover:border-gray-500 text-gray-400 hover:text-white"
              title="Editar Item"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <div className="flex flex-col items-end mt-1">
              <span className="text-xs text-gray-500">Custo Atual</span>
              <span className="font-mono font-bold text-white">
                {item.custo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>
          </div>
        </div>

        {/* PLATAFORMAS */}
        {item.plataformas.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1 ml-13">
            {item.plataformas.map((plat: string) => (
              <span key={plat} className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-400 border rounded-md bg-surface border-border">
                <Tag className="w-3 h-3" /> {plat}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* OBSERVAÇÕES */}
      {item.observacoes && (
        <div className="flex flex-col border-b border-border/50">
          <button 
            onClick={() => setObsAberta(!obsAberta)}
            className="flex items-center justify-between p-3 text-xs font-medium transition-colors text-gray-400 hover:text-white hover:bg-[#18181b]/50"
          >
            <span>Ver anotações do item</span>
            {obsAberta ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {obsAberta && (
            <div className="p-4 text-sm text-gray-300 bg-[#18181b]/80 border-t border-border/50">
              {item.observacoes}
            </div>
          )}
        </div>
      )}

      {/* RODAPÉ DE AÇÕES */}
      <div className="flex items-center justify-between p-4 bg-[#18181b]/50">
        <button 
          onClick={() => onAddCusto(item.id)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold transition-colors border rounded-xl bg-surface border-border hover:border-gray-500 text-gray-300"
        >
          <Plus className="w-3 h-3" />
          Custo Extra
        </button>
        
        <button 
          onClick={() => onVender(item.id)}
          className="flex items-center gap-2 px-5 py-2 text-sm font-bold transition-colors rounded-xl text-background bg-brand hover:bg-brand/90 shadow-[0_0_10px_rgba(var(--brand),0.2)]"
        >
          <BadgeDollarSign className="w-4 h-4" />
          Confirmar Venda
        </button>
      </div>
    </div>
  );
}