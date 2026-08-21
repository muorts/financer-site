import { Lock, Minus } from 'lucide-react';

// ATENÇÃO: Confirme se o seu arquivo em utils é "calculadoraTrade" (singular) ou plural. 
// Deixei no singular aqui igual arrumamos na página principal!
import { LinhaAposta, LinhaCalculada } from '@/utils/calculadoraTrade';

import { InputTabela } from '@/components/ui/InputTable';
import { BotaoAcaoTabela } from '@/components/ui/ButtonTable';

interface LinhaTabelaProps {
  linha: LinhaCalculada;
  mostrarComissao: boolean;
  podeRemover: boolean;
  onUpdate: (id: string, campo: keyof LinhaAposta, valor: any) => void;
  onFixar: (id: string) => void;
  onRemover: (id: string) => void;
}

export function LinhaTabelaCalculadora({
  linha,
  mostrarComissao,
  podeRemover,
  onUpdate,
  onFixar,
  onRemover
}: LinhaTabelaProps) {
  
  const isLucro = linha.lucroCenario >= 0;
  const corLucro = isLucro ? 'text-success' : 'text-danger';
  const sinal = linha.lucroCenario > 0 ? '+' : '';
  
  // AQUI ESTÁ O GATILHO VISUAL DO LAY!
  const isLay = linha.tipo === 'LAY';

  return (
    <tr className={`hover:bg-white/[0.02] transition-colors ${linha.isFixa ? 'bg-brand/[0.03]' : ''}`}>
      
      {/* 1. TIPO (Fica Vermelho se for LAY) */}
      <td className="px-4 py-3">
        <select 
          value={linha.tipo}
          onChange={(e) => onUpdate(linha.id, 'tipo', e.target.value)}
          className={`py-1.5 px-3 text-xs font-bold rounded-lg outline-none cursor-pointer transition-colors shadow-sm appearance-none text-center ${
            isLay 
              ? 'bg-red-200 text-red-900 border border-red-300 hover:bg-red-300' 
              : 'bg-brand/10 text-brand border border-brand/20 hover:bg-brand/20'
          }`}
        >
          <option value="BACK">BACK</option>
          <option value="LAY">LAY</option>
        </select>
      </td>

      {/* 2. ODD BRUTA */}
      <td className="px-4 py-3">
        <InputTabela 
          type="number"
          step="0.01"
          value={linha.odd}
          onChange={(e) => onUpdate(linha.id, 'odd', e.target.value)}
        />
      </td>

      {/* 3. COMISSÃO (OPCIONAL) */}
      {mostrarComissao && (
        <td className="px-4 py-3">
          <InputTabela 
            type="number"
            step="0.1"
            sufixo="%"
            containerClassName="w-16"
            value={linha.comissao}
            onChange={(e) => onUpdate(linha.id, 'comissao', e.target.value)}
          />
        </td>
      )}

      {/* 4. ODD REAL */}
      <td className="px-4 py-3 text-cyan-400 font-bold text-xs text-center">
        {linha.oddReal.toFixed(3)}
      </td>

      {/* 5. STAKE / VALOR / RESPONSABILIDADE (Se divide em 2 se for LAY) */}
      <td className="px-4 py-2 min-w-[140px]">
        {isLay ? (
          <div className="flex flex-col gap-2 my-1">
            {/* Campo Responsabilidade */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-gray-400 text-center uppercase tracking-wider font-sans leading-none">Responsa.</span>
              <InputTabela 
                type="number"
                step="0.01"
                containerClassName="w-32 mx-auto"
                isDestaque={false}
                value={linha.isFixa ? (parseFloat(linha.valor) * (linha.oddNum - 1)).toFixed(2) : linha.responsabilidadeFinal.toFixed(2)}
                onChange={(e) => {
                  const newResponsa = parseFloat(e.target.value) || 0;
                  const newApostaAFavor = newResponsa / (linha.oddNum - 1);
                  onUpdate(linha.id, 'valor', newApostaAFavor.toFixed(2));
                  onFixar(linha.id);
                }}
              />
            </div>
            {/* Campo Aposta a Favor */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-gray-400 text-center uppercase tracking-wider font-sans leading-none">Aposta a favor:</span>
              <InputTabela 
                type="number"
                step="0.01"
                containerClassName="w-32 mx-auto"
                isDestaque={linha.isFixa}
                value={linha.isFixa ? linha.valor : linha.stakeFinal.toFixed(2)}
                onChange={(e) => {
                  onUpdate(linha.id, 'valor', e.target.value);
                  onFixar(linha.id);
                }}
              />
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <InputTabela 
              type="number"
              step="0.01"
              prefixo="R$"
              containerClassName="w-32"
              isDestaque={linha.isFixa}
              value={linha.isFixa ? linha.valor : linha.stakeFinal.toFixed(2)}
              onChange={(e) => {
                onUpdate(linha.id, 'valor', e.target.value);
                onFixar(linha.id);
              }}
            />
          </div>
        )}
      </td>

      {/* 6. LUCRO DO CENÁRIO */}
      <td className={`px-4 py-3 text-right font-bold ${corLucro}`}>
        {sinal}{linha.lucroCenario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      </td>

      {/* 7. CHECKBOX FREEBET */}
      <td className="px-4 py-3 text-center">
        <input 
          type="checkbox"
          checked={linha.isFreebet}
          onChange={(e) => onUpdate(linha.id, 'isFreebet', e.target.checked)}
          className="w-4 h-4 accent-orange-500 cursor-pointer rounded"
        />
      </td>

      {/* 8. CADEADO */}
      <td className="px-4 py-3 text-center">
        <BotaoAcaoTabela 
          icone={Lock}
          variante={linha.isFixa ? 'ativo' : 'default'}
          onClick={() => onFixar(linha.id)}
          title={linha.isFixa ? "Linha Base Fixada" : "Clique para fixar esta aposta"}
        />
      </td>

      {/* 9. REMOVER */}
      <td className="px-4 py-3 text-center">
        <BotaoAcaoTabela 
          icone={Minus}
          variante="perigo"
          disabled={!podeRemover}
          onClick={() => onRemover(linha.id)}
          title={!podeRemover ? "Mínimo de 2 seleções necessárias" : "Remover seleção"}
        />
      </td>
      
    </tr>
  );
}