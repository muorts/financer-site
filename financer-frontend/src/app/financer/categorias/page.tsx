"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Tag, Save, TrendingUp, TrendingDown, 
  Pencil, Trash2
} from 'lucide-react';

import { CardSelecao } from '@/components/ui/CardSelect'; 
import { SeletorCores } from '@/components/ui/ColorSelect';
import { SeletorIcones } from '@/components/ui/IconSelect';
import { NameInput } from '@/components/ui/NameInput';
import { API_URL, CategoriaDTO, getIconePorId, getClassesCor } from '@/lib/util';

export default function CadastroCategoria() {
  const [categorias, setCategorias] = useState<CategoriaDTO[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Estados do Formulário
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState<'saida' | 'entrada'>('saida');
  const [corSelecionada, setCorSelecionada] = useState('emerald');
  const [iconeSelecionado, setIconeSelecionado] = useState('utensils');

  // Carregar categorias do Backend
  useEffect(() => {
    fetch(`${API_URL}/categorias`)
      .then((res) => res.json())
      .then((data) => setCategorias(Array.isArray(data) ? data : []))
      .catch((err) => console.error('Erro ao buscar categorias:', err))
      .finally(() => setCarregando(false));
  }, []);

  const resetarFormulario = () => {
    setEditandoId(null);
    setNome('');
    setTipo('saida');
    setCorSelecionada('emerald');
    setIconeSelecionado('utensils');
  };

  // Função para Salvar (Criar ou Atualizar no PostgreSQL)
  const handleSalvar = async () => {
    if (!nome.trim()) return;

    const payload = {
      nome: nome.trim(),
      tipo: tipo.toUpperCase(),
      cor: corSelecionada,
      icone: iconeSelecionado,
    };

    try {
      if (editandoId) {
        const res = await fetch(`${API_URL}/categorias/${editandoId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const atualizada: CategoriaDTO = await res.json();
          setCategorias(categorias.map((cat) => (cat.id === editandoId ? atualizada : cat)));
          resetarFormulario();
        }
      } else {
        const res = await fetch(`${API_URL}/categorias`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const novaCat: CategoriaDTO = await res.json();
          setCategorias([...categorias, novaCat]);
          resetarFormulario();
        }
      }
    } catch (erro) {
      console.error('Erro ao salvar categoria:', erro);
    }
  };

  // Função para carregar dados no form para edição
  const handleEditar = (cat: CategoriaDTO) => {
    setEditandoId(cat.id);
    setNome(cat.nome);
    setTipo(cat.tipo?.toLowerCase() === 'entrada' ? 'entrada' : 'saida');
    setCorSelecionada(cat.cor || 'emerald');
    setIconeSelecionado(cat.icone || 'utensils');
  };

  // Função para Excluir
  const handleExcluir = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/categorias/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCategorias(categorias.filter((cat) => cat.id !== id));
        if (editandoId === id) resetarFormulario();
      }
    } catch (erro) {
      console.error('Erro ao excluir categoria:', erro);
    }
  };

  return (
    <div className="flex flex-col p-4 md:p-6 gap-6 max-w-[800px] mx-auto pb-24">
      
      {/* BLOCO 1: CABEÇALHO */}
      <div className="flex items-center gap-5 p-5 md:p-6 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        <Link 
          href="/financer/visualizacao_geral" 
          className="p-3 transition-colors border rounded-xl bg-[#18181b] border-border hover:border-gray-500 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white font-sans">Gerenciar Categorias</h1>
          <p className="mt-1 text-sm text-gray-400">Cadastre, edite ou exclua suas categorias de lançamentos.</p>
        </div>
      </div>

      {/* BLOCO 2: VISUALIZAÇÃO E LISTAGEM DAS CATEGORIAS EXISTENTES */}
      <div className="flex flex-col gap-4 p-6 md:p-8 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        <h2 className="text-sm font-medium tracking-wider uppercase text-gray-400">
          Categorias Cadastradas ({categorias.length})
        </h2>

        <div className="flex flex-col gap-3">
          {carregando ? (
            <p className="text-sm text-gray-500 py-4 text-center">Carregando categorias...</p>
          ) : categorias.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">Nenhuma categoria cadastrada ainda.</p>
          ) : (
            categorias.map((cat) => {
              const IconComponent = getIconePorId(cat.icone);
              const cores = getClassesCor(cat.cor);
              const isEntrada = cat.tipo?.toUpperCase() === 'ENTRADA';

              return (
                <div 
                  key={cat.id} 
                  className="flex items-center justify-between p-4 border rounded-xl bg-[#18181b]/50 border-border/50 hover:bg-[#18181b] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-xl border ${cores.border} ${cores.bgSoft} ${cores.text}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-white text-sm">{cat.nome}</span>
                      <span className={`text-xs font-medium mt-0.5 ${isEntrada ? 'text-success' : 'text-danger'}`}>
                        {isEntrada ? 'Receita (Entrada)' : 'Despesa (Saída)'}
                      </span>
                    </div>
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
            {editandoId ? 'Editar Categoria' : 'Nova Categoria'}
          </h2>
          {editandoId && (
            <button 
              onClick={resetarFormulario}
              className="text-xs text-gray-400 hover:text-white underline"
            >
              Cancelar Edição
            </button>
          )}
        </div>

        <NameInput 
          label="Nome da Categoria"
          icon={Tag}
          placeholder="ex: Lazer e Games"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        {/* Tipo (Entrada ou Saída) */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-gray-300">
            Qual é o comportamento padrão?
          </label>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <CardSelecao
              titulo="Despesa (Saída)"
              descricao="Gastos em geral, contas, compras e lazer."
              icon={TrendingDown}
              ativo={tipo === 'saida'}
              onClick={() => setTipo('saida')}
              corTexto="text-danger" 
              corBorda="border-danger"
              corFundo="bg-danger/10"
            />
            <CardSelecao
              titulo="Receita (Entrada)"
              descricao="Salário, lucro de vendas, bolsa, ganhos extras."
              icon={TrendingUp}
              ativo={tipo === 'entrada'}
              onClick={() => setTipo('entrada')}
              corTexto="text-success" 
              corBorda="border-success"
              corFundo="bg-success/10"
            />
          </div>
        </div>

        {/* Seleção de Cor Modular */}
        <SeletorCores 
          corSelecionada={corSelecionada} 
          onChange={setCorSelecionada} 
        />

        {/* Seleção de Ícone Modular */}
        <SeletorIcones 
          label="Ícone da Categoria"
          iconeSelecionado={iconeSelecionado} 
          onChange={setIconeSelecionado} 
        />

      </div>

      {/* BLOCO 4: BOTÕES DE AÇÃO */}
      <div className="flex items-center justify-end p-5 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        <Link 
          href="/financer/visualizacao_geral"
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
