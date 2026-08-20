import { InputHTMLAttributes } from 'react';

interface InputDinheiroProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  tema?: 'brand' | 'orange' | 'success' | 'gray';
}

export function InputDinheiro({ 
  label, 
  tema = 'success', 
  className = '',
  ...props 
}: InputDinheiroProps) {
  
  // Define as cores com base no tema (no caso de lucro, será verde)
  const corFoco = {
    brand: "focus:border-brand text-brand",
    orange: "focus:border-orange-500 text-orange-500",
    success: "focus:border-success text-success",
    gray: "focus:border-gray-400 text-white",
  }[tema];

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-4 font-mono text-gray-500">R$</span>
        <input 
          type="text" 
          className={`w-full py-3 pl-12 pr-4 text-2xl font-bold font-mono transition-colors border rounded-xl bg-[#18181b] border-border outline-none ${corFoco} ${className}`} 
          {...props}
        />
      </div>
    </div>
  );
}