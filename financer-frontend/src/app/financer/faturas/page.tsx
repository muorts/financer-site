"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, CreditCard, Calendar, 
  Gamepad2, ShoppingBag, Coffee, AlertCircle 
} from 'lucide-react';

import { InputSelect } from '@/components/ui/InputSelect';
import { CardDataFatura } from '@/components/financer/CardDataFatura';
import { ItemFatura } from '@/components/financer/ItemFatura';

const resumoFaturas = [
  { id: 'nubank', banco: 'Nubank', valor: 'R$ 845,30', vencimento: '10/Set', fechamento: '03/Set', corTexto: 'text-purple-400', corFundo: 'bg-purple-500/10', corBorda: 'border-purple-500/30' },
  { id: 'inter', banco: 'Inter', valor: 'R$ 120,00', vencimento: '15/Set', fechamento: '08/Set', corTexto: 'text-orange-400', corFundo: 'bg-orange-500/10', corBorda: 'border-orange-500/30' },
];

const transacoesFatura = [
  { id: 1, descricao: 'Aliexpress (Analógico 3DS)', data: '05 Ago', valor: 'R$ 45,00', parcelas: '1/1', icon: Gamepad2 },
  { id: 2, descricao: 'Assinatura iCloud', data: '02 Ago', valor: 'R$ 14,90', parcelas: '1/1', icon: ShoppingBag },
  { id: 3, descricao: 'Ifood (Lanche)', data: '01 Ago', valor: 'R$ 38,50', parcelas: '1/1', icon: Coffee },
];

export default function Faturas() {
  const [bancoSelecionado, setBancoSelecionado] = useState('Nubank');

  return (
    <div className="flex flex-col p-4 md:p-6 gap-6 max-w-[800px] mx-auto pb-24">
      
      {/* BLOCO 1: CABEÇALHO FLUTUANTE */}
      <div className="flex items-center gap-5 p-5 md:p-6 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        <Link 
          href="/financeiro/visao-geral" 
          className="p-3 transition-colors border rounded-xl bg-[#18181b] border-border hover:border-gray-500 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white font-sans">Faturas</h1>
          <p className="mt-1 text-sm text-gray-400">Controle seus gastos no cartão de crédito.</p>
        </div>
      </div>

      {/* BLOCO 2: VISÃO GERAL (CARROSSEL) */}
      <div className="flex flex-col gap-4">
        <h2 className="px-2 text-sm font-medium tracking-wider uppercase text-gray-400">
          Faturas Abertas
        </h2>
        <div className="flex gap-4 pb-2 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
          {resumoFaturas.map((fatura) => (
            <div 
              key={fatura.id} 
              className={`flex flex-col min-w-[240px] p-5 border rounded-2xl snap-start ${fatura.corFundo} ${fatura.corBorda}`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`font-bold ${fatura.corTexto}`}>{fatura.banco}</span>
                <CreditCard className={`w-5 h-5 ${fatura.corTexto}`} />
              </div>
              <span className="mb-1 text-2xl font-bold text-white">{fatura.valor}</span>
              <span className="text-xs text-gray-400">Vence em {fatura.vencimento}</span>
            </div>
          ))}
        </div>
      </div>

      {/* BLOCO 3: SELETOR E AJUSTE DE DATAS */}
      <div className="flex flex-col items-end gap-4 p-6 border md:flex-row bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        <div className="flex-1 w-full">
          <InputSelect 
            label="Analisar fatura do cartão:"
            icon={CreditCard}
            placeholder="Selecione o banco"
            value={bancoSelecionado}
            onClick={() => console.log('Abrir modal de cartões')}
          />
        </div>
        <button className="flex items-center justify-center w-full gap-2 px-5 py-3 text-sm font-medium transition-colors border md:w-auto rounded-xl bg-[#18181b] border-border hover:border-gray-500 text-gray-300">
          <Calendar className="w-4 h-4" />
          Ajustar Datas
        </button>
      </div>

      {/* BLOCO 4: FATURA DETALHADA (AGORA MODULARIZADA!) */}
      <div className="flex flex-col overflow-hidden border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        
        {/* Cabeçalho e Datas (Usando o CardDataFatura) */}
        <div className="flex flex-col gap-6 p-6 md:p-8 bg-gradient-to-b from-[#18181b]/80 to-transparent border-b border-border/50">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="mb-1 text-sm font-medium text-gray-400">Fatura Atual (Setembro)</span>
              <span className="text-4xl font-bold text-white md:text-5xl">R$ 845,30</span>
              <span className="flex items-center gap-2 mt-3 text-sm font-medium text-brand bg-brand/10 w-fit px-3 py-1 rounded-full border border-brand/20">
                <AlertCircle className="w-4 h-4" /> Fatura Aberta
              </span>
            </div>
          </div>

          {/* Grid de Datas Importantes usando o Componente novo */}
          <div className="grid grid-cols-2 gap-4 mt-2">
            <CardDataFatura 
              tipo="fechamento" 
              data="03 de Setembro" 
              descricaoTempo="Em 27 dias" 
            />
            <CardDataFatura 
              tipo="vencimento" 
              data="10 de Setembro" 
              descricaoTempo="Sempre dia 10" 
            />
          </div>
        </div>

        {/* Lista de Gastos (Usando o ItemFatura) */}
        <div className="flex flex-col p-6 md:p-8">
          <h3 className="mb-4 text-sm font-medium text-gray-400">Lançamentos desta fatura</h3>
          
          <div className="flex flex-col gap-4">
            {transacoesFatura.map((transacao) => (
              <ItemFatura 
                key={transacao.id}
                descricao={transacao.descricao}
                data={transacao.data}
                valor={transacao.valor}
                parcelas={transacao.parcelas}
                icon={transacao.icon}
              />
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}