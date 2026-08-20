"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Package, Tag, Calendar, 
  Building2, Sparkles, History, Save 
} from 'lucide-react';

// Reutilizando nossos componentes modulares!
import { NameInput } from '@/components/ui/NameInput';
import { InputSelect } from '@/components/ui/InputSelect';
import { CardSelecao } from '@/components/ui/CardSelect';

export default function NovoItemEstoque() {
  const [nomeProduto, setNomeProduto] = useState('');
  const [precoCusto, setPrecoCusto] = useState('');
  const [condicao, setCondicao] = useState<'novo' | 'usado'>('usado');
  const [categoria, setCategoria] = useState('');
  const [banco, setBanco] = useState('');

  return (
    <div className="flex flex-col p-4 md:p-6 gap-6 max-w-200 mx-auto pb-24">
      
      {/* BLOCO 1: CABEÇALHO FLUTUANTE            */}
      <div className="flex items-center gap-5 p-5 md:p-6 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        <Link 
          href="/" 
          className="p-3 transition-colors border rounded-xl bg-[#18181b] border-border hover:border-gray-500 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white font-sans">Novo Item no Estoque</h1>
          <p className="mt-1 text-sm text-gray-400">Cadastre um produto adquirido para revenda ou uso.</p>
        </div>
      </div>

      {/* BLOCO 2: DETALHES DO PRODUTO            */}
      <div className="flex flex-col gap-8 p-6 md:p-8 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        
        {/* 1. Nome do Item */}
        <NameInput 
          label="Nome do Item / Aparelho"
          icon={Package}
          placeholder="ex: Nintendo 3DS XL / PS Vita PCH-1000"
          value={nomeProduto}
          onChange={(e) => setNomeProduto(e.target.value)}
        />

        {/* 2. Condição do Item (Usando nosso CardSelecao) */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-gray-300">
            Condição do Item
          </label>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <CardSelecao
              titulo="Usado / Recondicionado"
              descricao="Item adquirido de terceiros, com marcas de uso ou revisado."
              icon={History}
              ativo={condicao === 'usado'}
              onClick={() => setCondicao('usado')}
              corTexto="text-brand"
              corBorda="border-brand"
              corFundo="bg-brand/10"
            />

            <CardSelecao
              titulo="Novo / Lacrado"
              descricao="Item comprado diretamente da loja ou sem uso prévio."
              icon={Sparkles}
              ativo={condicao === 'novo'}
              onClick={() => setCondicao('novo')}
              corTexto="text-blue-500"
              corBorda="border-blue-500"
              corFundo="bg-blue-500/10"
            />
          </div>
        </div>

        {/* 3. Categoria e Preço de Custo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <InputSelect 
            label="Plataformas"
            icon={Tag}
            placeholder="Selecionar as plataformas..."
            value={categoria}
            onClick={() => console.log('Abrir modal de categorias')}
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Preço de Aquisição (Custo)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <span className="font-mono text-gray-500">R$</span>
              </div>
              <input 
                type="text" 
                placeholder="0,00"
                value={precoCusto}
                onChange={(e) => setPrecoCusto(e.target.value)}
                className="w-full py-3 pl-12 pr-4 font-mono text-white transition-colors border rounded-xl bg-[#18181b] border-border focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/50 placeholder:text-gray-600"
              />
            </div>
          </div>

        </div>

      </div>

      {/* BLOCO 3: PAGAMENTO E DATA               */}
      <div className="flex flex-col gap-6 p-6 md:p-8 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <InputSelect 
            label="Pago com qual banco/carteira?"
            icon={Building2}
            placeholder="Selecionar banco..."
            value={banco}
            onClick={() => console.log('Abrir seletor de banco')}
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Data da Compra</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Calendar className="w-5 h-5 text-gray-500" />
              </div>
              <input 
                type="date" 
                className="w-full py-3 pl-12 pr-4 text-white transition-colors border rounded-xl bg-[#18181b] border-border focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/50"
              />
            </div>
          </div>

        </div>

      </div>

      {/* BLOCO 4: BOTÕES DE AÇÃO FLUTUANTES      */}
      <div className="flex items-center justify-end p-5 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        <Link 
          href="/"
          className="px-6 py-2.5 text-sm font-medium transition-colors text-gray-400 hover:text-white"
        >
          Cancelar
        </Link>
        <button className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-background bg-brand rounded-xl hover:bg-brand/90 transition-colors ml-4 shadow-[0_0_15px_rgba(251,169,76,0.3)]">
          <Save className="w-4 h-4" />
          Adicionar ao Estoque
        </button>
      </div>

    </div>
  );
}