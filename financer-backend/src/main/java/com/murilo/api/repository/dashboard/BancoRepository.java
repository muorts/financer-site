package com.murilo.api.repository.dashboard;

import com.murilo.api.model.dashboard.Banco;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BancoRepository extends JpaRepository<Banco, UUID> {

    List<Banco> findAllByOrderByNomeAsc();

    List<Banco> findByTipoOrderByNomeAsc(String tipo);

    @Query("SELECT COALESCE(SUM(b.saldoAtual), 0.0) FROM Banco b WHERE b.tipo = :tipo")
    Double somarSaldoPorTipo(@Param("tipo") String tipo);
}
