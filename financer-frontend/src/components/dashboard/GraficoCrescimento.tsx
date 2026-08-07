export function GraficoCrescimento() {
  return (
    // Ocupa 2 colunas no desktop (col-span-1 lg:col-span-2)
    <div className="flex flex-col col-span-1 p-5 border lg:col-span-2 bg-surface/40 border-border/80 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-medium text-brand">Crescimento de Saldo</h3>
        <div className="flex gap-4">
          <span className="flex items-center gap-2 text-xs text-gray-400">
            <div className="w-2 h-2 rounded-full bg-brand"></div> Patrimônio Total
          </span>
          <span className="flex items-center gap-2 text-xs text-gray-400">
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div> Capital Líquido
          </span>
        </div>
      </div>
      
      {/* MOCKUP VISUAL DO GRÁFICO */}
      <div className="relative flex-1 w-full min-h-[250px] border-b border-border/50 flex items-end">
        <div 
          className="absolute inset-0 border-t-2 bg-gradient-to-b from-brand/20 to-transparent border-brand" 
          style={{ clipPath: 'polygon(0 40%, 25% 35%, 50% 15%, 75% 20%, 100% 5%, 100% 100%, 0% 100%)' }}
        />
        <div 
          className="absolute inset-0 border-t-2 bg-gradient-to-b from-gray-500/10 to-transparent border-gray-600/50" 
          style={{ clipPath: 'polygon(0 60%, 25% 55%, 50% 45%, 75% 50%, 100% 30%, 100% 100%, 0% 100%)' }}
        />
        
        {/* Linhas de grade horizontais falsas */}
        <div className="absolute top-0 w-full border-t border-dashed border-border/30"></div>
        <div className="absolute top-1/3 w-full border-t border-dashed border-border/30"></div>
        <div className="absolute top-2/3 w-full border-t border-dashed border-border/30"></div>
      </div>
      
      <div className="flex justify-between w-full mt-3 text-xs text-gray-500">
        <span>01/Ago</span>
        <span>10/Ago</span>
        <span>20/Ago</span>
        <span>Hoje</span>
      </div>
    </div>
  );
}