import { 
  Globe, Target, Swords, Zap, 
  Trophy, Flame, Shield, Star, 
  CircleDollarSign, Landmark
} from 'lucide-react';

export const ICONES_DISPONIVEIS = [
  { id: 'globe', icone: Globe, label: 'Global / Padrão' },
  { id: 'target', icone: Target, label: 'Missões / Alvo' },
  { id: 'swords', icone: Swords, label: 'Exchange / Confronto' },
  { id: 'zap', icone: Zap, label: 'Rápido / Turbo' },
  { id: 'trophy', icone: Trophy, label: 'Esportes / Campeão' },
  { id: 'flame', icone: Flame, label: 'Hot / Cassino' },
  { id: 'shield', icone: Shield, label: 'Proteção / Seguro' },
  { id: 'star', icone: Star, label: 'Premium / VIP' },
  { id: 'dollar', icone: CircleDollarSign, label: 'Financeiro' },
  { id: 'landmark', icone: Landmark, label: 'Institucional' },
] as const;

interface SeletorIconesProps {
  iconeSelecionado: string;
  onChange: (icone: string) => void;
}

export function SeletorIcones({ iconeSelecionado, onChange }: SeletorIconesProps) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-gray-300">
        Ícone da Casa
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