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

    //Guarda o valor da freebet que será gerada no futuro
    @Column(name = "valor_freebet_esperada")
    private Double valorFreebetEsperada;

    // Relacionamento: Um Trade tem várias entradas
    // O CascadeType.ALL e o orphanRemoval=true garantem que se o Trade for excluído, as Entradas dele também serão destruídas.
    @OneToMany(mappedBy = "trade", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EntradaTrade> entradas;
}