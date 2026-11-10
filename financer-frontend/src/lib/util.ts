import {
  Utensils, Coffee, ShoppingBag, Gamepad2, Car, Smartphone,
  Home, Plane, Heart, Zap, Globe, Target, Swords, Trophy,
  Flame, Shield, Star, CircleDollarSign, Landmark, Tag
} from 'lucide-react';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export interface BancoDTO {
  id: string;
  nome: string;
  tipo: 'GIRO' | 'RESERVA' | string;
  cor: string;
  saldoInicial: number;
  saldoAtual: number;
  diaFechamento?: number;
  diaVencimento?: number;
}

export interface CategoriaDTO {
  id: string;
  nome: string;
  tipo: 'ENTRADA' | 'SAIDA' | string;
  cor: string;
  icone: string;
}

export interface TransacaoDTO {
  id: string;
  descricao: string;
  valor: number;
  tipo: 'ENTRADA' | 'SAIDA' | string;
  metodoPagamento: 'PIX' | 'DEBITO' | 'CREDITO' | string;
  data: string;
  categoria?: CategoriaDTO | null;
  banco?: BancoDTO | null;
  parcelaAtual?: number;
  totalParcelas?: number;
  parcelasFormatadas?: string;
  mesFatura?: number;
  anoFatura?: number;
}

export interface MetaItemDTO {
  id: string;
  categoriaId: string;
  categoriaNome: string;
  categoriaCor: string;
  categoriaIcone: string;
  gastoAtual: number;
  limiteMaximo: number;
  percentual: number;
}

export interface ResumoMetasDTO {
  mes: number;
  ano: number;
  orcamentoTotal: number;
  gastoTotal: number;
  restanteGeral: number;
  metas: MetaItemDTO[];
}

export interface FaturaResumoDTO {
  bancoId: string;
  bancoNome: string;
  cor: string;
  mesFatura: number;
  anoFatura: number;
  valorTotal: number;
  diaFechamento: number;
  diaVencimento: number;
  lancamentos: TransacaoDTO[];
}

export const NOMES_MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const NOMES_MESES_CURTOS = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];

export function formatarBRL(valor: number | undefined | null): string {
  const num = Number(valor ?? 0);
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function parseValorMonetario(valorStr: string): number {
  if (!valorStr) return 0;
  const limpo = valorStr.replace(/[R$\s]/g, '').trim();
  // Se tiver vírgula e ponto (ex: 1.500,50), remove pontos de milhar e troca vírgula por ponto
  if (limpo.includes(',') && limpo.includes('.')) {
    return parseFloat(limpo.replace(/\./g, '').replace(',', '.')) || 0;
  }
  if (limpo.includes(',')) {
    return parseFloat(limpo.replace(',', '.')) || 0;
  }
  return parseFloat(limpo) || 0;
}

export function formatarDataCurta(dataIso: string): string {
  if (!dataIso) return '';
  const partes = dataIso.split('-');
  if (partes.length !== 3) return dataIso;
  const dia = partes[2];
  const mesIdx = parseInt(partes[1], 10) - 1;
  return `${dia} de ${NOMES_MESES_CURTOS[mesIdx] || partes[1]}`;
}

export const MAPA_ICONES: Record<string, any> = {
  utensils: Utensils,
  coffee: Coffee,
  shopping: ShoppingBag,
  gamepad: Gamepad2,
  car: Car,
  smartphone: Smartphone,
  home: Home,
  plane: Plane,
  heart: Heart,
  zap: Zap,
  globe: Globe,
  target: Target,
  swords: Swords,
  trophy: Trophy,
  flame: Flame,
  shield: Shield,
  star: Star,
  dollar: CircleDollarSign,
  landmark: Landmark,
  tag: Tag,
};

export function getIconePorId(id?: string | null) {
  if (!id) return Tag;
  return MAPA_ICONES[id.toLowerCase()] || Tag;
}

export function getClassesCor(cor?: string | null) {
  switch ((cor || '').toLowerCase()) {
    case 'purple':
      return {
        text: 'text-purple-400',
        bg: 'bg-purple-500',
        bgSoft: 'bg-purple-500/10',
        border: 'border-purple-500/30',
      };
    case 'orange':
    case 'brand':
      return {
        text: 'text-orange-400',
        bg: 'bg-orange-500',
        bgSoft: 'bg-orange-500/10',
        border: 'border-orange-500/30',
      };
    case 'emerald':
    case 'green':
    case 'success':
      return {
        text: 'text-emerald-400',
        bg: 'bg-emerald-500',
        bgSoft: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
      };
    case 'blue':
      return {
        text: 'text-blue-400',
        bg: 'bg-blue-500',
        bgSoft: 'bg-blue-500/10',
        border: 'border-blue-500/30',
      };
    case 'red':
    case 'danger':
      return {
        text: 'text-red-400',
        bg: 'bg-red-500',
        bgSoft: 'bg-red-500/10',
        border: 'border-red-500/30',
      };
    case 'yellow':
      return {
        text: 'text-yellow-400',
        bg: 'bg-yellow-500',
        bgSoft: 'bg-yellow-500/10',
        border: 'border-yellow-500/30',
      };
    default:
      return {
        text: 'text-gray-400',
        bg: 'bg-gray-400',
        bgSoft: 'bg-gray-500/10',
        border: 'border-gray-500/30',
      };
  }
}
