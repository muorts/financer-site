package com.murilo.api.dto.request;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class AtualizarItemEstoqueRequest {
    private String nome;
    private String condicao; // "NOVO" ou "USADO"
    private String status;   // "MANUTENCAO", "PRONTO", "ANUNCIADO" ou "VENDIDO"
    private String observacoes;
    private UUID categoriaVendaId;
    private Boolean limparCategoria;
    private List<UUID> plataformaIds;
    private List<String> plataformasNomes;
}
