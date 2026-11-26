package com.murilo.api.repository.sales;

import com.murilo.api.model.sales.PlataformaVenda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PlataformaVendaRepository extends JpaRepository<PlataformaVenda, UUID> {

    List<PlataformaVenda> findAllByOrderByNomeAsc();

    Optional<PlataformaVenda> findByNomeIgnoreCase(String nome);
}
