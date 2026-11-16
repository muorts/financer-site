"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, TrendingDown, Wallet, LineChart, 
  ChevronDown, Activity, ArrowUpRight,
  ChevronLeft, ChevronRight, Landmark, Check
} from 'lucide-react';
import { BarraCategoria } from "@/components/dashboard/BarraCategoria";
import { CardsResumo } from "@/components/dashboard/CardsResumo";
import { GraficoCrescimento, PontoEvolucaoDTO } from "@/components/dashboard/GraficoCrescimento";
import { ChartCat } from "@/components/financer/ChartCat";
import { API_URL, BancoDTO, NOMES_MESES, formatarBRL, getClassesCor } from "@/lib/util";

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
  evolucao: PontoEvolucaoDTO[];
}

export default function Dashboard() {
  const hoje = new Date();
  const [mes, setMes] = useState(hoje.getMonth() + 1);
  const [ano, setAno] = useState(hoje.getFullYear());

  const [bancos, setBancos] = useState<BancoDTO[]>([]);
  const [bancoFiltroId, setBancoFiltroId] = useState<string>('');
  const [dropdownContaAberto, setDropdownContaAberto] = useState(false);

  const [resumo, setResumo] = useState<DashboardResumoAPI | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/bancos`)
      .then((res) => res.json())
      .then((lista) => setBancos(Array.isArray(lista) ? lista : []))
      .catch((err) => console.error("Erro ao carregar bancos no dashboard:", err));
  }, []);

  const carregarResumo = useCallback(async () => {
    try {
      const queryBanco = bancoFiltroId ? `&bancoId=${bancoFiltroId}` : '';
      const res = await fetch(`${API_URL}/dashboard/resumo?mes=${mes}&ano=${ano}${queryBanco}`);
      if (res.ok) {
        setResumo(await res.json());
      }
    } catch (erro) {
      console.error("Erro ao carregar resumo do dashboard:", erro);
    }
  }, [mes, ano, bancoFiltroId]);

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

  const limparFiltros = () => {
    setBancoFiltroId('');
    setMes(hoje.getMonth() + 1);
    setAno(hoje.getFullYear());
  };

  const bancoSelecionado = bancos.find((b) => b.id === bancoFiltroId);

  const lucroLiquido = resumo?.lucroLiquido ?? 0;
  const entradasBrutas = resumo?.entradasBrutas ?? 0;
  const saidasTotais = resumo?.saidasTotais ?? 0;
  const aportesMes = resumo?.aportesMes ?? 0;
  const operacoesConcluidas = resumo?.operacoesConcluidas ?? 0;
  const raioX = resumo?.raioX ?? [];
  const evolucao = resumo?.evolucao ?? [];

  const dadosGraficoEntradas = raioX.map((item) => ({
    categoria: item.categoria,
    valor: formatarBRL(item.valor),
    percentual: item.percentual,
    cor: item.corTexto,
  }));

  return (
    <div className="flex flex-col p-4 md:p-6 gap-6 max-w-350 mx-auto">
      
      {/* 1. CABEÇALHO E FILTROS AVANÇADOS */}
      <div className="p-5 border bg-surface/50 border-border rounded-xl flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-medium text-brand">Filtros do Painel</h2>
          </div>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Dropdown Real de Contas/Bancos */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownContaAberto(!dropdownContaAberto)}
                className="flex items-center justify-between gap-4 px-4 py-2.5 border rounded-xl bg-[#18181b] border-border hover:border-gray-500 min-w-56 text-left transition-colors"
              >
                <span className="text-sm text-white font-medium">
                  {bancoSelecionado ? bancoSelecionado.nome : 'Todas as contas'}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {dropdownContaAberto && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setDropdownContaAberto(false)} />
                  <div className="absolute left-0 top-full mt-2 z-50 w-64 rounded-xl border border-border bg-[#131316] p-2 shadow-2xl flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setBancoFiltroId('');
                        setDropdownContaAberto(false);
                      }}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                        !bancoFiltroId ? 'bg-brand/15 text-brand font-bold' : 'text-gray-300 hover:bg-white/5'
                      }`}
                    >
                      <span>Todas as contas</span>
                      {!bancoFiltroId && <Check className="w-4 h-4 text-brand" />}
                    </button>

                    {bancos.map((b) => {
                      const cores = getClassesCor(b.cor);
                      const isSel = bancoFiltroId === b.id;
                      return (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => {
                            setBancoFiltroId(b.id);
                            setDropdownContaAberto(false);
                          }}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                            isSel ? 'bg-brand/15 border border-brand/40' : 'hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${cores.border} ${cores.bgSoft} ${cores.text}`}>
                              <Landmark className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-sm text-white">{b.nome}</span>
                          </div>
                          {isSel && <Check className="w-4 h-4 text-brand" />}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Seletor de Mês/Ano Real */}
            <div className="flex items-center justify-between gap-3 px-4 py-2 border rounded-xl bg-[#18181b] border-border">
              <button
                type="button"
                onClick={() => mudarMes(-1)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-border/50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm font-bold text-white min-w-[130px] text-center">
                {NOMES_MESES[mes - 1]} {ano}
              </span>
              <button
                type="button"
                onClick={() => mudarMes(1)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-border/50 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button 
              type="button"
              onClick={limparFiltros}
              className="text-sm text-gray-500 transition-colors hover:text-gray-300"
            >
              Limpar Filtros
            </button>
          </div>
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
        
        {/* 3. GRÁFICO DE CRESCIMENTO DINÂMICO */}
        <GraficoCrescimento dados={evolucao} />

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
