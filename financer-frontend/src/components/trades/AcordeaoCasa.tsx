import { useState } from 'react';
import { ChevronDown, ArrowUpRight, ArrowDownRight, FileText, Download } from 'lucide-react';

export interface Transacao {
  id: string;
  data: string;
  descricao: string;
  tipo: 'deposito' | 'saque' | 'aposta' | 'retorno' | 'bonus';
  valor: number;
}

export interface CasaComprovaBet {
  id: string;
  nome: string;
  corText: string;
  corBg: string;
  icone: any;
  totalInvestido: number;
  totalRetornado: number;
  lucroLiquido: number;
  transacoes: Transacao[];
}

interface AcordeaoCasaProps {
  casa: CasaComprovaBet;
}

export function AcordeaoCasa({ casa }: AcordeaoCasaProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isLucro = casa.lucroLiquido >= 0;
  const corLucro = isLucro ? 'text-success' : 'text-danger';
  const sinalLucro = isLucro ? '+' : '';

  return (
    <div className="flex flex-col border border-border/80 bg-surface/30 rounded-2xl overflow-hidden transition-all duration-300">
      
      {/* CABEÇALHO (VISÃO FECHADA) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-5 bg-[#18181b]/50 hover:bg-[#18181b] transition-colors outline-none"
      >
        <div className="flex items-center gap-4">
          <div className={`p-2.5 rounded-xl ${casa.corBg} ${casa.corText}`}>
            <casa.icone className="w-5 h-5" />
          </div>
          <div className="flex flex-col items-start">
            <span className="font-bold text-white">{casa.nome}</span>
            <span className="text-xs text-gray-500 font-medium">
              {casa.transacoes.length} transações registradas
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* P&L BRUTO (Lucro Líquido) */}
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-500 font-medium mb-0.5">P&L Histórico</span>
            <span className={`font-mono font-bold text-base ${corLucro}`}>
              {sinalLucro}{casa.lucroLiquido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* CORPO EXPANSÍVEL (EXTRATO DETALHADO) */}
      {isOpen && (
        <div className="flex flex-col border-t border-border/50 bg-[#18181b]/20 animate-in fade-in slide-in-from-top-2">
          
          {/* RESUMO TÁTICO DA CASA */}
          <div className="grid grid-cols-2 gap-4 p-5 border-b border-border/30 bg-black/20">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Investido</span>
              <span className="font-mono text-sm text-white">
                {casa.totalInvestido.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Retornado</span>
              <span className="font-mono text-sm text-white">
                {casa.totalRetornado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>
          </div>

          {/* TABELA DE TRANSAÇÕES */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/50 bg-[#18181b]/80">
                  <th className="px-5 py-3 text-xs font-medium text-gray-400 uppercase">Data</th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-400 uppercase">Descrição</th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-400 uppercase">Tipo</th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-400 uppercase text-right">Valor (R$)</th>
                  <th className="px-5 py-3 text-xs font-medium text-gray-400 uppercase text-center">Comp.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {casa.transacoes.map((t) => {
                  // Lógica de cores baseada no tipo de transação
                  const isEntrada = ['deposito', 'retorno', 'bonus'].includes(t.tipo);
                  const corValor = isEntrada ? 'text-success' : 'text-danger';
                  const sinal = isEntrada ? '+' : '-';
                  const IconeTipo = isEntrada ? ArrowDownRight : ArrowUpRight;
                  
                  // Tags visuais para o tipo
                  const badgeConfig = {
                    deposito: { bg: 'bg-blue-500/10', text: 'text-blue-500', label: 'Depósito' },
                    saque: { bg: 'bg-purple-500/10', text: 'text-purple-500', label: 'Saque' },
                    aposta: { bg: 'bg-danger/10', text: 'text-danger', label: 'Aposta' },
                    retorno: { bg: 'bg-success/10', text: 'text-success', label: 'Retorno' },
                    bonus: { bg: 'bg-orange-500/10', text: 'text-orange-500', label: 'Bônus' },
                  }[t.tipo];

                  return (
                    <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5 text-sm text-gray-400 whitespace-nowrap">{t.data}</td>
                      <td className="px-5 py-3.5 text-sm font-medium text-white">{t.descricao}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${badgeConfig.bg} ${badgeConfig.text}`}>
                          <IconeTipo className="w-3 h-3" />
                          {badgeConfig.label}
                        </span>
                      </td>
                      <td className={`px-5 py-3.5 text-sm font-mono font-bold text-right whitespace-nowrap ${corValor}`}>
                        {sinal} {Math.abs(t.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <button className="p-1.5 text-gray-500 hover:text-brand hover:bg-brand/10 rounded-md transition-colors" title="Baixar Comprovante (PDF)">
                          <Download className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
        </div>
      )}
    </div>
  );
}