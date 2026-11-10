package com.murilo.api.dto.request;

import lombok.Data;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class NovaTransacaoRequest {
    private String descricao;
    private Double valor;
    private String tipo; // "ENTRADA" ou "SAIDA"
    private String metodoPagamento; // "PIX", "DEBITO" ou "CREDITO"
    private LocalDate data;
    private UUID categoriaId;
    private UUID bancoId;
    private Integer totalParcelas; // Opcional (default = 1). Para compras parceladas no CRÉDITO.
}
