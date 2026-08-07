"use client";

import { useState } from 'react';
import { 
  ArrowLeft, TrendingUp, TrendingDown, Tag, Calendar, 
  AlignLeft, Building2 
} from 'lucide-react';
import Link from 'next/link';

// Importação das nossas novas "Peças de Lego"
import { SeletorTipoTransacao } from '@/components/cadastro/TypeTransacionSelect';
import { SeletorMetodoPagamento } from '@/components/cadastro/PaymentSelect';
import { InputSelect } from '@/components/ui/InputSelect';

export default function NovaTransacao() {
  const [tipo, setTipo] = useState<'entrada' | 'saida'>('saida');
  const [metodo, setMetodo] = useState<'pix' | 'debito' | 'credito'>('pix');
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [banco, setBanco] = useState('');
  
  const corPrimaria = tipo === 'entrada' ? 'text-success' : 'text-danger';

  return (
    <div className="flex flex-col p-4 md:p-6 gap-6 max-w-200 mx-auto pb-24">
      
      {/* 1. CABEÇALHO FLUTUANTE */}
      <div className="flex items-center gap-5 p-5 md:p-6 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        <Link 
          href="/financeiro/visao-geral" 
          className="p-3 transition-colors border rounded-xl bg-[#18181b] border-border hover:border-gray-500 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white font-sans">Nova Transação</h1>
          <p className="mt-1 text-sm text-gray-400">Registre uma nova movimentação no seu caixa.</p>
        </div>
      </div>

      {/* 2. TIPO E VALOR */}
      <div className="flex flex-col gap-8 p-6 md:p-8 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        
        <SeletorTipoTransacao tipo={tipo} onChange={setTipo} />

        {/* Input de Valor (Deixado aqui por ser muito específico no design gigante) */}
        <div className="flex flex-col items-center justify-center gap-2 py-4">
          <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">
            Valor da Transação
          </span>
          <div className="flex items-center gap-2">
            <span className={`text-3xl font-bold ${corPrimaria}`}>R$</span>
            <input 
              type="text" 
              placeholder="0,00"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              className="w-[200px] bg-transparent text-5xl md:text-6xl font-bold text-white text-center focus:outline-none placeholder:text-gray-700 caret-brand"
            />
          </div>
        </div>
      </div>

      {/* 3. DETALHES GERAIS */}
      <div className="flex flex-col gap-6 p-6 md:p-8 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        
        {/* Descrição */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-300">Descrição</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <AlignLeft className="w-5 h-5 text-gray-500" />
            </div>
            <input 
              type="text" 
              placeholder={tipo === 'entrada' ? "ex: Venda PS Vita na OLX" : "ex: Lanche IFood"}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full py-3 pl-12 pr-4 text-white transition-colors border rounded-xl bg-[#18181b] border-border focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/50 placeholder:text-gray-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Categoria Modularizada */}
          <InputSelect 
            label="Categoria"
            icon={Tag}
            placeholder={tipo === 'entrada' ? "Selecionar categoria..." : "Selecionar categoria..."}
            value={categoria}
            onClick={() => console.log('Abre modal de categoria')}
          />

          {/* Data */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Data</label>
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

      {/* 4. PAGAMENTO E CONTA */}
      <div className="flex flex-col gap-6 p-6 md:p-8 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        
        <SeletorMetodoPagamento tipo={tipo} metodo={metodo} onChange={setMetodo} />

        {/* Banco de Origem Modularizado */}
        <InputSelect 
          label={tipo === 'entrada' ? 'Recebido em qual banco?' : 'Pago com qual banco?'}
          icon={Building2}
          placeholder="Selecionar banco..."
          value={banco}
          onClick={() => console.log('Abre modal de banco')}
        />

      </div>

      {/* 5. BOTÕES DE AÇÃO FLUTUANTES */}
      <div className="flex items-center justify-end p-5 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        <Link 
          href="/financeiro/visao-geral"
          className="px-6 py-2.5 text-sm font-medium transition-colors text-gray-400 hover:text-white"
        >
          Cancelar
        </Link>
        <button className={`flex items-center gap-2 px-8 py-2.5 text-sm font-bold text-background rounded-xl transition-colors ml-4 shadow-lg ${
          tipo === 'entrada' ? 'bg-success hover:bg-success/90 shadow-success/30' : 'bg-danger hover:bg-danger/90 shadow-danger/30'
        }`}>
          {tipo === 'entrada' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          Registrar {tipo === 'entrada' ? 'Entrada' : 'Saída'}
        </button>
      </div>

    </div>
  );
}