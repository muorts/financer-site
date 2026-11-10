package com.murilo.api.controller.dashboard;

import com.murilo.api.model.dashboard.DashboardResumo;
import com.murilo.api.repository.dashboard.TransacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class DashboardController {

    private final TransacaoRepository transacaoRepository;

    @GetMapping("/resumo")
    public ResponseEntity<DashboardResumo> getResumo(
            @RequestParam(required = false) Integer mes,
            @RequestParam(required = false) Integer ano) {

        DashboardResumo resumo = new DashboardResumo();

        LocalDate hoje = LocalDate.now();
        int mesRef = mes != null ? mes : hoje.getMonthValue();
        int anoRef = ano != null ? ano : hoje.getYear();

        // 1. Buscas no Banco de Dados Real
        Double entradasBrutas = transacaoRepository.somarEntradasDoMes(mesRef, anoRef);
        Double saidasTotais = transacaoRepository.somarSaidasDoMes(mesRef, anoRef);
        Double aportesMes = transacaoRepository.somarAportesReservaDoMes(mesRef, anoRef);
        Integer totalMovimentacoes = transacaoRepository.contarTransacoesDoMes(mesRef, anoRef);

        entradasBrutas = entradasBrutas != null ? entradasBrutas : 0.0;
        saidasTotais = saidasTotais != null ? saidasTotais : 0.0;
        aportesMes = aportesMes != null ? aportesMes : 0.0;
        totalMovimentacoes = totalMovimentacoes != null ? totalMovimentacoes : 0;

        Double lucroLiquido = entradasBrutas - saidasTotais;

        resumo.setLucroLiquido(lucroLiquido);
        resumo.setEntradasBrutas(entradasBrutas);
        resumo.setSaidasTotais(saidasTotais);
        resumo.setAportesMes(aportesMes);
        resumo.setOperacoesConcluidas(totalMovimentacoes);

        // 2. Montar o Raio-X das Entradas e das Saídas dinamicamente pelas Categorias
        resumo.setRaioX(montarRaioX("ENTRADA", mesRef, anoRef, entradasBrutas));
        resumo.setRaioXSaidas(montarRaioX("SAIDA", mesRef, anoRef, saidasTotais));

        return ResponseEntity.ok(resumo);
    }

    private List<DashboardResumo.CategoriaResumo> montarRaioX(String tipo, int mes, int ano, double totalTipo) {
        List<Object[]> categoriasObj = transacaoRepository.agruparPorTipoECategoria(tipo, mes, ano);
        List<DashboardResumo.CategoriaResumo> lista = new ArrayList<>();

        for (Object[] obj : categoriasObj) {
            String nomeCategoria = (String) obj[0];
            String corCategoria = (String) obj[1];
            Double valorC = (Double) obj[3];

            int percentual = totalTipo > 0 ? (int) Math.round((valorC / totalTipo) * 100) : 0;
            String[] classesCor = mapearCorTailwind(corCategoria);

            lista.add(new DashboardResumo.CategoriaResumo(
                    nomeCategoria,
                    valorC,
                    percentual,
                    classesCor[0],
                    classesCor[1]
            ));
        }

        return lista;
    }

    private String[] mapearCorTailwind(String cor) {
        if (cor == null) {
            return new String[]{"text-gray-400", "bg-gray-400"};
        }
        return switch (cor.toLowerCase()) {
            case "emerald", "green", "success" -> new String[]{"text-success", "bg-success"};
            case "purple" -> new String[]{"text-purple-400", "bg-purple-500"};
            case "blue" -> new String[]{"text-blue-400", "bg-blue-500"};
            case "orange", "brand" -> new String[]{"text-brand", "bg-brand"};
            case "red", "danger", "rose" -> new String[]{"text-danger", "bg-danger"};
            case "yellow", "amber" -> new String[]{"text-amber-400", "bg-amber-500"};
            case "pink" -> new String[]{"text-pink-400", "bg-pink-500"};
            case "cyan" -> new String[]{"text-cyan-400", "bg-cyan-500"};
            default -> new String[]{"text-gray-400", "bg-gray-400"};
        };
    }
}
