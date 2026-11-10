package com.murilo.api.repository.trades;

import org.springframework.data.jpa.repository.JpaRepository;

import com.murilo.api.model.trades.FreebetVoucher;

import java.util.UUID;

public interface FreebetVoucherRepository extends JpaRepository<FreebetVoucher, UUID> {
    // Aqui poderemos criar buscas customizadas depois, se precisar
}