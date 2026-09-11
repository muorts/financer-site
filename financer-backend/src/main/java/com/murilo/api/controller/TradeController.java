package com.murilo.api.controller;

import com.murilo.api.dto.request.ResolverTradeRequest;
import com.murilo.api.model.Trade;
import com.murilo.api.service.TradeService;
import com.murilo.api.repository.TradeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/trades")
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
@RequiredArgsConstructor
public class TradeController {

    private final TradeService tradeService;
    private final TradeRepository tradeRepository; 

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

    // ==========================================
    // ROTA PARA SALVAR A EDIÇÃO DE ODDS E STAKES
    // ==========================================
    @PutMapping("/{id}/entradas")
    public ResponseEntity<?> atualizarEntradas(@PathVariable java.util.UUID id, @RequestBody java.util.List<com.murilo.api.model.EntradaTrade> entradasAtualizadas) {
        try {
            com.murilo.api.model.Trade tradeAtualizado = tradeService.atualizarEntradas(id, entradasAtualizadas);
            return ResponseEntity.ok(tradeAtualizado);
        } catch (Exception e) {
            e.printStackTrace(); // Vai imprimir o erro no terminal se algo der errado
            return ResponseEntity.badRequest().body("Erro ao atualizar: " + e.getMessage());
        }
    }

    // ==========================================
    // ROTA PARA DELETAR OPERAÇÃO COMPLETAMENTE
    // ==========================================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarTrade(@PathVariable UUID id) {
        try {
            // Verifica se a operação existe
            if (!tradeRepository.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
            
            // Exclui permanentemente do banco de dados
            tradeRepository.deleteById(id);
            return ResponseEntity.ok().build();
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao excluir a operação: " + e.getMessage());
        }
    }
}

