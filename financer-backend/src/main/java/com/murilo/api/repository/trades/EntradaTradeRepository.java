package com.murilo.api.repository.trades;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.murilo.api.model.trades.EntradaTrade;

import java.util.UUID;

@Repository
public interface EntradaTradeRepository extends JpaRepository<EntradaTrade, UUID> {
}