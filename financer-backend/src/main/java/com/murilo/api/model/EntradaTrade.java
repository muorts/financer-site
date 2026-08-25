package com.murilo.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;

@Data
@Entity
@Table(name = "entradas_trade")
public class EntradaTrade {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String tipo; // "PRINCIPAL" ou "PROTECAO"

    @Column(name = "back_lay", nullable = false)
    private String backLay; // "BACK" ou "LAY"

    @Column(nullable = false)
    private Double odd;

    @Column(nullable = false)
    private Double stake; // Valor investido ou Responsabilidade (no caso do LAY)

    @Column(name = "is_freebet", nullable = false)
    private Boolean isFreebet;

    // A qual Trade essa entrada pertence
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trade_id", nullable = false)
    private Trade trade;

    // Em qual Casa de Aposta essa entrada foi feita
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "casa_id", nullable = false)
    private CasaAposta casaAposta;
}