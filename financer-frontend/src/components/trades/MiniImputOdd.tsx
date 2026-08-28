interface InputCotacaoValorProps {
  oddLabel?: string;
  oddPlaceholder?: string;
  valorLabel?: string;
  valorPlaceholder?: string;
  tema?: 'brand' | 'orange' | 'gray' | 'success';
  
  // ==========================================
  // FIOS DE CONEXÃO (Para enviar dados para cima)
  // ==========================================
  oddValue?: string;
  onChangeOdd?: (valor: string) => void;
  stakeValue?: string;
  onChangeStake?: (valor: string) => void;
}

export function InputCotacaoValor({
  oddLabel = "Odd (Cotação)",
  oddPlaceholder = "2.00",
  valorLabel = "Valor (Stake)",
  valorPlaceholder = "0,00",
  tema = "brand",
  oddValue,
  onChangeOdd,
  stakeValue,
  onChangeStake
}: InputCotacaoValorProps) {
  
  // Define a cor da borda quando o usuário clica no input
  const corFoco = {
    brand: "focus:border-brand",
    orange: "focus:border-orange-500",
    gray: "focus:border-gray-400",
    success: "focus:border-success",
  }[tema];

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-gray-400">{oddLabel}</label>
        <input 
          type="number" 
          step="0.01" 
          placeholder={oddPlaceholder}
          value={oddValue || ''}
          onChange={(e) => onChangeOdd && onChangeOdd(e.target.value)}
          className={`w-full py-2 px-3 text-sm font-mono text-white border rounded-lg bg-[#18181b] border-border outline-none transition-colors ${corFoco}`} 
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-gray-400">{valorLabel}</label>
        <input 
          type="number"
          step="0.01" 
          placeholder={valorPlaceholder}
          value={stakeValue || ''}
          onChange={(e) => onChangeStake && onChangeStake(e.target.value)}
          className={`w-full py-2 px-3 text-sm font-mono text-white border rounded-lg bg-[#18181b] border-border outline-none transition-colors ${corFoco}`} 
        />
      </div>
    </div>
  );
}