package com.murilo.api.model.sales;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.LocalDate;
import java.util.UUID;

@Data
@Entity
@Table(name = "custos_extras_item")
public class CustoExtraItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_estoque_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private ItemEstoque itemEstoque;

    @Column(nullable = false)
    private String descricao; // Ex: "Troca de analógico", "Película de vidro"

    @Column(nullable = false)
    private Double valor;

    @Column(nullable = false)
    private LocalDate data;
}
