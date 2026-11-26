package com.murilo.api.dto.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class NovoCustoExtraRequest {
    private String descricao;
    private Double valor;
    private LocalDate data;
}
