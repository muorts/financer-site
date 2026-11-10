package com.murilo.api.model.dashboard;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Entity
@Table(name = "transacoes")
public class Transacao {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String descricao; // Ex: "Bolsa ICMC", "Venda PS Vita", "Lanche iFood"

    @Column(nullable = false)
    private Double valor;

    @Column(nullable = false)
    private String tipo; // "ENTRADA" ou "SAIDA"

    @Column(name = "metodo_pagamento")
    private String metodoPagamento = "PIX"; // "PIX", "DEBITO" ou "CREDITO"

    @Column(nullable = false)
    private LocalDate data; // Data em que a movimentação aconteceu

    // Relacionamento com a Categoria (Ex: Alimentação, Lazer, Salário)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;

    // Relacionamento com o Banco/Conta (Ex: Nubank, Inter)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "banco_id")
    private Banco banco;

    // ==========================================
    // CAMPOS PARA CARTÃO DE CRÉDITO / FATURAS
    // ==========================================
    @Column(name = "parcela_atual")
    private Integer parcelaAtual = 1;

    @Column(name = "total_parcelas")
    private Integer totalParcelas = 1;

    @Column(name = "grupo_parcelamento_id")
    private UUID grupoParcelamentoId; // Conecta todas as parcelas de uma mesma compra

    @Column(name = "mes_fatura")
    private Integer mesFatura; // Mês de referência da fatura (1-12)

    @Column(name = "ano_fatura")
    private Integer anoFatura; // Ano de referência da fatura (Ex: 2026)

    // Helper para formatar "1/3" na listagem de faturas do Frontend
    @Transient
    public String getParcelasFormatadas() {
        int atual = parcelaAtual != null ? parcelaAtual : 1;
        int total = totalParcelas != null ? totalParcelas : 1;
        return atual + "/" + total;
    }
}
