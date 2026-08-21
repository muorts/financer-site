// ==========================================
// TIPAGENS COMPARTILHADAS
// ==========================================
export interface LinhaAposta {
  id: string;
  tipo: 'BACK' | 'LAY';
  odd: string;
  comissao: string;
  valor: string; // "Aposta a favor" no LAY, Stake no BACK
  isFreebet: boolean;
  isFixa: boolean;
}

export interface LinhaCalculada extends LinhaAposta {
  oddNum: number;
  oddReal: number;
  stakeFinal: number; // Aposta a Favor
  responsabilidadeFinal: number; // Risco real (Liability)
  retornoBruto: number;
  lucroCenario: number;
}

export interface ResultadoCalculadora {
  linhasProcessadas: LinhaCalculada[];
  totalInvestidoReal: number;
  roiTotal: number;
}

// ==========================================
// 1. CALCULADORA AVANÇADA
// ==========================================
export function calcularGoatAvancado(linhas: LinhaAposta[]): ResultadoCalculadora {
  if (linhas.length === 0) return { linhasProcessadas: [], totalInvestidoReal: 0, roiTotal: 0 };

  // 1. Encontra a linha que está com o valor fixado pelo usuário
  const linhaFixa = linhas.find(l => l.isFixa) || linhas[0];
  const valFixa = parseFloat(linhaFixa.valor.replace(',', '.')) || 0;
  const oddFixa = parseFloat(linhaFixa.odd.replace(',', '.')) || 1.01;
  
  // 2. O Risco de uma linha FIXA depende se é BACK ou LAY
  let riscoFixo = valFixa;
  if (linhaFixa.tipo === 'LAY') {
    riscoFixo = valFixa * (oddFixa - 1); // Liability
  }

  // 3. Processa Odds Reais (Odd Equivalente no caso do LAY)
  const dadosLinhas = linhas.map(l => {
    const oddNum = parseFloat(l.odd.replace(',', '.')) || 1.01;
    const comissaoNum = parseFloat(l.comissao.replace(',', '.')) || 0;
    const fatorComissao = (100 - comissaoNum) / 100;

    let oddReal = 1.0;
    if (l.tipo === 'LAY') {
      // Para o motor genérico, um LAY vira um BACK equivalente inverso. 
      // Se eu arrisco L, eu ganho L * ((Odd - Comissao) / (Odd - 1))
      const c = comissaoNum / 100;
      oddReal = Math.max(1.001, (oddNum - c) / (oddNum - 1));
    } else {
      if (l.isFreebet) {
        oddReal = Math.max(0.001, (oddNum - 1) * fatorComissao);
      } else {
        oddReal = Math.max(0.001, 1 + (oddNum - 1) * fatorComissao);
      }
    }
    return { ...l, oddNum, oddReal };
  });

  // 4. Retorno Alvo (Iguala os Lucros)
  const linhaFixaProcessada = dadosLinhas.find(l => l.isFixa) || dadosLinhas[0];
  const retornoAlvo = riscoFixo * linhaFixaProcessada.oddReal;

  // 5. Calcula as Stakes para as demais linhas
  let totalInvestidoReal = 0;

  const linhasComStake = dadosLinhas.map(l => {
    let riscoCalculado = 0;

    if (l.isFixa) {
      riscoCalculado = l.id === linhaFixaProcessada.id ? riscoFixo : (l.oddReal > 0 ? retornoAlvo / l.oddReal : 0);
    } else {
      riscoCalculado = l.oddReal > 0 ? retornoAlvo / l.oddReal : 0;
    }

    if (!l.isFreebet) {
      totalInvestidoReal += riscoCalculado;
    }

    // Voltando para o formato que a Tabela entende (Aposta a Favor vs Responsabilidade)
    let apostaAFavor = riscoCalculado;
    let responsabilidade = riscoCalculado;

    if (l.tipo === 'LAY') {
      apostaAFavor = riscoCalculado / (l.oddNum - 1);
      responsabilidade = riscoCalculado;
    }

    return {
      ...l,
      stakeFinal: apostaAFavor,
      responsabilidadeFinal: responsabilidade,
      retornoBruto: riscoCalculado * l.oddReal
    };
  });

  // 6. Calcula Lucro Líquido
  const linhasProcessadas = linhasComStake.map(l => {
    const lucroCenario = l.retornoBruto - totalInvestidoReal;
    return { ...l, lucroCenario };
  });

  const lucroMedio = linhasProcessadas.length > 0 ? linhasProcessadas[0].lucroCenario : 0;
  const roiTotal = totalInvestidoReal > 0 ? (lucroMedio / totalInvestidoReal) * 100 : 0;

  return { linhasProcessadas, totalInvestidoReal, roiTotal };
}