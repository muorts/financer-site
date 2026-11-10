"use client";

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { NOMES_MESES } from '@/lib/util';

interface FiltersProps {
  mes?: number;
  ano?: number;
  onMudarMes?: (delta: number) => void;
  filtroAtivo?: string;
  onMudarFiltro?: (filtro: string) => void;
}

export function Filters({
  mes = new Date().getMonth() + 1,
  ano = new Date().getFullYear(),
  onMudarMes,
  filtroAtivo: filtroControlado,
  onMudarFiltro,
}: FiltersProps) {
  const [filtroInterno, setFiltroInterno] = useState('Todas');
  const filtroAtivo = filtroControlado ?? filtroInterno;

  const selecionarFiltro = (label: string) => {
    if (onMudarFiltro) {
      onMudarFiltro(label);
    } else {
      setFiltroInterno(label);
    }
  };

  const filtros = [
    { id: 'todas', label: 'Todas' },
    { id: 'entradas', label: 'Só Entradas' },
    { id: 'saidas', label: 'Só Saídas' },
  ];

  return (
    <div className="flex flex-col gap-5 p-5 border bg-surface/40 border-border/80 rounded-xl">
      
      {/* Carrossel de Meses */}
      <div className="flex items-center justify-between px-2 text-gray-400">
        <button 
          type="button"
          onClick={() => onMudarMes && onMudarMes(-1)}
          className="p-2 transition-colors rounded-full hover:bg-border/50 hover:text-white"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="font-medium text-white">
          {NOMES_MESES[mes - 1]} {ano}
        </span>
        <button 
          type="button"
          onClick={() => onMudarMes && onMudarMes(1)}
          className="p-2 transition-colors rounded-full hover:bg-border/50 hover:text-white"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Chips de Filtro */}
      <div className="flex gap-2 pb-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
        {filtros.map((filtro) => {
          const isAtivo = filtroAtivo === filtro.label;

          return (
            <button
              key={filtro.id}
              type="button"
              onClick={() => selecionarFiltro(filtro.label)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border snap-start rounded-full whitespace-nowrap ${
                isAtivo
                  ? 'bg-brand/10 text-brand border-brand'
                  : 'text-gray-400 border-transparent bg-background hover:bg-border/50'
              }`}
            >
              {filtro.label}
            </button>
          );
        })}
      </div>
      
    </div>
  );
}
