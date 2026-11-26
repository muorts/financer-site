package com.murilo.api.dto.request;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
public class NovoItemEstoqueRequest {
    private String nome;
    private String condicao; // "NOVO" ou "USADO"
    private String status;   // "MANUTENCAO", "PRONTO" ou "ANUNCIADO"
    private Double custoAquisicao;
    private LocalDate dataCompra;
    private String observacoes;
    private UUID categoriaVendaId;
    private UUID bancoCompraId;
    private List<UUID> plataformaIds;
    private List<String> plataformasNomes;
}
