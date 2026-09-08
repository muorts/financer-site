package com.murilo.api.service;

import com.murilo.api.model.CasaAposta;
import com.murilo.api.model.EntradaTrade;
import com.murilo.api.model.FreebetVoucher;
import com.murilo.api.model.Trade;
import com.murilo.api.repository.FreebetVoucherRepository;
import com.murilo.api.repository.TradeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // <-- Importação do Transactional aqui!

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TradeService {

    // <-- O tradeRepository declarado corretamente aqui!
    private final TradeRepository tradeRepository; 
    private final FreebetVoucherRepository freebetVoucherRepository;

    public List<Trade> listarTradesEmAndamento() {
        return tradeRepository.findByStatus("EM_ANDAMENTO");
    }

    public List<Trade> listarTodosTrades() {
        return tradeRepository.findAll();
    }

    @Transactional
    public Trade abrirTrade(Trade trade) {
        // Se vier do Frontend já FINALIZADO (Lucro Avulso), respeita o status. Se não, é EM_ANDAMENTO.
        if (trade.getStatus() == null || !trade.getStatus().equals("FINALIZADO")) {
            trade.setStatus("EM_ANDAMENTO");
        }
        
        // Permite custo zero (ex: Bônus de cassino não tiram dinheiro do bolso)
        if (trade.getValorTotalInvestido() == null || trade.getValorTotalInvestido() < 0) {
            throw new IllegalArgumentException("O valor investido não pode ser negativo.");
        }
        
        if (trade.getEntradas() != null) {
            trade.getEntradas().forEach(entrada -> entrada.setTrade(trade));
        }

        return tradeRepository.save(trade);
    }

    @Transactional
    public Trade resolverTrade(UUID tradeId, Double valorRecebido) {
        Trade trade = tradeRepository.findById(tradeId)
                .orElseThrow(() -> new RuntimeException("Operação não encontrada."));

        if ("FINALIZADO".equals(trade.getStatus())) {
            throw new IllegalStateException("Esta operação já foi finalizada.");
        }

        Double custoTotal = trade.getValorTotalInvestido();
        Double lucroLiquido = valorRecebido - custoTotal;

        trade.setLucroLiquidoReal(lucroLiquido);
        trade.setStatus("FINALIZADO");

        // GATILHO DA FREEBET
        if (trade.getValorFreebetEsperada() != null && trade.getValorFreebetEsperada() > 0) {
            CasaAposta casaPrincipal = trade.getEntradas().stream()
                .filter(e -> "PRINCIPAL".equalsIgnoreCase(e.getTipo()))
                .findFirst()
                .map(EntradaTrade::getCasaAposta)
                .orElse(null);

            if (casaPrincipal != null) {
                FreebetVoucher voucher = new FreebetVoucher();
                voucher.setValor(trade.getValorFreebetEsperada());
                voucher.setCasaAposta(casaPrincipal);
                voucher.setStatus("PENDENTE");
                voucher.setDataVencimento(LocalDate.now()); // Lança no dia atual
                
                freebetVoucherRepository.save(voucher);
            }
        }

        return tradeRepository.save(trade);
    }

    // ==========================================
    // NOVO MÉTODO DE SALVAR EDIÇÃO (COM ADIÇÃO E EXCLUSÃO)
    // ==========================================
    @Transactional
    public Trade atualizarEntradas(UUID tradeId, List<EntradaTrade> novasEntradas) {
        Trade trade = tradeRepository.findById(tradeId)
                .orElseThrow(() -> new RuntimeException("Operação não encontrada."));

        List<UUID> idsParaManter = novasEntradas.stream()
                .map(EntradaTrade::getId)
                .filter(java.util.Objects::nonNull)
                .toList();

        // 1. Remove quem foi deletado
        trade.getEntradas().removeIf(entradaAntiga -> 
                !"PRINCIPAL".equalsIgnoreCase(entradaAntiga.getTipo()) && 
                entradaAntiga.getId() != null && 
                !idsParaManter.contains(entradaAntiga.getId())
        );

        // 2. Atualiza e Adiciona
        for (EntradaTrade entradaNova : novasEntradas) {
            // Trava de segurança para o Java não explodir com o banco
            if (entradaNova.getCasaAposta() == null || entradaNova.getCasaAposta().getId() == null) {
                throw new IllegalArgumentException("Todas as entradas precisam ter uma Casa de Aposta válida.");
            }

            if (entradaNova.getId() != null) {
                trade.getEntradas().stream()
                        .filter(e -> e.getId().equals(entradaNova.getId()))
                        .findFirst()
                        .ifPresent(e -> {
                            e.setOdd(entradaNova.getOdd());
                            e.setStake(entradaNova.getStake());
                            e.setCasaAposta(entradaNova.getCasaAposta()); // O SEGREDO: AGORA PERMITE MUDAR A CASA!
                        });
            } else {
                entradaNova.setTrade(trade);
                entradaNova.setTipo("PROTECAO");
                entradaNova.setBackLay("LAY");
                entradaNova.setIsFreebet(false);
                trade.getEntradas().add(entradaNova);
            }
        }

        Double novoCustoTotal = trade.getEntradas().stream()
                .mapToDouble(EntradaTrade::getStake)
                .sum();
        trade.setValorTotalInvestido(novoCustoTotal);

        return tradeRepository.save(trade);
    }
}