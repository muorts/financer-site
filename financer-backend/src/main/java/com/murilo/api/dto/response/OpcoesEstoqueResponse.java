package com.murilo.api.dto.response;

import com.murilo.api.model.sales.CategoriaVenda;
import com.murilo.api.model.sales.PlataformaVenda;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OpcoesEstoqueResponse {
    private List<CategoriaVenda> categorias;
    private List<PlataformaVenda> plataformas;
}
