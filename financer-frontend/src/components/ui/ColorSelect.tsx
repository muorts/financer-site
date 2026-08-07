import { Check } from 'lucide-react';

// Exportamos a paleta caso alguma outra parte do sistema precise saber quais cores existem
export const PALETA_CORES = [
  { id: 'purple', classBg: 'bg-purple-500', classRing: 'ring-purple-500' },
  { id: 'orange', classBg: 'bg-orange-500', classRing: 'ring-orange-500' },
  { id: 'emerald', classBg: 'bg-emerald-500', classRing: 'ring-emerald-500' },
  { id: 'blue', classBg: 'bg-blue-500', classRing: 'ring-blue-500' },
  { id: 'red', classBg: 'bg-red-500', classRing: 'ring-red-500' },
  { id: 'yellow', classBg: 'bg-yellow-500', classRing: 'ring-yellow-500' },
  { id: 'gray', classBg: 'bg-gray-400', classRing: 'ring-gray-400' },
] as const;

interface SeletorCoresProps {
  corSelecionada: string;
  onChange: (cor: string) => void;
  label?: string; // Opcional, para você mudar o título dependendo da tela
}

export function SeletorCores({ corSelecionada, onChange, label = "Cor de Destaque" }: SeletorCoresProps) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-gray-300">
        {label}
      </label>
      <div className="flex flex-wrap gap-3 p-4 bg-[#18181b] border border-border rounded-xl">
        {PALETA_CORES.map((cor) => {
          const isAtivo = corSelecionada === cor.id;
          
          return (
            <button
              key={cor.id}
              onClick={() => onChange(cor.id)}
              type="button"
              className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${cor.classBg} ${
                isAtivo 
                  ? `ring-2 ring-offset-2 ring-offset-[#18181b] ${cor.classRing} scale-110 shadow-lg` 
                  : 'hover:scale-110 opacity-70 hover:opacity-100'
              }`}
            >
              {isAtivo && <Check className="w-5 h-5 text-white drop-shadow-md" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}