package com.murilo.api.repository;

import com.murilo.api.model.Trade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TradeRepository extends JpaRepository<Trade, UUID> {
    
    // Podemos criar buscas personalizadas só escrevendo o nome do método em inglês:
    // Exemplo: Buscar todos os trades que ainda estão em andamento
    List<Trade> findByStatus(String status);
}