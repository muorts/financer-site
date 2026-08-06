"use client";

import { useState, ElementType } from 'react';
import { MenuButton } from './MenuButton';
import { SubMenuButton } from './SubMenuButton';

interface SubMenuProps {
  modulo: {
    label: string;
    icon: ElementType;
    submenus: {label: string; icon: ElementType}[];
  }
}

export function SubMenu({ modulo }: SubMenuProps) {
  // O estado de abrir/fechar o módulo fica aqui!
  const [aberto, setAberto] = useState(true);
  const temSubmenu = modulo.submenus && modulo.submenus.length > 0;

  return (
    <div className="flex flex-col w-full">
      
      {/* 1. O Botão principal que serve de gatilho */}
      <MenuButton 
        icon={modulo.icon} 
        label={modulo.label} 
        onClick={() => setAberto(!aberto)}
        aberto={aberto}
        temSubmenu={temSubmenu}
      />

      {/* 2. A lista de sub-menus que abre e fecha */}
      {aberto && temSubmenu && (
        <div className="flex flex-col gap-1 mt-1 mb-2 ml-6.5 pl-4 border-l border-solid border-white/60 ">
          {modulo.submenus.map((aba) => (
            <SubMenuButton key={aba.label} label={aba.label} icon={aba.icon} />
          ))}
        </div>
      )}
      
    </div>
  );
}