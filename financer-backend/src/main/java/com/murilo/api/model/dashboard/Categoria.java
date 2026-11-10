package com.murilo.api.model.dashboard;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;

@Data
@Entity
@Table(name = "categorias")
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String nome; // Ex: "Alimentação", "Jogos / Lazer", "Salário / Vendas"

    @Column(nullable = false)
    private String tipo; // "ENTRADA" ou "SAIDA"

    @Column(nullable = false)
    private String cor; // Ex: "emerald", "purple", "blue"

    @Column(nullable = false)
    private String icone; // Ex: "utensils", "gamepad", "shopping", "car", "smartphone"
}
