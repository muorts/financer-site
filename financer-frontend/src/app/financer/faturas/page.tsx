"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, CreditCard, Calendar, AlertCircle, 
  ChevronLeft, ChevronRight, Check, Save, X, Landmark
} from 'lucide-react';

import { InputSelect } from '@/components/ui/InputSelect';
import { CardDataFatura } from '@/components/financer/CardDataFatura';
import { ItemFatura } from '@/components/financer/ItemFatura';
import { 
  API_URL, FaturaResumoDTO, NOMES_MESES, NOMES_MESES_CURTOS, 
  formatarBRL, formatarDataCurta, getClassesCor, getIconePorId 
} from '@/lib/util';

export default function Faturas() {
  const hoje = new Date();
  const [mes, setMes] = useState(hoje.getMonth() + 1);
  const [ano, setAno] = useState(hoje.getFullYear());

  const [faturas, setFaturas] = useState<FaturaResumoDTO[]>([]);
  const [bancoSelecionadoId, setBancoSelecionadoId] = useState<string>('');
  const [dropdownBancoAberto, setDropdownBancoAberto] = useState(false);

  // Estado para o modal/bloco de "Ajustar Datas"
  const [editandoDatas, setEditandoDatas] = useState(false);
  const [novoDiaFechamento, setNovoDiaFechamento] = useState('3');
  const [novoDiaVencimento, setNovoDiaVencimento] = useState('10');

  const carregarFaturas = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/transacoes/faturas?mes=${mes}&ano=${ano}`);
      if (res.ok) {
        const lista: FaturaResumoDTO[] = await res.json();
        setFaturas(Array.isArray(lista) ? lista : []);
        if (lista.length > 0 && !bancoSelecionadoId) {
          setBancoSelecionadoId(lista[0].bancoId);
        }
      }
    } catch (erro) {
      console.error('Erro ao buscar faturas:', erro);
    }
  }, [mes, ano, bancoSelecionadoId]);

  useEffect(() => {
    carregarFaturas();
  }, [carregarFaturas]);

  const mudarMes = (delta: number) => {
    let novoMes = mes + delta;
    let novoAno = ano;
    if (novoMes < 1) {
      novoMes = 12;
      novoAno -= 1;
    } else if (novoMes > 12) {
      novoMes = 1;
      novoAno += 1;
    }
    setMes(novoMes);
    setAno(novoAno);
  };

  const faturaAtual = faturas.find((f) => f.bancoId === bancoSelecionadoId) || faturas[0] || null;

  const abrirAjusteDatas = () => {
    if (!faturaAtual) return;
    setNovoDiaFechamento(String(faturaAtual.diaFechamento ?? 3));
    setNovoDiaVencimento(String(faturaAtual.diaVencimento ?? 10));
    setEditandoDatas(true);
  };

  const salvarAjusteDatas = async () => {
    if (!faturaAtual) return;
    try {
      const res = await fetch(`${API_URL}/bancos/${faturaAtual.bancoId}/datas-fatura`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          diaFechamento: parseInt(novoDiaFechamento, 10) || 3,
          diaVencimento: parseInt(novoDiaVencimento, 10) || 10,
        }),
      });
      if (res.ok) {
        setEditandoDatas(false);
        await carregarFaturas();
      }
    } catch (erro) {
      console.error('Erro ao ajustar datas da fatura:', erro);
    }
  };

  const nomeMesCurto = NOMES_MESES_CURTOS[mes - 1] || '';
  const nomeMesInteiro = NOMES_MESES[mes - 1] || '';

  return (
    <div className="flex flex-col p-4 md:p-6 gap-6 max-w-[800px] mx-auto pb-24">
      
      {/* BLOCO 1: CABEÇALHO FLUTUANTE + SELETOR DE MÊS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 md:p-6 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        <div className="flex items-center gap-5">
          <Link 
            href="/financer/visualizacao_geral" 
            className="p-3 transition-colors border rounded-xl bg-[#18181b] border-border hover:border-gray-500 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white font-sans">Faturas</h1>
            <p className="mt-1 text-sm text-gray-400">Controle seus gastos e parcelas no cartão de crédito.</p>
          </div>
        </div>

        {/* Navegação de Mês/Ano da Fatura */}
        <div className="flex items-center justify-between gap-3 px-3 py-2 border rounded-xl bg-[#18181b] border-border">
          <button
            type="button"
            onClick={() => mudarMes(-1)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-border/50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-bold text-white min-w-[120px] text-center">
            {nomeMesInteiro} {ano}
          </span>
          <button
            type="button"
            onClick={() => mudarMes(1)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-border/50 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* BLOCO 2: VISÃO GERAL (CARROSSEL DE BANCOS) */}
      <div className="flex flex-col gap-4">
        <h2 className="px-2 text-sm font-medium tracking-wider uppercase text-gray-400">
          Faturas de {nomeMesInteiro}
        </h2>
        {faturas.length === 0 ? (
          <div className="p-6 border rounded-2xl bg-surface/40 border-border/80 text-center text-sm text-gray-400">
            Nenhum banco cadastrado.{' '}
            <Link href="/cadastro_bancos" className="text-brand underline">
              Cadastre um banco
            </Link>{' '}
            para acompanhar suas faturas.
          </div>
        ) : (
          <div className="flex gap-4 pb-2 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
            {faturas.map((fatura) => {
              const cores = getClassesCor(fatura.cor);
              const isAtivo = faturaAtual?.bancoId === fatura.bancoId;

              return (
                <div 
                  key={fatura.bancoId} 
                  onClick={() => setBancoSelecionadoId(fatura.bancoId)}
                  className={`flex flex-col min-w-[240px] p-5 border rounded-2xl snap-start cursor-pointer transition-all ${cores.bgSoft} ${
                    isAtivo ? 'border-brand ring-1 ring-brand/40' : cores.border
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className={`font-bold ${cores.text}`}>{fatura.bancoNome}</span>
                    <CreditCard className={`w-5 h-5 ${cores.text}`} />
                  </div>
                  <span className="mb-1 text-2xl font-bold text-white font-mono">
                    {formatarBRL(fatura.valorTotal)}
                  </span>
                  <span className="text-xs text-gray-400">
                    Vence em {String(fatura.diaVencimento || 10).padStart(2, '0')}/{nomeMesCurto}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* BLOCO 3: SELETOR E AJUSTE DE DATAS */}
      {faturaAtual && (
        <div className="flex flex-col gap-4 p-6 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
          <div className="flex flex-col items-end gap-4 md:flex-row">
            <div className="relative flex-1 w-full">
              <InputSelect 
                label="Analisar fatura do cartão:"
                icon={CreditCard}
                placeholder="Selecione o banco"
                value={faturaAtual.bancoNome}
                onClick={() => setDropdownBancoAberto(!dropdownBancoAberto)}
              />

              {dropdownBancoAberto && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setDropdownBancoAberto(false)} />
                  <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-xl border border-border bg-[#131316] p-2 shadow-2xl flex flex-col gap-1">
                    {faturas.map((f) => {
                      const cores = getClassesCor(f.cor);
                      const isSel = faturaAtual.bancoId === f.bancoId;
                      return (
                        <button
                          key={f.bancoId}
                          type="button"
                          onClick={() => {
                            setBancoSelecionadoId(f.bancoId);
                            setDropdownBancoAberto(false);
                          }}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors ${
                            isSel ? 'bg-brand/15 border border-brand/40' : 'hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${cores.border} ${cores.bgSoft} ${cores.text}`}>
                              <Landmark className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium text-white">{f.bancoNome}</span>
                          </div>
                          {isSel && <Check className="w-4 h-4 text-brand" />}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <button 
              type="button"
              onClick={abrirAjusteDatas}
              className="flex items-center justify-center w-full gap-2 px-5 py-3 text-sm font-medium transition-colors border md:w-auto rounded-xl bg-[#18181b] border-border hover:border-gray-500 text-gray-300"
            >
              <Calendar className="w-4 h-4" />
              Ajustar Datas
            </button>
          </div>

          {/* Painel de Ajuste de Datas */}
          {editandoDatas && (
            <div className="flex flex-col md:flex-row items-end gap-4 pt-4 mt-2 border-t border-border/50 animate-in fade-in duration-200">
              <div className="flex-1 w-full">
                <label className="text-xs font-medium text-gray-400">Dia de Fechamento</label>
                <input
                  type="number"
                  min={1}
                  max={31}
                  value={novoDiaFechamento}
                  onChange={(e) => setNovoDiaFechamento(e.target.value)}
                  className="w-full mt-1 py-2.5 px-3 font-mono text-white border rounded-xl bg-[#18181b] border-border focus:border-brand outline-none"
                />
              </div>
              <div className="flex-1 w-full">
                <label className="text-xs font-medium text-gray-400">Dia de Vencimento</label>
                <input
                  type="number"
                  min={1}
                  max={31}
                  value={novoDiaVencimento}
                  onChange={(e) => setNovoDiaVencimento(e.target.value)}
                  className="w-full mt-1 py-2.5 px-3 font-mono text-white border rounded-xl bg-[#18181b] border-border focus:border-brand outline-none"
                />
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => setEditandoDatas(false)}
                  className="p-2.5 border rounded-xl bg-[#18181b] border-border text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={salvarAjusteDatas}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-background bg-brand rounded-xl hover:bg-brand/90"
                >
                  <Save className="w-4 h-4" />
                  Salvar
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* BLOCO 4: FATURA DETALHADA */}
      {faturaAtual && (
        <div className="flex flex-col overflow-hidden border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
          
          {/* Cabeçalho e Datas */}
          <div className="flex flex-col gap-6 p-6 md:p-8 bg-gradient-to-b from-[#18181b]/80 to-transparent border-b border-border/50">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="mb-1 text-sm font-medium text-gray-400">
                  Fatura de {nomeMesInteiro} ({faturaAtual.bancoNome})
                </span>
                <span className="text-4xl font-bold text-white md:text-5xl font-mono">
                  {formatarBRL(faturaAtual.valorTotal)}
                </span>
                <span className="flex items-center gap-2 mt-3 text-sm font-medium text-brand bg-brand/10 w-fit px-3 py-1 rounded-full border border-brand/20">
                  <AlertCircle className="w-4 h-4" /> Fatura Aberta
                </span>
              </div>
            </div>

            {/* Grid de Datas Importantes */}
            <div className="grid grid-cols-2 gap-4 mt-2">
              <CardDataFatura 
                tipo="fechamento" 
                data={`${String(faturaAtual.diaFechamento || 3).padStart(2, '0')} de ${nomeMesInteiro}`} 
                descricaoTempo={`Sempre dia ${faturaAtual.diaFechamento || 3}`} 
              />
              <CardDataFatura 
                tipo="vencimento" 
                data={`${String(faturaAtual.diaVencimento || 10).padStart(2, '0')} de ${nomeMesInteiro}`} 
                descricaoTempo={`Sempre dia ${faturaAtual.diaVencimento || 10}`} 
              />
            </div>
          </div>

          {/* Lista de Gastos */}
          <div className="flex flex-col p-6 md:p-8">
            <h3 className="mb-4 text-sm font-medium text-gray-400">
              Lançamentos desta fatura ({faturaAtual.lancamentos.length})
            </h3>
            
            {faturaAtual.lancamentos.length === 0 ? (
              <p className="text-sm text-gray-500 py-6 text-center">
                Nenhum gasto no cartão de crédito para {faturaAtual.bancoNome} em {nomeMesInteiro}.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {faturaAtual.lancamentos.map((transacao) => (
                  <ItemFatura 
                    key={transacao.id}
                    descricao={transacao.descricao}
                    data={formatarDataCurta(transacao.data)}
                    valor={formatarBRL(transacao.valor)}
                    parcelas={transacao.parcelasFormatadas || `${transacao.parcelaAtual || 1}/${transacao.totalParcelas || 1}`}
                    icon={getIconePorId(transacao.categoria?.icone)}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
