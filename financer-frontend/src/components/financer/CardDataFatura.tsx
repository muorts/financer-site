interface CardDataFaturaProps {
  tipo: 'fechamento' | 'vencimento';
  data: string;
  descricaoTempo: string; // ex: "Em 27 dias" ou "Sempre dia 10"
}

export function CardDataFatura({ tipo, data, descricaoTempo }: CardDataFaturaProps) {
  const isVencimento = tipo === 'vencimento';

  return (
    <div className="flex flex-col p-4 border rounded-xl bg-surface/50 border-border/50">
      <span className="text-xs text-gray-500 mb-1">
        {isVencimento ? 'Vencimento' : 'Fechamento'}
      </span>
      <span className={`font-medium ${isVencimento ? 'text-danger' : 'text-white'}`}>
        {data}
      </span>
      <span className="text-xs text-gray-400 mt-1">
        {descricaoTempo}
      </span>
    </div>
  );
}