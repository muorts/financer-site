"use client";

import { useState } from 'react';
import { RotateCcw, Plus, Calculator, DollarSign } from 'lucide-react';
import { CabecalhoPagina } from '@/components/ui/Header';
import { LinhaTabelaCalculadora } from '@/components/trades/TableLine'; 
import { calcularGoatAvancado, LinhaAposta } from '@/utils/calculadoraTrade';

export default function CalculadoraTatica() {
  const [mostrarComissao, setMostrarComissao] = useState<boolean>(true);
  const [modoCalculo, setModoCalculo] = useState<'linha' | 'total'>('linha');
  const [valorTotalFixo, setValorTotalFixo] = useState<string>('100');

  const estadoInicial: LinhaAposta[] = [
    { id: '1', tipo: 'BACK', odd: '2.00', comissao: '0', valor: '100', isFreebet: false, isFixa: true, isManual: false },
    { id: '2', tipo: 'BACK', odd: '2.00', comissao: '0', valor: '100', isFreebet: false, isFixa: false, isManual: false },
  ];

  const [linhas, setLinhas] = useState<LinhaAposta[]>(estadoInicial);

  const handleSetLinhaFixa = (id: string) => {
    setModoCalculo('linha'); 
    setLinhas(prev => prev.map(l => ({ 
      ...l, 
      isFixa: l.id === id,
      isManual: false 
    })));
  };

  const handleUpdateLinha = (id: string, campo: keyof LinhaAposta, valor: any) => {
    setLinhas(prev => prev.map(l => l.id === id ? { ...l, [campo]: valor } : l));
  };

  const handleAdicionarLinha = () => {
    setLinhas(prev => [
      ...prev,
      { id: String(Date.now()), tipo: 'BACK', odd: '3.00', comissao: '0', valor: '0', isFreebet: false, isFixa: false, isManual: false }
    ]);
  };

  const handleRemoverLinha = (id: string) => {
    if (linhas.length <= 2) return;
    const linhaRemovidaEraFixa = linhas.find(l => l.id === id)?.isFixa;
    const novasLinhas = linhas.filter(l => l.id !== id);
    if (linhaRemovidaEraFixa && novasLinhas.length > 0) {
      novasLinhas[0].isFixa = true;
    }
    setLinhas(novasLinhas);
  };

  const resetarCalculadora = () => {
    setLinhas(estadoInicial);
    setModoCalculo('linha');
    setValorTotalFixo('100');
  };

  const valFixoNum = parseFloat(valorTotalFixo.replace(',', '.')) || 0;
  const { linhasProcessadas, totalInvestidoReal, roiTotal } = calcularGoatAvancado(linhas, modoCalculo, valFixoNum);
  
  const podeRemover = linhas.length > 2;

  return (
    <div className="flex flex-col p-4 md:p-6 gap-6 max-w-[1000px] mx-auto pb-24">
      
      <CabecalhoPagina 
        titulo="Calculadora Tática" 
        descricao="Cálculo matemático profissional com suporte a comissões, freebets e fixação de stake (Dutching)."
        caminhoVoltar="/trades" 
      />

      <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-surface/40 border border-border/80 rounded-2xl gap-4">
        
        <div className="flex flex-wrap items-center gap-6">
          
          <div className="flex bg-[#18181b]/80 border border-border/50 rounded-lg p-1 gap-1">
            <button 
              onClick={() => { 
                setModoCalculo('linha'); 
                setLinhas(prev => {
                  const temFixa = prev.some(l => l.isFixa);
                  // Se ao voltar pro modo linha não tiver nenhuma fixada, ele fixa a primeira
                  return prev.map((l, idx) => ({ ...l, isManual: false, isFixa: temFixa ? l.isFixa : idx === 0 }));
                }); 
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${modoCalculo === 'linha' ? 'bg-surface text-brand shadow-sm border border-border/50' : 'text-gray-500 hover:text-white'}`}
            >
              <Calculator className="w-3.5 h-3.5" /> Fixar Linha
            </button>
            <button 
              onClick={() => { 
                setModoCalculo('total'); 
                // A MÁGICA: Limpa o estado isFixa de todas as linhas pra matar o cadeado azul!
                setLinhas(prev => prev.map(l => ({ ...l, isManual: false, isFixa: false }))); 
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${modoCalculo === 'total' ? 'bg-surface text-brand shadow-sm border border-border/50' : 'text-gray-500 hover:text-white'}`}
            >
              <DollarSign className="w-3.5 h-3.5" /> Rateio (Total)
            </button>
          </div>

          {modoCalculo === 'total' && (
            <div className="flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
              <span className="text-xs font-medium text-brand">Total (R$):</span>
              <input 
                type="text"
                value={valorTotalFixo}
                onChange={(e) => setValorTotalFixo(e.target.value)}
                className="w-24 px-2 py-1.5 text-sm font-mono font-bold text-white bg-black/50 border border-brand/50 rounded-lg outline-none focus:border-brand shadow-sm"
                placeholder="100,00"
              />
            </div>
          )}

          <label className="flex items-center gap-2 text-xs font-medium text-gray-300 cursor-pointer select-none border-l border-border/50 pl-6 h-6">
            <input type="checkbox" checked={mostrarComissao} onChange={(e) => setMostrarComissao(e.target.checked)} className="w-4 h-4 accent-brand rounded cursor-pointer" />
            <span>Habilitar Comissões</span>
          </label>
        </div>

        <button onClick={resetarCalculadora} className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-400 bg-[#18181b] border border-border rounded-xl hover:text-white transition-colors">
          <RotateCcw className="w-3.5 h-3.5" /> Resetar
        </button>
      </div>

      <div className="flex flex-col border border-border/80 bg-surface/40 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-border/50 bg-[#18181b]/90 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                <th className="px-4 py-3.5">Tipo</th>
                <th className="px-4 py-3.5">Odd</th>
                {mostrarComissao && <th className="px-4 py-3.5">Comissão (%)</th>}
                <th className="px-4 py-3.5">Odd Real</th>
                <th className="px-4 py-3.5">Valor (Stake)</th>
                <th className="px-4 py-3.5 text-right">Lucro Estimado</th>
                <th className="px-4 py-3.5 text-center">Freebet</th>
                <th className="px-4 py-3.5 text-center">{modoCalculo === 'total' ? 'Ignorado' : 'Fixo'}</th>
                <th className="px-4 py-3.5 text-center">Ações</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-border/30 font-mono text-sm">
              {linhasProcessadas.map((linha) => (
                <LinhaTabelaCalculadora 
                  key={linha.id}
                  linha={{...linha, isFixa: modoCalculo === 'total' ? false : linha.isFixa}}
                  mostrarComissao={mostrarComissao}
                  podeRemover={podeRemover}
                  onUpdate={handleUpdateLinha}
                  onFixar={handleSetLinhaFixa}
                  onRemover={handleRemoverLinha}
                />
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-[#18181b]/50 border-t border-border/50 flex justify-center">
          <button onClick={handleAdicionarLinha} className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-brand bg-brand/10 border border-brand/30 rounded-xl hover:bg-brand/20 transition-all shadow-sm">
            <Plus className="w-4 h-4" /> Adicionar Seleção
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-[#18181b]/95 border-t border-border/50 font-mono text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 font-sans font-semibold text-xs uppercase tracking-wider">Total Apostado Real:</span>
            <span className="text-white font-bold">{totalInvestidoReal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
          </div>

          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <span className="text-gray-400 font-sans font-semibold text-xs uppercase tracking-wider">Retorno Médio / ROI:</span>
            <span className={`font-bold ${roiTotal >= 0 ? 'text-success' : 'text-danger'}`}>
              {roiTotal.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}