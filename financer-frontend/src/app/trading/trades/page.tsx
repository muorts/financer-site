"use client";

import { useState, useEffect } from 'react';
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
// DADOS SIMULADOS DE FREEBETS (Será o próximo passo no backend!)
// ==========================================
const FREEBETS = [
  { id: '1', casa: 'Betano', valor: 50, vencimento: '2026-08-20' },
  { id: '2', casa: 'Pinnacle', valor: 100, vencimento: '2026-08-20' },
  { id: '3', casa: 'Bet365', valor: 25, vencimento: '2026-08-25' },
];

export default function VisaoTaticaTrades() {
  // Lógica de Datas para o Calendário
  const mesAtual = new Date(2026, 7, 18); 
  const diasNoMes = new Date(mesAtual.getFullYear(), mesAtual.getMonth() + 1, 0).getDate();
  const primeiroDiaDoMes = new Date(mesAtual.getFullYear(), mesAtual.getMonth(), 1).getDay(); 
  const diasArray = Array.from({ length: diasNoMes }, (_, i) => i + 1);
  const espacosVazios = Array.from({ length: primeiroDiaDoMes }, (_, i) => i);

  // Estados
  const [diaSelecionado, setDiaSelecionado] = useState<number | null>(null);
  
  // O Estado das operações agora começa vazio e será preenchido pelo Java
  const [tradesAtivos, setTradesAtivos] = useState<any[]>([]);

  // ==========================================
  // INTEGRAÇÃO COM O BACKEND JAVA
  // ==========================================
  useEffect(() => {
    fetch('http://localhost:8080/api/trades/andamento')
      .then(res => res.json())
      .then(dadosDoJava => {
        // Precisamos formatar os dados que vêm do banco para encaixar no seu componente
        const tradesFormatados = dadosDoJava.map((trade: any) => ({
          id: trade.id,
          jogo: trade.jogo,
          mercado: trade.mercado,
          // Como o trade está em andamento, o lucro real ainda não existe, assumimos 0
          lucro: trade.lucroLiquidoReal || 0, 
          valor: trade.valorTotalInvestido || 0,
          entradas: trade.entradas?.map((entrada: any) => ({
            id: entrada.id,
            tipo: entrada.tipo.toLowerCase(), // O Java manda 'PRINCIPAL', o React espera 'principal'
            casa: entrada.casaAposta?.nome || 'Desconhecida',
            odd: entrada.odd,
            stake: entrada.stake
          })) || []
        }));
        
        setTradesAtivos(tradesFormatados);
      })
      .catch(err => console.error("Erro ao buscar trades ativos do banco:", err));
  }, []);


  // Cálculos Automáticos dos Cards
  const capitalInPlay = tradesAtivos.reduce((acc, curr) => acc + curr.valor, 0);
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

      {/* 2. CARDS DE STATUS */}
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

      {/* LISTA DE OPERAÇÕES CONECTADA AO BANCO */}
      <ListaOperacoesAtivas trades={tradesAtivos} />

    </div>
  );
}