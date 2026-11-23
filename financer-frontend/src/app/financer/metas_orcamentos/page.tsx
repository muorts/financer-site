"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

import { ModalNovaMeta } from '@/components/financer/ModalNovaMeta';
import { ResumoOrcamentoGlobal } from '@/components/financer/ResumoOrcamentoGlobal';
import { ListaLimitesCategoria } from '@/components/financer/ListaLimitesCategoria';
import { 
  API_URL, CategoriaDTO, ResumoMetasDTO, 
  NOMES_MESES, getIconePorId, extrairMensagemErro 
} from '@/lib/util';

export default function Orcamentos() {
  const hoje = new Date();
  const [mes, setMes] = useState(hoje.getMonth() + 1);
  const [ano, setAno] = useState(hoje.getFullYear());

  const [modalAberto, setModalAberto] = useState(false);
  const [erroMsg, setErroMsg] = useState('');
  const [resumo, setResumo] = useState<ResumoMetasDTO>({
    mes: hoje.getMonth() + 1,
    ano: hoje.getFullYear(),
    orcamentoTotal: 0,
    gastoTotal: 0,
    restanteGeral: 0,
    metas: [],
  });
  const [categorias, setCategorias] = useState<CategoriaDTO[]>([]);
  const [versao, setVersao] = useState(0);

  useEffect(() => {
    let ativo = true;

    async function carregarDados() {
      try {
        const [resMetas, resCats] = await Promise.all([
          fetch(`${API_URL}/metas?mes=${mes}&ano=${ano}`),
          fetch(`${API_URL}/categorias?tipo=SAIDA`),
        ]);
        if (!ativo) return;

        if (resMetas.ok) {
          const dadosMetas: ResumoMetasDTO = await resMetas.json();
          if (!ativo) return;
          setErroMsg('');
          setResumo(dadosMetas);
        } else {
          setErroMsg(await extrairMensagemErro(resMetas, 'Não foi possível carregar as metas do mês.'));
        }
        if (resCats.ok) {
          const listaCats: CategoriaDTO[] = await resCats.json();
          if (!ativo) return;
          setCategorias(Array.isArray(listaCats) ? listaCats : []);
        }
      } catch (erro) {
        if (!ativo) return;
        console.error('Erro ao carregar metas e orçamentos:', erro);
        setErroMsg('Não foi possível conectar ao servidor backend.');
      }
    }

    void carregarDados();
    return () => {
      ativo = false;
    };
  }, [mes, ano, versao]);

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
    if (!res.ok) {
      throw new Error(await extrairMensagemErro(res, 'Não foi possível salvar a meta.'));
    }
    setVersao((v) => v + 1);
  };

  const handleExcluirMeta = async (id: string) => {
    setErroMsg('');
    try {
      const res = await fetch(`${API_URL}/metas/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setVersao((v) => v + 1);
      } else {
        setErroMsg(await extrairMensagemErro(res, 'Não foi possível excluir a meta.'));
      }
    } catch (erro) {
      console.error('Erro ao excluir meta:', erro);
      setErroMsg('Erro de conexão ao excluir a meta.');
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

      {erroMsg && (
        <div className="p-4 text-sm font-medium text-danger bg-danger/10 border border-danger/30 rounded-xl">
          {erroMsg}
        </div>
      )}

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
          type="button"
          onClick={() => setModalAberto(true)}
          className="flex items-center justify-center w-12 h-12 md:w-auto md:h-auto md:px-6 md:py-3 gap-2 font-bold transition-colors rounded-xl text-background bg-brand hover:bg-brand/90 shadow-lg shadow-brand/25"
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
