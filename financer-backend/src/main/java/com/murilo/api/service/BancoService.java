package com.murilo.api.service;

import com.murilo.api.model.dashboard.Banco;
import com.murilo.api.repository.dashboard.BancoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BancoService {

    private final BancoRepository bancoRepository;

    public List<Banco> listarTodos() {
        return bancoRepository.findAllByOrderByNomeAsc();
    }

    public Banco buscarPorId(UUID id) {
        return bancoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Banco/Conta não encontrado."));
    }

    @Transactional
    public Banco cadastrarBanco(Banco banco) {
        if (banco.getNome() == null || banco.getNome().trim().isEmpty()) {
            throw new IllegalArgumentException("O nome do banco/conta é obrigatório.");
        }

        banco.setTipo(banco.getTipo() != null ? banco.getTipo().toUpperCase() : "GIRO");
        if (banco.getCor() == null || banco.getCor().isBlank()) {
            banco.setCor("purple");
        }
        if (banco.getSaldoInicial() == null) {
            banco.setSaldoInicial(0.0);
        }
        // Ao criar a conta, o saldo atual parte do saldo inicial informado
        if (banco.getSaldoAtual() == null || banco.getId() == null) {
            banco.setSaldoAtual(banco.getSaldoInicial());
        }
        if (banco.getDiaFechamento() == null) {
            banco.setDiaFechamento(3);
        }
        if (banco.getDiaVencimento() == null) {
            banco.setDiaVencimento(10);
        }

        return bancoRepository.save(banco);
    }

    @Transactional
    public Banco atualizarBanco(UUID id, Banco dadosAtualizados) {
        Banco existente = buscarPorId(id);

        if (dadosAtualizados.getNome() != null && !dadosAtualizados.getNome().isBlank()) {
            existente.setNome(dadosAtualizados.getNome());
        }
        if (dadosAtualizados.getTipo() != null && !dadosAtualizados.getTipo().isBlank()) {
            existente.setTipo(dadosAtualizados.getTipo().toUpperCase());
        }
        if (dadosAtualizados.getCor() != null && !dadosAtualizados.getCor().isBlank()) {
            existente.setCor(dadosAtualizados.getCor());
        }
        if (dadosAtualizados.getSaldoInicial() != null) {
            double diferenca = dadosAtualizados.getSaldoInicial() - existente.getSaldoInicial();
            existente.setSaldoInicial(dadosAtualizados.getSaldoInicial());
            existente.setSaldoAtual(existente.getSaldoAtual() + diferenca);
        }
        if (dadosAtualizados.getDiaFechamento() != null) {
            existente.setDiaFechamento(dadosAtualizados.getDiaFechamento());
        }
        if (dadosAtualizados.getDiaVencimento() != null) {
            existente.setDiaVencimento(dadosAtualizados.getDiaVencimento());
        }

        return bancoRepository.save(existente);
    }

    @Transactional
    public Banco ajustarDatasFatura(UUID id, Integer diaFechamento, Integer diaVencimento) {
        Banco banco = buscarPorId(id);

        if (diaFechamento != null && (diaFechamento < 1 || diaFechamento > 31)) {
            throw new IllegalArgumentException("O dia de fechamento deve estar entre 1 e 31.");
        }
        if (diaVencimento != null && (diaVencimento < 1 || diaVencimento > 31)) {
            throw new IllegalArgumentException("O dia de vencimento deve estar entre 1 e 31.");
        }

        if (diaFechamento != null) {
            banco.setDiaFechamento(diaFechamento);
        }
        if (diaVencimento != null) {
            banco.setDiaVencimento(diaVencimento);
        }

        return bancoRepository.save(banco);
    }

    @Transactional
    public void deletarBanco(UUID id) {
        if (!bancoRepository.existsById(id)) {
            throw new RuntimeException("Banco/Conta não encontrado.");
        }
        bancoRepository.deleteById(id);
    }
}
