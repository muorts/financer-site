"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Calendar, Tag, TrendingUp, 
  DollarSign, CheckCircle2, Layers 
} from 'lucide-react';

// Importação dos nossos novos componentes
import { CardsResumo } from '@/components/dashboard/CardsResumo';
import { ItemVenda } from '@/components/sales/Sale';

const VENDAS_INICIAIS = [
  { id: '1', nome: 'PS Vita Slim Desbloqueado', data: '2026-08-05', plataforma: 'OLX', valorVenda: 850.00, custoTotal: 450.00 },
  { id: '2', nome: 'Nintendo 3DS XL + Luma3DS', data: '2026-07-20', plataforma: 'Mercado Livre', valorVenda: 650.00, custoTotal: 330.00 },
  { id: '3', nome: 'Placa de Vídeo RTX 3060', data: '2026-08-11', plataforma: 'OLX', valorVenda: 1400.00, custoTotal: 1000.00 },
  { id: '4', nome: 'Controle DualSense Branco', data: '2026-06-15', plataforma: 'Facebook', valorVenda: 300.00, custoTotal: 180.00 }
];

export default function VendasConcluidas() {
  const [filtroPlataforma, setFiltroPlataforma] = useState('todas');
  const [filtroPeriodo, setFiltroPeriodo] = useState('mes_atual');

  // Lógica de Filtragem Reativa (IMUNE A ERRO DE HIDRATAÇÃO / FUSO HORÁRIO)
  const vendasFiltradas = useMemo(() => {
    return VENDAS_INICIAIS.filter(venda => {
      if (filtroPlataforma !== 'todas' && venda.plataforma !== filtroPlataforma) return false;

      // Dividimos a string pura ('2026-08-05' -> ano='2026', mes='08', dia='05')
      const [ano, mes] = venda.data.split('-');
      const mesAtual = '08'; // Agosto
      const anoAtual = '2026';

      if (filtroPeriodo === 'mes_atual') {
        // Agora comparamos as strings exatas, sem o navegador subtrair 3 horas do fuso!
        if (mes !== mesAtual || ano !== anoAtual) {
          return false;
        }
      } else if (filtroPeriodo === 'ultimos_30') {
        // Comparação de string YYYY-MM-DD funciona perfeitamente matematicamente
        if (venda.data < '2026-07-14') {
          return false;
        }
      }

      return true;
    });
  }, [filtroPlataforma, filtroPeriodo]);

  // Cálculos Automáticos
  const { valorBruto, valorLiquido, roiMedio } = useMemo(() => {
    let bruto = 0;
    let liquido = 0;
    let somaRoi = 0;

    vendasFiltradas.forEach(v => {
      const lucro = v.valorVenda - v.custoTotal;
      bruto += v.valorVenda;
      liquido += lucro;
      somaRoi += (lucro / v.custoTotal) * 100;
    });

    const roiFinal = vendasFiltradas.length > 0 ? (somaRoi / vendasFiltradas.length).toFixed(1) : '0';

    return { valorBruto: bruto, valorLiquido: liquido, roiMedio: roiFinal };
  }, [vendasFiltradas]);

  return (
    <div className="flex flex-col p-4 md:p-6 gap-6 max-w-[800px] mx-auto pb-24">
      
      {/* CABEÇALHO */}
      <div className="flex items-center gap-5 p-5 md:p-6 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        <Link href="/" className="p-3 transition-colors border rounded-xl bg-[#18181b] border-border hover:border-gray-500 text-gray-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white font-sans">Vendas Concluídas</h1>
          <p className="mt-1 text-sm text-gray-400">Histórico de faturamento, lucros líquidos e margens de ROI.</p>
        </div>
      </div>

      {/* BARRA DE FILTROS */}
      <div className="flex flex-col md:flex-row items-center gap-4 p-5 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 w-full md:w-1/2">
          <Calendar className="w-4 h-4 shrink-0 text-gray-400" />
          <select value={filtroPeriodo} onChange={(e) => setFiltroPeriodo(e.target.value)} className="w-full py-2.5 px-3 text-sm text-white transition-colors border rounded-xl bg-[#18181b] border-border focus:border-brand outline-none cursor-pointer appearance-none">
            <option value="todos">Todo o Período</option>
            <option value="mes_atual">Mês Atual (Agosto/2026)</option>
            <option value="ultimos_30">Últimos 30 dias</option>
          </select>
        </div>

        <div className="flex items-center gap-2 w-full md:w-1/2">
          <Tag className="w-4 h-4 shrink-0 text-gray-400" />
          <select value={filtroPlataforma} onChange={(e) => setFiltroPlataforma(e.target.value)} className="w-full py-2.5 px-3 text-sm text-white transition-colors border rounded-xl bg-[#18181b] border-border focus:border-brand outline-none cursor-pointer appearance-none">
            <option value="todas">Todas as Plataformas</option>
            <option value="OLX">OLX</option>
            <option value="Mercado Livre">Mercado Livre</option>
            <option value="Facebook">Facebook</option>
          </select>
        </div>
      </div>

      {/* COMPONENTES DE MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CardsResumo 
          titulo="Faturamento Bruto" 
          valor={valorBruto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} 
          descricao="Total recebido"
          icon={DollarSign} 
          corTexto="text-brand"
          corHover="hover:border-brand/30" // Passando a classe de hover correta
        />
        <CardsResumo 
          titulo="Lucro Líquido Real" 
          valor={valorLiquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} 
          descricao="Já descontando custos"
          icon={TrendingUp} 
          corTexto="text-success" // Corrigido erro de digitação (success)
          corHover="hover:border-success/30" 
        />
        <CardsResumo 
          titulo="ROI Médio da Operação" 
          valor={`${roiMedio}%`}
          descricao="Retorno sobre investimento"
          icon={Layers} 
          corTexto="text-blue-400"
          corHover="hover:border-blue-400/30" 
        />
      </div>

      {/* LISTA DE VENDAS COMPONENTIZADA */}
      <div className="flex flex-col border bg-surface/40 border-border/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-border/50 bg-[#18181b]/30">
          <h2 className="text-sm font-medium tracking-wider uppercase text-gray-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-success" />
            Transações Finalizadas ({vendasFiltradas.length})
          </h2>
        </div>

        <div className="flex flex-col divide-y divide-border/50">
          {vendasFiltradas.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Nenhuma venda encontrada com os filtros selecionados.
            </div>
          ) : (
            vendasFiltradas.map((venda) => (
              <ItemVenda key={venda.id} venda={venda} />
            ))
          )}
        </div>
      </div>

    </div>
  );
}