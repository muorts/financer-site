"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Package, Tag, Calendar, Building2, Sparkles, 
  History, Save, Check, Landmark, Store, Wrench, CheckCircle2, Megaphone
} from 'lucide-react';

import { NameInput } from '@/components/ui/NameInput';
import { InputSelect } from '@/components/ui/InputSelect';
import { CardSelecao } from '@/components/ui/CardSelect';
import {
  API_URL,
  BancoDTO,
  CategoriaVendaDTO,
  OpcoesEstoqueDTO,
  PLATAFORMAS_SUGERIDAS,
  PlataformaVendaDTO,
  extrairMensagemErro,
  formatarBRL,
  getClassesCor,
  getIconePorId,
  obterDataLocalISO,
  parseValorMonetario,
} from '@/lib/util';

export default function NovoItemEstoque() {
  const router = useRouter();

  // Campos do formulário
  const [nomeProduto, setNomeProduto] = useState('');
  const [precoCusto, setPrecoCusto] = useState('');
  const [condicao, setCondicao] = useState<'USADO' | 'NOVO'>('USADO');
  const [status, setStatus] = useState<'PRONTO' | 'MANUTENCAO' | 'ANUNCIADO'>('PRONTO');
  const [dataCompra, setDataCompra] = useState(() => obterDataLocalISO());
  const [observacoes, setObservacoes] = useState('');

  // Opções carregadas do backend
  const [categorias, setCategorias] = useState<CategoriaVendaDTO[]>([]);
  const [plataformasDisponiveis, setPlataformasDisponiveis] = useState<PlataformaVendaDTO[]>([]);
  const [bancos, setBancos] = useState<BancoDTO[]>([]);

  // Selecionados
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<CategoriaVendaDTO | null>(null);
  const [bancoSelecionado, setBancoSelecionado] = useState<BancoDTO | null>(null);
  const [plataformasSelecionadas, setPlataformasSelecionadas] = useState<string[]>([]);

  // Controles de UI
  const [dropdownCategoriaAberto, setDropdownCategoriaAberto] = useState(false);
  const [dropdownBancoAberto, setDropdownBancoAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erroMsg, setErroMsg] = useState('');

  useEffect(() => {
    let ativo = true;

    async function carregarOpcoes() {
      try {
        const [resOpcoes, resBancos] = await Promise.all([
          fetch(`${API_URL}/estoque/opcoes`),
          fetch(`${API_URL}/bancos`),
        ]);
        if (!ativo) return;

        if (resOpcoes.ok) {
          const opcoes: OpcoesEstoqueDTO = await resOpcoes.json();
          if (!ativo) return;
          setCategorias(Array.isArray(opcoes.categorias) ? opcoes.categorias : []);
          setPlataformasDisponiveis(Array.isArray(opcoes.plataformas) ? opcoes.plataformas : []);
        }
        if (resBancos.ok) {
          const listaBancos: BancoDTO[] = await resBancos.json();
          if (!ativo) return;
          setBancos(Array.isArray(listaBancos) ? listaBancos : []);
        }
      } catch (erro) {
        if (!ativo) return;
        console.error('Erro ao carregar opções para novo item de estoque:', erro);
      }
    }

    void carregarOpcoes();
    return () => {
      ativo = false;
    };
  }, []);

  const chipsPlataforma: { id?: string; nome: string }[] =
    plataformasDisponiveis.length > 0
      ? plataformasDisponiveis.map((p) => ({ id: p.id, nome: p.nome }))
      : PLATAFORMAS_SUGERIDAS.map((nome) => ({ nome }));

  const togglePlataforma = (nomePlat: string) => {
    if (plataformasSelecionadas.includes(nomePlat)) {
      setPlataformasSelecionadas(plataformasSelecionadas.filter((p) => p !== nomePlat));
    } else {
      setPlataformasSelecionadas([...plataformasSelecionadas, nomePlat]);
    }
  };

  const handleCadastrar = async () => {
    setErroMsg('');
    const custoNumerico = parseValorMonetario(precoCusto);

    if (!nomeProduto.trim()) {
      setErroMsg('Informe o nome do item ou aparelho.');
      return;
    }
    if (custoNumerico <= 0) {
      setErroMsg('Informe um preço de aquisição maior que zero.');
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
      const payload = {
        nome: nomeProduto.trim(),
        condicao,
        status,
        custoAquisicao: custoNumerico,
        dataCompra: dataCompra || obterDataLocalISO(),
        observacoes: observacoes.trim() || null,
        categoriaVendaId: categoriaSelecionada?.id || null,
        bancoCompraId: bancoSelecionado?.id || null,
        plataformaIds,
        plataformasNomes,
      };

      const res = await fetch(`${API_URL}/estoque`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push('/sales/estoque');
      } else {
        setErroMsg(await extrairMensagemErro(res, 'Não foi possível cadastrar o item no estoque.'));
      }
    } catch (erro) {
      console.error('Erro ao cadastrar item no estoque:', erro);
      setErroMsg('Erro de conexão com o servidor.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="flex flex-col p-4 md:p-6 gap-6 max-w-200 mx-auto pb-24">
      
      {/* BLOCO 1: CABEÇALHO FLUTUANTE */}
      <div className="flex items-center gap-5 p-5 md:p-6 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        <Link 
          href="/sales/estoque" 
          className="p-3 transition-colors border rounded-xl bg-[#18181b] border-border hover:border-gray-500 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white font-sans">Novo Item no Estoque</h1>
          <p className="mt-1 text-sm text-gray-400">Cadastre um produto adquirido para revenda ou uso.</p>
        </div>
      </div>

      {/* BLOCO 2: DETALHES DO PRODUTO */}
      <div className="flex flex-col gap-8 p-6 md:p-8 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        
        {/* 1. Nome do Item */}
        <NameInput 
          label="Nome do Item / Aparelho"
          icon={Package}
          placeholder="ex: Nintendo 3DS XL / PS Vita PCH-1000"
          value={nomeProduto}
          onChange={(e) => setNomeProduto(e.target.value)}
        />

        {/* 2. Condição do Item */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-gray-300">
            Condição do Item
          </label>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <CardSelecao
              titulo="Usado / Recondicionado"
              descricao="Item adquirido de terceiros, com marcas de uso ou revisado."
              icon={History}
              ativo={condicao === 'USADO'}
              onClick={() => setCondicao('USADO')}
              corTexto="text-brand"
              corBorda="border-brand"
              corFundo="bg-brand/10"
            />

            <CardSelecao
              titulo="Novo / Lacrado"
              descricao="Item comprado diretamente da loja ou sem uso prévio."
              icon={Sparkles}
              ativo={condicao === 'NOVO'}
              onClick={() => setCondicao('NOVO')}
              corTexto="text-blue-500"
              corBorda="border-blue-500"
              corFundo="bg-blue-500/10"
            />
          </div>
        </div>

        {/* 3. Status Inicial */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-gray-300">Status Inicial</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'MANUTENCAO', label: 'Na Bancada', icon: Wrench, cor: 'border-red-500 bg-red-500/10 text-red-400' },
              { id: 'PRONTO', label: 'Pronto', icon: CheckCircle2, cor: 'border-yellow-500 bg-yellow-500/10 text-yellow-400' },
              { id: 'ANUNCIADO', label: 'Anunciado', icon: Megaphone, cor: 'border-success bg-success/10 text-success' },
            ].map((opt) => {
              const Icone = opt.icon;
              const ativo = status === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setStatus(opt.id as 'MANUTENCAO' | 'PRONTO' | 'ANUNCIADO')}
                  className={`flex items-center justify-center gap-2 py-3 px-3 text-xs md:text-sm font-bold border rounded-xl transition-all ${
                    ativo
                      ? opt.cor
                      : 'bg-[#18181b] border-border text-gray-400 hover:border-gray-500 hover:text-white'
                  }`}
                >
                  <Icone className="w-4 h-4" />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Categoria e Preço de Custo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="relative">
            <InputSelect 
              label="Categoria (Opcional)"
              icon={categoriaSelecionada ? getIconePorId(categoriaSelecionada.icone) : Tag}
              placeholder="Selecionar categoria..."
              value={categoriaSelecionada ? categoriaSelecionada.nome : ''}
              onClick={() => {
                setDropdownCategoriaAberto(!dropdownCategoriaAberto);
                setDropdownBancoAberto(false);
              }}
            />

            {dropdownCategoriaAberto && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setDropdownCategoriaAberto(false)} />
                <div className="absolute left-0 right-0 top-full mt-2 z-50 max-h-64 overflow-y-auto rounded-xl border border-border bg-[#131316] p-2 shadow-2xl flex flex-col gap-1">
                  {categorias.length === 0 ? (
                    <div className="p-3 text-center text-sm text-gray-400">
                      Nenhuma categoria de venda cadastrada no banco ainda.{' '}
                      <Link href="/sales/categorias" className="text-brand underline">
                        Ver categorias
                      </Link>
                    </div>
                  ) : (
                    <>
                      {categoriaSelecionada && (
                        <button
                          type="button"
                          onClick={() => {
                            setCategoriaSelecionada(null);
                            setDropdownCategoriaAberto(false);
                          }}
                          className="px-3 py-2 text-xs text-left text-gray-400 rounded-lg hover:bg-white/5 hover:text-white"
                        >
                          Limpar seleção
                        </button>
                      )}
                      {categorias.map((cat) => {
                        const IconeCat = getIconePorId(cat.icone);
                        const cores = getClassesCor(cat.cor);
                        const isSel = categoriaSelecionada?.id === cat.id;

                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              setCategoriaSelecionada(cat);
                              setDropdownCategoriaAberto(false);
                            }}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors ${
                              isSel ? 'bg-brand/15 border border-brand/40' : 'hover:bg-white/5'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${cores.border} ${cores.bgSoft} ${cores.text}`}>
                                <IconeCat className="w-4 h-4" />
                              </div>
                              <span className="text-sm font-medium text-white">{cat.nome}</span>
                            </div>
                            {isSel && <Check className="w-4 h-4 text-brand" />}
                          </button>
                        );
                      })}
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Preço de Aquisição (Custo)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <span className="font-mono text-gray-500">R$</span>
              </div>
              <input 
                type="text" 
                placeholder="0,00"
                value={precoCusto}
                onChange={(e) => setPrecoCusto(e.target.value)}
                className="w-full py-3 pl-12 pr-4 font-mono text-white transition-colors border rounded-xl bg-[#18181b] border-border focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/50 placeholder:text-gray-600"
              />
            </div>
          </div>

        </div>

        {/* 5. Plataformas (Multi-seleção) */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Store className="w-4 h-4 text-gray-400" />
              Plataformas de Anúncio (Opcional)
            </label>
            <Link href="/sales/plataformas" className="text-xs text-gray-400 hover:text-brand underline">
              Gerenciar plataformas
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {chipsPlataforma.map((plat) => {
              const isAtivo = plataformasSelecionadas.includes(plat.nome);
              return (
                <button
                  key={plat.id || plat.nome}
                  type="button"
                  onClick={() => togglePlataforma(plat.nome)}
                  className={`px-3.5 py-2 text-sm font-medium transition-all border rounded-xl ${
                    isAtivo
                      ? 'bg-brand/15 border-brand text-brand'
                      : 'bg-[#18181b] border-border text-gray-400 hover:text-white hover:border-gray-500'
                  }`}
                >
                  {plat.nome}
                </button>
              );
            })}
          </div>
        </div>

        {/* 6. Observações */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-300">Observações (Opcional)</label>
          <textarea
            rows={3}
            placeholder="ex: Saúde da bateria, acessórios inclusos, reparos previstos..."
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            className="w-full py-3 px-4 text-white transition-colors border rounded-xl bg-[#18181b] border-border focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/50 placeholder:text-gray-600 resize-none"
          />
        </div>

      </div>

      {/* BLOCO 3: PAGAMENTO E DATA */}
      <div className="flex flex-col gap-6 p-6 md:p-8 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="relative">
            <InputSelect 
              label="Pago com qual banco/carteira?"
              icon={Building2}
              placeholder="Selecionar banco..."
              value={bancoSelecionado ? bancoSelecionado.nome : ''}
              onClick={() => {
                setDropdownBancoAberto(!dropdownBancoAberto);
                setDropdownCategoriaAberto(false);
              }}
            />

            {dropdownBancoAberto && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setDropdownBancoAberto(false)} />
                <div className="absolute left-0 right-0 top-full mt-2 z-50 max-h-64 overflow-y-auto rounded-xl border border-border bg-[#131316] p-2 shadow-2xl flex flex-col gap-1">
                  {bancos.length === 0 ? (
                    <div className="p-3 text-center text-sm text-gray-400">
                      Nenhum banco cadastrado.{' '}
                      <Link href="/cadastro_bancos" className="text-brand underline">
                        Cadastrar banco
                      </Link>
                    </div>
                  ) : (
                    <>
                      {bancoSelecionado && (
                        <button
                          type="button"
                          onClick={() => {
                            setBancoSelecionado(null);
                            setDropdownBancoAberto(false);
                          }}
                          className="px-3 py-2 text-xs text-left text-gray-400 rounded-lg hover:bg-white/5 hover:text-white"
                        >
                          Limpar seleção
                        </button>
                      )}
                      {bancos.map((b) => {
                        const cores = getClassesCor(b.cor);
                        const isSel = bancoSelecionado?.id === b.id;

                        return (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => {
                              setBancoSelecionado(b);
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
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-white">{b.nome}</span>
                                <span className="text-xs text-gray-500 font-mono">
                                  Saldo: {formatarBRL(b.saldoAtual)}
                                </span>
                              </div>
                            </div>
                            {isSel && <Check className="w-4 h-4 text-brand" />}
                          </button>
                        );
                      })}
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Data da Compra</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Calendar className="w-5 h-5 text-gray-500" />
              </div>
              <input 
                type="date" 
                value={dataCompra}
                onChange={(e) => setDataCompra(e.target.value)}
                className="w-full py-3 pl-12 pr-4 text-white transition-colors border rounded-xl bg-[#18181b] border-border focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/50"
              />
            </div>
          </div>

        </div>

      </div>

      {erroMsg && (
        <div className="p-4 text-sm font-medium text-danger bg-danger/10 border border-danger/30 rounded-xl">
          {erroMsg}
        </div>
      )}

      {/* BLOCO 4: BOTÕES DE AÇÃO FLUTUANTES */}
      <div className="flex items-center justify-end p-5 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        <Link 
          href="/sales/estoque"
          className="px-6 py-2.5 text-sm font-medium transition-colors text-gray-400 hover:text-white"
        >
          Cancelar
        </Link>
        <button
          type="button"
          onClick={handleCadastrar}
          disabled={salvando}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-background bg-brand rounded-xl hover:bg-brand/90 transition-colors ml-4 shadow-lg shadow-brand/25 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {salvando ? 'Salvando...' : 'Adicionar ao Estoque'}
        </button>
      </div>

    </div>
  );
}
