import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface CabecalhoPaginaProps {
  titulo: string;
  descricao: string;
  caminhoVoltar?: string; // Opcional, se não passar nada, ele volta para o início ("/")
}

export function CabecalhoPagina({ titulo, descricao, caminhoVoltar = "/" }: CabecalhoPaginaProps) {
  return (
    <div className="flex items-center gap-5 p-5 md:p-6 border bg-surface/40 border-border/80 rounded-2xl shadow-sm">
      <Link 
        href={caminhoVoltar} 
        className="p-3 transition-colors border rounded-xl bg-[#18181b] border-border hover:border-gray-500 text-gray-400 hover:text-white shrink-0"
      >
        <ArrowLeft className="w-5 h-5" />
      </Link>
      <div>
        <h1 className="text-2xl font-bold text-white font-sans">{titulo}</h1>
        <p className="mt-1 text-sm text-gray-400">{descricao}</p>
      </div>
    </div>
  );
}