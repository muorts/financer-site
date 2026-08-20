interface ModalCamposOddStakeProps {
  odd: number;
  stake: number;
  isEditing: boolean;
  onOddChange: (valor: string) => void;
  onStakeChange: (valor: string) => void;
}

export function ModalCamposOddStake({
  odd,
  stake,
  isEditing,
  onOddChange,
  onStakeChange
}: ModalCamposOddStakeProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mt-3">
      
      {/* CAMPO ODD */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Odd Atual</label>
        {isEditing ? (
          <input 
            type="number" 
            step="0.01"
            value={odd}
            onChange={(e) => onOddChange(e.target.value)}
            className="w-full py-1.5 px-3 text-sm font-mono text-white bg-black border border-border rounded-lg outline-none focus:border-brand transition-colors"
          />
        ) : (
          <span className="font-mono text-sm text-white">{odd.toFixed(2)}</span>
        )}
      </div>

      {/* CAMPO STAKE */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Stake (Valor)</label>
        {isEditing ? (
          <input 
            type="number" 
            value={stake}
            onChange={(e) => onStakeChange(e.target.value)}
            className="w-full py-1.5 px-3 text-sm font-mono text-white bg-black border border-border rounded-lg outline-none focus:border-brand transition-colors"
          />
        ) : (
          <span className="font-mono text-sm text-white">
            {stake.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
        )}
      </div>

    </div>
  );
}