import { Ticket, AlertCircle, Calendar as CalendarIcon } from 'lucide-react';

interface Freebet {
  id: string;
  casa: string;
  valor: number;
  vencimento: string;
}

interface DetalhesDiaSelecionadoProps {
  diaSelecionado: number | null;
  freebetsDoDia: Freebet[];
}

export function DetalhesDiaSelecionado({ diaSelecionado, freebetsDoDia }: DetalhesDiaSelecionadoProps) {
  return (
    <div className="flex flex-col p-6 border bg-surface/40 border-border/80 rounded-2xl shadow-sm h-full">
      {diaSelecionado ? (
        <>
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 border-b border-border/50 pb-3">
            <Ticket className="w-4 h-4 text-orange-500" />
            Agendamentos dia {diaSelecionado}
          </h3>

          {freebetsDoDia.length > 0 ? (
            <div className="flex flex-col gap-3">
              {freebetsDoDia.map(fb => (
                <div key={fb.id} className="flex flex-col p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-orange-500">{fb.casa}</span>
                    <span className="text-sm font-bold font-mono text-white">
                      {fb.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 mt-1">
                    Expira ao final do dia. Converta antes!
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center h-full gap-2 opacity-60">
              <AlertCircle className="w-8 h-8 text-gray-500" />
              <p className="text-sm text-gray-400">Nenhuma freebet ou bônus expirando neste dia.</p>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center text-center h-full gap-2 opacity-60">
          <CalendarIcon className="w-8 h-8 text-gray-500" />
          <p className="text-sm text-gray-400">Clique em um dia no calendário para ver os vencimentos.</p>
        </div>
      )}
    </div>
  );
}