package com.murilo.api.repository.dashboard;

import com.murilo.api.model.dashboard.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, UUID> {

    List<Categoria> findAllByOrderByNomeAsc();

    List<Categoria> findByTipoOrderByNomeAsc(String tipo);
}
