"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Utensils, Gamepad2, Car, Smartphone } from 'lucide-react';

// Importação dos Componentes Modulares
import { ModalNovaMeta } from '@/components/financer/ModalNovaMeta';
import { ResumoOrcamentoGlobal } from '@/components/financer/ResumoOrcamentoGlobal';
import { ListaLimitesCategoria } from '@/components/financer/ListaLimitesCategoria';

// === DADOS FALSOS DE EXEMPLO ===
const metas = [
  { id: 1, categoria: 'Alimentação (Ifood, Mercado)', gastoAtual: 450, limiteMaximo: 600, icon: Utensils },
  { id: 2, categoria: 'Lazer (Jogos e Peças)', gastoAtual: 280, limiteMaximo: 300, icon: Gamepad2 }, 
  { id: 3, categoria: 'Transporte (Uber, Ônibus)', gastoAtual: 85, limiteMaximo: 200, icon: Car },
  { id: 4, categoria: 'Assinaturas Digitais', gastoAtual: 65, limiteMaximo: 50, icon: Smartphone }, 
];

export default function Orcamentos() {
  const [modalAberto, setModalAberto] = useState(false);

  // Cálculos repassados via "Props" para os componentes filhos
  const orcamentoTotal = metas.reduce((acc, meta) => acc + meta.limiteMaximo, 0);
  const gastoTotal = metas.reduce((acc, meta) => acc + meta.gastoAtual, 0);
  const restanteGeral = orcamentoTotal - gastoTotal;

  return (
    <div className="flex flex-col p-4 md:p-6 gap-6 max-w-[800px] mx-auto pb-24">
      
      {/* BLOCO 1: CABEÇALHO FLUTUANTE */}
      <div className="flex items-center gap-5 p-5 md:p-6 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        <Link 
          href="/financeiro/visao-geral" 
          className="p-3 transition-colors border rounded-xl bg-[#18181b] border-border hover:border-gray-500 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white font-sans">Metas e Orçamentos</h1>
          <p className="mt-1 text-sm text-gray-400">Defina tetos de gastos e não seja pego de surpresa.</p>
        </div>
      </div>

      {/* BLOCO 2: VISÃO GERAL DO MÊS (COMPONENTE) */}
      <ResumoOrcamentoGlobal 
        orcamentoTotal={orcamentoTotal} 
        gastoTotal={gastoTotal} 
        restanteGeral={restanteGeral} 
      />

      {/* BLOCO 3: ORÇAMENTOS POR CATEGORIA (COMPONENTE) */}
      <ListaLimitesCategoria metas={metas} />

      {/* BLOCO 4: BOTÃO FLUTUANTE DE NOVA META */}
      <div className="flex items-center justify-between p-5 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        <div className="flex flex-col">
          <span className="font-bold text-white">Adicionar Novo Limite</span>
          <span className="text-sm text-gray-400">Crie uma meta para uma categoria específica.</span>
        </div>
        
        <button 
          onClick={() => setModalAberto(true)}
          className="flex items-center justify-center w-12 h-12 md:w-auto md:h-auto md:px-6 md:py-3 gap-2 font-bold transition-colors rounded-xl text-background bg-brand hover:bg-brand/90 shadow-[0_0_15px_rgba(251,169,76,0.3)]"
        >
          <Plus className="w-5 h-5 md:w-4 md:h-4" />
          <span className="hidden md:block">Nova Meta</span>
        </button>
      </div>

      {/* O MODAL FICA AQUI NO FINAL INVISÍVEL */}
      <ModalNovaMeta 
        isOpen={modalAberto} 
        onClose={() => setModalAberto(false)} 
      />

    </div>
  );
}