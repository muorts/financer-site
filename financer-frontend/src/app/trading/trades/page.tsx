"use client";

import { useState } from 'react';
import { 
  Lock, Gift, Calendar as CalendarIcon, 
  ChevronLeft, ChevronRight, Ticket, ArrowRightLeft, AlertCircle 
} from 'lucide-react';

import { CabecalhoPagina } from '@/components/ui/Header'; 
import { CardStatus } from '@/components/trades/CardStatus';
import { CalendarioVencimentos } from '@/components/trades/Calendar'; 
import { ListaOperacoesAtivas } from '@/components/trades/ListOperations';
import { DetalhesDiaSelecionado } from '@/components/trades/DaysSelection'; 

// ==========================================
// DADOS SIMULADOS (Mock)
// ==========================================
const TRADES_ATIVOS = [
  { 
    id: '1', 
    jogo: 'Palmeiras x São Paulo', 
    mercado: 'PA (Pagamento Antecipado)', 
    lucro: 15.00,
    valor: 1035.00,
    entradas: [
      { id: 'e1', tipo: 'principal' as const, casa: 'Bet365', odd: 2.10, stake: 500 },
      { id: 'e2', tipo: 'protecao' as const, casa: 'Betano', odd: 1.95, stake: 535 }
    ]
  },
  { 
    id: '2', 
    jogo: 'Arsenal x Chelsea', 
    mercado: 'Missão Qualificativa', 
    lucro: -5.50,
    valor: 130.00, 
    entradas: [
      { id: 'e3', tipo: 'principal' as const, casa: 'Pinnacle', odd: 1.80, stake: 50 },
      { id: 'e4', tipo: 'protecao' as const, casa: 'Betfair', odd: 1.45, stake: 80 }
    ]
  },
  { 
    id: '3', 
    jogo: 'Flamengo x Fluminense', 
    mercado: 'Conversão de Freebet', 
    lucro: 75.00,
    valor: 100.00, 
    entradas: [
      { id: 'e5', tipo: 'principal' as const, casa: 'Betano', odd: 4.50, stake: 50 },
      { id: 'e6', tipo: 'protecao' as const, casa: 'Betfair', odd: 1.30, stake: 100 }
    ]
  }
];

const FREEBETS = [
  { id: '1', casa: 'Betano', valor: 50, vencimento: '2026-08-20' },
  { id: '2', casa: 'Pinnacle', valor: 100, vencimento: '2026-08-20' },
  { id: '3', casa: 'Bet365', valor: 25, vencimento: '2026-08-25' },
];

export default function VisaoTaticaTrades() {
  // Lógica de Datas para o Calendário (Fixado para Agosto de 2026 para o exemplo)
  const mesAtual = new Date(2026, 7, 18); 
  const diasNoMes = new Date(mesAtual.getFullYear(), mesAtual.getMonth() + 1, 0).getDate();
  const primeiroDiaDoMes = new Date(mesAtual.getFullYear(), mesAtual.getMonth(), 1).getDay(); 
  const diasArray = Array.from({ length: diasNoMes }, (_, i) => i + 1);
  const espacosVazios = Array.from({ length: primeiroDiaDoMes }, (_, i) => i);

  // Estados
  const [diaSelecionado, setDiaSelecionado] = useState<number | null>(null);

  // Cálculos Automáticos dos Cards
  const capitalInPlay = TRADES_ATIVOS.reduce((acc, curr) => acc + curr.valor, 0);
  const caixaFreebets = FREEBETS.reduce((acc, curr) => acc + curr.valor, 0);

  // Filtra as freebets do dia clicado no calendário
  const freebetsDoDia = diaSelecionado 
    ? FREEBETS.filter(fb => parseInt(fb.vencimento.split('-')[2]) === diaSelecionado)
    : [];

  return (
    <div className="flex flex-col p-4 md:p-6 gap-6 max-w-[900px] mx-auto pb-24">
      
      {/* 1. CABEÇALHO */}
      <CabecalhoPagina 
        titulo="Visão Tática (Trades)" 
        descricao="Acompanhe seu capital travado no mercado e suas freebets ativas."
        caminhoVoltar="/" 
      />

      {/* 2. CARDS DE STATUS (Agora Modulares!) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <CardStatus 
          titulo="Capital em Jogo (In-Play)"
          valor={capitalInPlay}
          icon={Lock}
          variante="brand"
        />
        
        <CardStatus 
          titulo="Caixa de Freebets"
          valor={caixaFreebets}
          icon={Gift}
          variante="orange"
        />
      </div>
        
        {/* 3 e 4. CALENDÁRIO E DETALHES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CalendarioVencimentos 
          freebets={FREEBETS}
          diaSelecionado={diaSelecionado}
          onSelectDia={setDiaSelecionado}
        />

        <DetalhesDiaSelecionado 
          diaSelecionado={diaSelecionado}
          freebetsDoDia={freebetsDoDia}
        />
      </div>


      {/* LISTA DE OPERAÇÕES MODULAR */}
      <ListaOperacoesAtivas trades={TRADES_ATIVOS} />

    </div>
  );
}