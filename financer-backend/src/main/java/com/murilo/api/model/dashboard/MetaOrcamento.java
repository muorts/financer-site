package com.murilo.api.model.dashboard;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;

@Data
@Entity
@Table(
    name = "metas_orcamento",
    uniqueConstraints = @UniqueConstraint(columnNames = {"categoria_id", "mes", "ano"})
)
public class MetaOrcamento {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    @Column(name = "limite_maximo", nullable = false)
    private Double limiteMaximo;

    @Column(nullable = false)
    private Integer mes; // 1 a 12

    @Column(nullable = false)
    private Integer ano; // Ex: 2026
}
