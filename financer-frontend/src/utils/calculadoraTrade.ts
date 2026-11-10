// ==========================================
// TIPAGENS COMPARTILHADAS
// ==========================================
export interface LinhaAposta {
  id: string;
  tipo: 'BACK' | 'LAY';
  odd: string | number; // Agora aceita tanto texto quanto número
  comissao: string | number;
  valor: string | number; 
  isFreebet: boolean;
  isFixa: boolean;
  isManual?: boolean; 
}

export interface LinhaCalculada extends LinhaAposta {
  oddNum: number;
  oddReal: number;
  stakeFinal: number; 
  responsabilidadeFinal: number; 
  retornoBruto: number;
  lucroCenario: number;
  stakeUsada: number; 
}

export interface ResultadoCalculadora {
  linhasProcessadas: LinhaCalculada[];
  totalInvestidoReal: number;
  roiTotal: number;
}

// ==========================================
// 1. CALCULADORA AVANÇADA (HÍBRIDA E BLINDADA CONTRA TIPAGEM)
// ==========================================
export function calcularGoatAvancado(
  linhas: LinhaAposta[], 
  modo: 'linha' | 'total' = 'linha', 
  totalFixo: number = 100
): ResultadoCalculadora {
  
  if (linhas.length === 0) return { linhasProcessadas: [], totalInvestidoReal: 0, roiTotal: 0 };

  const dadosLinhas = linhas.map(l => {
    // A MÁGICA: O String() garante que nunca vai quebrar o replace, mesmo se vier do Java
    const oddNum = parseFloat(String(l.odd).replace(',', '.')) || 1.01;
    const comissaoNum = parseFloat(String(l.comissao || '0').replace(',', '.')) || 0;
    const fatorComissao = (100 - comissaoNum) / 100;
    
    let oddReal = 1.0;
    
    if (l.tipo === 'LAY') {
      const c = comissaoNum / 100;
      oddReal = Math.max(1.001, (oddNum - c) / (oddNum - 1));
    } else {
      if (l.isFreebet) oddReal = Math.max(0.001, (oddNum - 1) * fatorComissao);
      else oddReal = Math.max(0.001, 1 + (oddNum - 1) * fatorComissao);
    }
    return { ...l, oddNum, oddReal };
  });

  let retornoAlvo = 0;
  if (modo === 'linha') {
    const linhaFixa = dadosLinhas.find(l => l.isFixa) || dadosLinhas[0];
    const valFixa = parseFloat(String(linhaFixa.valor || '0').replace(',', '.')) || 0;
    let riscoFixo = linhaFixa.tipo === 'LAY' ? valFixa * (linhaFixa.oddNum - 1) : valFixa;
    retornoAlvo = riscoFixo * linhaFixa.oddReal;
  } else {
    let somaInversos = 0;
    dadosLinhas.forEach(l => { if (!l.isFreebet && l.oddReal > 0) somaInversos += (1 / l.oddReal); });
    retornoAlvo = somaInversos > 0 ? (totalFixo / somaInversos) : 0;
  }

  let totalInvestidoReal = 0;

  const linhasComStake = dadosLinhas.map(l => {
    let riscoIdeal = 0;
    if (modo === 'linha' && l.isFixa) {
      const linhaF = dadosLinhas.find(f => f.isFixa) || dadosLinhas[0];
      const vFixa = parseFloat(String(linhaF.valor || '0').replace(',', '.')) || 0;
      riscoIdeal = l.tipo === 'LAY' ? vFixa * (l.oddNum - 1) : vFixa;
    } else {
      riscoIdeal = l.oddReal > 0 ? retornoAlvo / l.oddReal : 0;
    }

    const apostaIdeal = l.tipo === 'LAY' ? riscoIdeal / (l.oddNum - 1) : riscoIdeal;
    const responsaIdeal = riscoIdeal;

    let apostaAplicada = apostaIdeal;
    if (l.isFixa || l.isManual) {
      apostaAplicada = parseFloat(String(l.valor || '0').replace(',', '.')) || 0; 
    }

    const riscoAplicado = l.tipo === 'LAY' ? apostaAplicada * (l.oddNum - 1) : apostaAplicada;

    if (!l.isFreebet) {
      totalInvestidoReal += riscoAplicado;
    }

    return {
      ...l,
      stakeFinal: apostaIdeal, 
      responsabilidadeFinal: responsaIdeal,
      stakeUsada: apostaAplicada, 
      retornoBruto: riscoAplicado * l.oddReal
    };
  });

  const linhasProcessadas = linhasComStake.map(l => {
    const lucroCenario = l.retornoBruto - totalInvestidoReal;
    return { ...l, lucroCenario };
  });

  const lucroMedio = linhasProcessadas.length > 0 ? linhasProcessadas[0].lucroCenario : 0;
  const roiTotal = totalInvestidoReal > 0 ? (lucroMedio / totalInvestidoReal) * 100 : 0;

  return { linhasProcessadas, totalInvestidoReal, roiTotal };
}

// ==========================================
// 2. CÁLCULO DE LUCRO PARA LISTA DE OPERAÇÕES (BLINDADO)
// ==========================================
export function calcularLucroProjetado(entradas: any[], mercado: string, custoInicial: number): number {
  if (!entradas || entradas.length === 0) return 0;

  const mercadoStr = (mercado || "").toLowerCase();
  const isConversao = mercadoStr.includes('conversão') || mercadoStr.includes('conversao');
  const isMissao = mercadoStr.includes('missão') || mercadoStr.includes('missao');

  let custoReal = custoInicial;
  if (isConversao) {
    custoReal = entradas.reduce((acc, curr, index) => index === 0 ? acc : acc + parseFloat(String(curr.stake || '0').replace(',', '.')), 0);
  } else if (custoReal <= 0) {
    custoReal = entradas.reduce((acc, curr) => acc + parseFloat(String(curr.stake || '0').replace(',', '.')), 0);
  }

  const lucrosPossiveis = entradas.map((entrada, index) => {
    let isFreebet = entrada.isFreebet;
    
    if (isMissao) {
      isFreebet = false; 
    } else if (isConversao && index === 0) {
      isFreebet = true; 
    }

    // BLINDAGEM: Garante que a odd e a stake passem sem quebrar
    const oddFormatada = parseFloat(String(entrada.odd || '0').replace(',', '.'));
    const stakeFormatada = parseFloat(String(entrada.stake || '0').replace(',', '.'));

    const retorno = isFreebet
      ? (oddFormatada - 1) * stakeFormatada
      : oddFormatada * stakeFormatada;

    return retorno - custoReal;
  });

  return Math.min(...lucrosPossiveis);
}