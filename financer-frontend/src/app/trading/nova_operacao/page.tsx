"use client";

import { useState } from 'react';
import { Swords, Target, RefreshCw, Save, Percent } from 'lucide-react';

import { CabecalhoPagina } from '@/components/ui/Header';
import { NameInput } from '@/components/ui/NameInput';
import { SeletorTipoOperacao, TipoOperacao } from '@/components/trades/Operationtype';
import { SecaoOperacao } from '@/components/trades/OperationSecao';
import { SecaoLucro } from '@/components/trades/ProfitSec'; 

export default function NovaOperacao() {
  // Controle de Abas
  const [tipoOperacao, setTipoOperacao] = useState<TipoOperacao>('arbitragem');
  const [subTipoFreebet, setSubTipoFreebet] = useState<'missao' | 'conversao'>('missao');

  // Controle de Textos e Valores
  const [eventoArbitragem, setEventoArbitragem] = useState('');
  const [eventoFreebet, setEventoFreebet] = useState('');
  const [retencao, setRetencao] = useState('');
  const [valorLucro, setValorLucro] = useState(''); // <-- Estado para o Lançar Lucro

  // Controle de Proteções Dinâmicas
  const [protecoesArbitragem, setProtecoesArbitragem] = useState([{ id: Date.now() }]);
  const [protecoesFreebet, setProtecoesFreebet] = useState([{ id: Date.now() + 1 }]);

  const handleAddProtecaoArbitragem = () => setProtecoesArbitragem([...protecoesArbitragem, { id: Date.now() }]);
  const handleRemoveProtecaoArbitragem = (id: number) => setProtecoesArbitragem(protecoesArbitragem.filter(p => p.id !== id));

  const handleAddProtecaoFreebet = () => setProtecoesFreebet([...protecoesFreebet, { id: Date.now() }]);
  const handleRemoveProtecaoFreebet = (id: number) => setProtecoesFreebet(protecoesFreebet.filter(p => p.id !== id));

  return (
    <div className="flex flex-col p-4 md:p-6 gap-6 max-w-[800px] mx-auto pb-24">
      
      <CabecalhoPagina 
        titulo="Nova Operação" 
        descricao="Registre arbitragens, freebets ou lucros imprevistos."
        caminhoVoltar="/trades" 
      />

      <SeletorTipoOperacao 
        tipoAtual={tipoOperacao}
        onChange={setTipoOperacao}
      />

      <div className="flex flex-col gap-8 p-6 md:p-8 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        
        {/* ABA: ARBITRAGEM E PA */}
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
            
            protecoes={protecoesArbitragem}
            onAddProtecao={handleAddProtecaoArbitragem}
            onRemoveProtecao={handleRemoveProtecaoArbitragem}
            protecaoOddPlaceholder="1.95"
            protecaoValorPlaceholder="R$ 535,00"
          />
        )}

        {/* ABA: FREEBETS */}
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
              
              protecoes={protecoesFreebet}
              onAddProtecao={handleAddProtecaoFreebet}
              onRemoveProtecao={handleRemoveProtecaoFreebet}
              protecaoOddPlaceholder="1.45"
              protecaoValorPlaceholder="R$ 130,00"
              
              childrenPrincipal={
                subTipoFreebet === 'conversao' && (
                  <div className="mt-1 border-t border-orange-500/20 pt-4">
                    <NameInput 
                      label="Retenção Estimada (%)" 
                      icon={Percent}
                      placeholder="ex: 75" 
                      value={retencao}
                      onChange={(e) => setRetencao(e.target.value)}
                    />
                  </div>
                )
              }
            />
          </div>
        )}

        {/* ABA: LANÇAR LUCRO DIRETO */}
        {tipoOperacao === 'lucro' && (
          <SecaoLucro valor={valorLucro} onChangeValor={setValorLucro} />
        )}

      </div>

      <div className="flex justify-end mt-2">
        <button className="flex items-center gap-2 px-8 py-3 text-sm font-bold text-background bg-brand rounded-xl hover:bg-brand/90 transition-colors shadow-[0_0_15px_rgba(var(--brand),0.3)]">
          <Save className="w-5 h-5" /> Registrar Operação
        </button>
      </div>

    </div>
  );
}