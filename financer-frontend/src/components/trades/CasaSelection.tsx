"use client";

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe, Target, Swords, Zap, Star, Building2 } from 'lucide-react';

// ==========================================
// INTERFACE DA CASA (Vinda do Backend)
// ==========================================
interface CasaAposta {
  id: string;
  nome: string;
  cor: string;
  iconeId: string;
}

// Props agora recebem o "onChange" para enviar o ID escolhido para cima
interface SeletorCasaApostaProps {
  label?: string;
  tema?: 'brand' | 'orange' | 'gray' | 'success';
  tamanho?: 'sm' | 'md';
  value?: string; // O ID da casa atualmente selecionada
  onChange?: (casaId: string) => void; // Função que avisa o pai da mudança
}

// Mapa rápido para renderizar os ícones dinamicamente
const getIcone = (iconeId: string) => {
  const icones: Record<string, any> = {
    globe: Globe,
    target: Target,
    swords: Swords,
    zap: Zap,
    star: Star,
  };
  return icones[iconeId] || Building2;
};

export function SeletorCasaAposta({ 
  label = "Casa de Aposta", 
  tema = "brand",
  tamanho = "sm",
  value,
  onChange
}: SeletorCasaApostaProps) {
  
  const [isOpen, setIsOpen] = useState(false);
  const [casas, setCasas] = useState<CasaAposta[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ==========================================
  // BUSCAR CASAS DO BANCO DE DADOS
  // ==========================================
  useEffect(() => {
    fetch('http://localhost:8080/api/casas')
      .then(res => res.json())
      .then(data => setCasas(data))
      .catch(err => console.error("Erro ao buscar casas no seletor:", err));
  }, []);

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

  // Descobre qual é a casa completa baseada no ID (value) que foi passado
  const casaSelecionada = casas.find(c => c.id === value);

  const handleSelect = (casa: CasaAposta) => {
    if (onChange) {
      onChange(casa.id); // Manda o UUID oficial pro pai!
    }
    setIsOpen(false);
  };

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
      
      {/* INPUT CUSTOMIZADO */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between text-left text-white bg-[#18181b] border rounded-lg transition-colors outline-none ${cssTamanho} ${corBorda}`}
      >
        {casaSelecionada ? (
          <div className="flex items-center gap-2">
            {/* Renderiza a cor dinâmica do banco */}
            <div className={`p-1 rounded-md bg-${casaSelecionada.cor}-500/10 text-${casaSelecionada.cor}-500`}>
              {(() => {
                const Icone = getIcone(casaSelecionada.iconeId);
                return <Icone className={tamanho === 'sm' ? "w-3 h-3" : "w-4 h-4"} />;
              })()}
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

      {/* MENU DROPDOWN CONECTADO AO BANCO */}
      {isOpen && (
        <div className="absolute top-[100%] left-0 w-full mt-1 p-1 bg-[#18181b] border border-border/80 rounded-xl shadow-xl z-50 animate-in fade-in zoom-in-95 max-h-60 overflow-y-auto">
          {casas.length === 0 ? (
            <div className="p-3 text-sm text-center text-gray-500">Nenhuma casa cadastrada</div>
          ) : (
            casas.map((casa) => {
              const Icone = getIcone(casa.iconeId);
              return (
                <button
                  key={casa.id}
                  onClick={() => handleSelect(casa)}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-surface transition-colors text-left"
                >
                  <div className={`p-1.5 rounded-md bg-${casa.cor}-500/10 text-${casa.cor}-500`}>
                    <Icone className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-white">{casa.nome}</span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}