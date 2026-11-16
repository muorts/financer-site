package com.murilo.api.model.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
public class DashboardResumo {
    private Double lucroLiquido;
    private Double entradasBrutas;
    private Double saidasTotais;
    private Double aportesMes;
    private Integer operacoesConcluidas;
    private List<CategoriaResumo> raioX;
    private List<CategoriaResumo> raioXSaidas;
    private List<PontoEvolucao> evolucao;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoriaResumo {
        private String categoria;
        private Double valor;
        private Integer percentual;
        private String corTexto;
        private String corBarra;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PontoEvolucao {
        private String label;
        private Double patrimonioTotal;
        private Double capitalLiquido;
    }
}
