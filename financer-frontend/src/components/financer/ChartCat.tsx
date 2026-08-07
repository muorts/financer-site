"use client";

import { useState } from 'react';

interface DadoGrafico {
  categoria: string;
  valor: string;
  percentual: number;
  cor: string;
}

interface GraficoCategoriaProps {
  titulo: string;
  valorTotal: string;
  dados: DadoGrafico[];
}

export function ChartCat({ titulo, valorTotal, dados }: GraficoCategoriaProps) {
  const [hovered, setHovered] = useState<DadoGrafico | null>(null);
  let offsetAcumulado = 0;

  return (
    <div className="flex flex-col items-center gap-3">
      <h3 className="text-sm font-medium text-gray-400">{titulo}</h3>
      
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 42 42" className="w-full h-full transform -rotate-90 overflow-visible">
          
          {/* CORREÇÃO: fill="none" para o fundo não capturar o mouse */}
          <circle r="15.9155" cx="21" cy="21" fill="none" stroke="#323238" strokeWidth="3" />
          
          {dados.map((dado) => {
            const dasharray = `${dado.percentual} ${100 - dado.percentual}`;
            const offsetAtual = offsetAcumulado;
            offsetAcumulado -= dado.percentual;

            return (
              <circle
                key={dado.categoria}
                r="15.9155"
                cx="21"
                cy="21"
                fill="none" // MÁGICA 1: Sem preenchimento
                pointerEvents="stroke" // MÁGICA 2: Mouse só detecta a borda (linha)
                stroke="currentColor"
                strokeWidth={hovered?.categoria === dado.categoria ? "4.5" : "3"}
                className={`${dado.cor} transition-all duration-300 cursor-pointer outline-none`}
                strokeDasharray={dasharray}
                strokeDashoffset={offsetAtual}
                onMouseEnter={() => setHovered(dado)}
                onMouseLeave={() => setHovered(null)}
              />
            );
          })}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider text-center px-2">
            {hovered ? hovered.categoria : 'Total'}
          </span>
          <span className={`font-mono font-bold text-sm ${hovered ? hovered.cor : 'text-white'}`}>
            {hovered ? hovered.valor : valorTotal}
          </span>
        </div>
      </div>
    </div>
  );
}