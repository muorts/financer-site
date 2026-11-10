package com.murilo.api.service;

import com.murilo.api.dto.request.NovaTransacaoRequest;
import com.murilo.api.dto.response.FaturaResumoResponse;
import com.murilo.api.model.dashboard.Banco;
import com.murilo.api.model.dashboard.Categoria;
import com.murilo.api.model.dashboard.Transacao;
import com.murilo.api.repository.dashboard.BancoRepository;
import com.murilo.api.repository.dashboard.CategoriaRepository;
import com.murilo.api.repository.dashboard.TransacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TransacaoService {

    private final TransacaoRepository transacaoRepository;
    private final CategoriaRepository categoriaRepository;
    private final BancoRepository bancoRepository;

    public List<Transacao> listarTransacoes(Integer mes, Integer ano) {
        if (mes != null && ano != null) {
            return transacaoRepository.listarPorMesEAno(mes, ano);
        }
        return transacaoRepository.findAll();
    }

    @Transactional
    public Transacao registrarTransacao(NovaTransacaoRequest request) {
        if (request.getDescricao() == null || request.getDescricao().trim().isEmpty()) {
            throw new IllegalArgumentException("A descrição da transação é obrigatória.");
        }
        if (request.getValor() == null || request.getValor() <= 0) {
            throw new IllegalArgumentException("O valor da transação deve ser maior que zero.");
        }

        String tipo = request.getTipo() != null ? request.getTipo().toUpperCase() : "SAIDA";
        String metodo = request.getMetodoPagamento() != null ? request.getMetodoPagamento().toUpperCase() : "PIX";
        LocalDate dataCompra = request.getData() != null ? request.getData() : LocalDate.now();

        Categoria categoria = null;
        if (request.getCategoriaId() != null) {
            categoria = categoriaRepository.findById(request.getCategoriaId())
                    .orElseThrow(() -> new RuntimeException("Categoria informada não encontrada."));
        }

        Banco banco = null;
        if (request.getBancoId() != null) {
            banco = bancoRepository.findById(request.getBancoId())
                    .orElseThrow(() -> new RuntimeException("Banco informado não encontrado."));
        }

        // ==========================================
        // CASO 1: CARTÃO DE CRÉDITO (FATURA E PARCELAS)
        // ==========================================
        if ("CREDITO".equals(metodo)) {
            int totalParcelas = (request.getTotalParcelas() != null && request.getTotalParcelas() > 1)
                    ? request.getTotalParcelas()
                    : 1;

            // Define em qual mês/ano de fatura a 1ª parcela entra com base no dia de fechamento do banco
            YearMonth competenciaInicial = calcularCompetenciaInicialFatura(dataCompra, banco);
            UUID grupoId = totalParcelas > 1 ? UUID.randomUUID() : null;
            double valorPorParcela = Math.round((request.getValor() / totalParcelas) * 100.0) / 100.0;

            Transacao primeiraParcela = null;

            for (int i = 1; i <= totalParcelas; i++) {
                YearMonth competenciaParcela = competenciaInicial.plusMonths(i - 1);

                Transacao parcela = new Transacao();
                parcela.setDescricao(request.getDescricao());
                parcela.setValor(valorPorParcela);
                parcela.setTipo(tipo);
                parcela.setMetodoPagamento("CREDITO");
                parcela.setData(i == 1 ? dataCompra : dataCompra.plusMonths(i - 1));
                parcela.setCategoria(categoria);
                parcela.setBanco(banco);
                parcela.setParcelaAtual(i);
                parcela.setTotalParcelas(totalParcelas);
                parcela.setGrupoParcelamentoId(grupoId);
                parcela.setMesFatura(competenciaParcela.getMonthValue());
                parcela.setAnoFatura(competenciaParcela.getYear());

                Transacao salva = transacaoRepository.save(parcela);
                if (i == 1) {
                    primeiraParcela = salva;
                }
            }

            return primeiraParcela;
        }

        // ==========================================
        // CASO 2: PIX OU DÉBITO (MOVIMENTA SALDO DO BANCO)
        // ==========================================
        Transacao transacao = new Transacao();
        transacao.setDescricao(request.getDescricao());
        transacao.setValor(request.getValor());
        transacao.setTipo(tipo);
        transacao.setMetodoPagamento(metodo);
        transacao.setData(dataCompra);
        transacao.setCategoria(categoria);
        transacao.setBanco(banco);
        transacao.setParcelaAtual(1);
        transacao.setTotalParcelas(1);

        if (banco != null) {
            double saldoAtual = banco.getSaldoAtual() != null ? banco.getSaldoAtual() : 0.0;
            if ("ENTRADA".equals(tipo)) {
                banco.setSaldoAtual(saldoAtual + request.getValor());
            } else {
                banco.setSaldoAtual(saldoAtual - request.getValor());
            }
            bancoRepository.save(banco);
        }

        return transacaoRepository.save(transacao);
    }

    @Transactional
    public void deletarTransacao(UUID id, boolean deletarTodasParcelas) {
        Transacao transacao = transacaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transação não encontrada."));

        // Se for compra parcelada no crédito e o usuário pediu para apagar todas as parcelas juntas
        if (deletarTodasParcelas && transacao.getGrupoParcelamentoId() != null) {
            List<Transacao> parcelas = transacaoRepository.findByGrupoParcelamentoId(transacao.getGrupoParcelamentoId());
            transacaoRepository.deleteAll(parcelas);
            return;
        }

        // Se for PIX ou DÉBITO, desfaz o impacto no saldo atual do banco
        if (!"CREDITO".equalsIgnoreCase(transacao.getMetodoPagamento()) && transacao.getBanco() != null) {
            Banco banco = transacao.getBanco();
            double saldoAtual = banco.getSaldoAtual() != null ? banco.getSaldoAtual() : 0.0;
            if ("ENTRADA".equalsIgnoreCase(transacao.getTipo())) {
                banco.setSaldoAtual(saldoAtual - transacao.getValor());
            } else {
                banco.setSaldoAtual(saldoAtual + transacao.getValor());
            }
            bancoRepository.save(banco);
        }

        transacaoRepository.delete(transacao);
    }

    // ==========================================
    // CONSULTAS DE FATURAS DE CARTÃO DE CRÉDITO
    // ==========================================
    public List<FaturaResumoResponse> listarResumoFaturas(Integer mesParam, Integer anoParam) {
        LocalDate hoje = LocalDate.now();
        int mes = mesParam != null ? mesParam : hoje.getMonthValue();
        int ano = anoParam != null ? anoParam : hoje.getYear();

        List<Banco> bancos = bancoRepository.findAllByOrderByNomeAsc();
        List<FaturaResumoResponse> resumos = new ArrayList<>();

        for (Banco banco : bancos) {
            resumos.add(montarFaturaBanco(banco, mes, ano));
        }

        return resumos;
    }

    public FaturaResumoResponse obterFaturaDoBanco(UUID bancoId, Integer mesParam, Integer anoParam) {
        LocalDate hoje = LocalDate.now();
        int mes = mesParam != null ? mesParam : hoje.getMonthValue();
        int ano = anoParam != null ? anoParam : hoje.getYear();

        Banco banco = bancoRepository.findById(bancoId)
                .orElseThrow(() -> new RuntimeException("Banco não encontrado."));

        return montarFaturaBanco(banco, mes, ano);
    }

    private FaturaResumoResponse montarFaturaBanco(Banco banco, int mes, int ano) {
        List<Transacao> lancamentos = transacaoRepository.buscarLancamentosFatura(banco.getId(), mes, ano);
        Double valorTotal = transacaoRepository.somarFaturaPorBanco(banco.getId(), mes, ano);

        return new FaturaResumoResponse(
                banco.getId(),
                banco.getNome(),
                banco.getCor(),
                mes,
                ano,
                valorTotal != null ? valorTotal : 0.0,
                banco.getDiaFechamento(),
                banco.getDiaVencimento(),
                lancamentos
        );
    }

    private YearMonth calcularCompetenciaInicialFatura(LocalDate dataCompra, Banco banco) {
        YearMonth mesCompra = YearMonth.from(dataCompra);
        if (banco != null && banco.getDiaFechamento() != null) {
            // Se a compra ocorreu no dia do fechamento ou depois, entra na fatura do próximo mês
            if (dataCompra.getDayOfMonth() >= banco.getDiaFechamento()) {
                return mesCompra.plusMonths(1);
            }
        }
        return mesCompra;
    }
}
