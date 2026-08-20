import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe, Target, Swords, Zap, Star } from 'lucide-react';

// ==========================================
// MOCK: CASAS CADASTRADAS (Com ícones e cores)
// Isso refletirá exatamente o seu banco de dados depois
// ==========================================
export const CASAS_CADASTRADAS = [
  { id: 'bet365', nome: 'Bet365', corText: 'text-emerald-500', corBg: 'bg-emerald-500/10', icone: Globe },
  { id: 'betano', nome: 'Betano', corText: 'text-orange-500', corBg: 'bg-orange-500/10', icone: Target },
  { id: 'betfair', nome: 'Betfair', corText: 'text-yellow-500', corBg: 'bg-yellow-500/10', icone: Swords },
  { id: 'pinnacle', nome: 'Pinnacle', corText: 'text-blue-500', corBg: 'bg-blue-500/10', icone: Zap },
  { id: 'outra', nome: 'Outra Casa', corText: 'text-gray-400', corBg: 'bg-gray-400/10', icone: Star },
];

interface SeletorCasaApostaProps {
  label?: string;
  tema?: 'brand' | 'orange' | 'gray' | 'success';
  tamanho?: 'sm' | 'md';
}

export function SeletorCasaAposta({ 
  label = "Casa de Aposta", 
  tema = "brand",
  tamanho = "sm"
}: SeletorCasaApostaProps) {
  
  const [isOpen, setIsOpen] = useState(false);
  const [casaSelecionada, setCasaSelecionada] = useState<typeof CASAS_CADASTRADAS[0] | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fecha o dropdown se clicar fora dele
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cores da borda baseadas no tema do bloco
  const corBorda = {
    brand: isOpen ? "border-brand" : "border-border hover:border-gray-600",
    orange: isOpen ? "border-orange-500" : "border-border hover:border-gray-600",
    gray: isOpen ? "border-gray-400" : "border-border hover:border-gray-600",
    success: isOpen ? "border-success" : "border-border hover:border-gray-600",
  }[tema];

  const cssTamanho = tamanho === 'sm' ? "py-2 px-3 min-h-[38px]" : "py-3 px-4 min-h-[50px]";
  const cssLabel = tamanho === 'sm' ? "text-xs font-medium text-gray-400" : "text-sm font-medium text-gray-300";

  return (
    <div className="flex flex-col gap-2 relative" ref={dropdownRef}>
      <label className={cssLabel}>{label}</label>
      
      {/* INPUT CUSTOMIZADO (Botão que abre o dropdown) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between text-left text-white bg-[#18181b] border rounded-lg transition-colors outline-none ${cssTamanho} ${corBorda}`}
      >
        {casaSelecionada ? (
          <div className="flex items-center gap-2">
            <div className={`p-1 rounded-md ${casaSelecionada.corBg} ${casaSelecionada.corText}`}>
              <casaSelecionada.icone className={tamanho === 'sm' ? "w-3 h-3" : "w-4 h-4"} />
            </div>
            <span className={tamanho === 'sm' ? "text-sm" : "text-base font-medium"}>
              {casaSelecionada.nome}
            </span>
          </div>
        ) : (
          <span className={`text-gray-500 ${tamanho === 'sm' ? "text-sm" : "text-base"}`}>
            Selecione a casa...
          </span>
        )}
        <ChevronDown className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''} ${tamanho === 'sm' ? 'w-4 h-4' : 'w-5 h-5'}`} />
      </button>

      {/* MENU DROPDOWN */}
      {isOpen && (
        <div className="absolute top-[100%] left-0 w-full mt-1 p-1 bg-[#18181b] border border-border/80 rounded-xl shadow-xl z-50 animate-in fade-in zoom-in-95">
          {CASAS_CADASTRADAS.map((casa) => (
            <button
              key={casa.id}
              onClick={() => {
                setCasaSelecionada(casa);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-surface transition-colors text-left"
            >
              <div className={`p-1.5 rounded-md ${casa.corBg} ${casa.corText}`}>
                <casa.icone className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-white">{casa.nome}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}