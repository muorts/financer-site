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
import { calcularLucroProjetado } from '@/utils/calculadoraTrade';

export default function VisaoTaticaTrades() {
  const [diaSelecionado, setDiaSelecionado] = useState<number | null>(null);
  
  // Estados Reais Alimentados pelo Java
  const [tradesAtivos, setTradesAtivos] = useState<any[]>([]);
  const [freebetsPendentes, setFreebetsPendentes] = useState<any[]>([]);

  // ==========================================
  // INTEGRAÇÃO COM O BACKEND JAVA
  // ==========================================
  useEffect(() => {
    // 1. Busca Operações em Andamento
    fetch('http://localhost:8080/api/trades/andamento')
      .then(res => res.json())
      .then(dadosDoJava => {
        const tradesFormatados = dadosDoJava.map((trade: any) => {
          
          const entradasFront = trade.entradas?.map((entrada: any) => ({
            id: entrada.id,
            tipo: entrada.tipo ? entrada.tipo.toLowerCase() : 'protecao',
            casa: entrada.casaAposta?.nome || 'Desconhecida',
            odd: entrada.odd || 0,
            stake: entrada.stake || 0,
            isFreebet: entrada.isFreebet || false
          })) || [];

          let lucroFinal = trade.lucroLiquidoReal || 0;
          let custoTotal = trade.valorTotalInvestido || 0;

          // A MÁGICA LIMPA: Chama a calculadora externa se o trade estiver aberto
          if (lucroFinal === 0 && entradasFront.length > 0) {
            lucroFinal = calcularLucroProjetado(entradasFront, trade.mercado, custoTotal);
            
            // Corrige visualmente o custo total se o banco tiver mandado 0
            if (custoTotal === 0) {
              custoTotal = entradasFront.reduce((acc: number, curr: any) => acc + curr.stake, 0);
            }
          }

          return {
            id: trade.id,
            jogo: trade.jogo,
            mercado: trade.mercado,
            lucro: lucroFinal, 
            valor: custoTotal,
            entradas: entradasFront
          };
        });
        
        setTradesAtivos(tradesFormatados);
      })
      .catch(err => console.error("Erro ao buscar trades:", err));

    // 2. Busca Freebets Pendentes para o Calendário
    fetch('http://localhost:8080/api/freebets/pendentes')
      .then(res => res.json())
      .then(dados => setFreebetsPendentes(dados))
      .catch(err => console.error("Erro ao buscar freebets:", err));
  }, []);

  // ==========================================
  // EXCLUIR FREEBET (LIXEIRA)
  // ==========================================
  const handleApagarFreebet = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:8080/api/freebets/${id}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        // Remove da tela na hora sem precisar recarregar a página
        setFreebetsPendentes(prev => prev.filter(fb => fb.id !== id));
        setDiaSelecionado(null); // Limpa a seleção
      }
    } catch (err) {
      console.error("Erro ao apagar freebet:", err);
    }
  };

  // Cálculos Automáticos dos Cards
  const capitalInPlay = tradesAtivos.reduce((acc, curr) => acc + curr.valor, 0);
  const caixaFreebets = freebetsPendentes.reduce((acc, curr) => acc + curr.valor, 0);

  // Filtra as freebets do dia clicado (pegando o 'DD' da string 'YYYY-MM-DD')
  const freebetsDoDia = diaSelecionado 
    ? freebetsPendentes.filter(fb => {
        if (!fb.vencimento) return false;
        return parseInt(fb.vencimento.split('-')[2]) === diaSelecionado;
      })
    : [];

  return (
    <div className="flex flex-col p-4 md:p-6 gap-6 max-w-[900px] mx-auto pb-24">
      
      <CabecalhoPagina 
        titulo="Visão Tática (Trades)" 
        descricao="Acompanhe seu capital travado no mercado e suas freebets ativas."
        caminhoVoltar="/" 
      />

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
        
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CalendarioVencimentos 
          freebets={freebetsPendentes}
          diaSelecionado={diaSelecionado}
          onSelectDia={setDiaSelecionado}
        />

        <DetalhesDiaSelecionado 
          diaSelecionado={diaSelecionado}
          freebetsDoDia={freebetsDoDia}
          onDelete={handleApagarFreebet} // Passamos a função de excluir para o componente lateral!
        />
      </div>

      <ListaOperacoesAtivas trades={tradesAtivos} />

    </div>
  );
}