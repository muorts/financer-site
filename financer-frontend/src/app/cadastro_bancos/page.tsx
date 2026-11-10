"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Building2, Save, Pencil, Trash2, 
  Wallet, ShieldCheck, Landmark 
} from 'lucide-react';

import { CardSelecao } from '@/components/ui/CardSelect'; 
import { SeletorCores } from '@/components/ui/ColorSelect';
import { NameInput } from '@/components/ui/NameInput';
import { API_URL, BancoDTO, formatarBRL, parseValorMonetario, getClassesCor } from '@/lib/util';

export default function CadastroBanco() {
  const [bancos, setBancos] = useState<BancoDTO[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Estados do Formulário
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [nome, setNome] = useState('');
  const [tipoConta, setTipoConta] = useState<'giro' | 'reserva'>('giro');
  const [saldo, setSaldo] = useState('');
  const [corSelecionada, setCorSelecionada] = useState('purple');
  const [diaFechamento, setDiaFechamento] = useState('3');
  const [diaVencimento, setDiaVencimento] = useState('10');

  // Carregar bancos do Backend
  useEffect(() => {
    fetch(`${API_URL}/bancos`)
      .then((res) => res.json())
      .then((data) => setBancos(Array.isArray(data) ? data : []))
      .catch((err) => console.error('Erro ao carregar bancos:', err))
      .finally(() => setCarregando(false));
  }, []);

  const resetarFormulario = () => {
    setEditandoId(null);
    setNome('');
    setSaldo('');
    setTipoConta('giro');
    setCorSelecionada('purple');
    setDiaFechamento('3');
    setDiaVencimento('10');
  };

  // Função para Salvar (Criar ou Atualizar no PostgreSQL)
  const handleSalvar = async () => {
    if (!nome.trim()) return;

    const payload = {
      nome: nome.trim(),
      tipo: tipoConta.toUpperCase(),
      cor: corSelecionada,
      saldoInicial: parseValorMonetario(saldo),
      diaFechamento: parseInt(diaFechamento, 10) || 3,
      diaVencimento: parseInt(diaVencimento, 10) || 10,
    };

    try {
      if (editandoId) {
        const res = await fetch(`${API_URL}/bancos/${editandoId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const bancoAtualizado: BancoDTO = await res.json();
          setBancos(bancos.map((b) => (b.id === editandoId ? bancoAtualizado : b)));
          resetarFormulario();
        }
      } else {
        const res = await fetch(`${API_URL}/bancos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const novoBanco: BancoDTO = await res.json();
          setBancos([...bancos, novoBanco]);
          resetarFormulario();
        }
      }
    } catch (erro) {
      console.error('Erro ao salvar banco:', erro);
    }
  };

  const handleEditar = (banco: BancoDTO) => {
    setEditandoId(banco.id);
    setNome(banco.nome);
    setTipoConta(banco.tipo?.toLowerCase() === 'reserva' ? 'reserva' : 'giro');
    setSaldo(String(banco.saldoInicial ?? 0).replace('.', ','));
    setCorSelecionada(banco.cor || 'purple');
    setDiaFechamento(String(banco.diaFechamento ?? 3));
    setDiaVencimento(String(banco.diaVencimento ?? 10));
  };

  const handleExcluir = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/bancos/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBancos(bancos.filter((b) => b.id !== id));
        if (editandoId === id) resetarFormulario();
      }
    } catch (erro) {
      console.error('Erro ao excluir banco:', erro);
    }
  };

  return (
    <div className="flex flex-col p-4 md:p-6 gap-6 max-w-[800px] mx-auto pb-24">
      
      {/* CABEÇALHO */}
      <div className="flex items-center gap-5 p-5 md:p-6 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        <Link href="/" className="p-3 transition-colors border rounded-xl bg-[#18181b] border-border hover:border-gray-500 text-gray-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white font-sans">Gerenciar Bancos</h1>
          <p className="mt-1 text-sm text-gray-400">Cadastre e edite suas contas e carteiras.</p>
        </div>
      </div>

      {/* LISTAGEM DE BANCOS */}
      <div className="flex flex-col gap-4 p-6 md:p-8 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        <h2 className="text-sm font-medium tracking-wider uppercase text-gray-400">
          Contas Ativas ({bancos.length})
        </h2>
        
        <div className="flex flex-col gap-3">
          {carregando ? (
            <p className="text-sm text-gray-500 py-4 text-center">Carregando contas...</p>
          ) : bancos.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">Nenhum banco cadastrado ainda.</p>
          ) : (
            bancos.map((banco) => {
              const cores = getClassesCor(banco.cor);
              const isGiro = banco.tipo?.toUpperCase() === 'GIRO';

              return (
                <div key={banco.id} className="flex items-center justify-between p-4 border rounded-xl bg-[#18181b]/50 border-border/50 hover:bg-[#18181b] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${cores.border} ${cores.bgSoft} ${cores.text}`}>
                      <Landmark className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-white text-sm">{banco.nome}</span>
                      <span className="text-xs text-gray-500">
                        {isGiro ? 'Giro Operacional' : 'Reserva Fixa'} • Saldo: <strong className="text-gray-300 font-mono">{formatarBRL(banco.saldoAtual)}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEditar(banco)} className="p-2 border rounded-lg bg-surface border-border hover:border-gray-500 text-gray-400 hover:text-white" title="Editar">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleExcluir(banco.id)} className="p-2 border rounded-lg bg-surface border-border hover:border-danger/50 text-gray-400 hover:text-danger" title="Excluir">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* FORMULÁRIO */}
      <div className="flex flex-col gap-8 p-6 md:p-8 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">{editandoId ? 'Editar Banco' : 'Nova Conta'}</h2>
          {editandoId && (
            <button onClick={resetarFormulario} className="text-xs text-gray-400 hover:text-white underline">
              Cancelar Edição
            </button>
          )}
        </div>
        
        <NameInput 
          label="Nome de Identificação"
          icon={Building2}
          placeholder="ex: Nubank - Giro"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <SeletorCores 
          label="Cor do Banco"
          corSelecionada={corSelecionada} 
          onChange={setCorSelecionada} 
        />

        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-gray-300">Finalidade</label>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <CardSelecao
              titulo="Giro Operacional"
              descricao="Dinheiro do dia a dia."
              icon={Wallet}
              ativo={tipoConta === 'giro'}
              onClick={() => setTipoConta('giro')}
              corTexto="text-brand" 
              corBorda="border-brand"
              corFundo="bg-brand/10"
            />
            <CardSelecao
              titulo="Reserva Fixa"
              descricao="Dinheiro blindado."
              icon={ShieldCheck}
              ativo={tipoConta === 'reserva'}
              onClick={() => setTipoConta('reserva')}
              corTexto="text-blue-500"
              corBorda="border-blue-500"
              corFundo="bg-blue-500/10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Saldo Inicial</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 font-mono text-gray-500">R$</span>
              <input 
                type="text" 
                placeholder="0,00"
                value={saldo}
                onChange={(e) => setSaldo(e.target.value)}
                className="w-full py-3 pl-12 pr-4 font-mono text-white transition-colors border rounded-xl bg-[#18181b] border-border focus:border-brand outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Dia Fechamento Fatura</label>
            <input 
              type="number" 
              min={1}
              max={31}
              placeholder="Ex: 3"
              value={diaFechamento}
              onChange={(e) => setDiaFechamento(e.target.value)}
              className="w-full py-3 px-4 font-mono text-white transition-colors border rounded-xl bg-[#18181b] border-border focus:border-brand outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Dia Vencimento Fatura</label>
            <input 
              type="number" 
              min={1}
              max={31}
              placeholder="Ex: 10"
              value={diaVencimento}
              onChange={(e) => setDiaVencimento(e.target.value)}
              className="w-full py-3 px-4 font-mono text-white transition-colors border rounded-xl bg-[#18181b] border-border focus:border-brand outline-none"
            />
          </div>
        </div>
      </div>

      {/* BOTÃO SALVAR */}
      <div className="flex items-center justify-end p-5 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        <button onClick={handleSalvar} className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-background bg-brand rounded-xl hover:bg-brand/90 transition-colors shadow-[0_0_15px_rgba(var(--brand),0.3)]">
          <Save className="w-4 h-4" />
          {editandoId ? 'Atualizar Conta' : 'Cadastrar Conta'}
        </button>
      </div>
    </div>
  );
}
