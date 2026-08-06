import { ElementType } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

// Agora ele recebe propriedades para saber se está aberto e se tem submenus
interface MenuButtonProps {
  icon: ElementType;
  label: string;
  onClick: () => void;
  aberto: boolean;
  temSubmenu: boolean;
}

export function MenuButton({ icon: Icon, label, onClick, aberto, temSubmenu }: MenuButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center justify-between w-full p-2 px-4 transition-colors rounded-xl hover:text-brand hover:bg-border/50"
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5" />
        <span className="font-medium text-sm">{label}</span>
      </div>
      
      {/* A setinha só aparece se esse módulo tiver submenus */}
      {temSubmenu && (
        aberto ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
      )}
    </button>
  );
}