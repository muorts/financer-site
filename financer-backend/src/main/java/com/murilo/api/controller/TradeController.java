package com.murilo.api.controller;

import com.murilo.api.dto.request.ResolverTradeRequest;
import com.murilo.api.model.Trade;
import com.murilo.api.service.TradeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/trades")
@CrossOrigin(origins = "*") 
@RequiredArgsConstructor
public class TradeController {

    private final TradeService tradeService;

    // Busca todas as operações que estão na aba "Visão Tática" (Em Andamento)
    @GetMapping("/andamento")
    public ResponseEntity<List<Trade>> listarEmAndamento() {
        return ResponseEntity.ok(tradeService.listarTradesEmAndamento());
    }

    // Histórico completo para o ComprovaBet
    @GetMapping
    public ResponseEntity<List<Trade>> listarTodos() {
        return ResponseEntity.ok(tradeService.listarTodosTrades());
    }

    // Abre uma nova operação
    @PostMapping
    public ResponseEntity<Trade> abrirTrade(@RequestBody Trade trade) {
        Trade novoTrade = tradeService.abrirTrade(trade);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoTrade);
    }

    // Rota que é chamada pelo botão "Dar Baixa" lá do Modal do Frontend!
    @PostMapping("/{id}/resolver")
    public ResponseEntity<Trade> resolverTrade(
            @PathVariable UUID id,
            @RequestBody ResolverTradeRequest request) {
        
        // Passa a bola para o Service fazer o cálculo de lucro
        Trade tradeFinalizado = tradeService.resolverTrade(id, request.getValorRecebido());
        return ResponseEntity.ok(tradeFinalizado);
    }
}