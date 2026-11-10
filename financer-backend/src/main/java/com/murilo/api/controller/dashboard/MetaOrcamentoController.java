package com.murilo.api.controller.dashboard;

import com.murilo.api.dto.request.NovaMetaRequest;
import com.murilo.api.dto.response.ResumoMetasResponse;
import com.murilo.api.model.dashboard.MetaOrcamento;
import com.murilo.api.service.MetaOrcamentoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/metas")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class MetaOrcamentoController {

    private final MetaOrcamentoService metaOrcamentoService;

    @GetMapping
    public ResponseEntity<ResumoMetasResponse> obterResumoMetas(
            @RequestParam(required = false) Integer mes,
            @RequestParam(required = false) Integer ano) {
        return ResponseEntity.ok(metaOrcamentoService.obterResumoDoMes(mes, ano));
    }

    @PostMapping
    public ResponseEntity<MetaOrcamento> salvarMeta(@RequestBody NovaMetaRequest request) {
        MetaOrcamento salva = metaOrcamentoService.salvarOuAtualizarMeta(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(salva);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarMeta(@PathVariable UUID id) {
        metaOrcamentoService.deletarMeta(id);
        return ResponseEntity.noContent().build();
    }
}
