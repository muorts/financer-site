package com.murilo.api.controller;

import com.murilo.api.model.FreebetVoucher;
import com.murilo.api.repository.FreebetVoucherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/freebets")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class FreebetController {

    private final FreebetVoucherRepository freebetRepository;

    @GetMapping("/pendentes")
    public ResponseEntity<List<Map<String, Object>>> listarPendentes() {
        // Busca todas as freebets
        List<FreebetVoucher> pendentes = freebetRepository.findAll().stream()
                .filter(fb -> "PENDENTE".equals(fb.getStatus()))
                .collect(Collectors.toList());

        // Mapeia usando HashMap explícito para evitar erro de inferência de tipo do Java
        List<Map<String, Object>> resposta = pendentes.stream().map(fb -> {
            Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", fb.getId());
            map.put("valor", fb.getValor());
            map.put("vencimento", fb.getDataVencimento() != null ? fb.getDataVencimento().toString() : "");
            map.put("casa", fb.getCasaAposta() != null ? fb.getCasaAposta().getNome() : "Desconhecida");
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(resposta);
    }

    // ==========================================
    // ROTA PARA CRIAR UMA NOVA FREEBET (MISSÃO)
    // ==========================================
    @PostMapping
    public ResponseEntity<?> criarFreebet(@RequestBody FreebetVoucher novaFreebet) {
        try {
            // O React já manda o JSON no formato perfeito: { valor, status, dataVencimento, casaAposta: { id } }
            // O Hibernate entende isso automaticamente e faz a relação com a Casa de Aposta!
            FreebetVoucher freebetSalva = freebetRepository.save(novaFreebet);
            
            return ResponseEntity.ok(freebetSalva);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro interno ao salvar a freebet: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletarFreebet(@PathVariable UUID id) {
        // Encontra a freebet
        FreebetVoucher voucher = freebetRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Freebet não encontrada"));
            
        // Podemos deletar de verdade do banco, ou só mudar o status para histórico.
        // Mudar o status é mais seguro para não perder histórico financeiro!
        voucher.setStatus("EXPIRADA");
        freebetRepository.save(voucher);
        
        return ResponseEntity.ok().build();
    }

    
}