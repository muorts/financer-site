package com.murilo.api.model.sales;

import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Data
@Entity
@Table(name = "plataformas_venda")
public class PlataformaVenda {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String nome; // Ex: "OLX", "Mercado Livre", "Facebook Marketplace"

    @Column(nullable = false)
    private String cor = "purple";

    @Column(nullable = false)
    private String icone = "shopping";
}
