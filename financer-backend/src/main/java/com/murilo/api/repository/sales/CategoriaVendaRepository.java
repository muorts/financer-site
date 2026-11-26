package com.murilo.api.repository.sales;

import com.murilo.api.model.sales.CategoriaVenda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CategoriaVendaRepository extends JpaRepository<CategoriaVenda, UUID> {

    List<CategoriaVenda> findAllByOrderByNomeAsc();
}
