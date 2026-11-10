package com.murilo.api.model.dashboard;

import lombok.Data;
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

    @Data
    public static class CategoriaResumo {
        private String categoria;
        private Double valor;
        private Integer percentual;
        private String corTexto;
        private String corBarra;

        public CategoriaResumo(String categoria, Double valor, Integer percentual, String corTexto, String corBarra) {
            this.categoria = categoria;
            this.valor = valor;
            this.percentual = percentual;
            this.corTexto = corTexto;
            this.corBarra = corBarra;
        }
    }
}