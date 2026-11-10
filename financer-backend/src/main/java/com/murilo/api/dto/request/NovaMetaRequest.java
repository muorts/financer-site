package com.murilo.api.dto.request;

import lombok.Data;
import java.util.UUID;

@Data
public class NovaMetaRequest {
    private UUID categoriaId;
    private Double limiteMaximo;
    private Integer mes; // Opcional (se nulo, usa o mês atual)
    private Integer ano; // Opcional (se nulo, usa o ano atual)
}
