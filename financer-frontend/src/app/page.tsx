import { FiltroData } from "@/components/ui/FiltroData";
import { 
  TrendingUp, TrendingDown, Wallet, LineChart, 
  Search, ChevronDown, Activity, ArrowUpRight 
} from 'lucide-react';
import { BarraCategoria } from "@/components/dashboard/BarraCategoria";
import { CardsResumo } from "@/components/dashboard/CardsResumo";
import { GraficoCrescimento } from "@/components/dashboard/GraficoCrescimento";
import { ChartCat } from "@/components/financer/ChartCat";

// === DADOS FALSOS (Mock) PARA OS GRÁFICOS ===
const dadosEntradas = [
  { categoria: 'Operações', valor: 'R$ 1.500', percentual: 60, cor: 'text-brand' },
  { categoria: 'Bricks', valor: 'R$ 750', percentual: 30, cor: 'text-success' },
  { categoria: 'Bolsa', valor: 'R$ 250', percentual: 10, cor: 'text-blue-400' },
];

export default function Dashboard() {
  return (
    <div className="flex flex-col p-4 md:p-6 gap-6 max-w-350 mx-auto">
      
      {/* 1. CABEÇALHO E FILTROS AVANÇADOS */}
      <div className="p-5 border bg-surface/50 border-border rounded-xl flex-row flex gap-120">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-brand">Filtros Avançados</h2>
          </div>
          
            <div className="flex flex-col gap-5 md:flex-row">
              {/* Input de Busca Falso */}
              <div className="flex items-center gap-2 px-4 py-2.5 border rounded-lg bg-[#18181b] border-border md:w-64">
                <Search className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-500">Nome da conta...</span>
              </div>
              
              <FiltroData />

              {/* Dropdown Falso para Casas/Categorias */}
              <div className="flex items-center justify-between gap-4 px-4 py-2.5 border rounded-lg bg-[#18181b] border-border min-w-[200px]">
                <span className="text-sm text-gray-400">Todas as contas</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>

            <button className="text-sm text-gray-500 transition-colors hover:text-gray-300">
              Limpar Filtros
            </button>
          </div>
        </div>

      </div>

      {/* 2. OS "BIG NUMBERS" (4 Cards) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        
        <CardsResumo 
          titulo="Lucro Líquido"
          valor="+ R$ 3.240,00"
          descricao="Entradas - Saídas"
          icon={LineChart}
          corTexto="text-success"
          corHover="hover:border-success/30"
        />

        <CardsResumo 
          titulo="Entradas Brutas"
          valor="R$ 5.890,50"
          descricao="89 operações concluídas"
          icon={TrendingUp}
          corTexto="text-white" // O texto é branco, mas o hover e ícone podem ser brand!
          corHover="hover:border-brand/30"
        />

        <CardsResumo 
          titulo="Saídas Totais"
          valor="- R$ 2.650,50"
          descricao="Custo de vida + Operacional"
          icon={TrendingDown}
          corTexto="text-danger"
          corHover="hover:border-danger/30"
        />

        <CardsResumo 
          titulo="Aportes do Mês"
          valor="R$ 500,00"
          descricao="Travado em Reserva Fixa"
          icon={Wallet}
          corTexto="text-blue-400"
          corHover="hover:border-blue-400/30"
        />


      </div>

      {/* ÁREA INFERIOR: GRÁFICOS */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* 3. GRÁFICO DE CRESCIMENTO */}
        <GraficoCrescimento />

        {/* 4. RAIO-X DAS ENTRADAS (Ocupa 1/3 da tela) */}
        <div className="col-span-1 p-5 border bg-surface/40 border-border/80 rounded-xl">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-4 h-4 text-gray-400" />
            <h3 className="font-medium text-white">Raio-X das Entradas</h3>
          </div>

          <ChartCat 
                titulo="Entradas" 
                valorTotal="R$ 2.500" 
                dados={dadosEntradas} 
          />
          
          <div className="flex flex-col gap-5">
            <BarraCategoria 
              titulo="Operações" 
              valor="R$ 2.450,00" 
              porcentagem="60%" 
              corTexto="text-brand" 
              corBarra="bg-brand" 
            />
            <BarraCategoria 
              titulo="Lucro de Vendas" 
              valor="R$ 1.800,00" 
              porcentagem="30%" 
              corTexto="text-success" 
              corBarra="bg-success" 
            />
            <BarraCategoria 
              titulo="Salário / Bolsa" 
              valor="R$ 1.640,50" 
              porcentagem="25%" 
              corTexto="text-blue-400" 
              corBarra="bg-blue-400" 
            />

            <button className="flex items-center justify-center w-full gap-2 py-3 mt-4 text-sm transition-colors border border-dashed rounded-lg text-gray-400 border-border hover:border-brand hover:text-brand">
              <span>Ver relatório completo</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}