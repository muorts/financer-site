import { useState } from 'react';
import { Search, Trophy, Flame, Target, Star, Dices, Swords, ShieldCheck } from 'lucide-react';
import { InputSelect } from '@/components/ui/InputSelect';

// ==========================================
// DICIONÁRIO E FUNÇÕES (Agora moram aqui!)
// ==========================================
const MapaIcones: Record<string, any> = {
  Swords, ShieldCheck, Trophy, Flame, Target, Star, Dices
};

const getCorCasa = (casaDB: any) => casaDB?.cor || '#FFFFFF';

const getComponenteIcone = (casaDB: any) => {
  const nomeDoIcone = casaDB?.iconeId || 'Trophy'; 
  const nomeLimpo = String(nomeDoIcone).toLowerCase().trim();
  const chave = Object.keys(MapaIcones).find(k => k.toLowerCase() === nomeLimpo);
  return chave ? MapaIcones[chave] : Trophy;
};

// ==========================================
// PROPRIEDADES DO COMPONENTE
// ==========================================
interface SelectCasaComBuscaProps {
  label?: string;
  value: string;
  casas: any[];
  onChange: (nomeDaCasa: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export function SelectCasaComBusca({ label, value, casas, onChange, isOpen, onToggle, onClose }: SelectCasaComBuscaProps) {
  const [termoBusca, setTermoBusca] = useState('');

  // 1. Acha a casa atual selecionada para colorir o input
  const casaDetalhes = casas.find(c => c.nome.toLowerCase() === value.toLowerCase());
  const corAtiva = casaDetalhes ? getCorCasa(casaDetalhes) : undefined;
  const IconeAtivo = casaDetalhes ? getComponenteIcone(casaDetalhes) : Trophy;

  // 2. Filtra a lista com base no que o usuário digitar
  const casasFiltradas = casas.filter(c => c.nome.toLowerCase().includes(termoBusca.toLowerCase()));

  return (
    <div className="relative flex-1">
      <InputSelect 
        label={label} 
        icon={IconeAtivo}
        iconHexColor={corAtiva}
        placeholder="Selecione a Casa..."
        value={value}
        onClick={() => {
          if (!isOpen) setTermoBusca(''); // Limpa a busca ao abrir
          onToggle();
        }}
      />

      {isOpen && (
        <>
          {/* OVERLAY PARA FECHAR CLICANDO FORA */}
          <div className="fixed inset-0 z-[60]" onClick={onClose} />

          <div className="absolute left-0 right-0 top-[100%] mt-2 max-h-72 overflow-y-auto bg-[#131316] border border-border/80 rounded-xl shadow-2xl z-[70] custom-scrollbar flex flex-col">
            
            {/* BARRA DE PESQUISA STICKY */}
            <div className="sticky top-0 bg-[#131316] p-2 z-20 border-b border-white/5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Buscar casa..."
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                  className="w-full bg-[#18181b] text-white text-sm font-bold py-2.5 pl-9 pr-3 rounded-lg border border-border/50 focus:border-brand outline-none transition-colors"
                />
              </div>
            </div>

            {/* LISTA DE CASAS */}
            <div className="p-2 flex flex-col gap-1">
              {casasFiltradas.length > 0 ? (
                casasFiltradas.map((casaDB: any) => {
                  const corHex = getCorCasa(casaDB);
                  const IconeLista = getComponenteIcone(casaDB);

                  return (
                    <div 
                      key={casaDB.id}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/10"
                      onClick={() => {
                        onChange(casaDB.nome);
                        onClose();
                      }}
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl border shadow-sm relative overflow-hidden shrink-0" style={{ borderColor: corHex, color: corHex }}>
                        <div className="absolute inset-0 opacity-15" style={{ backgroundColor: corHex }} />
                        <IconeLista className="w-5 h-5 relative z-10" />
                      </div>
                      <span className="text-sm font-bold text-white tracking-wide truncate">{casaDB.nome}</span>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-4 text-sm font-medium text-gray-500">
                  Nenhuma casa encontrada.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}