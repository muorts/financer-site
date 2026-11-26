package com.murilo.api.dto.response;

import com.murilo.api.model.dashboard.Banco;
import com.murilo.api.model.sales.CategoriaVenda;
import com.murilo.api.model.sales.CustoExtraItem;
import com.murilo.api.model.sales.ItemEstoque;
import com.murilo.api.model.sales.PlataformaVenda;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ItemEstoqueResponse {
    private UUID id;
    private String nome;
    private String condicao;
    private String status;
    private Double custoAquisicao;
    private Double totalCustosExtras;
    private Double custoTotal;
    private LocalDate dataCompra;
    private String observacoes;
    private CategoriaVenda categoriaVenda;
    private Banco bancoCompra;
    private List<PlataformaVenda> plataformas;
    private List<CustoExtraItem> custosExtras;

    public static ItemEstoqueResponse fromEntity(ItemEstoque item) {
        double aquisicao = item.getCustoAquisicao() != null ? item.getCustoAquisicao() : 0.0;
        List<CustoExtraItem> custos = item.getCustosExtras() != null ? item.getCustosExtras() : List.of();
        double somaExtras = custos.stream()
                .mapToDouble(c -> c.getValor() != null ? c.getValor() : 0.0)
                .sum();

        double extrasArredondado = Math.round(somaExtras * 100.0) / 100.0;
        double totalArredondado = Math.round((aquisicao + extrasArredondado) * 100.0) / 100.0;

        return new ItemEstoqueResponse(
                item.getId(),
                item.getNome(),
                item.getCondicao(),
                item.getStatus(),
                aquisicao,
                extrasArredondado,
                totalArredondado,
                item.getDataCompra(),
                item.getObservacoes(),
                item.getCategoriaVenda(),
                item.getBancoCompra(),
                item.getPlataformas() != null ? List.copyOf(item.getPlataformas()) : List.of(),
                List.copyOf(custos)
        );
    }
}
