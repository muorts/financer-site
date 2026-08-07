import { ElementType } from 'react';
import { Check } from 'lucide-react';

interface CardSelecaoProps {
  titulo: string;
  descricao: string;
  icon: ElementType;
  ativo: boolean;
  onClick: () => void;
  // Usamos as classes completas do Tailwind para evitar bugs de compilação
  corTexto: string;  // Ex: "text-brand" ou "text-blue-500"
  corBorda: string;  // Ex: "border-brand" ou "border-blue-500"
  corFundo: string;  // Ex: "bg-brand/10" ou "bg-blue-500/10"
}

export function CardSelecao({ 
  titulo, 
  descricao, 
  icon: Icon, 
  ativo, 
  onClick, 
  corTexto, 
  corBorda, 
  corFundo 
}: CardSelecaoProps) {
  
  return (
    <button
      type="button" // Essencial! Impede que este botão tente enviar o formulário ao ser clicado.
      onClick={onClick}
      className={`relative flex flex-col items-start p-4 text-left border rounded-xl transition-all duration-200 ${
        ativo 
          ? `${corFundo} ${corBorda}` 
          : 'bg-[#18181b] border-border hover:border-gray-500'
      }`}
    >
      {/* O Checkmark animado no canto superior direito */}
      {ativo && <Check className={`absolute top-4 right-4 w-5 h-5 ${corTexto}`} />}
      
      {/* Ícone Dinâmico */}
      <Icon className={`w-6 h-6 mb-3 ${ativo ? corTexto : 'text-gray-500'}`} />
      
      {/* Textos */}
      <span className={`font-medium mb-1 ${ativo ? corTexto : 'text-white'}`}>
        {titulo}
      </span>
      <span className="text-xs text-gray-500">
        {descricao}
      </span>
      
    </button>
  );
}