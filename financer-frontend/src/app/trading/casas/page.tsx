"use client";

import { useState, useEffect } from 'react';
import { 
  Building2, Save, Pencil, Trash2, 
  Globe, Swords, ShieldAlert 
} from 'lucide-react';

import { CabecalhoPagina } from '@/components/ui/Header';
import { SeletorCores } from '@/components/ui/ColorSelect';
import { NameInput } from '@/components/ui/NameInput';
import { SeletorIcones, ICONES_DISPONIVEIS } from '@/components/ui/IconSelect';
import { CardInformacao } from '@/components/ui/CardInformation';

// Tipagem da Casa atualizada para bater com o Java
interface CasaAposta {
  id: string;
  nome: string;
  tipo: string;
  cor: string;
  iconeId: string;
}

export default function CadastroCasas() {
  // 1. Estado inicial agora começa VAZIO, os dados virão do banco real!
  const [casas, setCasas] = useState<CasaAposta[]>([]);
  
  // Estados do Formulário
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [nome, setNome] = useState('');
  const [corSelecionada, setCorSelecionada] = useState('brand');
  const [iconeSelecionado, setIconeSelecionado] = useState('globe');

  // ==========================================
  // BUSCAR DO BANCO AO CARREGAR A PÁGINA
  // ==========================================
  useEffect(() => {
    fetch('http://localhost:8080/api/casas')
      .then(res => res.json())
      .then(data => setCasas(data))
      .catch(err => console.error("Erro ao buscar casas:", err));
  }, []);

  // ==========================================
  // SALVAR OU ATUALIZAR NO BANCO
  // ==========================================
  const handleSalvar = async () => {
    if (!nome.trim()) return;

    if (editandoId) {
      // (Futuro) Aqui faremos o PUT (Atualizar) quando criarmos a rota no Java
      // Por enquanto, atualiza só na tela
      setCasas(casas.map(c => 
        c.id === editandoId 
          ? { ...c, nome, cor: corSelecionada, iconeId: iconeSelecionado } 
          : c
      ));
      setEditandoId(null);
    } else {
      // Prepara o pacote para mandar para o Java
      const novaCasa = {
        nome,
        tipo: "TRADICIONAL", // Mandando o tipo padrão para não dar erro no banco
        cor: corSelecionada,
        iconeId: iconeSelecionado,
      };

      try {
        const resposta = await fetch('http://localhost:8080/api/casas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(novaCasa) // Transforma em JSON
        });

        if (resposta.ok) {
          const casaSalvaBanco = await resposta.json();
          // Adiciona a casa que o Java retornou (com o ID gerado no PostgreSQL)
          setCasas([...casas, casaSalvaBanco]);
        }
      } catch (erro) {
        console.error("Erro ao salvar a casa:", erro);
      }
    }

    // Resetar formulário
    setNome('');
    setCorSelecionada('brand');
    setIconeSelecionado('globe');
  };

  const handleEditar = (casa: CasaAposta) => {
    setEditandoId(casa.id);
    setNome(casa.nome);
    setCorSelecionada(casa.cor);
    setIconeSelecionado(casa.iconeId);
  };

  // ==========================================
  // EXCLUIR DO BANCO DE DADOS
  // ==========================================
  const handleExcluir = async (id: string) => {
    try {
      const resposta = await fetch(`http://localhost:8080/api/casas/${id}`, {
        method: 'DELETE'
      });

      if (resposta.ok) {
        // Se o Java excluiu com sucesso, tiramos da tela
        setCasas(casas.filter(c => c.id !== id));
        if (editandoId === id) setEditandoId(null);
      }
    } catch (erro) {
      console.error("Erro ao excluir a casa:", erro);
    }
  };

  // Função auxiliar para renderizar o ícone correto na lista
  const getIconeComponent = (id: string) => {
    const item = ICONES_DISPONIVEIS.find(i => i.id === id);
    const Icone = item?.icone || Globe;
    return <Icone className="w-5 h-5" />;
  };

  return (
    <div className="flex flex-col p-4 md:p-6 gap-6 max-w-[850px] mx-auto pb-24">
      
      {/* CABEÇALHO */}
      <CabecalhoPagina 
        titulo="Gerenciar Casas de Aposta" 
        descricao="Cadastre suas plataformas e controle a banca com precisão para evitar surpresas."
        caminhoVoltar="/trades" 
      />

      {/* DICA DE PROTEÇÃO */}
      <CardInformacao 
        titulo="Controle Estrito de Banca"
        descricao="Mantenha o saldo inicial sempre atualizado. Ter um registro rigoroso é a sua maior prova caso precise acionar o suporte da casa por causa de saques retidos ou depósitos não creditados."
        tema="gray"
        icone={ShieldAlert}
      />

      {/* LISTAGEM DE CASAS CADASTRADAS */}
      <div className="flex flex-col gap-4 p-6 md:p-8 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        <h2 className="text-sm font-medium tracking-wider uppercase text-gray-400">Casas Ativas ({casas.length})</h2>
        
        {casas.length === 0 ? (
          <div className="p-6 text-center border rounded-xl bg-[#18181b]/30 border-border/50">
            <p className="text-sm text-gray-500">Nenhuma casa cadastrada ainda.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {casas.map((casa) => {

              return (
                <div key={casa.id} className="flex items-center justify-between p-4 border rounded-xl bg-[#18181b]/50 border-border/50 hover:bg-[#18181b] transition-colors">
                  <div className="flex items-center gap-4">
                    {/* Renderiza a cor e o ícone escolhidos pelo usuário */}
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-${casa.cor}-500/10 text-${casa.cor}-500 border border-${casa.cor}-500/20`}>
                      {getIconeComponent(casa.iconeId)}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-white text-sm">{casa.nome}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-5">

                    <div className="flex items-center gap-2 border-l border-border/50 pl-5">
                      <button onClick={() => handleEditar(casa)} className="p-2 rounded-lg bg-surface border border-border hover:border-gray-500 text-gray-400 hover:text-white transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleExcluir(casa.id)} className="p-2 rounded-lg bg-surface border border-border hover:border-danger/50 hover:bg-danger/10 text-gray-400 hover:text-danger transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FORMULÁRIO DE CADASTRO/EDIÇÃO */}
      <div className="flex flex-col gap-8 p-6 md:p-8 border bg-surface/40 border-border/80 rounded-2xl shadow-sm animate-in fade-in slide-in-from-bottom-4">
        <h2 className="text-lg font-bold text-white border-b border-border/50 pb-4">
          {editandoId ? 'Editando Plataforma' : 'Adicionar Nova Plataforma'}
        </h2>
        
        <NameInput 
          label="Nome da Casa de Aposta"
          icon={Building2}
          placeholder="ex: Bet365, Betano, Pinnacle"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <SeletorIcones 
          iconeSelecionado={iconeSelecionado}
          onChange={setIconeSelecionado}
        />

        <SeletorCores 
          label="Cor da Marca (Identidade Visual)"
          corSelecionada={corSelecionada} 
          onChange={setCorSelecionada} 
        />

      </div>

      {/* BOTÃO SALVAR */}
      <div className="flex items-center justify-end">
        <button 
          onClick={handleSalvar} 
          disabled={!nome.trim()}
          className="flex items-center gap-2 px-8 py-3.5 text-sm font-bold text-background bg-brand rounded-xl hover:bg-brand/90 transition-all shadow-[0_0_15px_rgba(var(--brand),0.3)] disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed"
        >
          <Save className="w-5 h-5" />
          {editandoId ? 'Atualizar Dados da Casa' : 'Cadastrar Casa de Aposta'}
        </button>
      </div>

    </div>
  );
}