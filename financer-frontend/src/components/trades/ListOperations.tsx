import { useState } from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { TradeDetalhado, ModalDetalhesOperacao } from './OperationDetails';

interface ListaOperacoesAtivasProps {
  trades: TradeDetalhado[];
}

export function ListaOperacoesAtivas({ trades }: ListaOperacoesAtivasProps) {
  const [tradeSelecionado, setTradeSelecionado] = useState<TradeDetalhado | null>(null);

  // Essa função vai ser passada para o onSave do seu ModalDetalhesOperacao
  const handleSalvarEdicao = async (tradeId: string, novasEntradas: any[]) => {
    try {
      // TRAVA DE SEGURANÇA NO FRONTEND
      const temCasaVazia = novasEntradas.some(ent => !ent.casaAposta || !ent.casaAposta.id);
      if (temCasaVazia) {
        alert("Atenção: Selecione a Casa de Aposta em todas as proteções antes de salvar.");
        return; 
      }

      const payloadLimpo = novasEntradas.map(ent => ({
        id: String(ent.id).startsWith('temp-') ? null : ent.id,
        odd: typeof ent.odd === 'string' ? parseFloat(ent.odd.toString().replace(',', '.')) : ent.odd,
        stake: typeof ent.stake === 'string' ? parseFloat(ent.stake.toString().replace(',', '.')) : ent.stake,
        casaAposta: ent.casaAposta // O FIO QUE FALTAVA LIGAR!
      }));

      const resposta = await fetch(`http://localhost:8080/api/trades/${tradeId}/entradas`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadLimpo)
      });

      if (resposta.ok) {
        window.location.reload(); 
      } else {
        const erroMsg = await resposta.text();
        alert("O Java recusou a edição: " + erroMsg);
      }
    } catch (erro) {
      alert("Erro de conexão com o backend!");
      console.error(erro);
    }
  };

  // === NOVA LÓGICA DE RESOLUÇÃO AQUI ===
  const handleResolverTrade = async (tradeId: string, valorRecebido: number, lucroLiquido: number) => {
    try {
      // Dispara a requisição para o nosso backend Java
      const resposta = await fetch(`http://localhost:8080/api/trades/${tradeId}/resolver`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // O DTO do Java espera receber exatamente a variável "valorRecebido"
        body: JSON.stringify({ valorRecebido }) 
      });

      if (resposta.ok) {
        // Sucesso! O Java já subtraiu o investimento, calculou o lucro e mudou o status para FINALIZADO.
        setTradeSelecionado(null); // Fecha o modal
        
        // Recarrega a página para a operação sumir da lista de "Em andamento"
        // (No futuro podemos usar o estado do React, mas isso fecha o ciclo perfeitamente agora)
        window.location.reload(); 
      } else {
        console.error("Falha ao registrar a baixa no servidor.");
      }
    } catch (erro) {
      console.error("Erro de conexão com a API:", erro);
    }
  };

  return (
    <>
      <div className="flex flex-col p-6 border bg-surface/40 border-border/80 rounded-2xl shadow-sm mt-2">
        <h2 className="text-sm font-medium tracking-wider uppercase text-gray-400 mb-4 flex items-center gap-2">
          <ArrowRightLeft className="w-4 h-4" />
          Operações em Andamento ({trades.length})
        </h2>
        
        {trades.length === 0 ? (
          <div className="p-6 text-center border rounded-xl bg-[#18181b]/30 border-border/50">
            <p className="text-sm text-gray-500">Nenhuma operação em andamento no momento.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {trades.map(trade => {
              const isLucro = trade.lucro >= 0;
              const corValor = isLucro ? 'text-success' : 'text-danger';
              const sinal = trade.lucro > 0 ? '+' : '';

              // Calcula o número de casas envolvidas olhando as entradas
              const casasNomes = Array.from(new Set(trade.entradas.map(e => e.casa))).join(' / ');

              return (
                <div 
                  key={trade.id} 
                  onClick={() => setTradeSelecionado(trade)}
                  className="flex items-center justify-between p-4 border rounded-xl bg-[#18181b]/50 border-border/50 hover:bg-[#18181b] hover:border-gray-600 transition-colors cursor-pointer group"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-white text-sm group-hover:text-brand transition-colors">{trade.jogo}</span>
                    <span className="text-xs text-gray-400 mt-0.5">
                      {casasNomes} • <span className="text-brand">{trade.mercado}</span>
                    </span>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <span className={`font-mono font-bold ${corValor}`}>
                      {sinal}{trade.lucro.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium">
                      Inv: {trade.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL ATUALIZADO COM A FUNÇÃO ONRESOLVE */}
      <ModalDetalhesOperacao 
        trade={tradeSelecionado}
        isOpen={!!tradeSelecionado}
        onClose={() => setTradeSelecionado(null)}
        onSave={handleSalvarEdicao}
        onResolve={handleResolverTrade} 
      />
    </>
  );
}