"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, TrendingUp, TrendingDown, Tag, Calendar, 
  AlignLeft, Building2, Layers, Landmark, Check
} from 'lucide-react';
import Link from 'next/link';

import { SeletorTipoTransacao } from '@/components/cadastro/TypeTransacionSelect';
import { SeletorMetodoPagamento } from '@/components/cadastro/PaymentSelect';
import { InputSelect } from '@/components/ui/InputSelect';
import { 
  API_URL, BancoDTO, CategoriaDTO, parseValorMonetario, 
  formatarBRL, getIconePorId, getClassesCor 
} from '@/lib/util';

export default function NovaTransacao() {
  const router = useRouter();

  const [tipo, setTipo] = useState<'entrada' | 'saida'>('saida');
  const [metodo, setMetodo] = useState<'pix' | 'debito' | 'credito'>('pix');
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState(() => new Date().toISOString().split('T')[0]);
  const [totalParcelas, setTotalParcelas] = useState(1);

  // Listas vindas do Banco de Dados
  const [categorias, setCategorias] = useState<CategoriaDTO[]>([]);
  const [bancos, setBancos] = useState<BancoDTO[]>([]);

  // Selecionados
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<CategoriaDTO | null>(null);
  const [bancoSelecionado, setBancoSelecionado] = useState<BancoDTO | null>(null);

  // Controle de abertura dos seletores
  const [dropdownCategoriaAberto, setDropdownCategoriaAberto] = useState(false);
  const [dropdownBancoAberto, setDropdownBancoAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erroMsg, setErroMsg] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/categorias`)
      .then((res) => res.json())
      .then((lista) => setCategorias(Array.isArray(lista) ? lista : []))
      .catch((err) => console.error('Erro ao carregar categorias:', err));

    fetch(`${API_URL}/bancos`)
      .then((res) => res.json())
      .then((lista) => setBancos(Array.isArray(lista) ? lista : []))
      .catch((err) => console.error('Erro ao carregar bancos:', err));
  }, []);

  // Quando mudar o tipo (entrada/saida), limpa a categoria se ela for de outro tipo
  const handleTrocarTipo = (novoTipo: 'entrada' | 'saida') => {
    setTipo(novoTipo);
    if (categoriaSelecionada && categoriaSelecionada.tipo?.toLowerCase() !== novoTipo) {
      setCategoriaSelecionada(null);
    }
    if (novoTipo === 'entrada' && metodo === 'credito') {
      setMetodo('pix');
    }
  };

  // Filtra categorias pelo tipo selecionado (se não houver nenhuma do tipo, exibe todas)
  const categoriasDoTipo = categorias.filter(
    (c) => c.tipo?.toLowerCase() === tipo
  );
  const categoriasParaExibir = categoriasDoTipo.length > 0 ? categoriasDoTipo : categorias;

  const corPrimaria = tipo === 'entrada' ? 'text-success' : 'text-danger';

  const handleRegistrar = async () => {
    setErroMsg('');
    const valorNumerico = parseValorMonetario(valor);

    if (!descricao.trim()) {
      setErroMsg('Informe uma descrição para a transação.');
      return;
    }
    if (valorNumerico <= 0) {
      setErroMsg('Informe um valor maior que zero.');
      return;
    }

    setSalvando(true);
    try {
      const payload = {
        descricao: descricao.trim(),
        valor: valorNumerico,
        tipo: tipo.toUpperCase(),
        metodoPagamento: metodo.toUpperCase(),
        data,
        categoriaId: categoriaSelecionada?.id || null,
        bancoId: bancoSelecionado?.id || null,
        totalParcelas: metodo === 'credito' ? totalParcelas : 1,
      };

      const res = await fetch(`${API_URL}/transacoes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push('/financer/visualizacao_geral');
      } else {
        const texto = await res.text();
        setErroMsg(texto || 'Não foi possível salvar a transação.');
      }
    } catch (erro) {
      console.error('Erro ao registrar transação:', erro);
      setErroMsg('Erro de conexão com o servidor.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="flex flex-col p-4 md:p-6 gap-6 max-w-200 mx-auto pb-24">
      
      {/* 1. CABEÇALHO FLUTUANTE */}
      <div className="flex items-center gap-5 p-5 md:p-6 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        <Link 
          href="/financer/visualizacao_geral" 
          className="p-3 transition-colors border rounded-xl bg-[#18181b] border-border hover:border-gray-500 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white font-sans">Nova Transação</h1>
          <p className="mt-1 text-sm text-gray-400">Registre uma nova movimentação no seu caixa.</p>
        </div>
      </div>

      {/* 2. TIPO E VALOR */}
      <div className="flex flex-col gap-8 p-6 md:p-8 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        
        <SeletorTipoTransacao tipo={tipo} onChange={handleTrocarTipo} />

        {/* Input de Valor */}
        <div className="flex flex-col items-center justify-center gap-2 py-4">
          <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">
            Valor da Transação
          </span>
          <div className="flex items-center gap-2">
            <span className={`text-3xl font-bold ${corPrimaria}`}>R$</span>
            <input 
              type="text" 
              placeholder="0,00"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              className="w-[220px] bg-transparent text-5xl md:text-6xl font-bold text-white text-center focus:outline-none placeholder:text-gray-700 caret-brand"
            />
          </div>
        </div>
      </div>

      {/* 3. DETALHES GERAIS */}
      <div className="flex flex-col gap-6 p-6 md:p-8 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        
        {/* Descrição */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-300">Descrição</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <AlignLeft className="w-5 h-5 text-gray-500" />
            </div>
            <input 
              type="text" 
              placeholder={tipo === 'entrada' ? "ex: Venda PS Vita na OLX" : "ex: Lanche IFood"}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full py-3 pl-12 pr-4 text-white transition-colors border rounded-xl bg-[#18181b] border-border focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/50 placeholder:text-gray-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Seletor de Categoria Conectado ao Banco */}
          <div className="relative">
            <InputSelect 
              label="Categoria"
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
                  {categoriasParaExibir.length === 0 ? (
                    <div className="p-3 text-center text-sm text-gray-400">
                      Nenhuma categoria cadastrada.{' '}
                      <Link href="/financer/categorias" className="text-brand underline">
                        Criar agora
                      </Link>
                    </div>
                  ) : (
                    categoriasParaExibir.map((cat) => {
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
                    })
                  )}
                </div>
              </>
            )}
          </div>

          {/* Data */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Data</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Calendar className="w-5 h-5 text-gray-500" />
              </div>
              <input 
                type="date" 
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full py-3 pl-12 pr-4 text-white transition-colors border rounded-xl bg-[#18181b] border-border focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. PAGAMENTO E CONTA */}
      <div className="flex flex-col gap-6 p-6 md:p-8 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        
        <SeletorMetodoPagamento tipo={tipo} metodo={metodo} onChange={setMetodo} />

        {/* Seletor de Parcelas quando for CRÉDITO */}
        {metodo === 'credito' && (
          <div className="flex flex-col gap-2 animate-in fade-in duration-200">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand" />
              Número de Parcelas (Cartão de Crédito)
            </label>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
              {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setTotalParcelas(num)}
                  className={`py-2.5 px-3 rounded-xl text-sm font-bold border transition-all ${
                    totalParcelas === num
                      ? 'bg-brand/15 border-brand text-brand'
                      : 'bg-[#18181b] border-border text-gray-400 hover:border-gray-500 hover:text-white'
                  }`}
                >
                  {num}x
                </button>
              ))}
            </div>
            {totalParcelas > 1 && parseValorMonetario(valor) > 0 && (
              <span className="text-xs text-gray-400 mt-1">
                Serão geradas {totalParcelas} parcelas de{' '}
                <strong className="text-white font-mono">
                  {formatarBRL(parseValorMonetario(valor) / totalParcelas)}
                </strong>{' '}
                nas faturas subsequentes.
              </span>
            )}
          </div>
        )}

        {/* Banco de Origem Conectado ao Backend */}
        <div className="relative">
          <InputSelect 
            label={tipo === 'entrada' ? 'Recebido em qual banco?' : metodo === 'credito' ? 'Em qual cartão de crédito?' : 'Pago com qual banco?'}
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
                  bancos.map((b) => {
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
                  })
                )}
              </div>
            </>
          )}
        </div>

      </div>

      {erroMsg && (
        <div className="p-4 text-sm font-medium text-danger bg-danger/10 border border-danger/30 rounded-xl">
          {erroMsg}
        </div>
      )}

      {/* 5. BOTÕES DE AÇÃO FLUTUANTES */}
      <div className="flex items-center justify-end p-5 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        <Link 
          href="/financer/visualizacao_geral"
          className="px-6 py-2.5 text-sm font-medium transition-colors text-gray-400 hover:text-white"
        >
          Cancelar
        </Link>
        <button 
          type="button"
          onClick={handleRegistrar}
          disabled={salvando}
          className={`flex items-center gap-2 px-8 py-2.5 text-sm font-bold text-background rounded-xl transition-colors ml-4 shadow-lg disabled:opacity-50 ${
            tipo === 'entrada' ? 'bg-success hover:bg-success/90 shadow-success/30' : 'bg-danger hover:bg-danger/90 shadow-danger/30'
          }`}
        >
          {tipo === 'entrada' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {salvando ? 'Registrando...' : `Registrar ${tipo === 'entrada' ? 'Entrada' : 'Saída'}`}
        </button>
      </div>

    </div>
  );
}
