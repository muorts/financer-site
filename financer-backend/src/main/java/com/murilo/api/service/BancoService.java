package com.murilo.api.service;

import com.murilo.api.model.dashboard.Banco;
import com.murilo.api.repository.dashboard.BancoRepository;
import com.murilo.api.repository.dashboard.TransacaoRepository;
import com.murilo.api.repository.sales.ItemEstoqueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BancoService {

    private final BancoRepository bancoRepository;
    private final TransacaoRepository transacaoRepository;
    private final ItemEstoqueRepository itemEstoqueRepository;

    public List<Banco> listarTodos() {
        return bancoRepository.findAllByOrderByNomeAsc();
    }

    public Banco buscarPorId(UUID id) {
        return bancoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Banco/Conta não encontrado."));
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
        validarDia(banco.getDiaFechamento(), "fechamento");
        validarDia(banco.getDiaVencimento(), "vencimento");

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
            double saldoInicialAtual = existente.getSaldoInicial() != null ? existente.getSaldoInicial() : 0.0;
            double saldoAtual = existente.getSaldoAtual() != null ? existente.getSaldoAtual() : 0.0;
            double diferenca = dadosAtualizados.getSaldoInicial() - saldoInicialAtual;
            existente.setSaldoInicial(dadosAtualizados.getSaldoInicial());
            existente.setSaldoAtual(saldoAtual + diferenca);
        }
        if (dadosAtualizados.getDiaFechamento() != null) {
            validarDia(dadosAtualizados.getDiaFechamento(), "fechamento");
            existente.setDiaFechamento(dadosAtualizados.getDiaFechamento());
        }
        if (dadosAtualizados.getDiaVencimento() != null) {
            validarDia(dadosAtualizados.getDiaVencimento(), "vencimento");
            existente.setDiaVencimento(dadosAtualizados.getDiaVencimento());
        }

        return bancoRepository.save(existente);
    }

    @Transactional
    public Banco ajustarDatasFatura(UUID id, Integer diaFechamento, Integer diaVencimento) {
        Banco banco = buscarPorId(id);

        if (diaFechamento != null) {
            validarDia(diaFechamento, "fechamento");
            banco.setDiaFechamento(diaFechamento);
        }
        if (diaVencimento != null) {
            validarDia(diaVencimento, "vencimento");
            banco.setDiaVencimento(diaVencimento);
        }

        return bancoRepository.save(banco);
    }

    @Transactional
    public void deletarBanco(UUID id) {
        if (!bancoRepository.existsById(id)) {
            throw new NoSuchElementException("Banco/Conta não encontrado.");
        }
        if (transacaoRepository.existsByBancoId(id) || itemEstoqueRepository.existsByBancoCompraId(id)) {
            throw new IllegalStateException("Não é possível excluir este banco pois existem transações ou itens de estoque vinculados a ele.");
        }
        bancoRepository.deleteById(id);
    }

    private void validarDia(Integer dia, String nomeCampo) {
        if (dia < 1 || dia > 31) {
            throw new IllegalArgumentException("O dia de " + nomeCampo + " deve estar entre 1 e 31.");
        }
    }
}
