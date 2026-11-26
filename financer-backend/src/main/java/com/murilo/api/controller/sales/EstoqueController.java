package com.murilo.api.controller.sales;

import com.murilo.api.dto.request.AtualizarItemEstoqueRequest;
import com.murilo.api.dto.request.NovoCustoExtraRequest;
import com.murilo.api.dto.request.NovoItemEstoqueRequest;
import com.murilo.api.dto.response.ItemEstoqueResponse;
import com.murilo.api.dto.response.OpcoesEstoqueResponse;
import com.murilo.api.service.EstoqueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/estoque")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class EstoqueController {

    private final EstoqueService estoqueService;

    @GetMapping
    public ResponseEntity<List<ItemEstoqueResponse>> listarItensAtivos() {
        return ResponseEntity.ok(estoqueService.listarItensAtivos());
    }

    @GetMapping("/opcoes")
    public ResponseEntity<OpcoesEstoqueResponse> listarOpcoes() {
        return ResponseEntity.ok(estoqueService.listarOpcoes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemEstoqueResponse> buscarPorId(@PathVariable UUID id) {
        return ResponseEntity.ok(estoqueService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<ItemEstoqueResponse> criarItem(@RequestBody NovoItemEstoqueRequest request) {
        ItemEstoqueResponse salvo = estoqueService.criarItem(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ItemEstoqueResponse> atualizarItem(
            @PathVariable UUID id,
            @RequestBody AtualizarItemEstoqueRequest request) {
        return ResponseEntity.ok(estoqueService.atualizarItem(id, request));
    }

    @PostMapping("/{id}/custos")
    public ResponseEntity<ItemEstoqueResponse> adicionarCustoExtra(
            @PathVariable UUID id,
            @RequestBody NovoCustoExtraRequest request) {
        ItemEstoqueResponse atualizado = estoqueService.adicionarCustoExtra(id, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(atualizado);
    }

    @DeleteMapping("/{id}/custos/{custoId}")
    public ResponseEntity<ItemEstoqueResponse> removerCustoExtra(
            @PathVariable UUID id,
            @PathVariable UUID custoId) {
        return ResponseEntity.ok(estoqueService.removerCustoExtra(id, custoId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarItem(@PathVariable UUID id) {
        estoqueService.deletarItem(id);
        return ResponseEntity.noContent().build();
    }
}
