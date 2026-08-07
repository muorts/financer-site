import { 
  Utensils, Gamepad2, Car, ShoppingBag, 
  Coffee, Smartphone, Home, Plane, Zap, Heart
} from 'lucide-react';

export const ICONES_DISPONIVEIS = [
  { id: 'utensils', icone: Utensils, label: 'Comida' },
  { id: 'coffee', icone: Coffee, label: 'Café/Lanche' },
  { id: 'shopping', icone: ShoppingBag, label: 'Compras' },
  { id: 'gamepad', icone: Gamepad2, label: 'Jogos/Lazer' },
  { id: 'car', icone: Car, label: 'Transporte' },
  { id: 'smartphone', icone: Smartphone, label: 'Eletrônicos/Assinaturas' },
  { id: 'home', icone: Home, label: 'Casa' },
  { id: 'plane', icone: Plane, label: 'Viagem' },
  { id: 'heart', icone: Heart, label: 'Saúde' },
  { id: 'zap', icone: Zap, label: 'Energia/Contas' },
] as const;

interface SeletorIconesProps {
  iconeSelecionado: string;
  onChange: (icone: string) => void;
}

export function SeletorIcones({ iconeSelecionado, onChange }: SeletorIconesProps) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-gray-300">
        Ícone Representativo
      </label>
      <div className="grid grid-cols-5 md:grid-cols-10 gap-3 p-4 bg-[#18181b] border border-border rounded-xl">
        {ICONES_DISPONIVEIS.map((item) => {
          const Icone = item.icone;
          const isAtivo = iconeSelecionado === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              type="button"
              title={item.label}
              className={`flex items-center justify-center aspect-square rounded-xl transition-all duration-200 border ${
                isAtivo 
                  ? 'bg-brand/20 border-brand text-brand shadow-inner' 
                  : 'bg-surface/50 border-transparent text-gray-400 hover:text-white hover:bg-surface'
              }`}
            >
              <Icone className={`w-6 h-6 ${isAtivo ? 'scale-110' : ''} transition-transform`} />
            </button>
          );
        })}
      </div>
    </div>
  );
}