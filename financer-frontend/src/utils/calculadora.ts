/**
 * Fórmulas baseadas nas calculadoras de Matched Betting (Ex: Calculadora GOAT)
 */

// 1. Calculadora Normal (Arbitragem / Duplo Green / PA)
export function calcularArbitragem(stake1: number, odd1: number, odd2: number) {
  // Retorno total se a aposta 1 bater
  const retornoAposta1 = stake1 * odd1;
  
  // Quanto precisamos colocar na aposta 2 para igualar o retorno
  const stake2 = retornoAposta1 / odd2;
  
  // O investimento total somando as duas casas
  const investimentoTotal = stake1 + stake2;
  
  // Lucro líquido
  const lucro = retornoAposta1 - investimentoTotal;
  
  // Retorno da conta (ROI em %)
  const roi = (lucro / investimentoTotal) * 100;

  return {
    stake2,
    investimentoTotal,
    lucro,
    roi
  };
}

// 2. Calculadora de Freebet (Conversão / Retenção)
export function calcularFreebet(valorFreebet: number, oddFreebet: number, oddProtecao: number) {
  // Retorno líquido da freebet (não devolve o valor apostado, só o lucro)
  const retornoLiquidoFreebet = valorFreebet * (oddFreebet - 1);
  
  // Quanto precisamos colocar na proteção para cobrir
  const stakeProtecao = retornoLiquidoFreebet / oddProtecao;
  
  // O lucro real vai ser o retorno da freebet menos o que gastamos na proteção
  const lucro = retornoLiquidoFreebet - stakeProtecao;
  
  // % de retenção (O padrão do mercado é buscar reter mais de 70% do bônus)
  const retencao = (lucro / valorFreebet) * 100;

  return {
    stakeProtecao,
    lucro,
    retencao
  };
}

// 3. Calculadora de Missão (Aposta Qualificativa)
// Aceitamos perder um pouquinho (Red) para ganhar a freebet depois.
export function calcularQualificativa(stake1: number, odd1: number, odd2: number) {
  const retornoAposta1 = stake1 * odd1;
  const stake2 = retornoAposta1 / odd2;
  const investimentoTotal = stake1 + stake2;
  const red = retornoAposta1 - investimentoTotal; // Será um número negativo

  return {
    stake2,
    investimentoTotal,
    red // Custo para ganhar a missão
  };
}