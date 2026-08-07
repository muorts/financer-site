"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Tag, Save, TrendingUp, TrendingDown } from 'lucide-react';

import { CardSelecao } from '@/components/ui/CardSelect'; 
import { SeletorCores } from '@/components/ui/ColorSelect';
import { SeletorIcones } from '@/components/ui/IconSelect';
import { NameInput } from '@/components/ui/NameInput';

export default function CadastroCategoria() {
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState<'saida' | 'entrada'>('saida');
  const [corSelecionada, setCorSelecionada] = useState('emerald');
  const [iconeSelecionado, setIconeSelecionado] = useState('utensils');

  return (
    <div className="flex flex-col p-4 md:p-6 gap-6 max-w-[800px] mx-auto pb-24">
      
      {/* BLOCO 1: CABEÇALHO */}
      <div className="flex items-center gap-5 p-5 md:p-6 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        <Link 
          href="/financeiro/visao-geral" 
          className="p-3 transition-colors border rounded-xl bg-[#18181b] border-border hover:border-gray-500 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white font-sans">Nova Categoria</h1>
          <p className="mt-1 text-sm text-gray-400">Organize seus lançamentos de forma visual.</p>
        </div>
      </div>

      {/* BLOCO 2: FORMULÁRIO */}
      <div className="flex flex-col gap-8 p-6 md:p-8 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">

        <NameInput 
          label="Nome da Categoria"
          icon={Tag}
          placeholder="ex: Lazer e Games"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        {/* 2. Tipo (Entrada ou Saída) */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-gray-300">
            Qual é o comportamento padrão?
          </label>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <CardSelecao
              titulo="Despesa (Saída)"
              descricao="Gastos em geral, contas, compras e lazer."
              icon={TrendingDown}
              ativo={tipo === 'saida'}
              onClick={() => setTipo('saida')}
              corTexto="text-danger" 
              corBorda="border-danger"
              corFundo="bg-danger/10"
            />
            <CardSelecao
              titulo="Receita (Entrada)"
              descricao="Salário, lucro de vendas, bolsa, ganhos extras."
              icon={TrendingUp}
              ativo={tipo === 'entrada'}
              onClick={() => setTipo('entrada')}
              corTexto="text-success" 
              corBorda="border-success"
              corFundo="bg-success/10"
            />
          </div>
        </div>

        {/* 3. Seleção de Cor Modular */}
        <SeletorCores 
          corSelecionada={corSelecionada} 
          onChange={setCorSelecionada} 
        />

        {/* 4. Seleção de Ícone Modular */}
        <SeletorIcones 
          iconeSelecionado={iconeSelecionado} 
          onChange={setIconeSelecionado} 
        />

      </div>

      {/* BLOCO 3: BOTÕES DE AÇÃO */}
      <div className="flex items-center justify-end p-5 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        <Link 
          href="/financeiro/visao-geral"
          className="px-6 py-2.5 text-sm font-medium transition-colors text-gray-400 hover:text-white"
        >
          Cancelar
        </Link>
        <button className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-background bg-brand rounded-xl hover:bg-brand/90 transition-colors ml-4 shadow-[0_0_15px_rgba(var(--brand),0.3)]">
          <Save className="w-4 h-4" />
          Salvar Categoria
        </button>
      </div>

    </div>
  );
}