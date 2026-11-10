package com.murilo.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResumoMetasResponse {
    private Integer mes;
    private Integer ano;
    private Double orcamentoTotal;
    private Double gastoTotal;
    private Double restanteGeral;
    private List<MetaItemResponse> metas;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MetaItemResponse {
        private UUID id;
        private UUID categoriaId;
        private String categoriaNome;
        private String categoriaCor;
        private String categoriaIcone;
        private Double gastoAtual;
        private Double limiteMaximo;
        private Double percentual;
    }
}
