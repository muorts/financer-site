"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { CardTransacao } from "@/components/financer/CardTransacao";
import { Filters } from "@/components/financer/filters";
import { ChartCat } from "@/components/financer/ChartCat";
import { Activity, TrendingUp, TrendingDown, Plus } from 'lucide-react';
import { 
  API_URL, TransacaoDTO, ResumoMetasDTO, 
  formatarBRL, formatarDataCurta 
} from '@/lib/util';

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

export default function VisaoGeralFinanceiro() {
  const hoje = new Date();
  const [mes, setMes] = useState(hoje.getMonth() + 1);
  const [ano, setAno] = useState(hoje.getFullYear());
  const [filtroAtivo, setFiltroAtivo] = useState('Todas');

  const [transacoes, setTransacoes] = useState<TransacaoDTO[]>([]);
  const [resumo, setResumo] = useState<DashboardResumoAPI | null>(null);
  const [resumoMetas, setResumoMetas] = useState<ResumoMetasDTO | null>(null);

  const carregarDados = useCallback(async () => {
    try {
      const [resTrans, resDash, resMetas] = await Promise.all([
        fetch(`${API_URL}/transacoes?mes=${mes}&ano=${ano}`),
        fetch(`${API_URL}/dashboard/resumo?mes=${mes}&ano=${ano}`),
        fetch(`${API_URL}/metas?mes=${mes}&ano=${ano}`),
      ]);

      if (resTrans.ok) {
        const lista = await resTrans.json();
        setTransacoes(Array.isArray(lista) ? lista : []);
      }
      if (resDash.ok) {
        setResumo(await resDash.json());
      }
      if (resMetas.ok) {
        setResumoMetas(await resMetas.json());
      }
    } catch (erro) {
      console.error('Erro ao carregar Visão Geral Financeira:', erro);
    }
  }, [mes, ano]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

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

  const handleExcluirTransacao = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/transacoes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await carregarDados();
      }
    } catch (erro) {
      console.error('Erro ao excluir transação:', erro);
    }
  };

  const entradas = transacoes.filter((t) => t.tipo?.toUpperCase() === 'ENTRADA');
  const saidas = transacoes.filter((t) => t.tipo?.toUpperCase() === 'SAIDA');

  const dadosGraficoEntradas = (resumo?.raioX || []).map((item) => ({
    categoria: item.categoria,
    valor: formatarBRL(item.valor),
    percentual: item.percentual,
    cor: item.corTexto,
  }));

  const dadosGraficoSaidas = (resumo?.raioXSaidas || []).map((item) => ({
    categoria: item.categoria,
    valor: formatarBRL(item.valor),
    percentual: item.percentual,
    cor: item.corTexto,
  }));

  const tetoOrcamento = resumoMetas?.orcamentoTotal || 0;
  const gastoNoMes = resumo?.saidasTotais || 0;
  const restanteOrcamento = Math.max(tetoOrcamento - gastoNoMes, 0);
  const percentualOrcamento = tetoOrcamento > 0 ? Math.min((gastoNoMes / tetoOrcamento) * 100, 100) : 0;

  return (
    <div className="flex flex-col p-4 md:p-6 gap-6 max-w-[1400px] mx-auto pb-24">
      
      {/* 1. BLOCO FLUTUANTE: CABEÇALHO ANALÍTICO */}
      <div className="flex flex-col gap-8 p-6 border bg-surface/40 border-border/80 rounded-xl lg:flex-row lg:items-center">
        
        {/* GRÁFICOS (Esquerda) */}
        <div className="flex flex-wrap justify-center gap-8 lg:w-1/2 lg:border-r lg:border-border/50 lg:pr-8">
          <ChartCat 
            titulo="Entradas" 
            valorTotal={formatarBRL(resumo?.entradasBrutas || 0)} 
            dados={dadosGraficoEntradas} 
          />
          <ChartCat 
            titulo="Saídas" 
            valorTotal={formatarBRL(resumo?.saidasTotais || 0)} 
            dados={dadosGraficoSaidas} 
          />
        </div>

        {/* ORÇAMENTO DO MÊS (Direita) */}
        <div className="flex flex-col justify-center flex-1 w-full gap-4 lg:pl-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Orçamento do Mês</h2>
            <span className="text-sm font-medium text-gray-400">
              {tetoOrcamento > 0 ? `Restam ${formatarBRL(restanteOrcamento)}` : 'Sem meta definida'}
            </span>
          </div>
          
          <div>
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-danger font-mono">Gasto: {formatarBRL(gastoNoMes)}</span>
              <span className="text-gray-500 font-mono">Teto: {formatarBRL(tetoOrcamento)}</span>
            </div>
            <div className="w-full h-3 overflow-hidden rounded-full bg-background border border-border/50">
              <div 
                className="h-full rounded-full bg-danger transition-all duration-1000"
                style={{ width: `${percentualOrcamento}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-2">
            <Link
              href="/financer/metas_orcamentos"
              className="text-xs font-medium text-gray-400 hover:text-white underline"
            >
              Configurar metas
            </Link>
            <Link
              href="/financer/nova_transacao"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-background bg-brand rounded-xl hover:bg-brand/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nova Transação
            </Link>
          </div>
        </div>
      </div>

      {/* 2. BLOCO FLUTUANTE: FILTROS */}
      <Filters 
        mes={mes}
        ano={ano}
        onMudarMes={mudarMes}
        filtroAtivo={filtroAtivo}
        onMudarFiltro={setFiltroAtivo}
      />

      {/* 3. BLOCO FLUTUANTE: FEED DE TRANSAÇÕES DIVIDIDO */}
      <div className="flex flex-col p-5 border bg-surface/40 border-border/80 rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-gray-400" />
            <h3 className="font-medium text-white">Histórico do Mês ({transacoes.length})</h3>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {filtroAtivo !== 'Só Saídas' && (
            <div className="flex flex-col gap-3">
              <h4 className="flex items-center gap-2 mb-2 text-sm font-medium text-success">
                <TrendingUp className="w-4 h-4" /> Entradas ({entradas.length})
              </h4>
              {entradas.length === 0 ? (
                <p className="text-sm text-gray-500 py-4">Nenhuma entrada registrada neste mês.</p>
              ) : (
                entradas.map((t) => (
                  <CardTransacao 
                    key={t.id} 
                    id={t.id}
                    tipo="entrada"
                    titulo={t.descricao}
                    valor={formatarBRL(t.valor)}
                    categoria={t.categoria?.nome || 'Sem Categoria'}
                    bancoNome={t.banco?.nome}
                    data={formatarDataCurta(t.data)}
                    onDelete={handleExcluirTransacao}
                  />
                ))
              )}
            </div>
          )}

          {filtroAtivo !== 'Só Entradas' && (
            <div className="flex flex-col gap-3">
              <h4 className="flex items-center gap-2 mb-2 text-sm font-medium text-danger">
                <TrendingDown className="w-4 h-4" /> Saídas ({saidas.length})
              </h4>
              {saidas.length === 0 ? (
                <p className="text-sm text-gray-500 py-4">Nenhuma saída registrada neste mês.</p>
              ) : (
                saidas.map((t) => (
                  <CardTransacao 
                    key={t.id} 
                    id={t.id}
                    tipo="saida"
                    titulo={t.descricao}
                    valor={formatarBRL(t.valor)}
                    categoria={t.categoria?.nome || 'Sem Categoria'}
                    bancoNome={t.banco?.nome}
                    data={formatarDataCurta(t.data)}
                    onDelete={handleExcluirTransacao}
                  />
                ))
              )}
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
