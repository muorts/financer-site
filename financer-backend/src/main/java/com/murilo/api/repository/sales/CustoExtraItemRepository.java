package com.murilo.api.repository.sales;

import com.murilo.api.model.sales.CustoExtraItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CustoExtraItemRepository extends JpaRepository<CustoExtraItem, UUID> {

    List<CustoExtraItem> findByItemEstoqueIdOrderByDataDesc(UUID itemEstoqueId);
}
