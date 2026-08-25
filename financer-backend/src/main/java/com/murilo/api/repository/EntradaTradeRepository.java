package com.murilo.api.repository;

import com.murilo.api.model.EntradaTrade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface EntradaTradeRepository extends JpaRepository<EntradaTrade, UUID> {
}