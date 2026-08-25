package com.murilo.api.controller;

import com.murilo.api.model.CasaAposta;
import com.murilo.api.service.CasaApostaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/casas")
@CrossOrigin(origins = "*") // Permite que o Next.js (rodando em outra porta) acesse a API
@RequiredArgsConstructor
public class CasaApostaController {

    private final CasaApostaService service;

    @GetMapping
    public ResponseEntity<List<CasaAposta>> listarTodas() {
        return ResponseEntity.ok(service.listarTodas());
    }

    @PostMapping
    public ResponseEntity<CasaAposta> cadastrarCasa(@RequestBody CasaAposta casaAposta) {
        CasaAposta novaCasa = service.salvarCasa(casaAposta);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaCasa);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarCasa(@PathVariable UUID id) {
        service.deletarCasa(id);
        return ResponseEntity.noContent().build();
    }
}