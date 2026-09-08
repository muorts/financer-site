import { ElementType } from 'react';
import { ChevronDown } from 'lucide-react';

interface InputSelectProps {
  label?: string;
  icon: ElementType;
  iconColorClass?: string;
  iconHexColor?: string; // NOVO: Recebe a cor da Casa do banco de dados
  placeholder: string;
  value: string;
  onClick: () => void;
}

export function InputSelect({
  label,
  icon: Icon,
  iconColorClass = 'text-gray-500 group-hover:text-brand',
  iconHexColor,
  placeholder,
  value,
  onClick
}: InputSelectProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && <label className="text-sm font-medium text-gray-300">{label}</label>}
      <div className="relative cursor-pointer group" onClick={onClick}>
        
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          {/* O ÍCONE: Aplica a cor do banco ou a cor padrão */}
          <Icon 
            className={`w-5 h-5 transition-colors ${iconHexColor ? '' : iconColorClass}`} 
            style={iconHexColor ? { color: iconHexColor } : {}}
          />
        </div>

        {/* O TEXTO: Blindado em text-white (cor padrão) */}
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          readOnly
          className="w-full py-3 pl-12 pr-10 text-white font-bold transition-colors border rounded-xl bg-[#18181b] border-border group-hover:border-gray-500 focus:outline-none cursor-pointer placeholder:text-gray-600"
        />

        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
        </div>
      </div>
    </div>
  );
}