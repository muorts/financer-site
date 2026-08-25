package com.murilo.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;

@Data
@Entity
@Table(name = "casas_aposta")
public class CasaAposta {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String tipo; // "TRADICIONAL" ou "EXCHANGE"

    @Column(nullable = false)
    private String cor;

    @Column(nullable = false)
    private String iconeId;
}