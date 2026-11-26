package com.murilo.api.service;

import com.murilo.api.dto.request.AtualizarItemEstoqueRequest;
import com.murilo.api.dto.request.NovoCustoExtraRequest;
import com.murilo.api.dto.request.NovoItemEstoqueRequest;
import com.murilo.api.dto.response.ItemEstoqueResponse;
import com.murilo.api.dto.response.OpcoesEstoqueResponse;
import com.murilo.api.model.dashboard.Banco;
import com.murilo.api.model.sales.CategoriaVenda;
import com.murilo.api.model.sales.CustoExtraItem;
import com.murilo.api.model.sales.ItemEstoque;
import com.murilo.api.model.sales.PlataformaVenda;
import com.murilo.api.repository.dashboard.BancoRepository;
import com.murilo.api.repository.sales.CategoriaVendaRepository;
import com.murilo.api.repository.sales.CustoExtraItemRepository;
import com.murilo.api.repository.sales.ItemEstoqueRepository;
import com.murilo.api.repository.sales.PlataformaVendaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class EstoqueService {

    private static final Set<String> CONDICOES_VALIDAS = Set.of("NOVO", "USADO");
    private static final Set<String> STATUS_VALIDOS = Set.of("MANUTENCAO", "PRONTO", "ANUNCIADO", "VENDIDO");

    private final ItemEstoqueRepository itemEstoqueRepository;
    private final CustoExtraItemRepository custoExtraItemRepository;
    private final CategoriaVendaRepository categoriaVendaRepository;
    private final PlataformaVendaRepository plataformaVendaRepository;
    private final BancoRepository bancoRepository;

    @Transactional(readOnly = true)
    public List<ItemEstoqueResponse> listarItensAtivos() {
        return itemEstoqueRepository.findByStatusNotOrderByDataCompraDesc("VENDIDO")
                .stream()
                .map(ItemEstoqueResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public ItemEstoqueResponse buscarPorId(UUID id) {
        ItemEstoque item = buscarEntidadePorId(id);
        return ItemEstoqueResponse.fromEntity(item);
    }

    @Transactional(readOnly = true)
    public OpcoesEstoqueResponse listarOpcoes() {
        return new OpcoesEstoqueResponse(
                categoriaVendaRepository.findAllByOrderByNomeAsc(),
                plataformaVendaRepository.findAllByOrderByNomeAsc()
        );
    }

    @Transactional
    public ItemEstoqueResponse criarItem(NovoItemEstoqueRequest request) {
        if (request.getNome() == null || request.getNome().trim().isEmpty()) {
            throw new IllegalArgumentException("O nome do item é obrigatório.");
        }
        if (request.getCustoAquisicao() == null || request.getCustoAquisicao() <= 0) {
            throw new IllegalArgumentException("O preço de aquisição deve ser maior que zero.");
        }

        String condicao = normalizarCondicao(request.getCondicao());
        String status = normalizarStatus(request.getStatus(), "PRONTO");
        if ("VENDIDO".equals(status)) {
            throw new IllegalArgumentException("Um novo item de estoque não pode ser cadastrado já como VENDIDO.");
        }

        CategoriaVenda categoria = null;
        if (request.getCategoriaVendaId() != null) {
            categoria = categoriaVendaRepository.findById(request.getCategoriaVendaId())
                    .orElseThrow(() -> new NoSuchElementException("Categoria de venda não encontrada."));
        }

        Banco bancoCompra = null;
        if (request.getBancoCompraId() != null) {
            bancoCompra = bancoRepository.findById(request.getBancoCompraId())
                    .orElseThrow(() -> new NoSuchElementException("Banco/Carteira informado não encontrado."));
        }

        List<PlataformaVenda> plataformas = resolverPlataformas(
                request.getPlataformaIds(),
                request.getPlataformasNomes()
        );

        ItemEstoque item = new ItemEstoque();
        item.setNome(request.getNome().trim());
        item.setCondicao(condicao);
        item.setStatus(status);
        item.setCustoAquisicao(Math.round(request.getCustoAquisicao() * 100.0) / 100.0);
        item.setDataCompra(request.getDataCompra() != null ? request.getDataCompra() : LocalDate.now());
        item.setObservacoes(request.getObservacoes() != null ? request.getObservacoes().trim() : null);
        item.setCategoriaVenda(categoria);
        item.setBancoCompra(bancoCompra);
        item.setPlataformas(plataformas);

        ItemEstoque salvo = itemEstoqueRepository.save(item);
        return ItemEstoqueResponse.fromEntity(salvo);
    }

    @Transactional
    public ItemEstoqueResponse atualizarItem(UUID id, AtualizarItemEstoqueRequest request) {
        ItemEstoque existente = buscarEntidadePorId(id);

        if (request.getNome() != null) {
            if (request.getNome().trim().isEmpty()) {
                throw new IllegalArgumentException("O nome do item não pode ficar vazio.");
            }
            existente.setNome(request.getNome().trim());
        }

        if (request.getCondicao() != null && !request.getCondicao().isBlank()) {
            existente.setCondicao(normalizarCondicao(request.getCondicao()));
        }

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            existente.setStatus(normalizarStatus(request.getStatus(), existente.getStatus()));
        }

        if (request.getObservacoes() != null) {
            String obsLimpa = request.getObservacoes().trim();
            existente.setObservacoes(obsLimpa.isEmpty() ? null : obsLimpa);
        }

        if (Boolean.TRUE.equals(request.getLimparCategoria())) {
            existente.setCategoriaVenda(null);
        } else if (request.getCategoriaVendaId() != null) {
            CategoriaVenda categoria = categoriaVendaRepository.findById(request.getCategoriaVendaId())
                    .orElseThrow(() -> new NoSuchElementException("Categoria de venda não encontrada."));
            existente.setCategoriaVenda(categoria);
        }

        if (request.getPlataformaIds() != null || request.getPlataformasNomes() != null) {
            List<PlataformaVenda> novasPlataformas = resolverPlataformas(
                    request.getPlataformaIds(),
                    request.getPlataformasNomes()
            );
            existente.setPlataformas(novasPlataformas);
        }

        ItemEstoque atualizado = itemEstoqueRepository.save(existente);
        return ItemEstoqueResponse.fromEntity(atualizado);
    }

    @Transactional
    public ItemEstoqueResponse adicionarCustoExtra(UUID itemId, NovoCustoExtraRequest request) {
        ItemEstoque item = buscarEntidadePorId(itemId);

        if (request.getDescricao() == null || request.getDescricao().trim().isEmpty()) {
            throw new IllegalArgumentException("A descrição do custo extra é obrigatória.");
        }
        if (request.getValor() == null || request.getValor() <= 0) {
            throw new IllegalArgumentException("O valor do custo extra deve ser maior que zero.");
        }

        CustoExtraItem custo = new CustoExtraItem();
        custo.setItemEstoque(item);
        custo.setDescricao(request.getDescricao().trim());
        custo.setValor(Math.round(request.getValor() * 100.0) / 100.0);
        custo.setData(request.getData() != null ? request.getData() : LocalDate.now());

        CustoExtraItem salvo = custoExtraItemRepository.save(custo);
        item.getCustosExtras().add(0, salvo);

        return ItemEstoqueResponse.fromEntity(item);
    }

    @Transactional
    public ItemEstoqueResponse removerCustoExtra(UUID itemId, UUID custoId) {
        ItemEstoque item = buscarEntidadePorId(itemId);

        boolean removido = item.getCustosExtras().removeIf(c -> custoId.equals(c.getId()));
        if (!removido) {
            throw new NoSuchElementException("Custo extra não encontrado para este item.");
        }

        ItemEstoque atualizado = itemEstoqueRepository.save(item);
        return ItemEstoqueResponse.fromEntity(atualizado);
    }

    @Transactional
    public void deletarItem(UUID id) {
        ItemEstoque item = buscarEntidadePorId(id);
        itemEstoqueRepository.delete(item);
    }

    private ItemEstoque buscarEntidadePorId(UUID id) {
        return itemEstoqueRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Item de estoque não encontrado."));
    }

    private String normalizarCondicao(String condicao) {
        if (condicao == null || condicao.isBlank()) {
            return "USADO";
        }
        String upper = condicao.trim().toUpperCase();
        if (!CONDICOES_VALIDAS.contains(upper)) {
            throw new IllegalArgumentException("Condição inválida. Use NOVO ou USADO.");
        }
        return upper;
    }

    private String normalizarStatus(String status, String padrao) {
        if (status == null || status.isBlank()) {
            return padrao;
        }
        String upper = status.trim().toUpperCase();
        if (!STATUS_VALIDOS.contains(upper)) {
            throw new IllegalArgumentException("Status inválido. Use MANUTENCAO, PRONTO, ANUNCIADO ou VENDIDO.");
        }
        return upper;
    }

    private List<PlataformaVenda> resolverPlataformas(List<UUID> plataformaIds, List<String> plataformasNomes) {
        Map<UUID, PlataformaVenda> selecionadas = new LinkedHashMap<>();

        if (plataformaIds != null) {
            for (UUID platId : plataformaIds) {
                if (platId == null) continue;
                PlataformaVenda plat = plataformaVendaRepository.findById(platId)
                        .orElseThrow(() -> new NoSuchElementException("Plataforma de venda não encontrada."));
                selecionadas.put(plat.getId(), plat);
            }
        }

        if (plataformasNomes != null) {
            for (String nomeBruto : plataformasNomes) {
                if (nomeBruto == null || nomeBruto.trim().isEmpty()) continue;
                String nome = nomeBruto.trim();
                PlataformaVenda plat = plataformaVendaRepository.findByNomeIgnoreCase(nome)
                        .orElseGet(() -> criarPlataformaPadrao(nome));
                selecionadas.put(plat.getId(), plat);
            }
        }

        return new ArrayList<>(selecionadas.values());
    }

    private PlataformaVenda criarPlataformaPadrao(String nome) {
        PlataformaVenda nova = new PlataformaVenda();
        nova.setNome(nome);
        String lower = nome.toLowerCase();
        if (lower.contains("mercado")) {
            nova.setCor("yellow");
            nova.setIcone("store");
        } else if (lower.contains("facebook")) {
            nova.setCor("blue");
            nova.setIcone("monitor");
        } else if (lower.contains("particular")) {
            nova.setCor("emerald");
            nova.setIcone("users");
        } else {
            nova.setCor("purple");
            nova.setIcone("shopping");
        }
        return plataformaVendaRepository.save(nova);
    }
}
