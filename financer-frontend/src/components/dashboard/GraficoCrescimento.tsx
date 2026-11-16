import { formatarBRL } from "@/lib/util";

export interface PontoEvolucaoDTO {
  label: string;
  patrimonioTotal: number;
  capitalLiquido: number;
}

interface GraficoCrescimentoProps {
  dados?: PontoEvolucaoDTO[];
}

export function GraficoCrescimento({ dados = [] }: GraficoCrescimentoProps) {
  const pontos = dados.length >= 2 ? dados : [
    { label: '01', patrimonioTotal: 0, capitalLiquido: 0 },
    { label: '10', patrimonioTotal: 0, capitalLiquido: 0 },
    { label: '20', patrimonioTotal: 0, capitalLiquido: 0 },
    { label: 'Fim', patrimonioTotal: 0, capitalLiquido: 0 },
  ];

  const valores = pontos.flatMap((p) => [p.patrimonioTotal, p.capitalLiquido]);
  const maxVal = Math.max(...valores, 100);
  const minVal = Math.min(...valores, 0);
  const amplitude = Math.max(maxVal - minVal, 1);

  // Calcula a porcentagem Y (10% topo até 90% base) para desenhar o polygon dinâmico
  const getY = (val: number) => {
    const norm = (val - minVal) / amplitude;
    return Math.round(90 - norm * 75);
  };

  const montarClipPath = (chave: 'patrimonioTotal' | 'capitalLiquido') => {
    const coords = pontos.map((p, idx) => {
      const x = Math.round((idx / (pontos.length - 1)) * 100);
      const y = getY(p[chave]);
      return `${x}% ${y}%`;
    });
    return `polygon(${coords.join(', ')}, 100% 100%, 0% 100%)`;
  };

  const ultimoPonto = pontos[pontos.length - 1];

  return (
    <div className="flex flex-col col-span-1 p-5 border lg:col-span-2 bg-surface/40 border-border/80 rounded-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="font-medium text-brand">Crescimento de Saldo</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Patrimônio Atual: <strong className="text-white font-mono">{formatarBRL(ultimoPonto?.patrimonioTotal || 0)}</strong>
          </p>
        </div>
        <div className="flex gap-4">
          <span className="flex items-center gap-2 text-xs text-gray-400">
            <div className="w-2 h-2 rounded-full bg-brand"></div> Patrimônio Total
          </span>
          <span className="flex items-center gap-2 text-xs text-gray-400">
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div> Capital Líquido (Giro)
          </span>
        </div>
      </div>
      
      {/* GRÁFICO DINÂMICO DE EVOLUÇÃO */}
      <div className="relative flex-1 w-full min-h-[250px] border-b border-border/50 flex items-end">
        <div 
          className="absolute inset-0 border-t-2 bg-gradient-to-b from-brand/20 to-transparent border-brand transition-all duration-700" 
          style={{ clipPath: montarClipPath('patrimonioTotal') }}
        />
        <div 
          className="absolute inset-0 border-t-2 bg-gradient-to-b from-gray-500/10 to-transparent border-gray-600/50 transition-all duration-700" 
          style={{ clipPath: montarClipPath('capitalLiquido') }}
        />
        
        {/* Linhas de grade horizontais */}
        <div className="absolute top-0 w-full border-t border-dashed border-border/30"></div>
        <div className="absolute top-1/3 w-full border-t border-dashed border-border/30"></div>
        <div className="absolute top-2/3 w-full border-t border-dashed border-border/30"></div>
      </div>
      
      <div className="flex justify-between w-full mt-3 text-xs text-gray-500 font-mono">
        {pontos.map((p) => (
          <span key={p.label}>{p.label}</span>
        ))}
      </div>
    </div>
  );
}
