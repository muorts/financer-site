"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, LayoutList } from 'lucide-react';

import { CardEstoque } from '@/components/sales/CardStock';
import { ModalCustoExtra, ModalConfirmarVenda, ModalEditarItem } from '@/components/sales/ModalStock';

const ESTOQUE_INICIAL = [
  {
    id: '1',
    nome: 'PS Vita FAT PCH-1000',
    custo: 550.00,
    status: 'pronto', 
    plataformas: ['OLX', 'Facebook'],
    observacoes: 'Downgrade para 3.65 feito. VitaDeploy e Adrenaline instalados. 60fps plugin configurado.',
  },
  {
    id: '2',
    nome: 'Nintendo 3DS XL',
    custo: 320.00,
    status: 'manutencao',
    plataformas: [],
    observacoes: 'Aguardando peça para trocar o analógico. Luma3DS já atualizado.',
  },
  {
    id: '3',
    nome: 'iPhone 15 Pro 256GB',
    custo: 4200.00,
    status: 'anunciado',
    plataformas: ['OLX'],
    observacoes: 'Saúde da bateria em 91%, 332 ciclos. Tela 120Hz impecável. Negociando pau a pau em iPhone 16.',
  }
];

export default function EstoqueAtual() {
  const [estoque, setEstoque] = useState(ESTOQUE_INICIAL);
  
  // Controle de Modais
  const [modalCustoAberto, setModalCustoAberto] = useState<string | null>(null);
  const [modalVendaAberto, setModalVendaAberto] = useState<string | null>(null);
  // NOVO: Controle do Modal de Edição (guarda o ID de quem está sendo editado)
  const [modalEditarAberto, setModalEditarAberto] = useState<string | null>(null);

  // Ações
  const handleAddCusto = (valor: number, desc: string) => {
    if (!valor || !modalCustoAberto) return;
    setEstoque(estoque.map(item => 
      item.id === modalCustoAberto ? { ...item, custo: item.custo + valor } : item
    ));
    setModalCustoAberto(null);
  };

  const handleConfirmarVenda = (dadosVenda: any) => {
    if (!modalVendaAberto) return;
    setEstoque(estoque.filter(item => item.id !== modalVendaAberto));
    setModalVendaAberto(null);
  };

  const handleSalvarEdicao = (dadosAtualizados: any) => {
    if (!modalEditarAberto) return;
    setEstoque(estoque.map(item => 
      item.id === modalEditarAberto ? { ...item, ...dadosAtualizados } : item
    ));
    setModalEditarAberto(null);
  };

  // Encontra os dados completos do item que o usuário clicou para editar
  const itemParaEditar = estoque.find(i => i.id === modalEditarAberto);

  return (
    <div className="flex flex-col p-4 md:p-6 gap-6 max-w-200 mx-auto pb-24">
      
      {/* CABEÇALHO */}
      <div className="flex items-center gap-5 p-5 md:p-6 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
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

      {/* LISTAGEM DE CARDS */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-2">
          <span className="text-sm font-medium tracking-wider uppercase text-gray-400 flex items-center gap-2">
            <LayoutList className="w-4 h-4" />
            Itens no Pátio ({estoque.length})
          </span>
        </div>

        {estoque.length === 0 ? (
          <div className="p-8 text-center border rounded-2xl bg-surface/30 border-border/50">
            <p className="text-gray-500">Seu estoque está vazio. Vá para a aba "Novo Item" para adicionar produtos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {estoque.map(item => (
              <CardEstoque 
                key={item.id} 
                item={item} 
                onAddCusto={(id) => setModalCustoAberto(id)}
                onVender={(id) => setModalVendaAberto(id)}
                onEditar={(id) => setModalEditarAberto(id)} // Passando a nova função!
              />
            ))}
          </div>
        )}
      </div>

      {/* RENDERIZAÇÃO DOS MODAIS */}
      <ModalCustoExtra 
        isOpen={!!modalCustoAberto} 
        onClose={() => setModalCustoAberto(null)}
        onSave={handleAddCusto}
      />

      <ModalConfirmarVenda 
        isOpen={!!modalVendaAberto}
        onClose={() => setModalVendaAberto(null)}
        onConfirm={handleConfirmarVenda}
      />

      {/* NOVO MODAL DE EDIÇÃO */}
      <ModalEditarItem 
        isOpen={!!modalEditarAberto}
        onClose={() => setModalEditarAberto(null)}
        onSave={handleSalvarEdicao}
        itemAtual={itemParaEditar}
      />

    </div>
  );
}