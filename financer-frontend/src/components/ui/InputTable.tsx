import { InputHTMLAttributes } from 'react';

interface InputTabelaProps extends InputHTMLAttributes<HTMLInputElement> {
  prefixo?: string;
  sufixo?: string;
  isDestaque?: boolean;
  containerClassName?: string; // Para controlar a largura (ex: w-20, w-28)
}

export function InputTabela({ 
  prefixo, 
  sufixo, 
  isDestaque, 
  containerClassName = "w-20", 
  className = "", 
  ...props 
}: InputTabelaProps) {
  
  // Ajusta o padding interno caso tenha R$ ou %
  const pl = prefixo ? "pl-8" : "px-2.5";
  const pr = sufixo ? "pr-6" : "px-2.5";
  
  // Estilo muda drasticamente se for a linha "Fixada"
  const estiloBorda = isDestaque 
    ? "bg-black border-2 border-brand font-bold ring-2 ring-brand/20" 
    : "bg-[#18181b] border border-border hover:border-gray-500 focus:border-brand";

  return (
    <div className={`relative ${containerClassName}`}>
      {prefixo && (
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-500 font-sans">
          {prefixo}
        </span>
      )}
      
      <input
        className={`w-full py-1.5 ${pl} ${pr} font-mono text-sm text-white rounded-lg outline-none transition-all ${estiloBorda} ${className}`}
        {...props}
      />
      
      {sufixo && (
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 pointer-events-none">
          {sufixo}
        </span>
      )}
    </div>
  );
}