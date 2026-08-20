"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  Store, Save, Pencil, Trash2, 
  ShoppingBag, Monitor, Smartphone, Globe, 
  MessageCircle, Users, Truck, Package 
} from 'lucide-react';

// Seus imports com os nomes atualizados
import { SeletorCores } from '@/components/ui/ColorSelect';
import { SeletorIcones } from '@/components/ui/IconSelect';
import { NameInput } from '@/components/ui/NameInput';
import { CabecalhoPagina } from '@/components/ui/Header';

// Helper para renderizar o ícone correspondente na listagem
const iconeMap: Record<string, any> = {
  store: Store,
  shopping: ShoppingBag,
  monitor: Monitor,
  smartphone: Smartphone,
  globe: Globe,
  message: MessageCircle,
  users: Users,
  truck: Truck,
  package: Package,
};

export default function CadastroPlataformas() {
  // Estado com lista simulada de plataformas cadastradas
  const [plataformas, setPlataformas] = useState([
    { id: '1', nome: 'OLX', cor: 'purple', icone: 'shopping' },
    { id: '2', nome: 'Mercado Livre', cor: 'yellow', icone: 'store' },
    { id: '3', nome: 'Facebook Marketplace', cor: 'blue', icone: 'monitor' },
    { id: '4', nome: 'Particular / Direto', cor: 'emerald', icone: 'users' },
  ]);

  // Estados do Formulário
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [nome, setNome] = useState('');
  const [corSelecionada, setCorSelecionada] = useState('purple');
  const [iconeSelecionado, setIconeSelecionado] = useState('shopping');

  // Função para Salvar (Criar ou Atualizar)
  const handleSalvar = () => {
    if (!nome.trim()) return;

    if (editandoId) {
      // Atualiza a plataforma existente
      setPlataformas(plataformas.map(plat => 
        plat.id === editandoId 
          ? { ...plat, nome, cor: corSelecionada, icone: iconeSelecionado } 
          : plat
      ));
      setEditandoId(null);
    } else {
      // Cria uma nova plataforma
      const novaPlat = {
        id: String(Date.now()),
        nome,
        cor: corSelecionada,
        icone: iconeSelecionado,
      };
      setPlataformas([...plataformas, novaPlat]);
    }

    // Limpa o formulário
    setNome('');
    setCorSelecionada('purple');
    setIconeSelecionado('shopping');
  };

  // Função para carregar dados no form para edição
  const handleEditar = (plat: typeof plataformas[0]) => {
    setEditandoId(plat.id);
    setNome(plat.nome);
    setCorSelecionada(plat.cor);
    setIconeSelecionado(plat.icone);
  };

  // Função para Excluir
  const handleExcluir = (id: string) => {
    setPlataformas(plataformas.filter(plat => plat.id !== id));
    if (editandoId === id) {
      setEditandoId(null);
      setNome('');
    }
  };

  return (
    <div className="flex flex-col p-4 md:p-6 gap-6 max-w-[800px] mx-auto pb-24">
      
      {/* BLOCO 1: CABEÇALHO */}
      <CabecalhoPagina 
        titulo="Canais de Venda" 
        descricao="Gerencie as plataformas onde você anuncia seus produtos."
        caminhoVoltar="/" 
      />

      {/* BLOCO 2: VISUALIZAÇÃO E LISTAGEM DAS PLATAFORMAS */}
      <div className="flex flex-col gap-4 p-6 md:p-8 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        <h2 className="text-sm font-medium tracking-wider uppercase text-gray-400">
          Plataformas Ativas ({plataformas.length})
        </h2>

        <div className="flex flex-col gap-3">
          {plataformas.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">Nenhuma plataforma cadastrada ainda.</p>
          ) : (
            plataformas.map((plat) => {
              const IconComponent = iconeMap[plat.icone] || Store;

              // Identifica dinamicamente a cor da borda/fundo baseada na cor escolhida
              const corMap: Record<string, string> = {
                purple: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
                orange: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
                emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
                blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
                red: 'text-red-500 bg-red-500/10 border-red-500/20',
                yellow: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
                gray: 'text-gray-400 bg-gray-400/10 border-gray-400/20',
              };

              const cores = corMap[plat.cor] || corMap.gray;

              return (
                <div 
                  key={plat.id} 
                  className="flex items-center justify-between p-4 border rounded-xl bg-[#18181b]/50 border-border/50 hover:bg-[#18181b] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-xl border ${cores}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-white text-sm">{plat.nome}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleEditar(plat)}
                      className="p-2 transition-colors border rounded-lg bg-surface border-border hover:border-gray-500 text-gray-400 hover:text-white"
                      title="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleExcluir(plat.id)}
                      className="p-2 transition-colors border rounded-lg bg-surface border-border hover:border-danger/50 text-gray-400 hover:text-danger"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* BLOCO 3: FORMULÁRIO DE CADASTRO / EDIÇÃO */}
      <div className="flex flex-col gap-8 p-6 md:p-8 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">
            {editandoId ? 'Editar Plataforma' : 'Nova Plataforma'}
          </h2>
          {editandoId && (
            <button 
              onClick={() => {
                setEditandoId(null);
                setNome('');
              }}
              className="text-xs text-gray-400 hover:text-white underline"
            >
              Cancelar Edição
            </button>
          )}
        </div>

        <NameInput 
          label="Nome da Plataforma"
          icon={Store}
          placeholder="ex: Shopee, OLX, Amazon..."
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <SeletorCores 
          label="Cor de Destaque da Plataforma"
          corSelecionada={corSelecionada} 
          onChange={setCorSelecionada} 
        />

        <SeletorIcones 
          iconeSelecionado={iconeSelecionado} 
          onChange={setIconeSelecionado} 
        />

      </div>

      {/* BLOCO 4: BOTÕES DE AÇÃO */}
      <div className="flex items-center justify-end p-5 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        <Link 
          href="/"
          className="px-6 py-2.5 text-sm font-medium transition-colors text-gray-400 hover:text-white"
        >
          Voltar
        </Link>
        <button 
          onClick={handleSalvar}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-background bg-brand rounded-xl hover:bg-brand/90 transition-colors ml-4 shadow-[0_0_15px_rgba(var(--brand),0.3)]"
        >
          <Save className="w-4 h-4" />
          {editandoId ? 'Salvar Alterações' : 'Salvar Plataforma'}
        </button>
      </div>

    </div>
  );
}