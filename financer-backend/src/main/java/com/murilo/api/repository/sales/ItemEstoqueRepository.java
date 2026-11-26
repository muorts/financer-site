package com.murilo.api.repository.sales;

import com.murilo.api.model.sales.ItemEstoque;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ItemEstoqueRepository extends JpaRepository<ItemEstoque, UUID> {

    List<ItemEstoque> findByStatusNotOrderByDataCompraDesc(String status);

    List<ItemEstoque> findAllByOrderByDataCompraDesc();

    boolean existsByBancoCompraId(UUID bancoId);

    boolean existsByCategoriaVendaId(UUID categoriaVendaId);
}
