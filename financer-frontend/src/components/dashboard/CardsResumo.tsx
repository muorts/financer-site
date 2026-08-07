import { ElementType } from "react"

interface CardsResumo {
  titulo: string;
  valor: string;
  descricao: string;
  icon: ElementType; // Para podermos passar os ícones do Lucide
  corTexto: string;  // Ex: "text-success"
  corHover: string;  // Ex: "hover:border-success/30"
}

export function CardsResumo({ titulo, valor, descricao, icon: Icon, corTexto, corHover }: CardsResumo) {
  return (
    // Juntamos as classes fixas do cartão com a classe de Hover dinâmica que vier da página
    <div className={`p-5 border bg-surface/40 border-border/80 rounded-xl transition-colors relative overflow-hidden ${corHover}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
          {titulo}
        </h3>
        {/* O ícone recebe a cor dinâmica */}
        <Icon className={`w-4 h-4 ${corTexto}`} />
      </div>
      
      {/* O valor também recebe a cor dinâmica (exceto nas Entradas Brutas que é branco, mas lidamos com isso na prop!) */}
      <p className={`font-mono text-2xl font-bold ${corTexto}`}>
        {valor}
      </p>
      
      <p className="mt-1 text-xs text-gray-500">
        {descricao}
      </p>
    </div>
  );
}