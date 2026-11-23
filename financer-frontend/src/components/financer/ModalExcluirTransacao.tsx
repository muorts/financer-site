"use client";

import { useState } from 'react';
import { Trash2, X, Layers } from 'lucide-react';
import { TransacaoDTO, formatarBRL } from '@/lib/util';

interface ModalExcluirTransacaoProps {
  transacao: TransacaoDTO | null;
  onClose: () => void;
  onConfirmar: (id: string, deletarTodasParcelas: boolean) => Promise<void>;
}

export function ModalExcluirTransacao({ transacao, onClose, onConfirmar }: ModalExcluirTransacaoProps) {
  const [excluindo, setExcluindo] = useState(false);

  if (!transacao) return null;

  const isParcelada = Boolean(transacao.grupoParcelamentoId) && (transacao.totalParcelas ?? 1) > 1;
  const parcelaLabel = transacao.parcelasFormatadas || `${transacao.parcelaAtual || 1}/${transacao.totalParcelas || 1}`;

  const executarExclusao = async (deletarTodas: boolean) => {
    setExcluindo(true);
    try {
      await onConfirmar(transacao.id, deletarTodas);
      onClose();
    } finally {
      setExcluindo(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md border shadow-2xl bg-surface border-border/80 rounded-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-border/50 bg-[#18181b]/50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-danger/10 text-danger">
              <Trash2 className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-white">Excluir Transação</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={excluindo}
            className="p-2 transition-colors rounded-lg text-gray-400 hover:text-white hover:bg-border/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-3 p-6">
          <p className="text-sm text-gray-300">
            Deseja excluir <strong className="text-white">{transacao.descricao}</strong> ({formatarBRL(transacao.valor)})?
          </p>
          {isParcelada && (
            <div className="flex items-start gap-2.5 p-3 text-xs text-gray-300 bg-brand/10 border border-brand/20 rounded-xl">
              <Layers className="w-4 h-4 text-brand shrink-0 mt-0.5" />
              <span>
                Esta é a parcela <strong className="text-white">{parcelaLabel}</strong> de uma compra parcelada.
                Você pode apagar somente esta parcela ou remover todas as {transacao.totalParcelas} parcelas de uma vez.
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 p-5 border-t border-border/50 bg-[#18181b]/50 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            disabled={excluindo}
            className="px-4 py-2 text-sm font-medium transition-colors text-gray-400 hover:text-white"
          >
            Cancelar
          </button>
          {isParcelada ? (
            <>
              <button
                type="button"
                onClick={() => executarExclusao(false)}
                disabled={excluindo}
                className="px-4 py-2 text-sm font-bold text-white border rounded-xl bg-[#18181b] border-border hover:border-gray-500 transition-colors disabled:opacity-50"
              >
                Só esta parcela
              </button>
              <button
                type="button"
                onClick={() => executarExclusao(true)}
                disabled={excluindo}
                className="px-4 py-2 text-sm font-bold text-background bg-danger rounded-xl hover:bg-danger/90 transition-colors disabled:opacity-50"
              >
                {excluindo ? 'Excluindo...' : 'Todas as parcelas'}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => executarExclusao(false)}
              disabled={excluindo}
              className="px-5 py-2 text-sm font-bold text-background bg-danger rounded-xl hover:bg-danger/90 transition-colors disabled:opacity-50"
            >
              {excluindo ? 'Excluindo...' : 'Excluir'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
