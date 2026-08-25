package com.murilo.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Entity
@Table(name = "trades")
public class Trade {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String jogo;

    @Column(nullable = false)
    private String mercado;

    @Column(nullable = false)
    private String status; // "EM_ANDAMENTO" ou "FINALIZADO"

    @Column(name = "valor_total_investido")
    private Double valorTotalInvestido;

    @Column(name = "lucro_liquido_real")
    private Double lucroLiquidoReal;

    @Column(name = "data_criacao", nullable = false, updatable = false)
    private LocalDateTime dataCriacao = LocalDateTime.now();

    // Relacionamento: Um Trade tem várias entradas
    @OneToMany(mappedBy = "trade", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EntradaTrade> entradas;
}