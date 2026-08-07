import { CardTransacao } from "@/components/financer/CardTransacao";
import { Filters } from "@/components/financer/filters";
import { ChartCat } from "@/components/financer/ChartCat";
import { Activity, TrendingUp, TrendingDown } from 'lucide-react';

// === DADOS FALSOS (Mock) PARA OS GRÁFICOS ===
const dadosEntradas = [
  { categoria: 'Operações', valor: 'R$ 1.500', percentual: 60, cor: 'text-brand' },
  { categoria: 'Bricks', valor: 'R$ 750', percentual: 30, cor: 'text-success' },
  { categoria: 'Bolsa', valor: 'R$ 250', percentual: 10, cor: 'text-blue-400' },
];

const dadosSaidas = [
  { categoria: 'Lazer', valor: 'R$ 350', percentual: 50, cor: 'text-danger' },
  { categoria: 'Alimentação', valor: 'R$ 210', percentual: 30, cor: 'text-orange-400' },
  { categoria: 'Operacional', valor: 'R$ 140', percentual: 20, cor: 'text-purple-400' },
];

// === DADOS FALSOS PARA O FEED ===
const transacoes = [
  { id: 1, tipo: 'entrada', titulo: 'Venda PS Vita (OLX)', valor: 'R$ 950,00', categoria: 'Lucro de Bricks', data: 'Hoje, 14:30' },
  { id: 2, tipo: 'saida', titulo: 'Analógico 3DS (Aliexpress)', valor: 'R$ 45,00', categoria: 'Custo Operacional', data: 'Ontem, 09:15' },
  { id: 3, tipo: 'entrada', titulo: 'Bolsa USP', valor: 'R$ 700,00', categoria: 'Salário/Bolsa', data: '05 de Ago' },
  { id: 4, tipo: 'entrada', titulo: 'Green (Duplo PA)', valor: 'R$ 120,00', categoria: 'Operações', data: '04 de Ago' },
  { id: 5, tipo: 'saida', titulo: 'Ifood (Lanche)', valor: 'R$ 38,50', categoria: 'Alimentação', data: '02 de Ago' },
] as const;

export default function VisaoGeralFinanceiro() {
  const entradas = transacoes.filter(t => t.tipo === 'entrada');
  const saidas = transacoes.filter(t => t.tipo === 'saida');

  return (
    <div className="flex flex-col p-4 md:p-6 gap-6 max-w-[1400px] mx-auto pb-24">
      
      {/* 1. BLOCO FLUTUANTE: CABEÇALHO ANALÍTICO (Agora com 2 gráficos) */}
      <div className="flex flex-col gap-8 p-6 border bg-surface/40 border-border/80 rounded-xl lg:flex-row lg:items-center">
        
        {/* GRÁFICOS (Esquerda) */}
        <div className="flex justify-center gap-8 lg:w-1/2 lg:border-r lg:border-border/50 lg:pr-8">
          
          <ChartCat 
            titulo="Saídas" 
            valorTotal="R$ 700" 
            dados={dadosSaidas} 
          />
        </div>

        {/* ORÇAMENTO DO MÊS (Direita) */}
        <div className="flex flex-col justify-center flex-1 w-full gap-4 lg:pl-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Orçamento do Mês</h2>
            <span className="text-sm font-medium text-gray-400">Restam R$ 616,50</span>
          </div>
          
          <div>
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-danger">Gasto: R$ 83,50</span>
              <span className="text-gray-500">Teto: R$ 700,00</span>
            </div>
            <div className="w-full h-3 overflow-hidden rounded-full bg-background border border-border/50">
              <div className="h-full rounded-full bg-danger w-[12%] transition-all duration-1000"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. BLOCO FLUTUANTE: FILTROS */}
      <Filters />

      {/* 3. BLOCO FLUTUANTE: FEED DE TRANSAÇÕES DIVIDIDO */}
      <div className="flex flex-col p-5 border bg-surface/40 border-border/80 rounded-xl">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-4 h-4 text-gray-400" />
          <h3 className="font-medium text-white">Histórico Recente</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="flex flex-col gap-3">
            <h4 className="flex items-center gap-2 mb-2 text-sm font-medium text-success">
              <TrendingUp className="w-4 h-4" /> Entradas
            </h4>
            {entradas.map((transacao) => (
              <CardTransacao key={transacao.id} {...transacao} />
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="flex items-center gap-2 mb-2 text-sm font-medium text-danger">
              <TrendingDown className="w-4 h-4" /> Saídas
            </h4>
            {saidas.map((transacao) => (
              <CardTransacao key={transacao.id} {...transacao} />
            ))}
          </div>

        </div>
      </div>

    </div>
  );
}