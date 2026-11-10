package com.murilo.api.controller.dashboard;

import com.murilo.api.dto.request.AjusteDatasFaturaRequest;
import com.murilo.api.model.dashboard.Banco;
import com.murilo.api.service.BancoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/bancos")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class BancoController {

    private final BancoService bancoService;

    @GetMapping
    public ResponseEntity<List<Banco>> listarTodos() {
        return ResponseEntity.ok(bancoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Banco> buscarPorId(@PathVariable UUID id) {
        return ResponseEntity.ok(bancoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<Banco> cadastrarBanco(@RequestBody Banco banco) {
        Banco salvo = bancoService.cadastrarBanco(banco);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Banco> atualizarBanco(@PathVariable UUID id, @RequestBody Banco banco) {
        return ResponseEntity.ok(bancoService.atualizarBanco(id, banco));
    }

    @PatchMapping("/{id}/datas-fatura")
    public ResponseEntity<Banco> ajustarDatasFatura(
            @PathVariable UUID id,
            @RequestBody AjusteDatasFaturaRequest request) {
        return ResponseEntity.ok(
                bancoService.ajustarDatasFatura(id, request.getDiaFechamento(), request.getDiaVencimento())
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarBanco(@PathVariable UUID id) {
        bancoService.deletarBanco(id);
        return ResponseEntity.noContent().build();
    }
}
