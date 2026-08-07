interface BarraCategoriaProps {
  titulo: string;
  valor: string;
  porcentagem: string;
  corTexto: string;
  corBarra: string; 
}

export function BarraCategoria({ titulo, valor, porcentagem, corTexto, corBarra }: BarraCategoriaProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1 text-sm">
        <span className="text-gray-300">{titulo}</span>
        {/* Usamos a cor recebida para pintar o texto do valor */}
        <span className={`font-mono ${corTexto}`}>{valor}</span>
      </div>
      <div className="w-full h-2 rounded-full bg-background">
        {/* A largura e a cor da barra mudam */}
        <div 
          className={`h-full rounded-full ${corBarra}`} 
          style={{ width: porcentagem }} 
        />
      </div>
    </div>
  );
}