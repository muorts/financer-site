import { CircleDollarSign } from 'lucide-react';
import { SeletorCasaAposta } from './CasaSelection';
import { InputDinheiro } from '@/components/ui/InputMoney';

interface SecaoLucroProps {
  valor: string;
  onChangeValor: (valor: string) => void;
}

export function SecaoLucro({ valor, onChangeValor }: SecaoLucroProps) {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2">
      
      {/* AVISO / DICA */}
      <div className="p-4 border rounded-xl border-success/20 bg-success/5">
        <p className="text-sm text-success flex items-center gap-2">
          <CircleDollarSign className="w-4 h-4" />
          Use para ganhos como giros grátis de cassino, bonificações sem rollover ou apostas recreativas.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* SELETOR DE CASAS GIGANTE */}
        <SeletorCasaAposta 
          label="Origem (Casa/Cassino)" 
          tema="success" 
          tamanho="md" 
        />

        {/* NOSSO NOVO INPUT DE DINHEIRO */}
        <InputDinheiro 
          label="Valor do Lucro Líquido"
          placeholder="0,00"
          tema="success"
          value={valor}
          onChange={(e) => onChangeValor(e.target.value)}
        />
        
      </div>
    </div>
  );
}