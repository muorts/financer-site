package com.murilo.api.model.sales;

import com.murilo.api.model.dashboard.Banco;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@Entity
@Table(name = "itens_estoque")
public class ItemEstoque {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String nome; // Ex: "PS Vita FAT PCH-1000", "Nintendo 3DS XL"

    @Column(nullable = false)
    private String condicao = "USADO"; // "NOVO" ou "USADO"

    @Column(nullable = false)
    private String status = "PRONTO"; // "MANUTENCAO", "PRONTO", "ANUNCIADO", "VENDIDO"

    @Column(name = "custo_aquisicao", nullable = false)
    private Double custoAquisicao = 0.0;

    @Column(name = "data_compra", nullable = false)
    private LocalDate dataCompra;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "categoria_venda_id")
    private CategoriaVenda categoriaVenda;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "banco_compra_id")
    private Banco bancoCompra;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "item_estoque_plataformas",
        joinColumns = @JoinColumn(name = "item_estoque_id"),
        inverseJoinColumns = @JoinColumn(name = "plataforma_venda_id")
    )
    private List<PlataformaVenda> plataformas = new ArrayList<>();

    @OneToMany(
        mappedBy = "itemEstoque",
        cascade = CascadeType.ALL,
        orphanRemoval = true,
        fetch = FetchType.EAGER
    )
    @OrderBy("data DESC")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<CustoExtraItem> custosExtras = new ArrayList<>();
}
