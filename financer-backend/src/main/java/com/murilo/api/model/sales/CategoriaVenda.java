package com.murilo.api.model.sales;

import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Data
@Entity
@Table(name = "categorias_venda")
public class CategoriaVenda {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String nome; // Ex: "Consoles & Portáteis", "Placas de Vídeo / GPU"

    @Column(nullable = false)
    private String cor = "purple";

    @Column(nullable = false)
    private String icone = "gamepad";
}
