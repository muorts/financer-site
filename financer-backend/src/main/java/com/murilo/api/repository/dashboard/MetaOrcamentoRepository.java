package com.murilo.api.repository.dashboard;

import com.murilo.api.model.dashboard.MetaOrcamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MetaOrcamentoRepository extends JpaRepository<MetaOrcamento, UUID> {

    List<MetaOrcamento> findByMesAndAno(Integer mes, Integer ano);

    Optional<MetaOrcamento> findByCategoriaIdAndMesAndAno(UUID categoriaId, Integer mes, Integer ano);
}
