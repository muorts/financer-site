"use client";

import { useState } from 'react';
import { Calculator, ArrowRightLeft, RefreshCw, Trophy } from 'lucide-react';
import { CabecalhoPagina } from '@/components/ui/Header';

type ModoCalculadora = 'arbitragem' | 'freebet' | 'qualificativa';

export default function CalculadoraTatica() {
  const [modo, setModo] = useState<ModoCalculadora>('arbitragem');

  // Inputs da Calculadora
  const [stake, setStake] = useState<string>('100');
  const [odd1, setOdd1] = useState<string>('2.10');
  const [odd2, setOdd2] = useState<string>('2.00');

  // Valores numéricos convertidos com segurança
  const numStake = parseFloat(stake.replace(',', '.')) || 0;
  const numOdd1 = parseFloat(odd1.replace(',', '.')) || 0;
  const numOdd2 = parseFloat(odd2.replace(',', '.')) || 0;

  // ==========================================
  // MOTOR MATEMÁTICO (Fórmulas da GOAT)
  // ==========================================
  let stakeProtecao = 0;
  let investimentoTotal = 0;
  let retorno1 = 0;
  let retorno2 = 0;
  let lucro1 = 0;
  let lucro2 = 0;
  let roi = 0;

  if (numOdd1 > 0 && numOdd2 > 0) {
    if (modo === 'arbitragem') {
      retorno1 = numStake * numOdd1;
      stakeProtecao = retorno1 / numOdd2;
      investimentoTotal = numStake + stakeProtecao;
      
      retorno2 = stakeProtecao * numOdd2;
      lucro1 = retorno1 - investimentoTotal;
      lucro2 = retorno2 - investimentoTotal;
      roi = (lucro1 / investimentoTotal) * 100;

    } else if (modo === 'freebet') {
      // Fórmula SNR (Stake Not Returned)
      const lucroLiquidoFreebet = numStake * (numOdd1 - 1);
      stakeProtecao = lucroLiquidoFreebet / numOdd2;
      investimentoTotal = stakeProtecao; // O dinheiro real gasto é só a proteção

      retorno1 = lucroLiquidoFreebet;
      retorno2 = stakeProtecao * numOdd2;
      
      lucro1 = lucroLiquidoFreebet - stakeProtecao;
      lucro2 = retorno2 - stakeProtecao - stakeProtecao; // Se der a proteção, você perde o valor da proteção investida
      roi = (lucro1 / numStake) * 100; // Retenção sobre a freebet

    } else if (modo === 'qualificativa') {
      retorno1 = numStake * numOdd1;
      stakeProtecao = retorno1 / numOdd2;
      investimentoTotal = numStake + stakeProtecao;

      retorno2 = stakeProtecao * numOdd2;
      lucro1 = retorno1 - investimentoTotal; // Vai ser negativo (o custo da missão)
      lucro2 = retorno2 - investimentoTotal; // Vai ser positivo se bater a proteção
      roi = (lucro1 / investimentoTotal) * 100;
    }
  }

  return (
    <div className="flex flex-col p-4 md:p-6 gap-6 max-w-[850px] mx-auto pb-24">
      
      <CabecalhoPagina 
        titulo="Calculadora Tática" 
        descricao="Cálculo instantâneo de stakes para Arbitragem e Freebets."
        caminhoVoltar="/trades" 
      />

      {/* SELETOR DE MODO (Estilo GOAT: Limpo e Direto) */}
      <div className="grid grid-cols-3 p-1 bg-[#18181b] border border-border/80 rounded-xl">
        <button
          onClick={() => setModo('arbitragem')}
          className={`py-2.5 text-xs md:text-sm font-bold rounded-lg transition-all ${
            modo === 'arbitragem' ? 'bg-brand text-background shadow-md' : 'text-gray-400 hover:text-white'
          }`}
        >
          Arbitragem / PA
        </button>
        <button
          onClick={() => setModo('freebet')}
          className={`py-2.5 text-xs md:text-sm font-bold rounded-lg transition-all ${
            modo === 'freebet' ? 'bg-orange-500 text-background shadow-md' : 'text-gray-400 hover:text-white'
          }`}
        >
          Giro Freebet
        </button>
        <button
          onClick={() => setModo('qualificativa')}
          className={`py-2.5 text-xs md:text-sm font-bold rounded-lg transition-all ${
            modo === 'qualificativa' ? 'bg-surface border border-border text-white shadow-md' : 'text-gray-400 hover:text-white'
          }`}
        >
          Qualificativa (Missão)
        </button>
      </div>

      {/* PAINEL DE ENTRADA DE DADOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 bg-surface/40 border border-border/80 rounded-2xl">
        
        {/* INPUT 1: VALOR */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-gray-400">
            {modo === 'freebet' ? 'Valor da Freebet (R$)' : 'Valor da Stake (R$)'}
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 font-mono text-gray-500 text-sm">R$</span>
            <input 
              type="number"
              value={stake}
              onChange={(e) => setStake(e.target.value)}
              className="w-full py-2.5 pl-10 pr-3 font-mono text-white bg-[#18181b] border border-border rounded-xl outline-none focus:border-brand text-sm font-bold"
            />
          </div>
        </div>

        {/* INPUT 2: ODD PRINCIPAL */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-gray-400">Odd Principal (Back)</label>
          <input 
            type="number"
            step="0.01"
            value={odd1}
            onChange={(e) => setOdd1(e.target.value)}
            className="w-full py-2.5 px-3 font-mono text-white bg-[#18181b] border border-border rounded-xl outline-none focus:border-brand text-sm font-bold"
          />
        </div>

        {/* INPUT 3: ODD PROTEÇÃO */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-gray-400">Odd Proteção (Lay/Casa 2)</label>
          <input 
            type="number"
            step="0.01"
            value={odd2}
            onChange={(e) => setOdd2(e.target.value)}
            className="w-full py-2.5 px-3 font-mono text-white bg-[#18181b] border border-border rounded-xl outline-none focus:border-brand text-sm font-bold"
          />
        </div>

      </div>

      {/* RESULTADO DESTAQUE (STAKE DE PROTEÇÃO) */}
      <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-gradient-to-r from-brand/10 via-[#18181b] to-surface border border-brand/30 rounded-2xl gap-4 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-brand/20 text-brand rounded-xl">
            <Calculator className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Valor a Apostar na Proteção</span>
            <span className="text-xs text-gray-500">Coloque exato este valor na segunda casa</span>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className="font-mono text-3xl font-bold text-brand">
            {stakeProtecao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
          <span className="font-mono text-xs text-gray-400">
            Investimento Total: {investimentoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </div>
      </div>

      {/* TABELA DE CENÁRIOS (ESTILO GOAT) */}
      <div className="flex flex-col border border-border/80 bg-surface/40 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 bg-[#18181b]/60 border-b border-border/50">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Trophy className="w-4 h-4 text-brand" />
            Cenários de Retorno e Lucro
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/50">
          
          {/* CENÁRIO 1 */}
          <div className="flex flex-col p-5 gap-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Se a Entrada Principal Vencer</span>
              <span className="font-mono text-xs px-2 py-0.5 bg-surface rounded text-gray-300">Odd {numOdd1.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Lucro Líquido</span>
                <span className={`font-mono text-xl font-bold ${lucro1 >= 0 ? 'text-success' : 'text-danger'}`}>
                  {lucro1 > 0 ? '+' : ''}{lucro1.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-500">Retorno Bruto</span>
                <span className="font-mono text-sm text-white">
                  {retorno1.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
            </div>
          </div>

          {/* CENÁRIO 2 */}
          <div className="flex flex-col p-5 gap-3 bg-black/10">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Se a Proteção Vencer</span>
              <span className="font-mono text-xs px-2 py-0.5 bg-surface rounded text-gray-300">Odd {numOdd2.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Lucro Líquido</span>
                <span className={`font-mono text-xl font-bold ${lucro2 >= 0 ? 'text-success' : 'text-danger'}`}>
                  {lucro2 > 0 ? '+' : ''}{lucro2.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-500">Retorno Bruto</span>
                <span className="font-mono text-sm text-white">
                  {retorno2.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* RODAPÉ DA TABELA (ROI / RETENÇÃO) */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#18181b]/80 border-t border-border/50">
          <span className="text-xs font-medium text-gray-400">
            {modo === 'freebet' ? 'Taxa de Retenção Estimada:' : 'Retorno Sobre o Investimento (ROI):'}
          </span>
          <span className="font-mono font-bold text-white text-base">
            {roi.toFixed(2)}%
          </span>
        </div>

      </div>

    </div>
  );
}