import { Edit2, Save } from 'lucide-react';

interface RodapeModalOperacaoProps {
  lucro: number;
  isEditing: boolean;
  onEditToggle: (editing: boolean) => void;
  onSave: () => void;
}

export function RodapeModalOperacao({
  lucro,
  isEditing,
  onEditToggle,
  onSave
}: RodapeModalOperacaoProps) {
  const isLucro = lucro >= 0;
  const corLucro = isLucro ? 'text-success' : 'text-danger';
  const sinal = lucro > 0 ? '+' : '';

  return (
    <div className="flex items-center justify-between p-5 border-t border-border/50 bg-surface/30">
      {/* EXIBIÇÃO DO LUCRO/PREJUÍZO PREVISTO */}
      <div className="flex flex-col">
        <span className="text-xs text-gray-500 font-medium">Lucro Previsto</span>
        <span className={`text-lg font-bold font-mono ${corLucro}`}>
          {sinal}{lucro.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </span>
      </div>

      {/* BOTÕES DE AÇÃO */}
      <div className="flex items-center gap-3">
        {isEditing ? (
          <>
            <button 
              type="button"
              onClick={() => onEditToggle(false)}
              className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="button"
              onClick={onSave}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-success text-background rounded-xl shadow-[0_0_10px_rgba(34,197,94,0.3)] hover:bg-success/90 transition-all"
            >
              <Save className="w-4 h-4" />
              Salvar Edição
            </button>
          </>
        ) : (
          <button 
            type="button"
            onClick={() => onEditToggle(true)}
            className="flex items-center gap-2 px-5 py-2 text-sm font-bold bg-surface border border-border hover:border-gray-500 text-white rounded-xl transition-all"
          >
            <Edit2 className="w-4 h-4" />
            Editar Valores
          </button>
        )}
      </div>
    </div>
  );
}