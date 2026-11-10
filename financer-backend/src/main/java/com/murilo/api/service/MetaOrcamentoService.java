package com.murilo.api.service;

import com.murilo.api.dto.request.NovaMetaRequest;
import com.murilo.api.dto.response.ResumoMetasResponse;
import com.murilo.api.model.dashboard.Categoria;
import com.murilo.api.model.dashboard.MetaOrcamento;
import com.murilo.api.repository.dashboard.CategoriaRepository;
import com.murilo.api.repository.dashboard.MetaOrcamentoRepository;
import com.murilo.api.repository.dashboard.TransacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MetaOrcamentoService {

    private final MetaOrcamentoRepository metaOrcamentoRepository;
    private final CategoriaRepository categoriaRepository;
    private final TransacaoRepository transacaoRepository;

    public ResumoMetasResponse obterResumoDoMes(Integer mesParam, Integer anoParam) {
        LocalDate hoje = LocalDate.now();
        int mes = mesParam != null ? mesParam : hoje.getMonthValue();
        int ano = anoParam != null ? anoParam : hoje.getYear();

        List<MetaOrcamento> metasDoMes = metaOrcamentoRepository.findByMesAndAno(mes, ano);
        List<ResumoMetasResponse.MetaItemResponse> itens = new ArrayList<>();

        double orcamentoTotal = 0.0;
        double gastoTotal = 0.0;

        for (MetaOrcamento meta : metasDoMes) {
            Categoria cat = meta.getCategoria();
            Double gastoCategoria = transacaoRepository.somarGastoPorCategoriaNoMes(cat.getId(), mes, ano);
            gastoCategoria = gastoCategoria != null ? gastoCategoria : 0.0;

            double limite = meta.getLimiteMaximo() != null ? meta.getLimiteMaximo() : 0.0;
            double percentual = limite > 0 ? (gastoCategoria / limite) * 100.0 : 0.0;

            orcamentoTotal += limite;
            gastoTotal += gastoCategoria;

            itens.add(new ResumoMetasResponse.MetaItemResponse(
                    meta.getId(),
                    cat.getId(),
                    cat.getNome(),
                    cat.getCor(),
                    cat.getIcone(),
                    gastoCategoria,
                    limite,
                    percentual
            ));
        }

        double restanteGeral = orcamentoTotal - gastoTotal;

        return new ResumoMetasResponse(mes, ano, orcamentoTotal, gastoTotal, restanteGeral, itens);
    }

    @Transactional
    public MetaOrcamento salvarOuAtualizarMeta(NovaMetaRequest request) {
        if (request.getCategoriaId() == null) {
            throw new IllegalArgumentException("A categoria é obrigatória para definir uma meta.");
        }
        if (request.getLimiteMaximo() == null || request.getLimiteMaximo() <= 0) {
            throw new IllegalArgumentException("O teto máximo deve ser maior que zero.");
        }

        Categoria categoria = categoriaRepository.findById(request.getCategoriaId())
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada."));

        LocalDate hoje = LocalDate.now();
        int mes = request.getMes() != null ? request.getMes() : hoje.getMonthValue();
        int ano = request.getAno() != null ? request.getAno() : hoje.getYear();

        // Se já existir meta para essa categoria nesse mesmo mês/ano, atualiza o limite
        MetaOrcamento meta = metaOrcamentoRepository
                .findByCategoriaIdAndMesAndAno(categoria.getId(), mes, ano)
                .orElseGet(MetaOrcamento::new);

        meta.setCategoria(categoria);
        meta.setLimiteMaximo(request.getLimiteMaximo());
        meta.setMes(mes);
        meta.setAno(ano);

        return metaOrcamentoRepository.save(meta);
    }

    @Transactional
    public void deletarMeta(UUID id) {
        if (!metaOrcamentoRepository.existsById(id)) {
            throw new RuntimeException("Meta não encontrada.");
        }
        metaOrcamentoRepository.deleteById(id);
    }
}
