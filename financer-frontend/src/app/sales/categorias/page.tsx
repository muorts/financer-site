"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Tag, Save, Pencil, Trash2, 
  Gamepad2, Smartphone, Monitor, HardDrive, 
  Headphones, ShoppingBag, Cpu, Watch, Camera, Sparkles 
} from 'lucide-react';

import { SeletorCores } from '@/components/ui/ColorSelect';
import { SeletorIcones } from '@/components/ui/IconSelect';
import { NameInput } from '@/components/ui/NameInput';

// Helper para mapear ícones voltados para produtos e hardwares
const iconeMap: Record<string, any> = {
  gamepad: Gamepad2,
  smartphone: Smartphone,
  monitor: Monitor,
  hardware: HardDrive,
  headphones: Headphones,
  bag: ShoppingBag,
  cpu: Cpu,
  watch: Watch,
  camera: Camera,
  sparkles: Sparkles,
};

export default function CategoriasVendas() {
  // Estado com lista simulada de categorias de vendas e estoque
  const [categorias, setCategorias] = useState([
    { id: '1', nome: 'Consoles & Portáteis', cor: 'purple', icone: 'gamepad' },
    { id: '2', nome: 'Placas de Vídeo / GPU', cor: 'blue', icone: 'cpu' },
    { id: '3', nome: 'Smartphones & Acessórios', cor: 'emerald', icone: 'smartphone' },
  ]);

  // Estados do Formulário
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [nome, setNome] = useState('');
  const [corSelecionada, setCorSelecionada] = useState('purple');
  const [iconeSelecionado, setIconeSelecionado] = useState('gamepad');

  // Função para Salvar (Criar ou Atualizar)
  const handleSalvar = () => {
    if (!nome.trim()) return;

    if (editandoId) {
      // Atualiza a categoria existente
      setCategorias(categorias.map(cat => 
        cat.id === editandoId 
          ? { ...cat, nome, cor: corSelecionada, icone: iconeSelecionado } 
          : cat
      ));
      setEditandoId(null);
    } else {
      // Cria uma nova categoria de venda
      const novaCat = {
        id: String(Date.now()),
        nome,
        cor: corSelecionada,
        icone: iconeSelecionado,
      };
      setCategorias([...categorias, novaCat]);
    }

    // Limpa o formulário
    setNome('');
    setCorSelecionada('purple');
    setIconeSelecionado('gamepad');
  };

  // Função para carregar dados no form para edição
  const handleEditar = (cat: typeof categorias[0]) => {
    setEditandoId(cat.id);
    setNome(cat.nome);
    setCorSelecionada(cat.cor);
    setIconeSelecionado(cat.icone);
  };

  // Função para Excluir
  const handleExcluir = (id: string) => {
    setCategorias(categorias.filter(cat => cat.id !== id));
    if (editandoId === id) {
      setEditandoId(null);
      setNome('');
    }
  };

  return (
    <div className="flex flex-col p-4 md:p-6 gap-6 max-w-[800px] mx-auto pb-24">
      
      {/* BLOCO 1: CABEÇALHO */}
      <div className="flex items-center gap-5 p-5 md:p-6 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        <Link 
          href="/" 
          className="p-3 transition-colors border rounded-xl bg-[#18181b] border-border hover:border-gray-500 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white font-sans">Categorias de Vendas & Estoque</h1>
          <p className="mt-1 text-sm text-gray-400">Organize seus produtos, consoles e hardwares por categorias.</p>
        </div>
      </div>

      {/* BLOCO 2: VISUALIZAÇÃO E LISTAGEM DAS CATEGORIAS EXISTENTES */}
      <div className="flex flex-col gap-4 p-6 md:p-8 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        <h2 className="text-sm font-medium tracking-wider uppercase text-gray-400">
          Categorias Cadastradas ({categorias.length})
        </h2>

        <div className="flex flex-col gap-3">
          {categorias.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">Nenhuma categoria de venda cadastrada ainda.</p>
          ) : (
            categorias.map((cat) => {
              const IconComponent = iconeMap[cat.icone] || Tag;

              return (
                <div 
                  key={cat.id} 
                  className="flex items-center justify-between p-4 border rounded-xl bg-[#18181b]/50 border-border/50 hover:bg-[#18181b] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-surface border border-border text-brand">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-white text-sm">{cat.nome}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleEditar(cat)}
                      className="p-2 transition-colors border rounded-lg bg-surface border-border hover:border-gray-500 text-gray-400 hover:text-white"
                      title="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleExcluir(cat.id)}
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
            {editandoId ? 'Editar Categoria de Venda' : 'Nova Categoria de Venda'}
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
          label="Nome da Categoria de Produto"
          icon={Tag}
          placeholder="ex: Consoles, Placas de Vídeo, Smartphones..."
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        {/* Seleção de Cor Modular */}
        <SeletorCores 
          corSelecionada={corSelecionada} 
          onChange={setCorSelecionada} 
        />

        {/* Seleção de Ícone Modular */}
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
          {editandoId ? 'Salvar Alterações' : 'Salvar Categoria'}
        </button>
      </div>

    </div>
  );
}