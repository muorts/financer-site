"use client";

import { useState } from 'react';
import { Calendar } from 'lucide-react';

const atalhos = ['Este Mês', 'Mês Passado', 'Últimos 7 Dias', 'Últimos 30 Dias'];

interface FiltroDataProps {
  // O sinal de interrogação '?' torna as propriedades OPCIONAIS.
  // Isso impede que outras páginas que usem <FiltroData /> quebrem.
  filtroAtivo?: string;
  setFiltroAtivo?: (valor: string) => void;
}

export function FiltroData({ filtroAtivo, setFiltroAtivo }: FiltroDataProps) {
  const [aberto, setAberto] = useState(false);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  
  // ESTADO INTERNO: Usado caso a página não passe o 'filtroAtivo' nas props
  const [filtroInterno, setFiltroInterno] = useState('Este Mês');

  // LÓGICA INTELIGENTE: Decide quem manda na informação
  const valorAtual = filtroAtivo !== undefined ? filtroAtivo : filtroInterno;

  // Função para lidar com o clique sem quebrar nada
  const handleSelecionar = (novoValor: string) => {
    if (setFiltroAtivo) {
      setFiltroAtivo(novoValor); // Avisa a página que controla o estado (ex: Vendas)
    } else {
      setFiltroInterno(novoValor); // Controla a si mesmo (ex: Dashboard antigo)
    }
    setAberto(false);
  };

  return (
    <div className="relative w-full md:w-auto">
      <button 
        onClick={() => setAberto(!aberto)}
        className="flex items-center justify-between gap-4 px-4 py-2.5 transition-colors border rounded-xl bg-[#18181b] border-border hover:border-gray-500 text-gray-300 w-full md:min-w-60"
      >
        <span className="text-sm">{valorAtual === 'todos' ? 'Todo o Período' : valorAtual}</span>
        <Calendar className="w-4 h-4 text-gray-400" />
      </button>

      {aberto && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setAberto(false)} />
          <div className="absolute left-0 md:right-0 md:left-auto z-50 flex flex-col p-4 mt-2 border shadow-xl w-80 bg-surface border-border rounded-xl">
            
            <h3 className="mb-3 text-sm font-medium text-gray-400">Filtros Rápidos</h3>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => handleSelecionar('todos')}
                className={`py-2 text-sm rounded-lg transition-colors border col-span-2 ${
                  valorAtual === 'todos' ? 'bg-brand/10 border-brand text-brand' : 'bg-background border-transparent text-gray-400 hover:bg-border/50'
                }`}
              >
                Todo o Período
              </button>
              
              {atalhos.map((atalho) => (
                <button
                  key={atalho}
                  onClick={() => handleSelecionar(atalho)}
                  className={`py-2 text-sm rounded-lg transition-colors border ${
                    valorAtual === atalho 
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
              Aplicar Datas
            </button>
          </div>
        </>
      )}
    </div>
  );
}