import { ElementType } from 'react';
import { ChevronDown } from 'lucide-react';

interface InputSelectProps {
  label: string;
  icon: ElementType;
  placeholder: string;
  value: string;
  onClick: () => void;
}

export function InputSelect({ label, icon: Icon, placeholder, value, onClick }: InputSelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <div 
        className="relative cursor-pointer group" 
        onClick={onClick}
      >
        {/* Ícone da Esquerda */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Icon className="w-5 h-5 text-gray-500 group-hover:text-brand transition-colors" />
        </div>
        
        <input 
          type="text" 
          placeholder={placeholder}
          value={value}
          readOnly // Garante que o teclado do celular não abra ao clicar
          className="w-full py-3 pl-12 pr-10 text-white transition-colors border rounded-xl bg-[#18181b] border-border group-hover:border-gray-500 focus:outline-none cursor-pointer placeholder:text-gray-600"
        />
        
        {/* Ícone da Direita (Setinha) */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
        </div>
      </div>
    </div>
  );
}