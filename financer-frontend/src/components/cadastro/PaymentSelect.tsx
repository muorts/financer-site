import { Smartphone, CreditCard, Check } from 'lucide-react';

interface SeletorMetodoPagamentoProps {
  metodo: 'pix' | 'debito' | 'credito';
  onChange: (metodo: 'pix' | 'debito' | 'credito') => void;
  tipo: 'entrada' | 'saida'; // Recebemos o tipo para saber se fica verde ou vermelho!
}

export function SeletorMetodoPagamento({ metodo, onChange, tipo }: SeletorMetodoPagamentoProps) {
  const corPrimaria = tipo === 'entrada' ? 'text-success' : 'text-danger';
  const bgPrimario = tipo === 'entrada' ? 'bg-success/10' : 'bg-danger/10';
  const borderPrimario = tipo === 'entrada' ? 'border-success' : 'border-danger';

  // Para receitas (entrada), ocultamos Crédito pois cartão de crédito representa despesa/fatura
  const todasOpcoes = [
    { id: 'pix', label: 'Pix', icon: Smartphone },
    { id: 'debito', label: 'Débito', icon: CreditCard },
    { id: 'credito', label: 'Crédito', icon: CreditCard },
  ] as const;

  const opcoes = tipo === 'entrada'
    ? todasOpcoes.filter((o) => o.id !== 'credito')
    : todasOpcoes;

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-gray-300">Método de Pagamento</label>
      <div className={`grid gap-3 ${opcoes.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
        {opcoes.map((opcao) => {
          const isAtivo = metodo === opcao.id;
          const Icone = opcao.icon;

          return (
            <button
              key={opcao.id}
              type="button"
              onClick={() => onChange(opcao.id)}
              className={`relative flex flex-col items-center justify-center p-4 border rounded-xl transition-all ${
                isAtivo 
                  ? `${bgPrimario} ${borderPrimario} ${corPrimaria}` 
                  : 'bg-[#18181b] border-border hover:border-gray-500 text-gray-400'
              }`}
            >
              {isAtivo && <Check className="absolute top-2 right-2 w-4 h-4" />}
              <Icone className="w-6 h-6 mb-2" />
              <span className="text-sm font-medium">{opcao.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}