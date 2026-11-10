package com.murilo.api.service;

import com.murilo.api.model.dashboard.Categoria;
import com.murilo.api.repository.dashboard.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public List<Categoria> listarCategorias(String tipo) {
        if (tipo != null && !tipo.isBlank()) {
            return categoriaRepository.findByTipoOrderByNomeAsc(tipo.toUpperCase());
        }
        return categoriaRepository.findAllByOrderByNomeAsc();
    }

    public Categoria buscarPorId(UUID id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada."));
    }

    @Transactional
    public Categoria salvarCategoria(Categoria categoria) {
        if (categoria.getNome() == null || categoria.getNome().trim().isEmpty()) {
            throw new IllegalArgumentException("O nome da categoria é obrigatório.");
        }

        categoria.setTipo(categoria.getTipo() != null ? categoria.getTipo().toUpperCase() : "SAIDA");
        if (categoria.getCor() == null || categoria.getCor().isBlank()) {
            categoria.setCor("emerald");
        }
        if (categoria.getIcone() == null || categoria.getIcone().isBlank()) {
            categoria.setIcone("utensils");
        }

        return categoriaRepository.save(categoria);
    }

    @Transactional
    public Categoria atualizarCategoria(UUID id, Categoria dados) {
        Categoria existente = buscarPorId(id);

        if (dados.getNome() != null && !dados.getNome().isBlank()) {
            existente.setNome(dados.getNome());
        }
        if (dados.getTipo() != null && !dados.getTipo().isBlank()) {
            existente.setTipo(dados.getTipo().toUpperCase());
        }
        if (dados.getCor() != null && !dados.getCor().isBlank()) {
            existente.setCor(dados.getCor());
        }
        if (dados.getIcone() != null && !dados.getIcone().isBlank()) {
            existente.setIcone(dados.getIcone());
        }

        return categoriaRepository.save(existente);
    }

    @Transactional
    public void deletarCategoria(UUID id) {
        if (!categoriaRepository.existsById(id)) {
            throw new RuntimeException("Categoria não encontrada.");
        }
        categoriaRepository.deleteById(id);
    }
}
