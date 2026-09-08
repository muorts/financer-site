import { Trash2, AlertCircle, Ticket } from 'lucide-react';

export interface Freebet {
  id: string;
  casa: string;
  valor: number;
  vencimento: string;
}

interface DetalhesDiaSelecionadoProps {
  diaSelecionado: number | null;
  freebetsDoDia: Freebet[];
  // O TypeScript agora sabe que essa função existe e espera receber um ID
  onDelete: (id: string) => void; 
}

export function DetalhesDiaSelecionado({ diaSelecionado, freebetsDoDia, onDelete }: DetalhesDiaSelecionadoProps) {
  
  // Estado 1: Nenhum dia clicado
  if (!diaSelecionado) {
    return (
      <div className="flex flex-col items-center justify-center p-6 border bg-surface/40 border-border/80 rounded-2xl shadow-sm min-h-62.5 text-center">
        <Ticket className="w-12 h-12 text-gray-500 mb-3 opacity-20" />
        <p className="text-sm font-medium text-gray-400">Selecione um dia no calendário para ver os detalhes.</p>
      </div>
    );
  }

  // Estado 2: Dia clicado (Com ou sem freebets)
  return (
    <div className="flex flex-col p-6 border bg-surface/40 border-border/80 rounded-2xl shadow-sm min-h-62.5">
      <h3 className="text-sm font-bold text-white mb-4 pb-4 border-b border-border/50 flex items-center justify-between">
        <span>Freebets do dia {diaSelecionado}</span>
        <span className="px-2 py-0.5 bg-orange-500/20 text-orange-500 rounded-md text-xs font-bold">
          {freebetsDoDia.length}
        </span>
      </h3>

      {freebetsDoDia.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 text-center opacity-50">
          <AlertCircle className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-xs text-gray-400">Nenhum vencimento para esta data.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {freebetsDoDia.map(fb => (
            <div key={fb.id} className="flex items-center justify-between p-3 bg-[#18181b] border border-orange-500/20 rounded-xl relative group overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>
              
              <div className="flex flex-col pl-2">
                <span className="text-sm font-bold text-white">{fb.casa}</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">Voucher Pendente</span>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-orange-500">
                  {fb.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
                
                {/* Botão de Excluir que dispara a função enviada pelo elemento Pai */}
                <button 
                  onClick={() => onDelete(fb.id)}
                  className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Excluir Freebet (Perdeu o prazo)"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}