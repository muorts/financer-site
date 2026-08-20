import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

// Tipagem básica para as freebets que o calendário vai receber
interface Freebet {
  id: string;
  casa: string;
  valor: number;
  vencimento: string;
}

interface CalendarioVencimentosProps {
  freebets: Freebet[];
  diaSelecionado: number | null;
  onSelectDia: (dia: number) => void;
}

export function CalendarioVencimentos({ freebets, diaSelecionado, onSelectDia }: CalendarioVencimentosProps) {
  // Lógica de Datas para o Calendário (Fixado para Agosto de 2026 no nosso mock)
  const mesAtual = new Date(2026, 7, 18); // Agosto (0-indexed: 7)
  const diasNoMes = new Date(mesAtual.getFullYear(), mesAtual.getMonth() + 1, 0).getDate();
  const primeiroDiaDoMes = new Date(mesAtual.getFullYear(), mesAtual.getMonth(), 1).getDay(); // 0 = Dom, 1 = Seg...
  const diasArray = Array.from({ length: diasNoMes }, (_, i) => i + 1);
  const espacosVazios = Array.from({ length: primeiroDiaDoMes }, (_, i) => i);

  return (
    <div className="lg:col-span-2 flex flex-col p-6 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-brand" />
          <h2 className="text-lg font-bold text-white">Vencimento de Freebets</h2>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-1 text-gray-400 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium text-gray-300">Agosto 2026</span>
          <button className="p-1 text-gray-400 hover:text-white transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Grid de Dias da Semana */}
      <div className="grid grid-cols-7 gap-2 text-center mb-2">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(dia => (
          <span key={dia} className="text-xs font-medium text-gray-500 uppercase">{dia}</span>
        ))}
      </div>

      {/* Grid de Dias do Mês */}
      <div className="grid grid-cols-7 gap-2">
        {espacosVazios.map(i => (
          <div key={`vazio-${i}`} className="h-10"></div>
        ))}
        
        {diasArray.map(dia => {
          // Verifica se tem freebet vencendo neste dia
          const temFreebet = freebets.some(fb => parseInt(fb.vencimento.split('-')[2]) === dia);
          const isSelecionado = diaSelecionado === dia;
          const isHoje = dia === 18; // Simulando dia de hoje

          return (
            <button
              key={dia}
              onClick={() => onSelectDia(dia)}
              className={`relative flex flex-col items-center justify-center h-12 rounded-xl text-sm font-medium transition-all ${
                isSelecionado 
                  ? 'bg-brand text-background shadow-md' 
                  : isHoje
                    ? 'bg-surface/80 text-white border border-gray-600'
                    : 'text-gray-400 hover:bg-surface hover:text-white border border-transparent'
              }`}
            >
              {dia}
              {/* O Famoso Ponto Laranja de Aviso */}
              {temFreebet && (
                <span className={`absolute bottom-2 w-1.5 h-1.5 rounded-full ${isSelecionado ? 'bg-background' : 'bg-orange-500 shadow-[0_0_5px_rgba(249,115,22,0.8)]'}`}></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}