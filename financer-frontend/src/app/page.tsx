"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { FiltroData } from "@/components/ui/FiltroData";
import { 
  TrendingUp, TrendingDown, Wallet, LineChart, 
  Search, ChevronDown, Activity, ArrowUpRight,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { BarraCategoria } from "@/components/dashboard/BarraCategoria";
import { CardsResumo } from "@/components/dashboard/CardsResumo";
import { GraficoCrescimento } from "@/components/dashboard/GraficoCrescimento";
import { ChartCat } from "@/components/financer/ChartCat";
import { API_URL, NOMES_MESES, formatarBRL } from "@/lib/util";

interface CategoriaResumoAPI {
  categoria: string;
  valor: number;
  percentual: number;
  corTexto: string;
  corBarra: string;
}

interface DashboardResumoAPI {
  lucroLiquido: number;
  entradasBrutas: number;
  saidasTotais: number;
  aportesMes: number;
  operacoesConcluidas: number;
  raioX: CategoriaResumoAPI[];
  raioXSaidas: CategoriaResumoAPI[];
}

export default function Dashboard() {
  const hoje = new Date();
  const [mes, setMes] = useState(hoje.getMonth() + 1);
  const [ano, setAno] = useState(hoje.getFullYear());
  const [resumo, setResumo] = useState<DashboardResumoAPI | null>(null);

  const carregarResumo = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/dashboard/resumo?mes=${mes}&ano=${ano}`);
      if (res.ok) {
        setResumo(await res.json());
      }
    } catch (erro) {
      console.error("Erro ao carregar resumo do dashboard:", erro);
    }
  }, [mes, ano]);

  useEffect(() => {
    carregarResumo();
  }, [carregarResumo]);

  const mudarMes = (delta: number) => {
    let novoMes = mes + delta;
    let novoAno = ano;
    if (novoMes < 1) {
      novoMes = 12;
      novoAno -= 1;
    } else if (novoMes > 12) {
      novoMes = 1;
      novoAno += 1;
    }
    setMes(novoMes);
    setAno(novoAno);
  };

  const lucroLiquido = resumo?.lucroLiquido ?? 0;
  const entradasBrutas = resumo?.entradasBrutas ?? 0;
  const saidasTotais = resumo?.saidasTotais ?? 0;
  const aportesMes = resumo?.aportesMes ?? 0;
  const operacoesConcluidas = resumo?.operacoesConcluidas ?? 0;
  const raioX = resumo?.raioX ?? [];

  const dadosGraficoEntradas = raioX.map((item) => ({
    categoria: item.categoria,
    valor: formatarBRL(item.valor),
    percentual: item.percentual,
    cor: item.corTexto,
  }));

  return (
    <div className="flex flex-col p-4 md:p-6 gap-6 max-w-350 mx-auto">
      
      {/* 1. CABEÇALHO E FILTROS AVANÇADOS */}
      <div className="p-5 border bg-surface/50 border-border rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-brand">Filtros Avançados</h2>
          </div>
          
          <div className="flex flex-col gap-5 md:flex-row">
            <div className="flex items-center gap-2 px-4 py-2.5 border rounded-lg bg-[#18181b] border-border md:w-64">
              <Search className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500">Nome da conta...</span>
            </div>
            
            <FiltroData />

            <div className="flex items-center justify-between gap-4 px-4 py-2.5 border rounded-lg bg-[#18181b] border-border min-w-50">
              <span className="text-sm text-gray-400">Todas as contas</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Seletor de Mês/Ano Real */}
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 border rounded-xl bg-[#18181b] border-border">
          <button
            type="button"
            onClick={() => mudarMes(-1)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-border/50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-bold text-white min-w-[130px] text-center">
            {NOMES_MESES[mes - 1]} {ano}
          </span>
          <button
            type="button"
            onClick={() => mudarMes(1)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-border/50 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. OS "BIG NUMBERS" (4 Cards) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        
        <CardsResumo 
          titulo="Lucro Líquido"
          valor={`${lucroLiquido >= 0 ? '+ ' : '- '}${formatarBRL(Math.abs(lucroLiquido))}`}
          descricao="Entradas - Saídas"
          icon={LineChart}
          corTexto={lucroLiquido >= 0 ? "text-success" : "text-danger"}
          corHover="hover:border-success/30"
        />

        <CardsResumo 
          titulo="Entradas Brutas"
          valor={formatarBRL(entradasBrutas)}
          descricao={`${operacoesConcluidas} movimentações no mês`}
          icon={TrendingUp}
          corTexto="text-white"
          corHover="hover:border-brand/30"
        />

        <CardsResumo 
          titulo="Saídas Totais"
          valor={`- ${formatarBRL(saidasTotais)}`}
          descricao="Custo de vida + Operacional"
          icon={TrendingDown}
          corTexto="text-danger"
          corHover="hover:border-danger/30"
        />

        <CardsResumo 
          titulo="Aportes do Mês"
          valor={formatarBRL(aportesMes)}
          descricao="Travado em Reserva Fixa"
          icon={Wallet}
          corTexto="text-blue-400"
          corHover="hover:border-blue-400/30"
        />

      </div>

      {/* ÁREA INFERIOR: GRÁFICOS */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* 3. GRÁFICO DE CRESCIMENTO */}
        <GraficoCrescimento />

        {/* 4. RAIO-X DAS ENTRADAS (Ocupa 1/3 da tela) */}
        <div className="col-span-1 p-5 border bg-surface/40 border-border/80 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-4 h-4 text-gray-400" />
              <h3 className="font-medium text-white">Raio-X das Entradas</h3>
            </div>

            <ChartCat 
              titulo="Entradas" 
              valorTotal={formatarBRL(entradasBrutas)} 
              dados={dadosGraficoEntradas} 
            />
            
            <div className="flex flex-col gap-5 mt-6">
              {raioX.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  Nenhuma entrada registrada neste mês.
                </p>
              ) : (
                raioX.map((cat) => (
                  <BarraCategoria 
                    key={cat.categoria}
                    titulo={cat.categoria} 
                    valor={formatarBRL(cat.valor)} 
                    porcentagem={`${cat.percentual}%`} 
                    corTexto={cat.corTexto} 
                    corBarra={cat.corBarra} 
                  />
                ))
              )}
            </div>
          </div>

          <Link 
            href="/financer/visualizacao_geral"
            className="flex items-center justify-center w-full gap-2 py-3 mt-6 text-sm transition-colors border border-dashed rounded-lg text-gray-400 border-border hover:border-brand hover:text-brand"
          >
            <span>Ver relatório completo</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
