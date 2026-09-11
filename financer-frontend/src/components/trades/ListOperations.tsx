import { useState } from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { TradeDetalhado, ModalDetalhesOperacao } from './OperationDetails';
import { FiltroOperacoes, TipoFiltro } from './FiltersOperation';
import { CardOperacaoAtiva } from './CardOperation';

interface ListaOperacoesAtivasProps {
  trades: TradeDetalhado[];
}

export function ListaOperacoesAtivas({ trades }: ListaOperacoesAtivasProps) {
  const [tradeSelecionado, setTradeSelecionado] = useState<TradeDetalhado | null>(null);
  const [filtroAtivo, setFiltroAtivo] = useState<TipoFiltro>('todos');

  const handleSalvarEdicao = async (tradeId: string, novasEntradas: any[]) => {
    try {
      const temCasaVazia = novasEntradas.some(ent => !ent.casaAposta || !ent.casaAposta.id);
      if (temCasaVazia) {
        alert("Atenção: Selecione a Casa de Aposta em todas as proteções antes de salvar.");
        return; 
      }

      const payloadLimpo = novasEntradas.map(ent => ({
        id: String(ent.id).startsWith('temp-') ? null : ent.id,
        odd: typeof ent.odd === 'string' ? parseFloat(ent.odd.toString().replace(',', '.')) : ent.odd,
        stake: typeof ent.stake === 'string' ? parseFloat(ent.stake.toString().replace(',', '.')) : ent.stake,
        casaAposta: ent.casaAposta 
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
    }
  };

  const handleResolverTrade = async (tradeId: string, valorRecebido: number) => {
    try {
      const resposta = await fetch(`http://localhost:8080/api/trades/${tradeId}/resolver`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ valorRecebido }) 
      });

      if (resposta.ok) {
        setTradeSelecionado(null); 
        window.location.reload(); 
      } else {
        console.error("Falha ao registrar a baixa no servidor.");
      }
    } catch (erro) {
      console.error("Erro de conexão com a API:", erro);
    }
  };

  const handleExcluirRapido = async (tradeId: string, e: React.MouseEvent) => {
    e.stopPropagation(); 
    
    const confirmacao = window.confirm("ATENÇÃO: Deseja excluir esta operação permanentemente?");
    if (!confirmacao) return;

    try {
      const res = await fetch(`http://localhost:8080/api/trades/${tradeId}`, { method: 'DELETE' });

      if (res.ok) {
        window.location.reload(); 
      } else {
        const erroMsg = await res.text();
        alert("Erro ao excluir do banco de dados:\n" + erroMsg);
      }
    } catch (error) {
      alert("Erro fatal de conexão ao tentar excluir.");
    }
  };

  const tradesFiltrados = trades.filter(trade => {
    const mercado = trade.mercado.toLowerCase();
    if (filtroAtivo === 'todos') return true;
    if (filtroAtivo === 'arbitragem') return mercado.includes('arbitragem');
    if (filtroAtivo === 'missao') return mercado.includes('missao');
    if (filtroAtivo === 'conversao') return mercado.includes('conversao');
    return true;
  });

  return (
    <>
      <div className="flex flex-col p-6 border bg-surface/40 border-border/80 rounded-2xl shadow-sm mt-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium tracking-wider uppercase text-gray-400 flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4" />
            Em Andamento ({tradesFiltrados.length})
          </h2>
          
          <FiltroOperacoes 
            filtroAtivo={filtroAtivo} 
            onChangeFiltro={setFiltroAtivo} 
          />
        </div>
        
        {tradesFiltrados.length === 0 ? (
          <div className="p-6 text-center border rounded-xl bg-[#18181b]/30 border-border/50">
            <p className="text-sm text-gray-500">Nenhuma operação encontrada para este filtro.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {tradesFiltrados.map(trade => (
              <CardOperacaoAtiva 
                key={trade.id}
                trade={trade}
                onClick={() => setTradeSelecionado(trade)}
                onDelete={handleExcluirRapido}
              />
            ))}
          </div>
        )}
      </div>

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