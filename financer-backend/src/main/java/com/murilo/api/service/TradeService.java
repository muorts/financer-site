package com.murilo.api.service;

import com.murilo.api.model.Trade;
import com.murilo.api.repository.TradeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TradeService {

    private final TradeRepository tradeRepository;

    public List<Trade> listarTradesEmAndamento() {
        return tradeRepository.findByStatus("EM_ANDAMENTO");
    }

    public List<Trade> listarTodosTrades() {
        return tradeRepository.findAll();
    }

    @Transactional
    public Trade abrirTrade(Trade trade) {
        trade.setStatus("EM_ANDAMENTO");
        
        // Garante que o valor total investido é maior que zero
        if (trade.getValorTotalInvestido() == null || trade.getValorTotalInvestido() <= 0) {
            throw new IllegalArgumentException("O valor investido deve ser maior que zero.");
        }
        
        // Relaciona as entradas ao Trade pai para o Hibernate salvar em cascata
        if (trade.getEntradas() != null) {
            trade.getEntradas().forEach(entrada -> entrada.setTrade(trade));
        }

        return tradeRepository.save(trade);
    }

    // ========================================================
    // A LÓGICA DE DAR BAIXA NA OPERAÇÃO (Cálculo de Lucro)
    // ========================================================
    @Transactional
    public Trade resolverTrade(UUID tradeId, Double valorRecebido) {
        // 1. Busca a operação no banco de dados
        Trade trade = tradeRepository.findById(tradeId)
                .orElseThrow(() -> new RuntimeException("Operação não encontrada com o ID informado."));

        // 2. Proteção: Verifica se já não foi finalizada antes
        if ("FINALIZADO".equals(trade.getStatus())) {
            throw new IllegalStateException("Esta operação já foi finalizada.");
        }

        // 3. A Matemática: Lucro Líquido = (O que voltou) - (O que foi gasto em todas as casas)
        Double custoTotal = trade.getValorTotalInvestido();
        Double lucroLiquido = valorRecebido - custoTotal;

        // 4. Atualiza os dados da operação
        trade.setLucroLiquidoReal(lucroLiquido);
        trade.setStatus("FINALIZADO");

        // 5. Salva no banco de dados e retorna a operação atualizada
        return tradeRepository.save(trade);
    }
}