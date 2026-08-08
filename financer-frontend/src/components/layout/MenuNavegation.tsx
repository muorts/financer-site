// Layout que usei para fazer o menu da lateral onde vai ser encaixado no layout.tsx.

"use client";

import { useState } from 'react';
import { HousePlus, Calculator, ChartCandlestick, Store, BadgeDollarSign, Home, Package, Dices, Wallet, Menu, X, Plus, PieChart, CalendarDays, FileText, WalletCards, ChartColumnStacked, ChartNoAxesCombined, Layers, Warehouse } from 'lucide-react';
import { SubMenu } from '@/components/menu/SubMenu';
import { Logo } from '../ui/logo';
import { LogoString } from '../ui/logoString';

// cria os sub-modulos apartir de uma lista de objetos 
const modulos = [
  { 
    label: 'Dashboard', 
    icon: Home,
    submenus: [
      {label: "DashBoard", icon: Layers, url: '/' },
      {label: "Cadastro Banco", icon: Plus, url: '/cadastro_bancos'}
    ]
  },
  { 
    label: 'Financeiro', 
    icon: Wallet,
    submenus: [
      {label: "Visualização Geral", icon: PieChart, url: '/financer/visualizacao_geral'},
      {label: "Nova Transação", icon: Plus, url: '/financer/nova_transacao'},
      {label: "Faturas", icon: WalletCards, url: '/financer/faturas'},
      {label: "Metas/Orçamentos", icon: ChartNoAxesCombined, url: '/financer/metas_orcamentos'},
      {label: "Categorias", icon: ChartColumnStacked, url: '/financer/categorias'},
    ]
  },
  { 
    label: 'Vendas', 
    icon: Package,
    submenus: [
        {label: "Novo Item", icon: Plus, url: '/sales/novo_item'},
        {label: "Estoque", icon: Warehouse, url: '/sales/estoque'},
        {label: "Vendas", icon: BadgeDollarSign, url: '/sales/vendas'},
        {label: "Plataformas", icon: Store, url: '/sales/plataformas'},
        {label: "Categorias", icon: ChartColumnStacked, url: '/sales/categorias'},
    ] 
  },
  { 
    label: 'Trading', 
    icon: Dices,
    submenus: [
      {label: "Trades", icon: ChartCandlestick, url: '/trading/trades'},
      {label: "Nova Operação", icon: Plus, url: '/trading/nova_operacao'},
      {label: "ComprovaBet", icon: FileText, url: '/trading/comprovabet'},
      {label: "Calculadora", icon: Calculator, url: '/trading/calculadora'},
      {label: "Casas", icon: HousePlus, url: '/trading/casas'},
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
        <Logo className="text-xl font-bold text-brand w-15 h-10"></Logo>
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
        
        {/* menu no celular quando está aberto */}
        <div className="flex items-center justify-between px-4 mt-4 mb-8">
          <LogoString className="text-xl font-bold text-brand w-50 h-20"></LogoString>
          <button onClick={() => setMenuOpen(false)} className="p-2 text-gray-400 md:hidden hover:text-white mt-4">
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