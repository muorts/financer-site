package com.murilo.api.repository.trades;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.murilo.api.model.trades.CasaAposta;

import java.util.UUID;

@Repository
public interface CasaApostaRepository extends JpaRepository<CasaAposta, UUID> {
    // Só de herdar o JpaRepository, você já ganhou os métodos:
    // save(), findAll(), findById(), deleteById() de graça!
}