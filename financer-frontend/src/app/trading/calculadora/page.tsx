"use client";

import { useState } from 'react';
import { RotateCcw, Plus } from 'lucide-react';
import { CabecalhoPagina } from '@/components/ui/Header';
import { LinhaTabelaCalculadora } from '@/components/trades/TableLine'; 

// IMPORT CORRIGIDO: Apontando para o seu arquivo no singular!
import { calcularGoatAvancado, LinhaAposta } from '@/utils/calculadoraTrade';

// O EXPORT DEFAULT É OBRIGATÓRIO AQUI PARA O NEXT.JS RECONHECER A PÁGINA
export default function CalculadoraTatica() {
  const [mostrarComissao, setMostrarComissao] = useState<boolean>(true);

  // Estado Inicial
  const estadoInicial: LinhaAposta[] = [
    { id: '1', tipo: 'BACK', odd: '2.00', comissao: '0', valor: '100', isFreebet: false, isFixa: true },
    { id: '2', tipo: 'BACK', odd: '2.00', comissao: '0', valor: '100', isFreebet: false, isFixa: false },
  ];

  const [linhas, setLinhas] = useState<LinhaAposta[]>(estadoInicial);

  // ==========================================
  // FUNÇÕES DE MANIPULAÇÃO DA TABELA
  // ==========================================
  const handleSetLinhaFixa = (id: string) => {
    setLinhas(prev => prev.map(l => ({ ...l, isFixa: l.id === id })));
  };

  const handleUpdateLinha = (id: string, campo: keyof LinhaAposta, valor: any) => {
    setLinhas(prev => prev.map(l => l.id === id ? { ...l, [campo]: valor } : l));
  };

  const handleAdicionarLinha = () => {
    setLinhas(prev => [
      ...prev,
      { id: String(Date.now()), tipo: 'BACK', odd: '3.00', comissao: '0', valor: '0', isFreebet: false, isFixa: false }
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

  const resetarCalculadora = () => setLinhas(estadoInicial);

  // ==========================================
  // CHAMA O MOTOR MATEMÁTICO EXTERNO
  // ==========================================
  const { linhasProcessadas, totalInvestidoReal, roiTotal } = calcularGoatAvancado(linhas);
  const podeRemover = linhas.length > 2;

  return (
    <div className="flex flex-col p-4 md:p-6 gap-6 max-w-[1000px] mx-auto pb-24">
      
      <CabecalhoPagina 
        titulo="Calculadora Tática" 
        descricao="Cálculo matemático profissional com suporte a comissões, freebets e fixação de stake."
        caminhoVoltar="/trades" 
      />

      {/* BARRA DE CONTROLES DO TOPO */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-surface/40 border border-border/80 rounded-2xl gap-4">
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-xs font-medium text-gray-300 cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={mostrarComissao}
              onChange={(e) => setMostrarComissao(e.target.checked)}
              className="w-4 h-4 accent-brand rounded cursor-pointer"
            />
            <span>Habilitar Comissões (%)</span>
          </label>
        </div>

        <button 
          onClick={resetarCalculadora}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-400 bg-[#18181b] border border-border rounded-xl hover:text-white transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Resetar
        </button>
      </div>

      {/* TABELA DA CALCULADORA */}
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
                <th className="px-4 py-3.5 text-center">Fixo</th>
                <th className="px-4 py-3.5 text-center">Ações</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-border/30 font-mono text-sm">
              {linhasProcessadas.map((linha) => (
                <LinhaTabelaCalculadora 
                  key={linha.id}
                  linha={linha}
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

        {/* BOTÃO ADICIONAR SELEÇÃO */}
        <div className="p-3 bg-[#18181b]/50 border-t border-border/50 flex justify-center">
          <button 
            onClick={handleAdicionarLinha}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-brand bg-brand/10 border border-brand/30 rounded-xl hover:bg-brand/20 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" /> Adicionar Seleção (Resultado)
          </button>
        </div>

        {/* RODAPÉ: TOTAL APOSTADO E ROI */}
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