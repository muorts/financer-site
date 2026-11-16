package com.murilo.api.controller.dashboard;

import com.murilo.api.model.dashboard.Banco;
import com.murilo.api.model.dashboard.Categoria;
import com.murilo.api.model.dashboard.DashboardResumo;
import com.murilo.api.model.dashboard.Transacao;
import com.murilo.api.repository.dashboard.BancoRepository;
import com.murilo.api.repository.dashboard.TransacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class DashboardController {

    private final TransacaoRepository transacaoRepository;
    private final BancoRepository bancoRepository;

    private static final String[] MESES_CURTOS = {
        "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
        "Jul", "Ago", "Set", "Out", "Nov", "Dez"
    };

    @GetMapping("/resumo")
    public ResponseEntity<DashboardResumo> getResumo(
            @RequestParam(required = false) Integer mes,
            @RequestParam(required = false) Integer ano,
            @RequestParam(required = false) UUID bancoId) {

        DashboardResumo resumo = new DashboardResumo();

        LocalDate hoje = LocalDate.now();
        int mesRef = mes != null ? mes : hoje.getMonthValue();
        int anoRef = ano != null ? ano : hoje.getYear();

        // Busca transações do mês e filtra por bancoId se informado
        List<Transacao> transacoesMes = transacaoRepository.listarPorMesEAno(mesRef, anoRef);
        if (bancoId != null) {
            transacoesMes = transacoesMes.stream()
                    .filter(t -> t.getBanco() != null && bancoId.equals(t.getBanco().getId()))
                    .toList();
        }

        double entradasBrutas = 0.0;
        double saidasTotais = 0.0;
        double aportesMes = 0.0;

        for (Transacao t : transacoesMes) {
            double valor = t.getValor() != null ? t.getValor() : 0.0;
            if ("ENTRADA".equalsIgnoreCase(t.getTipo())) {
                entradasBrutas += valor;
                if (t.getBanco() != null && "RESERVA".equalsIgnoreCase(t.getBanco().getTipo())) {
                    aportesMes += valor;
                }
            } else if ("SAIDA".equalsIgnoreCase(t.getTipo())) {
                saidasTotais += valor;
            }
        }

        double lucroLiquido = entradasBrutas - saidasTotais;

        resumo.setLucroLiquido(lucroLiquido);
        resumo.setEntradasBrutas(entradasBrutas);
        resumo.setSaidasTotais(saidasTotais);
        resumo.setAportesMes(aportesMes);
        resumo.setOperacoesConcluidas(transacoesMes.size());

        // Montar Raio-X das Entradas e Saídas
        resumo.setRaioX(montarRaioX(transacoesMes, "ENTRADA", entradasBrutas));
        resumo.setRaioXSaidas(montarRaioX(transacoesMes, "SAIDA", saidasTotais));

        // Montar evolução patrimonial ao longo do mês
        resumo.setEvolucao(montarEvolucaoMes(transacoesMes, mesRef, anoRef, bancoId));

        return ResponseEntity.ok(resumo);
    }

    private List<DashboardResumo.CategoriaResumo> montarRaioX(
            List<Transacao> transacoes, String tipo, double totalTipo) {

        Map<String, Double> somaPorCategoria = new LinkedHashMap<>();
        Map<String, String> corPorCategoria = new HashMap<>();

        for (Transacao t : transacoes) {
            if (!tipo.equalsIgnoreCase(t.getTipo())) continue;
            Categoria c = t.getCategoria();
            String nome = c != null && c.getNome() != null ? c.getNome() : "Sem Categoria";
            String cor = c != null && c.getCor() != null ? c.getCor() : "gray";
            double valor = t.getValor() != null ? t.getValor() : 0.0;

            somaPorCategoria.merge(nome, valor, Double::sum);
            corPorCategoria.putIfAbsent(nome, cor);
        }

        List<DashboardResumo.CategoriaResumo> lista = new ArrayList<>();
        somaPorCategoria.entrySet().stream()
                .sorted((a, b) -> Double.compare(b.getValue(), a.getValue()))
                .forEach(entry -> {
                    String nomeCat = entry.getKey();
                    Double valorC = entry.getValue();
                    int percentual = totalTipo > 0 ? (int) Math.round((valorC / totalTipo) * 100) : 0;
                    String[] classesCor = mapearCorTailwind(corPorCategoria.get(nomeCat));

                    lista.add(new DashboardResumo.CategoriaResumo(
                            nomeCat, valorC, percentual, classesCor[0], classesCor[1]
                    ));
                });

        return lista;
    }

    private List<DashboardResumo.PontoEvolucao> montarEvolucaoMes(
            List<Transacao> transacoesMes, int mes, int ano, UUID bancoId) {

        List<Banco> bancos = bancoRepository.findAllByOrderByNomeAsc();
        if (bancoId != null) {
            bancos = bancos.stream().filter(b -> bancoId.equals(b.getId())).toList();
        }

        double baseTotal = 0.0;
        double baseLiquido = 0.0;
        for (Banco b : bancos) {
            double s = b.getSaldoInicial() != null ? b.getSaldoInicial() : 0.0;
            baseTotal += s;
            if (!"RESERVA".equalsIgnoreCase(b.getTipo())) {
                baseLiquido += s;
            }
        }

        int ultimoDia = YearMonth.of(ano, mes).lengthOfMonth();
        int[] marcos = {1, 10, 20, ultimoDia};
        String mesNome = MESES_CURTOS[Math.max(0, Math.min(11, mes - 1))];

        List<DashboardResumo.PontoEvolucao> pontos = new ArrayList<>();
        for (int diaMarco : marcos) {
            double deltaTotal = 0.0;
            double deltaLiquido = 0.0;

            for (Transacao t : transacoesMes) {
                if (t.getData() != null && t.getData().getDayOfMonth() <= diaMarco) {
                    if ("CREDITO".equalsIgnoreCase(t.getMetodoPagamento())) continue;
                    double v = t.getValor() != null ? t.getValor() : 0.0;
                    double sinal = "ENTRADA".equalsIgnoreCase(t.getTipo()) ? 1.0 : -1.0;
                    deltaTotal += sinal * v;

                    boolean isReserva = t.getBanco() != null && "RESERVA".equalsIgnoreCase(t.getBanco().getTipo());
                    if (!isReserva) {
                        deltaLiquido += sinal * v;
                    }
                }
            }

            String label = String.format("%02d/%s", diaMarco, mesNome);
            pontos.add(new DashboardResumo.PontoEvolucao(
                    label,
                    baseTotal + deltaTotal,
                    baseLiquido + deltaLiquido
            ));
        }

        return pontos;
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
