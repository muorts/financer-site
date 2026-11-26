"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, LayoutList, Plus, Wallet } from 'lucide-react';

import { CardEstoque } from '@/components/sales/CardStock';
import {
  DadosEdicaoItem,
  ModalConfirmarVenda,
  ModalCustoExtra,
  ModalEditarItem,
  ModalExcluirItem,
} from '@/components/sales/ModalStock';
import {
  API_URL,
  CategoriaVendaDTO,
  ItemEstoqueDTO,
  OpcoesEstoqueDTO,
  PlataformaVendaDTO,
  extrairMensagemErro,
  formatarBRL,
} from '@/lib/util';

export default function EstoqueAtual() {
  const [estoque, setEstoque] = useState<ItemEstoqueDTO[]>([]);
  const [categoriasDisponiveis, setCategoriasDisponiveis] = useState<CategoriaVendaDTO[]>([]);
  const [plataformasDisponiveis, setPlataformasDisponiveis] = useState<PlataformaVendaDTO[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erroMsg, setErroMsg] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('TODOS');
  const [versao, setVersao] = useState(0);

  // Controle de Modais
  const [itemParaCusto, setItemParaCusto] = useState<ItemEstoqueDTO | null>(null);
  const [itemParaVenda, setItemParaVenda] = useState<ItemEstoqueDTO | null>(null);
  const [itemParaEditar, setItemParaEditar] = useState<ItemEstoqueDTO | null>(null);
  const [itemParaExcluir, setItemParaExcluir] = useState<ItemEstoqueDTO | null>(null);

  useEffect(() => {
    let ativo = true;

    async function carregarEstoque() {
      try {
        const [resEstoque, resOpcoes] = await Promise.all([
          fetch(`${API_URL}/estoque`),
          fetch(`${API_URL}/estoque/opcoes`),
        ]);
        if (!ativo) return;

        if (resEstoque.ok) {
          const lista: ItemEstoqueDTO[] = await resEstoque.json();
          if (!ativo) return;
          setErroMsg('');
          setEstoque(Array.isArray(lista) ? lista : []);
        } else {
          setErroMsg(await extrairMensagemErro(resEstoque, 'Não foi possível carregar os itens do estoque.'));
        }

        if (resOpcoes.ok) {
          const opcoes: OpcoesEstoqueDTO = await resOpcoes.json();
          if (!ativo) return;
          setCategoriasDisponiveis(Array.isArray(opcoes.categorias) ? opcoes.categorias : []);
          setPlataformasDisponiveis(Array.isArray(opcoes.plataformas) ? opcoes.plataformas : []);
        }
      } catch (erro) {
        if (!ativo) return;
        console.error('Erro ao carregar estoque:', erro);
        setErroMsg('Não foi possível conectar ao servidor backend.');
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    void carregarEstoque();
    return () => {
      ativo = false;
    };
  }, [versao]);

  const handleAddCusto = async (dados: { descricao: string; valor: number; data: string }) => {
    if (!itemParaCusto) return;

    const res = await fetch(`${API_URL}/estoque/${itemParaCusto.id}/custos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });

    if (!res.ok) {
      throw new Error(await extrairMensagemErro(res, 'Não foi possível adicionar o custo extra.'));
    }

    const atualizado: ItemEstoqueDTO = await res.json();
    setEstoque((atual) => atual.map((item) => (item.id === atualizado.id ? atualizado : item)));
  };

  const handleRemoverCustoExtra = async (itemId: string, custoId: string) => {
    setErroMsg('');
    try {
      const res = await fetch(`${API_URL}/estoque/${itemId}/custos/${custoId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const atualizado: ItemEstoqueDTO = await res.json();
        setEstoque((atual) => atual.map((item) => (item.id === atualizado.id ? atualizado : item)));
      } else {
        setErroMsg(await extrairMensagemErro(res, 'Não foi possível remover o custo extra.'));
      }
    } catch (erro) {
      console.error('Erro ao remover custo extra:', erro);
      setErroMsg('Erro de conexão ao remover o custo extra.');
    }
  };

  const handleSalvarEdicao = async (dadosAtualizados: DadosEdicaoItem) => {
    if (!itemParaEditar) return;

    const res = await fetch(`${API_URL}/estoque/${itemParaEditar.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosAtualizados),
    });

    if (!res.ok) {
      throw new Error(await extrairMensagemErro(res, 'Não foi possível salvar as alterações.'));
    }

    const atualizado: ItemEstoqueDTO = await res.json();
    setEstoque((atual) => atual.map((item) => (item.id === atualizado.id ? atualizado : item)));
    // Atualiza também as opções de plataformas caso uma nova plataforma sugerida tenha sido persistida
    if (dadosAtualizados.plataformasNomes.length > 0) {
      setVersao((v) => v + 1);
    }
  };

  const handleExcluirItem = async (id: string) => {
    setErroMsg('');
    try {
      const res = await fetch(`${API_URL}/estoque/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setEstoque((atual) => atual.filter((item) => item.id !== id));
      } else {
        setErroMsg(await extrairMensagemErro(res, 'Não foi possível excluir o item.'));
      }
    } catch (erro) {
      console.error('Erro ao excluir item do estoque:', erro);
      setErroMsg('Erro de conexão ao excluir o item.');
    }
  };

  const itensFiltrados = filtroStatus === 'TODOS'
    ? estoque
    : estoque.filter((item) => item.status?.toUpperCase() === filtroStatus);

  const capitalImobilizado = estoque.reduce((acc, item) => acc + (item.custoTotal || 0), 0);

  return (
    <div className="flex flex-col p-4 md:p-6 gap-6 max-w-200 mx-auto pb-24">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 md:p-6 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        <div className="flex items-center gap-5">
          <Link 
            href="/" 
            className="p-3 transition-colors border rounded-xl bg-[#18181b] border-border hover:border-gray-500 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white font-sans">Estoque Atual</h1>
            <p className="mt-1 text-sm text-gray-400">Gerencie seus produtos, custos de reparo e vendas.</p>
          </div>
        </div>

        <Link
          href="/sales/novo_item"
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-background bg-brand rounded-xl hover:bg-brand/90 transition-colors shadow-lg shadow-brand/20"
        >
          <Plus className="w-4 h-4" />
          Novo Item
        </Link>
      </div>

      {/* RESUMO DO PÁTIO E FILTRO POR STATUS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 px-5 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
            <Wallet className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">Capital em Estoque</span>
            <span className="font-mono text-lg font-bold text-white">{formatarBRL(capitalImobilizado)}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { id: 'TODOS', label: 'Todos' },
            { id: 'MANUTENCAO', label: 'Na Bancada' },
            { id: 'PRONTO', label: 'Prontos' },
            { id: 'ANUNCIADO', label: 'Anunciados' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFiltroStatus(f.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                filtroStatus === f.id
                  ? 'bg-brand/15 text-brand border-brand'
                  : 'bg-[#18181b] text-gray-400 border-border hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {erroMsg && (
        <div className="p-4 text-sm font-medium text-danger bg-danger/10 border border-danger/30 rounded-xl">
          {erroMsg}
        </div>
      )}

      {/* LISTAGEM DE CARDS */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-2">
          <span className="text-sm font-medium tracking-wider uppercase text-gray-400 flex items-center gap-2">
            <LayoutList className="w-4 h-4" />
            Itens no Pátio ({itensFiltrados.length})
          </span>
        </div>

        {carregando ? (
          <div className="p-8 text-center border rounded-2xl bg-surface/30 border-border/50">
            <p className="text-sm text-gray-500">Carregando itens do estoque...</p>
          </div>
        ) : itensFiltrados.length === 0 ? (
          <div className="p-8 text-center border rounded-2xl bg-surface/30 border-border/50">
            <p className="text-gray-500">
              {estoque.length === 0
                ? 'Seu estoque está vazio. Clique em "Novo Item" para cadastrar seu primeiro produto.'
                : 'Nenhum item encontrado com este status.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {itensFiltrados.map((item) => (
              <CardEstoque 
                key={item.id} 
                item={item} 
                onAddCusto={setItemParaCusto}
                onVender={setItemParaVenda}
                onEditar={setItemParaEditar}
                onExcluir={setItemParaExcluir}
                onRemoverCustoExtra={handleRemoverCustoExtra}
              />
            ))}
          </div>
        )}
      </div>

      {/* MODAIS */}
      <ModalCustoExtra 
        isOpen={Boolean(itemParaCusto)} 
        itemNome={itemParaCusto?.nome}
        onClose={() => setItemParaCusto(null)}
        onSave={handleAddCusto}
      />

      <ModalConfirmarVenda 
        isOpen={Boolean(itemParaVenda)}
        itemAtual={itemParaVenda}
        onClose={() => setItemParaVenda(null)}
      />

      <ModalEditarItem 
        isOpen={Boolean(itemParaEditar)}
        onClose={() => setItemParaEditar(null)}
        onSave={handleSalvarEdicao}
        itemAtual={itemParaEditar}
        plataformasDisponiveis={plataformasDisponiveis}
        categoriasDisponiveis={categoriasDisponiveis}
      />

      <ModalExcluirItem
        item={itemParaExcluir}
        onClose={() => setItemParaExcluir(null)}
        onConfirmar={handleExcluirItem}
      />

    </div>
  );
}
