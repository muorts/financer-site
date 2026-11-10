package com.murilo.api.model.dashboard;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;

@Data
@Entity
@Table(name = "bancos")
public class Banco {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String nome; // Ex: "Nubank - Giro", "Inter - Reserva"

    @Column(nullable = false)
    private String tipo; // "GIRO" ou "RESERVA"

    @Column(nullable = false)
    private String cor; // Ex: "purple", "orange", "emerald", "blue"

    @Column(name = "saldo_inicial", nullable = false)
    private Double saldoInicial = 0.0;

    @Column(name = "saldo_atual", nullable = false)
    private Double saldoAtual = 0.0;

    @Column(name = "dia_fechamento")
    private Integer diaFechamento = 3; // Dia do mês em que a fatura fecha (1-31)

    @Column(name = "dia_vencimento")
    private Integer diaVencimento = 10; // Dia do mês em que a fatura vence (1-31)
}
