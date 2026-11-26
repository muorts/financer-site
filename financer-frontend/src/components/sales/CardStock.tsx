"use client";

import { createElement, useState } from 'react';
import { 
  ChevronDown, ChevronUp, Package, Tag, 
  Wrench, CheckCircle2, Megaphone, Plus, BadgeDollarSign,
  Pencil, Trash2, Calendar, Landmark, Sparkles, History
} from 'lucide-react';
import {
  ItemEstoqueDTO,
  formatarBRL,
  formatarDataCurta,
  getClassesCor,
  getIconePorId,
} from '@/lib/util';

interface CardEstoqueProps {
  item: ItemEstoqueDTO;
  onAddCusto: (item: ItemEstoqueDTO) => void;
  onVender: (item: ItemEstoqueDTO) => void;
  onEditar: (item: ItemEstoqueDTO) => void;
  onExcluir: (item: ItemEstoqueDTO) => void;
  onRemoverCustoExtra?: (itemId: string, custoId: string) => void;
}

export function CardEstoque({
  item,
  onAddCusto,
  onVender,
  onEditar,
  onExcluir,
  onRemoverCustoExtra,
}: CardEstoqueProps) {
  const [detalhesAbertos, setDetalhesAbertos] = useState(false);

  const statusNormalizado = (item.status || '').toUpperCase();
  const isNovo = (item.condicao || '').toUpperCase() === 'NOVO';
  const iconeCategoria = item.categoriaVenda ? getIconePorId(item.categoriaVenda.icone) : Package;
  const coresCategoria = item.categoriaVenda ? getClassesCor(item.categoriaVenda.cor) : null;
  const temDetalhes = Boolean(item.observacoes) || (item.custosExtras?.length ?? 0) > 0;

  const renderBadge = (status: string) => {
    switch (status) {
      case 'MANUTENCAO':
        return (
          <span className="flex items-center gap-1 px-2 py-1 text-xs font-bold text-red-500 bg-red-500/10 rounded-md border border-red-500/20">
            <Wrench className="w-3 h-3" /> Na Bancada
          </span>
        );
      case 'PRONTO':
        return (
          <span className="flex items-center gap-1 px-2 py-1 text-xs font-bold text-yellow-500 bg-yellow-500/10 rounded-md border border-yellow-500/20">
            <CheckCircle2 className="w-3 h-3" /> Pronto
          </span>
        );
      case 'ANUNCIADO':
        return (
          <span className="flex items-center gap-1 px-2 py-1 text-xs font-bold text-success bg-success/10 rounded-md border border-success/20">
            <Megaphone className="w-3 h-3" /> Anunciado
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col overflow-hidden transition-all border bg-surface/40 border-border/80 rounded-2xl shadow-sm hover:border-gray-600/50">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col gap-3 p-5 border-b border-border/50 bg-[#18181b]/30">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div
              className={`flex items-center justify-center w-10 h-10 shrink-0 border rounded-xl ${
                coresCategoria
                  ? `${coresCategoria.border} ${coresCategoria.bgSoft} ${coresCategoria.text}`
                  : 'bg-surface text-gray-400 border-border'
              }`}
            >
              {createElement(iconeCategoria, { className: 'w-5 h-5' })}
            </div>
            <div className="flex flex-col">
              <h3 className="font-bold text-white text-md">{item.nome}</h3>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                {renderBadge(statusNormalizado)}
                <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-300 bg-surface border border-border rounded-md">
                  {isNovo ? <Sparkles className="w-3 h-3 text-blue-400" /> : <History className="w-3 h-3 text-brand" />}
                  {isNovo ? 'Novo' : 'Usado'}
                </span>
                {item.categoriaVenda && (
                  <span className="text-xs text-gray-400">{item.categoriaVenda.nome}</span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                {item.dataCompra && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Compra em {formatarDataCurta(item.dataCompra)}
                  </span>
                )}
                {item.bancoCompra && (
                  <span className="flex items-center gap-1">
                    <Landmark className="w-3 h-3" />
                    {item.bancoCompra.nome}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-1 shrink-0">
            <div className="flex items-center gap-1.5">
              <button 
                type="button"
                onClick={() => onEditar(item)}
                className="p-1.5 transition-colors border rounded-lg bg-surface border-border hover:border-gray-500 text-gray-400 hover:text-white"
                title="Editar Item"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button 
                type="button"
                onClick={() => onExcluir(item)}
                className="p-1.5 transition-colors border rounded-lg bg-surface border-border hover:border-danger/50 text-gray-400 hover:text-danger"
                title="Excluir Item"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex flex-col items-end mt-1">
              <span className="text-xs text-gray-500">Custo Total</span>
              <span className="font-mono font-bold text-white">
                {formatarBRL(item.custoTotal)}
              </span>
              {item.totalCustosExtras > 0 && (
                <span className="text-[11px] text-gray-500 font-mono">
                  {formatarBRL(item.custoAquisicao)} + {formatarBRL(item.totalCustosExtras)} extras
                </span>
              )}
            </div>
          </div>
        </div>

        {/* PLATAFORMAS */}
        {item.plataformas && item.plataformas.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1 ml-13">
            {item.plataformas.map((plat) => {
              const cores = getClassesCor(plat.cor);
              return (
                <span
                  key={plat.id}
                  className={`flex items-center gap-1 px-2 py-1 text-xs font-medium border rounded-md ${cores.border} ${cores.bgSoft} ${cores.text}`}
                >
                  <Tag className="w-3 h-3" /> {plat.nome}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* OBSERVAÇÕES E HISTÓRICO DE CUSTOS EXTRAS */}
      {temDetalhes && (
        <div className="flex flex-col border-b border-border/50">
          <button 
            type="button"
            onClick={() => setDetalhesAbertos(!detalhesAbertos)}
            className="flex items-center justify-between p-3 px-5 text-xs font-medium transition-colors text-gray-400 hover:text-white hover:bg-[#18181b]/50"
          >
            <span>
              {item.custosExtras.length > 0
                ? `Ver anotações e histórico de custos (${item.custosExtras.length})`
                : 'Ver anotações do item'}
            </span>
            {detalhesAbertos ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {detalhesAbertos && (
            <div className="flex flex-col gap-4 p-4 px-5 text-sm text-gray-300 bg-[#18181b]/80 border-t border-border/50">
              {item.observacoes && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-500">Observações</span>
                  <p className="text-sm text-gray-300 whitespace-pre-line">{item.observacoes}</p>
                </div>
              )}

              {item.custosExtras.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    Histórico de Custos Extras
                  </span>
                  <div className="flex flex-col gap-2">
                    {item.custosExtras.map((custo) => (
                      <div
                        key={custo.id}
                        className="flex items-center justify-between px-3 py-2 text-xs border rounded-lg bg-surface/60 border-border/60"
                      >
                        <div className="flex items-center gap-2">
                          <Wrench className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                          <span className="text-white font-medium">{custo.descricao}</span>
                          <span className="text-gray-500">• {formatarDataCurta(custo.data)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-orange-400">
                            +{formatarBRL(custo.valor)}
                          </span>
                          {onRemoverCustoExtra && (
                            <button
                              type="button"
                              onClick={() => onRemoverCustoExtra(item.id, custo.id)}
                              className="p-1 text-gray-500 transition-colors rounded hover:text-danger"
                              title="Remover custo extra"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* RODAPÉ DE AÇÕES */}
      <div className="flex items-center justify-between p-4 bg-[#18181b]/50">
        <button 
          type="button"
          onClick={() => onAddCusto(item)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold transition-colors border rounded-xl bg-surface border-border hover:border-gray-500 text-gray-300 hover:text-white"
        >
          <Plus className="w-3 h-3" />
          Custo Extra
        </button>
        
        <button 
          type="button"
          onClick={() => onVender(item)}
          className="flex items-center gap-2 px-5 py-2 text-sm font-bold transition-colors rounded-xl text-background bg-brand hover:bg-brand/90 shadow-lg shadow-brand/20"
        >
          <BadgeDollarSign className="w-4 h-4" />
          Confirmar Venda
        </button>
      </div>
    </div>
  );
}
