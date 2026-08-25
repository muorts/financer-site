package com.murilo.api.dto.request;

import lombok.Data;

@Data
public class ResolverTradeRequest {
    // Essa é a única informação que o Next.js precisa mandar quando clicar em "Dar Baixa"
    private Double valorRecebido;
}