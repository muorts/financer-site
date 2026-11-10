package com.murilo.api.dto.request;

import lombok.Data;

@Data
public class AjusteDatasFaturaRequest {
    private Integer diaFechamento;
    private Integer diaVencimento;
}
