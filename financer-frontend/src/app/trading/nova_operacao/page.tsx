"use client";

import { useState, useEffect } from 'react';
import { Swords, Target, RefreshCw, Save, Percent, Ticket } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { CabecalhoPagina } from '@/components/ui/Header';
import { NameInput } from '@/components/ui/NameInput';
import { SeletorTipoOperacao, TipoOperacao } from '@/components/trades/Operationtype';
import { SecaoOperacao } from '@/components/trades/OperationSecao';
import { SecaoLucro } from '@/components/trades/ProfitSec'; 
import { InputSelect } from '@/components/ui/InputSelect'; 
import { calcularLucroProjetado } from '@/utils/calculadoraTrade'; 

export default function NovaOperacao() {
  const router = useRouter();

  // Controle de Abas
  const [tipoOperacao, setTipoOperacao] = useState<TipoOperacao>('arbitragem');
  const [subTipoFreebet, setSubTipoFreebet] = useState<'missao' | 'conversao'>('missao');

  // Controle de Textos e Valores
  const [eventoArbitragem, setEventoArbitragem] = useState('');
  const [eventoFreebet, setEventoFreebet] = useState('');
  const [retencao, setRetencao] = useState('');
  const [valorLucro, setValorLucro] = useState('');
  const [valorFreebetEsperada, setValorFreebetEsperada] = useState('');

  // ==========================================
  // ESTADOS DA ENTRADA PRINCIPAL
  // ==========================================
  const [mainCasaId, setMainCasaId] = useState('');
  const [mainOdd, setMainOdd] = useState('');
  const [mainStake, setMainStake] = useState('');

  // Estados para o Seletor Customizado de Freebets
  const [freebetsPendentes, setFreebetsPendentes] = useState<any[]>([]);
  const [freebetSelecionada, setFreebetSelecionada] = useState<string>('nova');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // NOVO: Controle do menu suspenso
  const [casasOficiaisDB, setCasasOficiaisDB] = useState<any[]>([]);

  // ==========================================
  // CONTROLE DE PROTEÇÕES DINÂMICAS
  // ==========================================
  const [protecoesArbitragem, setProtecoesArbitragem] = useState<any[]>([{ id: 1, casaId: '', odd: '', stake: '' }]);
  const [protecoesFreebet, setProtecoesFreebet] = useState<any[]>([{ id: 2, casaId: '', odd: '', stake: '' }]);

  const handleAddProtecaoArbitragem = () => setProtecoesArbitragem([...protecoesArbitragem, { id: Date.now(), casaId: '', odd: '', stake: '' }]);
  const handleRemoveProtecaoArbitragem = (id: number) => setProtecoesArbitragem(protecoesArbitragem.filter(p => p.id !== id));

  const handleAddProtecaoFreebet = () => setProtecoesFreebet([...protecoesFreebet, { id: Date.now(), casaId: '', odd: '', stake: '' }]);
  const handleRemoveProtecaoFreebet = (id: number) => setProtecoesFreebet(protecoesFreebet.filter(p => p.id !== id));

  const updateProtecaoArbitragem = (id: number, campo: string, valor: string) => {
    setProtecoesArbitragem(prev => prev.map(p => p.id === id ? { ...p, [campo]: valor } : p));
  };

  const updateProtecaoFreebet = (id: number, campo: string, valor: string) => {
    setProtecoesFreebet(prev => prev.map(p => p.id === id ? { ...p, [campo]: valor } : p));
  };

  useEffect(() => {
    fetch('http://localhost:8080/api/freebets/pendentes')
      .then(res => res.json())
      .then(dados => setFreebetsPendentes(dados))
      .catch(err => console.error("Erro ao buscar freebets:", err));
  }, []);

  useEffect(() => {
    // Busca as freebets do cofre
    fetch('http://localhost:8080/api/freebets/pendentes')
      .then(res => res.json())
      .then(dados => setFreebetsPendentes(dados))
      .catch(err => console.error("Erro ao buscar freebets:", err));

    // NOVO: Busca as casas de aposta para podermos traduzir o Nome para ID ao salvar
    fetch('http://localhost:8080/api/casas')
      .then(res => res.json())
      .then(dados => setCasasOficiaisDB(dados))
      .catch(err => console.error("Erro ao buscar casas:", err));
  }, []);

  // ==========================================
  // CÁLCULO AUTOMÁTICO DE RETENÇÃO (USANDO O MOTOR CENTRAL)
  // ==========================================
  useEffect(() => {
    if (tipoOperacao === 'freebet' && subTipoFreebet === 'conversao') {
      const parseNum = (val: string) => parseFloat(val.replace(',', '.')) || 0;
      const stakePrincipal = parseNum(mainStake);

      if (stakePrincipal > 0) {
        
        // 1. Monta o array de entradas exatamente como a sua Calculadora exige
        const entradasParaCalculadora = [
          { stake: stakePrincipal, odd: parseNum(mainOdd), isFreebet: true, tipo: 'principal' },
          ...protecoesFreebet.map(p => ({
            stake: parseNum(p.stake),
            odd: parseNum(p.odd),
            isFreebet: false,
            tipo: 'protecao'
          }))
        ];

        // 2. Evita mostrar lucro negativo enquanto o usuário ainda está digitando a primeira proteção
        const temProtecaoValida = protecoesFreebet.some(p => parseNum(p.stake) > 0 && parseNum(p.odd) > 0);
        
        let menorLucro = 0;
        if (temProtecaoValida) {
          // 3. Chama o SEU motor matemático. (Mandamos 0 no custo inicial para a calculadora somar sozinha)
          menorLucro = calcularLucroProjetado(entradasParaCalculadora, 'Conversão', 0);
        }

        // 4. A Retenção é apenas o Lucro Garantido dividido pelo valor do Voucher original
        const percentualRetencao = (menorLucro / stakePrincipal) * 100;
        
        if (isFinite(percentualRetencao)) {
          setRetencao(percentualRetencao.toFixed(2).replace('.', ','));
        }
      } else {
        setRetencao('');
      }
    }
  }, [tipoOperacao, subTipoFreebet, mainStake, mainOdd, protecoesFreebet]);

  const handleRegistrar = async () => {
    const parseNumber = (valor: string) => {
      if (!valor) return 0;
      return parseFloat(valor.replace(',', '.'));
    };

    // ==========================================
    // ROTA EXPRESSA: LUCRO / PERDA DIRETA
    // ==========================================
    if (tipoOperacao === 'lucro') {
      const valorFinal = parseNumber(valorLucro);
      if (valorFinal === 0 || !eventoArbitragem.trim()) {
        alert("Preencha a origem do lucro/perda e o valor!");
        return;
      }

      const tradeAvulso = {
        jogo: eventoArbitragem, 
        mercado: 'Lucro/Perda Avulsa',
        valorTotalInvestido: valorFinal < 0 ? Math.abs(valorFinal) : 0,
        lucroLiquidoReal: valorFinal,
        status: 'FINALIZADO',
        entradas: [] 
      };

      try {
        const res = await fetch('http://localhost:8080/api/trades', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(tradeAvulso)
        });
        
        if (res.ok) {
          router.push('./trades');
        } else {
          const erroMsg = await res.text();
          alert("O Java recusou o Lucro Avulso:\n" + erroMsg);
        }
      } catch (err) {
        alert("Erro fatal de conexão com o servidor!");
      }
      return; 
    }

    // ==========================================
    // ROTA PADRÃO: ARBITRAGEM E FREEBET
    // ==========================================
    const jogo = tipoOperacao === 'freebet' ? eventoFreebet : eventoArbitragem;
    
    if (!jogo.trim() || !mainCasaId) {
      alert("Preencha o nome do jogo e selecione a casa principal!");
      return;
    }

    // TRADUTOR: Pega o Nome que está na tela (ex: "Betano") e acha o ID oficial do banco
    const getCasaIdReal = (nomeOuId: string) => {
      const casa = casasOficiaisDB.find(c => 
        c.nome.toLowerCase() === String(nomeOuId).toLowerCase() || c.id === nomeOuId
      );
      return casa ? casa.id : null; 
    };

    const idPrincipal = getCasaIdReal(mainCasaId);
    if (!idPrincipal) {
      alert(`Erro no Sistema: A casa '${mainCasaId}' não foi encontrada no banco oficial!`);
      return;
    }

    const entradasParaOJava = [
      {
        tipo: "PRINCIPAL",
        backLay: "BACK",
        odd: parseNumber(mainOdd),
        stake: parseNumber(mainStake),
        // CORREÇÃO LÓGICA: Na MISSÃO, a entrada é com dinheiro real, não com a freebet em si!
        isFreebet: tipoOperacao === 'freebet' && subTipoFreebet === 'conversao',
        casaAposta: { id: idPrincipal } 
      }
    ];

    const protecoesAtivas = tipoOperacao === 'freebet' ? protecoesFreebet : protecoesArbitragem;

    // Usando for...of para poder dar o return alert se a casa da proteção falhar
    for (const prot of protecoesAtivas) {
      if (prot.casaId && prot.stake) {
        const idProt = getCasaIdReal(prot.casaId);
        if (!idProt) {
          alert(`Erro na Proteção: A casa '${prot.casaId}' não existe no banco!`);
          return;
        }

        entradasParaOJava.push({
          tipo: "PROTECAO",
          backLay: "LAY",
          odd: parseNumber(prot.odd),
          stake: parseNumber(prot.stake),
          isFreebet: false,
          casaAposta: { id: idProt }
        });
      }
    }

    const valorInvestido = entradasParaOJava.reduce((total, entrada) => total + entrada.stake, 0);

    const novoTrade = {
      jogo: jogo,
      mercado: tipoOperacao === 'freebet' ? `Freebet (${subTipoFreebet})` : 'Arbitragem / PA',
      valorTotalInvestido: valorInvestido,
      valorFreebetEsperada: (tipoOperacao === 'freebet' && subTipoFreebet === 'missao') 
                             ? parseNumber(valorFreebetEsperada) : 0.0,
      entradas: entradasParaOJava
    };

    try {
      const resposta = await fetch('http://localhost:8080/api/trades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoTrade)
      });
      
      if (resposta.ok) {
        
       // ==========================================
        // GATILHO 1: SE FOR MISSÃO, GERA A FREEBET NO COFRE
        // ==========================================
        if (tipoOperacao === 'freebet' && subTipoFreebet === 'missao') {
          const valorFb = parseNumber(valorFreebetEsperada);
          if (valorFb > 0) {
            
            // Pega a data EXATA DE HOJE
            const dataDeHoje = new Date();
            
            const novaFreebetPayload = {
              valor: valorFb,
              status: "PENDENTE",
              dataVencimento: dataDeHoje.toISOString().split('T')[0], // Envia o formato "YYYY-MM-DD" do dia atual
              casaAposta: { id: idPrincipal } 
            };
            
            try {
              const resFb = await fetch('http://localhost:8080/api/freebets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novaFreebetPayload)
              });
              
              if (!resFb.ok) {
                const erroMsg = await resFb.text();
                alert("A operação foi salva, MAS a Freebet não foi criada no cofre!\n\nMotivo do Java:\n" + erroMsg);
              }
            } catch (errFb) {
              console.error("Erro fatal ao gerar freebet:", errFb);
            }
          }
        }

        // ==========================================
        // GATILHO 2: SE FOR CONVERSÃO, DÁ BAIXA NO COFRE
        // ==========================================
        if (tipoOperacao === 'freebet' && subTipoFreebet === 'conversao' && freebetSelecionada !== 'nova') {
          try {
            await fetch(`http://localhost:8080/api/freebets/${freebetSelecionada}`, {
              method: 'DELETE' 
            });
          } catch (errFreebet) {
            console.error("Erro ao dar baixa na freebet:", errFreebet);
          }
        }
        
        router.push('./trades'); 
      } else {
        // O DEDO-DURO! Se o Java não gostar, ele vai aparecer neste Alerta:
        const erroMsg = await resposta.text();
        alert("O Java recusou o Registro!\n\nDetalhes do Erro:\n" + erroMsg);
      }
    } catch (erro) {
      alert("Erro fatal de conexão com o backend!");
    }
  };

  const handleSelecionarFreebet = (id: string) => {
    setFreebetSelecionada(id);
    setIsDropdownOpen(false); 
    
    if (id !== 'nova') {
      const fb = freebetsPendentes.find(f => f.id === id);
      if (fb) {
        setMainStake(fb.valor.toString()); 
        // CORREÇÃO: Lendo o objeto 'casaAposta' exato do seu Java!
        if (fb.casaAposta && fb.casaAposta.nome) {
          setMainCasaId(fb.casaAposta.nome); 
        }
      }
    } else {
      setMainStake('');
      setMainCasaId('');
    }
  };

  // Pega os dados da freebet selecionada para mostrar no InputSelect
  const fbAtiva = freebetsPendentes.find(f => f.id === freebetSelecionada);
  const textoInputSelect = freebetSelecionada === 'nova' 
    ? 'Nova Freebet' 
    : `${fbAtiva?.casaAposta?.nome} - R$ ${fbAtiva?.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  return (
    <div className="flex flex-col p-4 md:p-6 gap-6 max-w-200 mx-auto pb-24 relative">
      
      {/* Overlay invisível para fechar o dropdown ao clicar fora */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}

      <CabecalhoPagina 
        titulo="Nova Operação" 
        descricao="Registre arbitragens, freebets ou lucros imprevistos."
        caminhoVoltar="./trades" 
      />

      <SeletorTipoOperacao 
        tipoAtual={tipoOperacao}
        onChange={setTipoOperacao}
      />

      <div className="flex flex-col gap-8 p-6 md:p-8 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        
        {tipoOperacao === 'arbitragem' && (
          <SecaoOperacao 
            eventoNome={eventoArbitragem}
            onChangeEvento={setEventoArbitragem}
            eventoPlaceholder="ex: Palmeiras x Corinthians"
            mainTitulo="Entrada Principal"
            mainIcon={Swords}
            mainTema="brand"
            mainOddPlaceholder="2.10"
            mainValorPlaceholder="R$ 500,00"
            mainCasaId={mainCasaId}
            onChangeMainCasa={setMainCasaId}
            mainOdd={mainOdd}
            onChangeMainOdd={setMainOdd}
            mainStake={mainStake}
            onChangeMainStake={setMainStake}
            protecoes={protecoesArbitragem}
            onAddProtecao={handleAddProtecaoArbitragem}
            onRemoveProtecao={handleRemoveProtecaoArbitragem}
            protecaoOddPlaceholder="1.95"
            protecaoValorPlaceholder="R$ 535,00"
            onChangeProtecaoCasa={(id, valor) => updateProtecaoArbitragem(id, 'casaId', valor)}
            onChangeProtecaoOdd={(id, valor) => updateProtecaoArbitragem(id, 'odd', valor)}
            onChangeProtecaoStake={(id, valor) => updateProtecaoArbitragem(id, 'stake', valor)}
          />
        )}

        {tipoOperacao === 'freebet' && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2">
            
            <div className="flex p-1 bg-[#18181b]/80 border border-border/50 rounded-xl w-full max-w-sm mx-auto mb-2">
              <button
                onClick={() => setSubTipoFreebet('missao')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
                  subTipoFreebet === 'missao' ? 'bg-surface text-orange-500 shadow-sm border border-border/50' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Target className="w-3.5 h-3.5" /> Missão (Qualificativa)
              </button>
              <button
                onClick={() => setSubTipoFreebet('conversao')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${
                  subTipoFreebet === 'conversao' ? 'bg-surface text-success shadow-sm border border-border/50' : 'text-gray-400 hover:text-white'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" /> Conversão (Giro)
              </button>
            </div>

            {/* SELETOR CUSTOMIZADO DE FREEBETS */}
            {subTipoFreebet === 'conversao' && (
              <div className="relative z-50 animate-in fade-in">
                <InputSelect 
                  label="Vincular Freebet do Cofre"
                  icon={Ticket}
                  placeholder="Selecione uma freebet..."
                  value={textoInputSelect}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                />

                {/* Dropdown Menu Estilizado */}
                {isDropdownOpen && (
                  <div className="absolute left-0 right-0 top-[105%] mt-1 bg-[#18181b] border border-border rounded-xl shadow-xl overflow-hidden z-50">
                    <div 
                      className="px-4 py-3 text-sm text-gray-400 hover:bg-white/5 cursor-pointer border-b border-border/50"
                      onClick={() => handleSelecionarFreebet('nova')}
                    >
                      Nova Freebet (Preencher Manualmente)
                    </div>
                    {freebetsPendentes.map(fb => (
                      <div 
                        key={fb.id}
                        className="px-4 py-3 text-sm font-bold text-success hover:bg-white/5 cursor-pointer"
                        onClick={() => handleSelecionarFreebet(fb.id)}
                      >
                        {fb.casaAposta?.nome} - R$ {fb.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <SecaoOperacao 
              eventoNome={eventoFreebet}
              onChangeEvento={setEventoFreebet}
              eventoPlaceholder="ex: Arsenal x Chelsea"
              
              mainTitulo={subTipoFreebet === 'missao' ? 'Entrada Qualificativa' : 'Entrada Freebet'}
              mainIcon={subTipoFreebet === 'missao' ? Target : RefreshCw}
              mainTema="orange"
              mainOddPlaceholder={subTipoFreebet === 'missao' ? "1.80" : "4.50"}
              mainValorLabel={subTipoFreebet === 'missao' ? "Custo (R$)" : "Valor Freebet (R$)"}
              mainValorPlaceholder="R$ 50,00"
              
              mainCasaId={mainCasaId}
              mainOdd={mainOdd}
              onChangeMainOdd={setMainOdd}
              mainStake={mainStake}
              
              // ==========================================
              // TRAVAS DE SEGURANÇA (BLOQUEIO DE VALORES)
              // ==========================================
              onChangeMainCasa={(valor) => {
                if (subTipoFreebet === 'conversao' && freebetSelecionada !== 'nova') return; // Bloqueia a edição
                setMainCasaId(valor);
              }}
              onChangeMainStake={(valor) => {
                if (subTipoFreebet === 'conversao' && freebetSelecionada !== 'nova') return; // Bloqueia a edição
                setMainStake(valor);
              }}

              protecoes={protecoesFreebet}
              onAddProtecao={handleAddProtecaoFreebet}
              onRemoveProtecao={handleRemoveProtecaoFreebet}
              protecaoOddPlaceholder="1.45"
              protecaoValorPlaceholder="R$ 130,00"
              onChangeProtecaoCasa={(id, valor) => updateProtecaoFreebet(id, 'casaId', valor)}
              onChangeProtecaoOdd={(id, valor) => updateProtecaoFreebet(id, 'odd', valor)}
              onChangeProtecaoStake={(id, valor) => updateProtecaoFreebet(id, 'stake', valor)}
              
              childrenPrincipal={
                <>
                  {subTipoFreebet === 'missao' && (
                    <div className="mt-1 border-t border-orange-500/20 pt-4">
                      <div className="flex flex-col gap-2 relative">
                        <label className="text-xs font-medium text-orange-500 flex items-center gap-1">
                          <Target className="w-3 h-3" /> Recompensa Esperada (Valor da Freebet)
                        </label>
                        <input 
                          type="text"
                          inputMode="decimal"
                          placeholder="R$ 50,00"
                          value={valorFreebetEsperada}
                          onChange={(e) => setValorFreebetEsperada(e.target.value)}
                          className="w-full py-2 px-3 text-sm font-mono font-bold text-white bg-black/50 border border-orange-500/30 rounded-lg outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>
                  )}

                  {subTipoFreebet === 'conversao' && (
                    <div className="mt-1 border-t border-success/20 pt-4 animate-in fade-in">
                      <div className="flex flex-col gap-2 relative">
                        <label className="text-xs font-medium text-success flex items-center gap-1">
                          <Percent className="w-3 h-3" /> Retenção Estimada (Tempo Real)
                        </label>
                        <input 
                          type="text"
                          readOnly
                          placeholder="0,00%"
                          value={retencao ? `${retencao}%` : ''}
                          className="w-full py-2 px-3 text-sm font-mono font-bold text-success bg-success/10 border border-success/30 rounded-lg outline-none cursor-not-allowed transition-all"
                        />
                      </div>
                    </div>
                  )}
                </>
              }
            />
          </div>
        )}

        {/* ABA: LANÇAR LUCRO DIRETO */}
        {tipoOperacao === 'lucro' && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2">
            <NameInput 
              label="Origem da Operação" 
              icon={Target}
              placeholder="ex: Roleta Betano, Aposta com Amigos..." 
              value={eventoArbitragem} // Reutilizamos o state para economizar código
              onChange={(e) => setEventoArbitragem(e.target.value)}
            />
            <SecaoLucro valor={valorLucro} onChangeValor={setValorLucro} />
          </div>
        )}

      </div>

      <div className="flex justify-end mt-2">
        <button 
          onClick={handleRegistrar}
          className="flex items-center gap-2 px-8 py-3 text-sm font-bold text-background bg-brand rounded-xl hover:bg-brand/90 transition-colors shadow-[0_0_15px_rgba(var(--brand),0.3)]"
        >
          <Save className="w-5 h-5" /> Registrar Operação
        </button>
      </div>
    </div>
  );
}