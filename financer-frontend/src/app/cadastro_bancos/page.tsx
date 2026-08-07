"use client";

import { useState } from 'react';
import { Building2, Wallet, ShieldCheck, ArrowLeft, Landmark } from 'lucide-react';
import Link from 'next/link';

// Componentes modulares
import { CardSelecao } from '@/components/ui/CardSelect';
import { SeletorCores } from '@/components/ui/ColorSelect';
import { NameInput } from '@/components/ui/NameInput'; 

export default function CadastroBanco() {
  const [tipoConta, setTipoConta] = useState<'giro' | 'reserva'>('giro');
  const [nome, setNome] = useState('');
  const [saldo, setSaldo] = useState('');
  // Agora usamos a corSelecionada com nosso componente modular
  const [corSelecionada, setCorSelecionada] = useState('purple');

  return (
    <div className="flex flex-col p-4 md:p-6 gap-6 max-w-[800px] mx-auto pb-24">
      
      {/* BLOCO 1: CABEÇALHO */}
      <div className="flex items-center gap-5 p-5 md:p-6 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        <Link 
          href="/" 
          className="p-3 transition-colors border rounded-xl bg-[#18181b] border-border hover:border-gray-500 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white font-sans">Nova Conta</h1>
          <p className="mt-1 text-sm text-gray-400">Cadastre um banco ou carteira para acompanhar.</p>
        </div>
      </div>

      {/* BLOCO 2: FORMULÁRIO */}
      <div className="flex flex-col gap-8 p-6 md:p-8 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        
        <NameInput 
            label="Nome de Identificação"
            icon={Building2}
            placeholder="ex: Nubank - Caixinha 1"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
        />

        {/* 2. Cor de Identificação (MODULARIZADO) */}
        <SeletorCores 
          label="Cor de Identificação"
          corSelecionada={corSelecionada} 
          onChange={setCorSelecionada} 
        />

        {/* 3. Tipo de Conta */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-gray-300">
            Qual é a finalidade deste dinheiro?
          </label>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <CardSelecao
              titulo="Giro Operacional"
              descricao="Usado no dia a dia, apostas e compras. Entra nos cálculos de saldo livre."
              icon={Wallet}
              ativo={tipoConta === 'giro'}
              onClick={() => setTipoConta('giro')}
              corTexto="text-brand" 
              corBorda="border-brand"
              corFundo="bg-brand/10"
            />
            <CardSelecao
              titulo="Reserva Fixa (Blindada)"
              descricao="Dinheiro guardado. Não se mistura com o seu saldo de giro operacional."
              icon={ShieldCheck}
              ativo={tipoConta === 'reserva'}
              onClick={() => setTipoConta('reserva')}
              corTexto="text-blue-500"
              corBorda="border-blue-500"
              corFundo="bg-blue-500/10"
            />
          </div>
        </div>

        {/* 4. Saldo Inicial */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-300">
            Saldo Atual (Ponto de Partida)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <span className="font-mono text-gray-500">R$</span>
            </div>
            <input 
              type="text" 
              placeholder="0,00"
              value={saldo}
              onChange={(e) => setSaldo(e.target.value)}
              className="w-full py-3 pl-12 pr-4 font-mono text-xl text-white transition-colors border rounded-xl bg-[#18181b] border-border focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/50 placeholder:text-gray-600"
            />
          </div>
          <span className="mt-1 text-xs text-gray-500">
            Este valor será usado como base inicial para os gráficos de crescimento.
          </span>
        </div>
      </div>

      {/* BLOCO 3: BOTÕES DE AÇÃO */}
      <div className="flex items-center justify-end p-5 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        <Link 
          href="/"
          className="px-6 py-2.5 text-sm font-medium transition-colors text-gray-400 hover:text-white"
        >
          Cancelar
        </Link>
        <button className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-background bg-brand rounded-xl hover:bg-brand/90 transition-colors ml-4 shadow-[0_0_15px_rgba(var(--brand),0.3)]">
          <Landmark className="w-4 h-4" />
          Cadastrar Conta
        </button>
      </div>

    </div>
  );
}