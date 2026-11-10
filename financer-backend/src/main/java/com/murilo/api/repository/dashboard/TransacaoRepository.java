package com.murilo.api.repository.dashboard;

import com.murilo.api.model.dashboard.Transacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TransacaoRepository extends JpaRepository<Transacao, UUID> {

    // Lista todas as transações de um mês/ano da mais recente para a mais antiga
    @Query("SELECT t FROM Transacao t WHERE MONTH(t.data) = :mes AND YEAR(t.data) = :ano ORDER BY t.data DESC")
    List<Transacao> listarPorMesEAno(@Param("mes") int mes, @Param("ano") int ano);

    // 1. Soma todo o dinheiro que ENTROU em um mês/ano específico
    @Query("SELECT COALESCE(SUM(t.valor), 0.0) FROM Transacao t WHERE t.tipo = 'ENTRADA' AND MONTH(t.data) = :mes AND YEAR(t.data) = :ano")
    Double somarEntradasDoMes(@Param("mes") int mes, @Param("ano") int ano);

    // 2. Soma todo o dinheiro que SAIU em um mês/ano específico
    @Query("SELECT COALESCE(SUM(t.valor), 0.0) FROM Transacao t WHERE t.tipo = 'SAIDA' AND MONTH(t.data) = :mes AND YEAR(t.data) = :ano")
    Double somarSaidasDoMes(@Param("mes") int mes, @Param("ano") int ano);

    // 3. Soma entradas direcionadas a contas do tipo RESERVA no mês (Aportes do Mês)
    @Query("SELECT COALESCE(SUM(t.valor), 0.0) FROM Transacao t WHERE t.tipo = 'ENTRADA' AND t.banco.tipo = 'RESERVA' AND MONTH(t.data) = :mes AND YEAR(t.data) = :ano")
    Double somarAportesReservaDoMes(@Param("mes") int mes, @Param("ano") int ano);

    // 4. Conta quantas movimentações ocorreram no mês
    @Query("SELECT COUNT(t) FROM Transacao t WHERE MONTH(t.data) = :mes AND YEAR(t.data) = :ano")
    Integer contarTransacoesDoMes(@Param("mes") int mes, @Param("ano") int ano);

    // 5. Soma quanto já foi gasto (SAIDA) em uma Categoria específica no mês/ano (para Metas/Orçamentos)
    @Query("SELECT COALESCE(SUM(t.valor), 0.0) FROM Transacao t WHERE t.tipo = 'SAIDA' AND t.categoria.id = :categoriaId AND MONTH(t.data) = :mes AND YEAR(t.data) = :ano")
    Double somarGastoPorCategoriaNoMes(@Param("categoriaId") UUID categoriaId, @Param("mes") int mes, @Param("ano") int ano);

    // 6. Agrupa transações por Categoria (retorna [nome, cor, icone, somaValor]) para gráficos de Entradas ou Saídas
    @Query("SELECT COALESCE(c.nome, 'Sem Categoria'), COALESCE(c.cor, 'gray'), COALESCE(c.icone, 'tag'), COALESCE(SUM(t.valor), 0.0) " +
           "FROM Transacao t LEFT JOIN t.categoria c " +
           "WHERE t.tipo = :tipo AND MONTH(t.data) = :mes AND YEAR(t.data) = :ano " +
           "GROUP BY c.nome, c.cor, c.icone " +
           "ORDER BY SUM(t.valor) DESC")
    List<Object[]> agruparPorTipoECategoria(@Param("tipo") String tipo, @Param("mes") int mes, @Param("ano") int ano);

    // 7. Faturas: Busca lançamentos no cartão de crédito de um banco para um mês/ano de fatura
    @Query("SELECT t FROM Transacao t WHERE t.banco.id = :bancoId AND t.metodoPagamento = 'CREDITO' AND t.mesFatura = :mesFatura AND t.anoFatura = :anoFatura ORDER BY t.data DESC")
    List<Transacao> buscarLancamentosFatura(@Param("bancoId") UUID bancoId, @Param("mesFatura") int mesFatura, @Param("anoFatura") int anoFatura);

    // 8. Faturas: Soma o valor total da fatura de um banco em um mês/ano
    @Query("SELECT COALESCE(SUM(t.valor), 0.0) FROM Transacao t WHERE t.banco.id = :bancoId AND t.metodoPagamento = 'CREDITO' AND t.mesFatura = :mesFatura AND t.anoFatura = :anoFatura")
    Double somarFaturaPorBanco(@Param("bancoId") UUID bancoId, @Param("mesFatura") int mesFatura, @Param("anoFatura") int anoFatura);

    // 9. Busca todas as parcelas de uma mesma compra parcelada
    List<Transacao> findByGrupoParcelamentoId(UUID grupoParcelamentoId);
}
