"use client";

import { useState } from 'react';
import { Calendar } from 'lucide-react';

const atalhos = ['Este Mês', 'Mês Passado', 'Últimos 7 Dias', 'Últimos 30 Dias'];

export function FiltroData() {
  const [aberto, setAberto] = useState(false);
  const [filtroAtivo, setFiltroAtivo] = useState('Este Mês');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  return (
    <div className="relative">
      {/* Gatilho idêntico ao da imagem: Fundo bem escuro, borda sutil, texto pequeno */}
      <button 
        onClick={() => setAberto(!aberto)}
        className="flex items-center justify-between gap-4 px-4 py-2.5 transition-colors border rounded-lg bg-[#18181b] border-border hover:border-gray-500 text-gray-300 min-w-60"
      >
        <span className="text-sm">{filtroAtivo}</span>
        <Calendar className="w-4 h-4 text-gray-400" />
      </button>

      {aberto && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setAberto(false)} />
          <div className="absolute right-0 z-50 flex flex-col p-4 mt-2 border shadow-xl w-80 bg-surface border-border rounded-xl">
            <h3 className="mb-3 text-sm font-medium text-gray-400">Filtros Rápidos</h3>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {atalhos.map((atalho) => (
                <button
                  key={atalho}
                  onClick={() => setFiltroAtivo(atalho)}
                  className={`py-2 text-sm rounded-lg transition-colors border ${
                    filtroAtivo === atalho 
                      ? 'bg-brand/10 border-brand text-brand' 
                      : 'bg-background border-transparent text-gray-400 hover:bg-border/50'
                  }`}
                >
                  {atalho}
                </button>
              ))}
            </div>

            <div className="h-px mb-4 bg-border" /> 

            <h3 className="mb-3 text-sm font-medium text-gray-400">Período Específico</h3>
            <div className="flex items-center gap-2 mb-6">
              <input 
                type="date" 
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="w-full px-3 py-2 text-sm text-gray-300 border rounded-lg bg-background border-border focus:outline-none focus:border-brand"
              />
              <span className="text-gray-500">até</span>
              <input 
                type="date" 
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="w-full px-3 py-2 text-sm text-gray-300 border rounded-lg bg-background border-border focus:outline-none focus:border-brand"
              />
            </div>

            <button 
              onClick={() => setAberto(false)}
              className="w-full py-2.5 text-sm font-bold text-background bg-brand rounded-lg hover:bg-brand/90 transition-colors"
            >
              Aplicar Filtro
            </button>
          </div>
        </>
      )}
    </div>
  );
}