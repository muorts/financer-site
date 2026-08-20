"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Building2, Save, Pencil, Trash2, 
  Wallet, ShieldCheck, Landmark 
} from 'lucide-react';

import { CardSelecao } from '@/components/ui/CardSelect'; 
import { SeletorCores } from '@/components/ui/ColorSelect';
import { NameInput } from '@/components/ui/NameInput';

export default function CadastroBanco() {
  // Estado com lista simulada de bancos cadastrados
  const [bancos, setBancos] = useState([
    { id: '1', nome: 'Nubank - Giro', tipo: 'giro', cor: 'purple', saldo: '1500,00' },
    { id: '2', nome: 'Inter - Reserva', tipo: 'reserva', cor: 'orange', saldo: '5000,00' },
  ]);

  // Estados do Formulário
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [nome, setNome] = useState('');
  const [tipoConta, setTipoConta] = useState<'giro' | 'reserva'>('giro');
  const [saldo, setSaldo] = useState('');
  const [corSelecionada, setCorSelecionada] = useState('purple');

  // Função para Salvar (Criar ou Atualizar)
  const handleSalvar = () => {
    if (!nome.trim()) return;

    if (editandoId) {
      setBancos(bancos.map(b => 
        b.id === editandoId 
          ? { ...b, nome, tipo: tipoConta, cor: corSelecionada, saldo } 
          : b
      ));
      setEditandoId(null);
    } else {
      const novoBanco = {
        id: String(Date.now()),
        nome,
        tipo: tipoConta,
        cor: corSelecionada,
        saldo,
      };
      setBancos([...bancos, novoBanco]);
    }

    // Resetar formulário
    setNome('');
    setSaldo('');
    setTipoConta('giro');
    setCorSelecionada('purple');
  };

  const handleEditar = (banco: typeof bancos[0]) => {
    setEditandoId(banco.id);
    setNome(banco.nome);
    setTipoConta(banco.tipo as 'giro' | 'reserva');
    setSaldo(banco.saldo);
    setCorSelecionada(banco.cor);
  };

  const handleExcluir = (id: string) => {
    setBancos(bancos.filter(b => b.id !== id));
    if (editandoId === id) setEditandoId(null);
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
        <h2 className="text-sm font-medium tracking-wider uppercase text-gray-400">Contas Ativas</h2>
        
        <div className="flex flex-col gap-3">
          {bancos.map((banco) => (
            <div key={banco.id} className="flex items-center justify-between p-4 border rounded-xl bg-[#18181b]/50 border-border/50 hover:bg-[#18181b] transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border border-border bg-surface text-white`}>
                  <Landmark className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-white text-sm">{banco.nome}</span>
                  <span className="text-xs text-gray-500">{banco.tipo === 'giro' ? 'Giro Operacional' : 'Reserva Fixa'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => handleEditar(banco)} className="p-2 border rounded-lg bg-surface border-border hover:border-gray-500 text-gray-400 hover:text-white">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleExcluir(banco.id)} className="p-2 border rounded-lg bg-surface border-border hover:border-danger/50 text-gray-400 hover:text-danger">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FORMULÁRIO */}
      <div className="flex flex-col gap-8 p-6 md:p-8 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        <h2 className="text-lg font-bold text-white">{editandoId ? 'Editar Banco' : 'Nova Conta'}</h2>
        
        <NameInput 
          label="Nome de Identificação"
          icon={Building2}
          placeholder="ex: Nubank - Caixinha 1"
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