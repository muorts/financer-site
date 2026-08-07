"use client";

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';

export function Filters() {
  // Estado que controla qual filtro está selecionado no momento
  const [filtroAtivo, setFiltroAtivo] = useState('Todas');

  // A nossa lista inteligente de filtros (O princípio DRY aplicado)
  const filtros = [
    { id: 'todas', label: 'Todas' },
    { id: 'entradas', label: 'Só Entradas' },
    { id: 'saidas', label: 'Só Saídas' },
    { id: 'categorias', label: 'Categorias', icon: Filter }, // Este recebe o componente do ícone
  ];

  return (
    // Bloco flutuante isolado (janela de vidro)
    <div className="flex flex-col gap-5 p-5 border bg-surface/40 border-border/80 rounded-xl">
      
      {/* Carrossel de Meses */}
      <div className="flex items-center justify-between px-2 text-gray-400">
        <button className="p-2 transition-colors rounded-full hover:bg-border/50 hover:text-white">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="font-medium text-white">Agosto 2026</span>
        <button className="p-2 transition-colors rounded-full hover:bg-border/50 hover:text-white">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Chips de Filtro (Carrossel Horizontal Gerado Dinamicamente) */}
      <div className="flex gap-2 pb-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
        {filtros.map((filtro) => {
          const isAtivo = filtroAtivo === filtro.label;

          return (
            <button
              key={filtro.id}
              onClick={() => setFiltroAtivo(filtro.label)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border snap-start rounded-full whitespace-nowrap ${
                isAtivo
                  ? 'bg-brand/10 text-brand border-brand' // Estilo quando está ATIVO
                  : 'text-gray-400 border-transparent bg-background hover:bg-border/50' // Estilo INATIVO
              }`}
            >
              {/* Renderiza o ícone de forma condicional (só se ele existir no objeto) */}
              {filtro.icon && <filtro.icon className="w-4 h-4" />}
              {filtro.label}
            </button>
          );
        })}
      </div>
      
    </div>
  );
}