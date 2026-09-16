# Fincker 💰📊

> Um sistema unificado de gestão financeira em formato Progressive Web App (PWA), estruturado com arquitetura monorepo e microsserviços.

![Badge Status](http://img.shields.io/static/v1?label=STATUS&message=EM%20DESENVOLVIMENTO&color=YELLOW&style=for-the-badge)
![Badge Front](http://img.shields.io/static/v1?label=FRONTEND&message=NEXT.JS&color=BLACK&style=for-the-badge)
![Badge Back](http://img.shields.io/static/v1?label=BACKEND&message=SPRING%20BOOT&color=GREEN&style=for-the-badge)
![Badge DB](http://img.shields.io/static/v1?label=DATABASE&message=POSTGRESQL&color=BLUE&style=for-the-badge)

## 📋 Descrição

Este projeto consiste no desenvolvimento de uma aplicação web instalável (PWA) voltada para o controle minucioso e independente de finanças pessoais. O sistema isola fluxos de caixa distintos para garantir uma análise de dados precisa, consolidando tudo em um dashboard analítico.

O projeto foi construído utilizando **Next.js** para uma interface fluida no ecossistema iOS e **Java Spring Boot** para garantir a segurança e robustez das regras de negócio financeiras no back-end, operando de forma autônoma via *Self-Hosting*.

---

## 🚀 Funcionalidades Técnicas

A arquitetura do código foi projetada para garantir segurança de dados e fácil manutenção, implementando:

* **Arquitetura Client-Server Separada:** Divisão clara entre o Front-end (`React/Next.js`) e a API RESTful no Back-end (`Java Spring Boot`), permitindo escalabilidade independente.
* **Progressive Web App (PWA):** Configuração nativa via `manifest.json` e *Apple Touch Icons* para instalação direta na tela de início do iOS, ocultando a barra de navegação do Safari e operando em tela cheia.
* **Banco de Dados Relacional Seguro:** Utilização do PostgreSQL isolado via **Docker**, garantindo integridade transacional (ACID) para todas as entradas e saídas de capital.
* **Rede Privada (Self-Hosting):** Servidor local exposto de forma segura utilizando túneis (Tailscale / Cloudflare Tunnel) para fornecimento de certificado HTTPS, exigência obrigatória da Apple para PWAs.

---

## 📊 Estrutura do Sistema

### Objetivo
Centralizar a vida financeira sem misturar o custo de vida pessoal com o capital de giro destinado a investimentos e revendas. 

### Módulos Principais

| Módulo | Descrição Funcional |
| :--- | :--- |
| **Dia a Dia** | Livro-caixa clássico. Controle do custo de vida mensal, gestão de salário, aportes e categorização de despesas (fixas e variáveis). |
| **Vendas** | Gestão de estoque e mercado secundário. Rastreamento do Custo de Aquisição (lotes, peças) vs. Faturamento, calculando o ROI e Lucro Líquido por item vendido. |
| **Dashboard Mensal** | Painel macro. Consolida os caixas dos 3 módulos, apresentando gráficos dinâmicos de proporção de renda e histórico de evolução patrimonial. |

---

## 💻 Como Executar

Este projeto utiliza arquitetura monorepo. Para rodar o ambiente de desenvolvimento, você precisará iniciar o Back-end e o Front-end simultaneamente.

1.  **Baixe o Repositório:**
    ```bash
    git clone [https://github.com/muorts/](https://github.com/muorts/)[NOME-DO-REPO].git
    ```

2.  **Iniciando o Back-end (API Java):**
    Abra um terminal e navegue até a pasta do back-end. O *Maven wrapper* fará o download das dependências automaticamente.
    ```bash
    cd backend
    ./mvnw spring-boot:run
    ```
    *(A API ficará disponível em `http://localhost:8080`)*.

3.  **Iniciando o Front-end (Interface Next.js):**
    Abra uma **nova aba** no terminal, navegue até a pasta do front-end e inicie o servidor Node.
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    *(A aplicação web ficará disponível em `http://localhost:3000`)*.

4.  **Banco de Dados (Docker):**
    Certifique-se de que o contêiner do PostgreSQL está em execução na sua máquina host antes de iniciar o Back-end.

---

## 📸 Screenshots

| Dashboard Mensal |
| :---: |
| <img width="1705" height="990" alt="Screenshot 2026-09-15 at 21 33 28" src="https://github.com/user-attachments/assets/6255faad-b582-46d4-92ed-1d8bd1fdfc77" /> |

| Gestão Financeira | 
| :---: |
| <img width="1702" height="985" alt="Screenshot 2026-09-15 at 21 34 35" src="https://github.com/user-attachments/assets/7d01ad5c-a8ef-4c62-86fa-910c9269c9db" /> |
| <img width="1699" height="984" alt="Screenshot 2026-09-15 at 21 34 46" src="https://github.com/user-attachments/assets/2b579384-f6d3-446c-8451-722026ce72a2" /> |
| <img width="1698" height="980" alt="Screenshot 2026-09-15 at 21 34 55" src="https://github.com/user-attachments/assets/bad29dd6-372e-4d19-a406-f553d3ad5fa9" /> |

| Gestão de Bricks | 
| :---: |
| <img width="1705" height="985" alt="Screenshot 2026-09-15 at 21 35 07" src="https://github.com/user-attachments/assets/2f0406c0-3f24-443e-a33b-87ec1b269648" /> |
| <img width="1700" height="983" alt="Screenshot 2026-09-15 at 21 35 15" src="https://github.com/user-attachments/assets/a9cc3e9a-703d-4b8f-8ed2-30754aa8e2bf" /> |


---

## ✒️ Autor

* **Murilo Ortega Pereira** - [GitHub](https://github.com/muorts) - [Linkedin](www.linkedin.com/in/murilo-ortega-67387b364)
