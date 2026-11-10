package com.murilo.api.dto.response;

import com.murilo.api.model.dashboard.Transacao;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FaturaResumoResponse {
    private UUID bancoId;
    private String bancoNome;
    private String cor;
    private Integer mesFatura;
    private Integer anoFatura;
    private Double valorTotal;
    private Integer diaFechamento;
    private Integer diaVencimento;
    private List<Transacao> lancamentos;
}
