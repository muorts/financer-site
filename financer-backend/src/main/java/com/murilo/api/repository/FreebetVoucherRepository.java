package com.murilo.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import com.murilo.api.model.FreebetVoucher;

public interface FreebetVoucherRepository extends JpaRepository<FreebetVoucher, UUID> {
    // Aqui poderemos criar buscas customizadas depois, se precisar
}