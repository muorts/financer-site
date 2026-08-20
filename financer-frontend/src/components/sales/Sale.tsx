import { CheckCircle2 } from 'lucide-react';

interface ItemVendaProps {
  venda: {
    id: string;
    nome: string;
    data: string;
    plataforma: string;
    valorVenda: number;
    custoTotal: number;
  };
}

export function ItemVenda({ venda }: ItemVendaProps) {
  const lucroLiquido = venda.valorVenda - venda.custoTotal;
  const roiPercentual = ((lucroLiquido / venda.custoTotal) * 100).toFixed(1);
  
  // Tratamento seguro da data (Evita fuso horário adiantando/atrasando 1 dia)
  const [ano, mes, dia] = venda.data.split('-');
  const dataFormatada = `${dia}/${mes}/${ano}`;

  return (
    <div className="flex flex-col gap-4 p-5 transition-colors md:flex-row md:items-center justify-between hover:bg-[#18181b]/40">
      
      {/* Esquerda: Nome e Detalhes */}
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center shrink-0 w-10 h-10 border rounded-xl bg-surface text-success border-border">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-white text-md">{venda.nome}</span>
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
            <span>{dataFormatada}</span>
            <span>•</span>
            <span className="px-2 py-0.5 rounded-md bg-surface border border-border text-gray-300">
              {venda.plataforma}
            </span>
          </div>
        </div>
      </div>

      {/* Direita: Lucro e ROI */}
      <div className="flex items-center justify-between pt-3 border-t md:justify-end gap-6 md:pt-0 md:border-t-0 border-border/50">
        <div className="flex flex-col items-start md:items-end">
          <span className="text-xs text-gray-500">Lucro Líquido</span>
          <span className="font-mono font-bold text-success">
            +{lucroLiquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-xs text-gray-500">ROI</span>
          <span className="px-2.5 py-1 font-mono font-bold text-white border rounded-lg bg-surface border-border">
            {roiPercentual}%
          </span>
        </div>
      </div>

    </div>
  );
}