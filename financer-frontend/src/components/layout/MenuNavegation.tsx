// Layout que usei para fazer o menu da lateral onde vai ser encaixado no layout.tsx.

"use client";

import { useState } from 'react';
import { HousePlus, Calculator, ChartCandlestick, Store, BadgeDollarSign, Home, Package, Dices, Wallet, Menu, X, Plus, PieChart, CalendarDays, FileText, WalletCards, ChartColumnStacked, ChartNoAxesCombined, Layers, Warehouse } from 'lucide-react';
import { SubMenu } from '@/components/ui/SubMenu';

// cria os sub-modulos apartir de uma lista de objetos 
const modulos = [
  { 
    label: 'Dashboard', 
    icon: Home,
    submenus: [
      {label: "DashBoard", icon: Layers }
    ]
  },
  { 
    label: 'Financeiro', 
    icon: Wallet,
    submenus: [
      {label: "Visualização Geral", icon: PieChart},
      {label: "Nova Transação", icon: Plus},
      {label: "Faturas", icon: WalletCards},
      {label: "Metas e Orçamentos", icon: ChartNoAxesCombined},
      {label: "Categorias", icon: ChartColumnStacked},
    ]
  },
  { 
    label: 'Vendas', 
    icon: Package,
    submenus: [
        {label: "Novo Item", icon: Plus},
        {label: "Estoque", icon: Warehouse},
        {label: "Vendas", icon: BadgeDollarSign},
        {label: "Plataformas", icon: Store},
    ] 
  },
  { 
    label: 'Trading', 
    icon: Dices,
    submenus: [
      {label: "Trades", icon: ChartCandlestick},
      {label: "Nova Operação", icon: Plus},
      {label: "ComprovaBet", icon: FileText},
      {label: "Calculadora", icon: Calculator},
      {label: "Casas", icon: HousePlus},
    ] 
  },
  
];

// corpo do menu, onde tudo funciona e é transmitido para o layout.tsx, funciona com um useState para poder fazer com que o menu (no modo mobile) seja retrátil
export function MenuNavegation() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>

      {/* Topo do app visto pelo celular */}
      <div className="fixed top-0 left-0 z-40 flex items-center justify-between w-full h-16 px-4 border-b md:hidden bg-surface border-border">
        <span className="text-xl font-bold text-brand">Financer</span>
        <button onClick={() => setMenuOpen(true)} className="p-2 text-gray-300 hover:text-white">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* se o menu tiver aberto, joga um blur para melhor visualizacao */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-black/50 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
      )}

      {/* Barra lateral com comportamento duplo, no computador fica parada e no celular fica escondida até ser chamada */}
      <nav className={`
        fixed top-0 left-0 h-screen w-64 bg-surface border-r border-border z-50 p-4 overflow-y-auto
        flex flex-col gap-1 transition-transform duration-300 ease-in-out
        ${menuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        
        {/* menu no celular */}
        <div className="flex items-center justify-between px-4 mt-4 mb-8">
          <span className="text-2xl font-bold text-brand">Financer</span>
          <button onClick={() => setMenuOpen(false)} className="p-2 text-gray-400 md:hidden hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* pega a lista do topo e chame o SubMenu pra cada um dos objetos */}
        {modulos.map((modulo) => (
          <SubMenu key={modulo.label} modulo={modulo} />
        ))}

      </nav>
    </>
  );
}