"use client";

import { useState } from 'react';
import { X, Wrench, BadgeDollarSign, Tag, Calendar, Trash2, Info } from 'lucide-react';
import { NameInput } from '@/components/ui/NameInput';
import {
  CategoriaVendaDTO,
  ItemEstoqueDTO,
  PLATAFORMAS_SUGERIDAS,
  PlataformaVendaDTO,
  formatarBRL,
  obterDataLocalISO,
  parseValorMonetario,
} from '@/lib/util';

// ==========================================
// MODAL 1: CUSTO EXTRA (Manutenção / Peças)
// ==========================================
interface ModalCustoExtraProps {
  isOpen: boolean;
  itemNome?: string;
  onClose: () => void;
  onSave: (dados: { descricao: string; valor: number; data: string }) => Promise<void>;
}

export function ModalCustoExtra({ isOpen, itemNome, onClose, onSave }: ModalCustoExtraProps) {
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState(() => obterDataLocalISO());
  const [salvando, setSalvando] = useState(false);
  const [erroMsg, setErroMsg] = useState('');

  if (!isOpen) return null;

  const handleFechar = () => {
    setErroMsg('');
    onClose();
  };

  const handleConfirmar = async () => {
    setErroMsg('');
    const valorNumerico = parseValorMonetario(valor);

    if (!descricao.trim()) {
      setErroMsg('Informe uma descrição para o custo extra.');
      return;
    }
    if (valorNumerico <= 0) {
      setErroMsg('Informe um valor maior que zero.');
      return;
    }

    setSalvando(true);
    try {
      await onSave({
        descricao: descricao.trim(),
        valor: valorNumerico,
        data: data || obterDataLocalISO(),
      });
      setValor('');
      setDescricao('');
      setData(obterDataLocalISO());
      handleFechar();
    } catch (erro) {
      setErroMsg(erro instanceof Error ? erro.message : 'Não foi possível adicionar o custo extra.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm border shadow-2xl bg-surface border-border/80 rounded-2xl animate-in fade-in zoom-in-95">
        
        <div className="flex items-center justify-between p-5 border-b border-border/50 bg-[#18181b]/50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-500/10 text-orange-500">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-white">Adicionar Custo</h2>
              {itemNome && <p className="text-xs text-gray-400 truncate max-w-[200px]">{itemNome}</p>}
            </div>
          </div>
          <button type="button" onClick={handleFechar} className="p-2 transition-colors rounded-lg text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-5 p-6">
          <NameInput
            label="Com o que você gastou?"
            icon={Tag}
            placeholder="ex: Película / Analógico"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Valor do Custo</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 font-mono text-gray-500">R$</span>
              <input
                type="text"
                placeholder="0,00"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                className="w-full py-3 pl-12 pr-4 font-mono text-white transition-colors border rounded-xl bg-[#18181b] border-border focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Data</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Calendar className="w-4 h-4 text-gray-500" />
              </div>
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full py-3 pl-11 pr-4 text-white transition-colors border rounded-xl bg-[#18181b] border-border focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>

          {erroMsg && (
            <div className="p-3 text-xs font-medium text-danger bg-danger/10 border border-danger/30 rounded-xl">
              {erroMsg}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-5 border-t border-border/50 bg-[#18181b]/50 rounded-b-2xl">
          <button type="button" onClick={handleFechar} disabled={salvando} className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white">
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirmar}
            disabled={salvando}
            className="px-5 py-2 text-sm font-bold text-white bg-orange-500 rounded-xl hover:bg-orange-600 disabled:opacity-50"
          >
            {salvando ? 'Salvando...' : 'Somar ao Custo'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MODAL 2: CONFIRMAR VENDA (Integrado na SALES-03)
// ==========================================
interface ModalConfirmarVendaProps {
  isOpen: boolean;
  itemAtual: ItemEstoqueDTO | null;
  onClose: () => void;
}

export function ModalConfirmarVenda({ isOpen, itemAtual, onClose }: ModalConfirmarVendaProps) {
  if (!isOpen || !itemAtual) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md border shadow-2xl bg-surface border-border/80 rounded-2xl animate-in fade-in zoom-in-95">
        
        <div className="flex items-center justify-between p-5 border-b border-border/50 bg-[#18181b]/50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand/10 text-brand">
              <BadgeDollarSign className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-white">Liquidar Venda</h2>
          </div>
          <button type="button" onClick={onClose} className="p-2 transition-colors rounded-lg text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-4 p-6">
          <div className="p-4 border rounded-xl bg-[#18181b] border-border">
            <span className="text-sm font-bold text-white block">{itemAtual.nome}</span>
            <span className="text-xs text-gray-400 mt-1 block">
              Custo total acumulado: <strong className="text-white font-mono">{formatarBRL(itemAtual.custoTotal)}</strong>
            </span>
          </div>

          <div className="flex items-start gap-3 p-4 text-xs text-gray-300 bg-brand/10 border border-brand/25 rounded-xl">
            <Info className="w-4 h-4 text-brand shrink-0 mt-0.5" />
            <span>
              A liquidação de vendas (registro na tabela de vendas, cálculo de lucro líquido e ROI em{' '}
              <strong className="text-white">/sales/vendas</strong>) será conectada na issue{' '}
              <strong className="text-white">SALES-03</strong>. Até lá, seus custos e detalhes deste item continuam salvos no banco.
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end p-5 border-t border-border/50 bg-[#18181b]/50 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-background bg-brand rounded-xl hover:bg-brand/90"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MODAL 3: EDITAR ITEM
// ==========================================
export interface DadosEdicaoItem {
  nome: string;
  condicao: 'NOVO' | 'USADO';
  status: 'MANUTENCAO' | 'PRONTO' | 'ANUNCIADO';
  categoriaVendaId: string | null;
  limparCategoria: boolean;
  plataformaIds: string[];
  plataformasNomes: string[];
  observacoes: string;
}

interface ModalEditarItemProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dadosAtualizados: DadosEdicaoItem) => Promise<void>;
  itemAtual: ItemEstoqueDTO | null;
  plataformasDisponiveis: PlataformaVendaDTO[];
  categoriasDisponiveis: CategoriaVendaDTO[];
}

function FormularioEditarItem({
  itemAtual,
  plataformasDisponiveis,
  categoriasDisponiveis,
  onClose,
  onSave,
}: {
  itemAtual: ItemEstoqueDTO;
  plataformasDisponiveis: PlataformaVendaDTO[];
  categoriasDisponiveis: CategoriaVendaDTO[];
  onClose: () => void;
  onSave: (dadosAtualizados: DadosEdicaoItem) => Promise<void>;
}) {
  const [nome, setNome] = useState(itemAtual.nome);
  const [condicao, setCondicao] = useState<'NOVO' | 'USADO'>(
    itemAtual.condicao?.toUpperCase() === 'NOVO' ? 'NOVO' : 'USADO'
  );
  const [status, setStatus] = useState<'MANUTENCAO' | 'PRONTO' | 'ANUNCIADO'>(() => {
    const upper = itemAtual.status?.toUpperCase();
    if (upper === 'MANUTENCAO' || upper === 'ANUNCIADO') return upper;
    return 'PRONTO';
  });
  const [categoriaId, setCategoriaId] = useState<string>(itemAtual.categoriaVenda?.id || '');
  const [observacoes, setObservacoes] = useState(itemAtual.observacoes || '');
  const [salvando, setSalvando] = useState(false);
  const [erroMsg, setErroMsg] = useState('');

  // Monta lista de chips combinando plataformas do banco (ou sugestões se ainda não houver nenhuma cadastrada)
  const opcoesChips: { id?: string; nome: string }[] =
    plataformasDisponiveis.length > 0
      ? plataformasDisponiveis.map((p) => ({ id: p.id, nome: p.nome }))
      : PLATAFORMAS_SUGERIDAS.map((nomeSug) => ({ nome: nomeSug }));

  const [plataformasSelecionadas, setPlataformasSelecionadas] = useState<string[]>(
    () => (itemAtual.plataformas || []).map((p) => p.nome)
  );

  const togglePlataforma = (nomePlat: string) => {
    if (plataformasSelecionadas.includes(nomePlat)) {
      setPlataformasSelecionadas(plataformasSelecionadas.filter((p) => p !== nomePlat));
    } else {
      setPlataformasSelecionadas([...plataformasSelecionadas, nomePlat]);
    }
  };

  const handleConfirmar = async () => {
    setErroMsg('');
    if (!nome.trim()) {
      setErroMsg('O nome do item é obrigatório.');
      return;
    }

    const plataformaIds: string[] = [];
    const plataformasNomes: string[] = [];

    for (const nomeSel of plataformasSelecionadas) {
      const encontrada = plataformasDisponiveis.find(
        (p) => p.nome.toLowerCase() === nomeSel.toLowerCase()
      );
      if (encontrada) {
        plataformaIds.push(encontrada.id);
      } else {
        plataformasNomes.push(nomeSel);
      }
    }

    setSalvando(true);
    try {
      await onSave({
        nome: nome.trim(),
        condicao,
        status,
        categoriaVendaId: categoriaId || null,
        limparCategoria: !categoriaId,
        plataformaIds,
        plataformasNomes,
        observacoes: observacoes.trim(),
      });
      onClose();
    } catch (erro) {
      setErroMsg(erro instanceof Error ? erro.message : 'Não foi possível salvar as alterações.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto border shadow-2xl bg-surface border-border/80 rounded-2xl animate-in fade-in zoom-in-95">
        
        <div className="flex items-center justify-between p-5 border-b border-border/50 bg-[#18181b]/50 rounded-t-2xl">
          <h2 className="font-bold text-white">Editar Detalhes do Item</h2>
          <button type="button" onClick={onClose} className="p-2 transition-colors rounded-lg text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-5 p-6">
          <NameInput 
            label="Nome do Item" 
            icon={Tag} 
            placeholder="Nome do produto" 
            value={nome} 
            onChange={(e) => setNome(e.target.value)} 
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">Status no Estoque</label>
              <select 
                value={status} 
                onChange={(e) => setStatus(e.target.value as 'MANUTENCAO' | 'PRONTO' | 'ANUNCIADO')} 
                className="w-full py-3 px-3 text-sm text-white transition-colors border rounded-xl bg-[#18181b] border-border focus:border-brand outline-none cursor-pointer"
              >
                <option value="MANUTENCAO">Na Bancada / Manutenção</option>
                <option value="PRONTO">Pronto para Venda</option>
                <option value="ANUNCIADO">Já Anunciado</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">Condição</label>
              <select 
                value={condicao} 
                onChange={(e) => setCondicao(e.target.value as 'NOVO' | 'USADO')} 
                className="w-full py-3 px-3 text-sm text-white transition-colors border rounded-xl bg-[#18181b] border-border focus:border-brand outline-none cursor-pointer"
              >
                <option value="USADO">Usado</option>
                <option value="NOVO">Novo</option>
              </select>
            </div>
          </div>

          {categoriasDisponiveis.length > 0 && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">Categoria</label>
              <select
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                className="w-full py-3 px-3 text-sm text-white transition-colors border rounded-xl bg-[#18181b] border-border focus:border-brand outline-none cursor-pointer"
              >
                <option value="">Sem categoria</option>
                {categoriasDisponiveis.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nome}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* SELETOR DE PLATAFORMAS (CHIPS CLICÁVEIS) */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Anunciado onde?</label>
            <div className="flex flex-wrap gap-2">
              {opcoesChips.map((plat) => {
                const isAtivo = plataformasSelecionadas.some(
                  (p) => p.toLowerCase() === plat.nome.toLowerCase()
                );
                
                return (
                  <button
                    key={plat.id || plat.nome}
                    type="button"
                    onClick={() => togglePlataforma(plat.nome)}
                    className={`px-3 py-1.5 text-sm font-medium transition-all border rounded-lg ${
                      isAtivo 
                        ? 'bg-brand/20 border-brand text-brand' 
                        : 'bg-[#18181b] border-border text-gray-400 hover:text-white hover:border-gray-500'
                    }`}
                  >
                    {plat.nome}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Observações Gerais</label>
            <textarea 
              rows={3}
              placeholder="Anotações sobre a condição, bateria, reparos..." 
              value={observacoes} 
              onChange={(e) => setObservacoes(e.target.value)} 
              className="w-full py-3 px-4 text-white transition-colors border rounded-xl bg-[#18181b] border-border focus:border-brand outline-none placeholder:text-gray-600 resize-none" 
            />
          </div>

          {erroMsg && (
            <div className="p-3 text-xs font-medium text-danger bg-danger/10 border border-danger/30 rounded-xl">
              {erroMsg}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-5 border-t border-border/50 bg-[#18181b]/50 rounded-b-2xl">
          <button type="button" onClick={onClose} disabled={salvando} className="px-5 py-2.5 text-sm font-medium text-gray-400 hover:text-white">
            Cancelar
          </button>
          <button 
            type="button"
            onClick={handleConfirmar}
            disabled={salvando}
            className="px-6 py-2.5 text-sm font-bold text-background bg-brand rounded-xl hover:bg-brand/90 shadow-lg shadow-brand/25 disabled:opacity-50"
          >
            {salvando ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ModalEditarItem({
  isOpen,
  onClose,
  onSave,
  itemAtual,
  plataformasDisponiveis,
  categoriasDisponiveis,
}: ModalEditarItemProps) {
  if (!isOpen || !itemAtual) return null;

  return (
    <FormularioEditarItem
      key={itemAtual.id}
      itemAtual={itemAtual}
      plataformasDisponiveis={plataformasDisponiveis}
      categoriasDisponiveis={categoriasDisponiveis}
      onClose={onClose}
      onSave={onSave}
    />
  );
}

// ==========================================
// MODAL 4: EXCLUIR ITEM DO ESTOQUE
// ==========================================
interface ModalExcluirItemProps {
  item: ItemEstoqueDTO | null;
  onClose: () => void;
  onConfirmar: (id: string) => Promise<void>;
}

export function ModalExcluirItem({ item, onClose, onConfirmar }: ModalExcluirItemProps) {
  const [excluindo, setExcluindo] = useState(false);

  if (!item) return null;

  const handleConfirmar = async () => {
    setExcluindo(true);
    try {
      await onConfirmar(item.id);
      onClose();
    } finally {
      setExcluindo(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md border shadow-2xl bg-surface border-border/80 rounded-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between p-5 border-b border-border/50 bg-[#18181b]/50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-danger/10 text-danger">
              <Trash2 className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-white">Excluir Item do Estoque</h2>
          </div>
          <button type="button" onClick={onClose} disabled={excluindo} className="p-2 transition-colors rounded-lg text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 text-sm text-gray-300">
          Tem certeza que deseja remover <strong className="text-white">{item.nome}</strong> ({formatarBRL(item.custoTotal)}) do estoque? Todos os custos extras registrados para este item também serão removidos.
        </div>

        <div className="flex items-center justify-end gap-3 p-5 border-t border-border/50 bg-[#18181b]/50 rounded-b-2xl">
          <button type="button" onClick={onClose} disabled={excluindo} className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white">
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirmar}
            disabled={excluindo}
            className="px-5 py-2 text-sm font-bold text-background bg-danger rounded-xl hover:bg-danger/90 disabled:opacity-50"
          >
            {excluindo ? 'Excluindo...' : 'Excluir Item'}
          </button>
        </div>
      </div>
    </div>
  );
}
