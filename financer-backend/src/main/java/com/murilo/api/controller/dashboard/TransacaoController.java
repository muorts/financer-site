package com.murilo.api.controller.dashboard;

import com.murilo.api.dto.request.NovaTransacaoRequest;
import com.murilo.api.dto.response.FaturaResumoResponse;
import com.murilo.api.model.dashboard.Transacao;
import com.murilo.api.service.TransacaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/transacoes")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class TransacaoController {

    private final TransacaoService transacaoService;

    @GetMapping
    public ResponseEntity<List<Transacao>> listarTransacoes(
            @RequestParam(required = false) Integer mes,
            @RequestParam(required = false) Integer ano) {
        return ResponseEntity.ok(transacaoService.listarTransacoes(mes, ano));
    }

    @PostMapping
    public ResponseEntity<Transacao> salvarTransacao(@RequestBody NovaTransacaoRequest request) {
        Transacao salva = transacaoService.registrarTransacao(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(salva);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarTransacao(
            @PathVariable UUID id,
            @RequestParam(defaultValue = "false") boolean deletarTodasParcelas) {
        transacaoService.deletarTransacao(id, deletarTodasParcelas);
        return ResponseEntity.noContent().build();
    }

    // ==========================================
    // ROTAS DE FATURAS DE CARTÃO DE CRÉDITO
    // ==========================================
    @GetMapping("/faturas")
    public ResponseEntity<List<FaturaResumoResponse>> listarResumoFaturas(
            @RequestParam(required = false) Integer mes,
            @RequestParam(required = false) Integer ano) {
        return ResponseEntity.ok(transacaoService.listarResumoFaturas(mes, ano));
    }

    @GetMapping("/faturas/{bancoId}")
    public ResponseEntity<FaturaResumoResponse> obterFaturaDoBanco(
            @PathVariable UUID bancoId,
            @RequestParam(required = false) Integer mes,
            @RequestParam(required = false) Integer ano) {
        return ResponseEntity.ok(transacaoService.obterFaturaDoBanco(bancoId, mes, ano));
    }
}
