"use client";

import { Globe, Target, Swords, ShieldCheck } from 'lucide-react';
import { CabecalhoPagina } from '@/components/ui/Header';
import { CardInformacao } from '@/components/ui/CardInformation'; 
import { AcordeaoCasa, CasaComprovaBet } from '@/components/trades/AcordeaoCasa';

// ==========================================
// MOCK DE DADOS: O SEU EXTRATO MESTRE
// (Mantenha o array CASAS_AUDITORIA gigante que fizemos na mensagem anterior)
// ==========================================
const CASAS_AUDITORIA: CasaComprovaBet[] = [
  // ... seus dados mockados continuam aqui
];

export default function ComprovaBet() {
  return (
    <div className="flex flex-col p-4 md:p-6 gap-6 max-w-[900px] mx-auto pb-24">
      
      {/* CABEÇALHO */}
      <CabecalhoPagina 
        titulo="ComprovaBet" 
        descricao="Auditoria, extratos e histórico de P&L de cada plataforma."
        caminhoVoltar="/trades" 
      />

      {/* COMPONENTE MODULARIZADO DO CARD */}
      <CardInformacao 
        titulo="Seu Escudo Contra Bloqueios"
        descricao="As casas de apostas podem exigir auditoria para liberar saques altos. Utilize esta aba para exportar o extrato completo e comprovar a origem de todas as suas entradas e depósitos de forma transparente."
        icone={ShieldCheck}
        tema="brand"
      />

      {/* LISTA DE ACORDEÕES DAS CASAS */}
      <div className="flex flex-col gap-4">
        {CASAS_AUDITORIA.map((casa) => (
          <AcordeaoCasa key={casa.id} casa={casa} />
        ))}
      </div>

    </div>
  );
}