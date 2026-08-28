package com.murilo.api.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "freebets_pendentes")
public class FreebetVoucher {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    private Double valor;

    private LocalDate dataVencimento;

    private String status; // Ex: "PENDENTE", "USADA", "EXPIRADA"

    // Relacionamento para sabermos a qual casa essa freebet pertence (para puxar a logo)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "casa_aposta_id", nullable = false)
    private CasaAposta casaAposta;

    // Construtor vazio obrigatório do JPA
    public FreebetVoucher() {}

    // Getters e Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Double getValor() { return valor; }
    public void setValor(Double valor) { this.valor = valor; }

    public LocalDate getDataVencimento() { return dataVencimento; }
    public void setDataVencimento(LocalDate dataVencimento) { this.dataVencimento = dataVencimento; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public CasaAposta getCasaAposta() { return casaAposta; }
    public void setCasaAposta(CasaAposta casaAposta) { this.casaAposta = casaAposta; }
}