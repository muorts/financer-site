"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

import { ModalNovaMeta } from '@/components/financer/ModalNovaMeta';
import { ResumoOrcamentoGlobal } from '@/components/financer/ResumoOrcamentoGlobal';
import { ListaLimitesCategoria } from '@/components/financer/ListaLimitesCategoria';
import { 
  API_URL, CategoriaDTO, ResumoMetasDTO, 
  NOMES_MESES, getIconePorId 
} from '@/lib/util';

export default function Orcamentos() {
  const hoje = new Date();
  const [mes, setMes] = useState(hoje.getMonth() + 1);
  const [ano, setAno] = useState(hoje.getFullYear());

  const [modalAberto, setModalAberto] = useState(false);
  const [resumo, setResumo] = useState<ResumoMetasDTO>({
    mes: hoje.getMonth() + 1,
    ano: hoje.getFullYear(),
    orcamentoTotal: 0,
    gastoTotal: 0,
    restanteGeral: 0,
    metas: [],
  });
  const [categorias, setCategorias] = useState<CategoriaDTO[]>([]);

  const carregarDados = useCallback(async () => {
    try {
      const [resMetas, resCats] = await Promise.all([
        fetch(`${API_URL}/metas?mes=${mes}&ano=${ano}`),
        fetch(`${API_URL}/categorias`),
      ]);
      if (resMetas.ok) {
        const dadosMetas: ResumoMetasDTO = await resMetas.json();
        setResumo(dadosMetas);
      }
      if (resCats.ok) {
        const listaCats: CategoriaDTO[] = await resCats.json();
        const catsSaida = listaCats.filter((c) => c.tipo?.toUpperCase() === 'SAIDA');
        setCategorias(catsSaida.length > 0 ? catsSaida : listaCats);
      }
    } catch (erro) {
      console.error('Erro ao carregar metas e orçamentos:', erro);
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

  const handleSalvarMeta = async (categoriaId: string, limiteMaximo: number) => {
    const res = await fetch(`${API_URL}/metas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categoriaId, limiteMaximo, mes, ano }),
    });
    if (res.ok) {
      await carregarDados();
    }
  };

  const handleExcluirMeta = async (id: string) => {
    const res = await fetch(`${API_URL}/metas/${id}`, { method: 'DELETE' });
    if (res.ok) {
      await carregarDados();
    }
  };

  const metasFormatadas = (resumo.metas || []).map((m) => ({
    id: m.id,
    categoria: m.categoriaNome,
    gastoAtual: m.gastoAtual,
    limiteMaximo: m.limiteMaximo,
    icon: getIconePorId(m.categoriaIcone),
  }));

  return (
    <div className="flex flex-col p-4 md:p-6 gap-6 max-w-[800px] mx-auto pb-24">
      
      {/* BLOCO 1: CABEÇALHO FLUTUANTE + SELETOR DE MÊS/ANO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 md:p-6 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        <div className="flex items-center gap-5">
          <Link 
            href="/financer/visualizacao_geral" 
            className="p-3 transition-colors border rounded-xl bg-[#18181b] border-border hover:border-gray-500 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white font-sans">Metas e Orçamentos</h1>
            <p className="mt-1 text-sm text-gray-400">Defina tetos de gastos mensais e não seja pego de surpresa.</p>
          </div>
        </div>

        {/* Seletor de Mês/Ano */}
        <div className="flex items-center justify-between gap-3 px-3 py-2 border rounded-xl bg-[#18181b] border-border">
          <button
            type="button"
            onClick={() => mudarMes(-1)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-border/50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-bold text-white min-w-[120px] text-center">
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

      {/* BLOCO 2: VISÃO GERAL DO MÊS (COMPONENTE) */}
      <ResumoOrcamentoGlobal 
        orcamentoTotal={resumo.orcamentoTotal} 
        gastoTotal={resumo.gastoTotal} 
        restanteGeral={resumo.restanteGeral} 
      />

      {/* BLOCO 3: ORÇAMENTOS POR CATEGORIA (COMPONENTE) */}
      <ListaLimitesCategoria metas={metasFormatadas} onDelete={handleExcluirMeta} />

      {/* BLOCO 4: BOTÃO FLUTUANTE DE NOVA META */}
      <div className="flex items-center justify-between p-5 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        <div className="flex flex-col">
          <span className="font-bold text-white">Adicionar Novo Limite</span>
          <span className="text-sm text-gray-400">
            Crie ou atualize uma meta para {NOMES_MESES[mes - 1]} de {ano}.
          </span>
        </div>
        
        <button 
          onClick={() => setModalAberto(true)}
          className="flex items-center justify-center w-12 h-12 md:w-auto md:h-auto md:px-6 md:py-3 gap-2 font-bold transition-colors rounded-xl text-background bg-brand hover:bg-brand/90 shadow-[0_0_15px_rgba(251,169,76,0.3)]"
        >
          <Plus className="w-5 h-5 md:w-4 md:h-4" />
          <span className="hidden md:block">Nova Meta</span>
        </button>
      </div>

      {/* MODAL DE NOVA META */}
      <ModalNovaMeta 
        isOpen={modalAberto} 
        onClose={() => setModalAberto(false)} 
        categorias={categorias}
        onSalvar={handleSalvarMeta}
      />

    </div>
  );
}
