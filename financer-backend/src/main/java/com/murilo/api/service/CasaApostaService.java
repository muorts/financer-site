package com.murilo.api.service;

import com.murilo.api.model.CasaAposta;
import com.murilo.api.repository.CasaApostaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CasaApostaService {

    // O Spring injeta o Repository automaticamente graças ao @RequiredArgsConstructor do Lombok
    private final CasaApostaRepository repository;

    public List<CasaAposta> listarTodas() {
        return repository.findAll();
    }

    @Transactional
    public CasaAposta salvarCasa(CasaAposta casaAposta) {
        // Aqui poderíamos colocar regras como: "Não deixar cadastrar nome vazio"
        if (casaAposta.getNome() == null || casaAposta.getNome().trim().isEmpty()) {
            throw new IllegalArgumentException("O nome da casa de aposta é obrigatório.");
        }
        return repository.save(casaAposta);
    }

    @Transactional
    public void deletarCasa(UUID id) {
        repository.deleteById(id);
    }
}