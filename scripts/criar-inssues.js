#!/usr/bin/env node
/**
 * Script para sincronizar Labels, Milestones e Issues do arquivo scripts/backlog.json
 * diretamente no GitHub usando a REST API v3 (sem dependências externas — Node 18+).
 *
 * Uso:
 *   node scripts/criar-inssues.js --dry-run
 *   GITHUB_TOKEN=ghp_xxx node scripts/criar-inssues.js
 *   GITHUB_TOKEN=ghp_xxx node scripts/criar-inssues.js --only=SALES-01,SALES-02
 *   GITHUB_TOKEN=ghp_xxx node scripts/criar-inssues.js --milestone="v1.0 - Módulo Vendas & Estoque"
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const API_BASE = 'https://api.github.com';
const DELAY_MS = 600;

function mostrarAjuda() {
  console.log(`
Organizador automático de Issues no GitHub (Financer / Fincker)

USO:
  node scripts/criar-inssues.js [opções]

OPÇÕES:
  --dry-run                Simula a execução sem enviar nada para o GitHub (não exige token)
  --repo=owner/repo        Sobrescreve o repositório definido no backlog.json
  --file=caminho.json      Caminho alternativo do arquivo JSON (padrão: scripts/backlog.json)
  --only=ID1,ID2           Cria apenas as issues com os IDs informados (ex: SALES-01,FIN-01)
  --milestone="Nome"       Cria apenas as issues pertencentes à milestone informada
  --sync-labels            Atualiza cor e descrição de labels que já existem no GitHub
  --help, -h               Exibe esta ajuda

AUTENTICAÇÃO:
  Defina a variável de ambiente GITHUB_TOKEN (ou GH_TOKEN) ou coloque em um arquivo .env na raiz:
    GITHUB_TOKEN=seu_token_aqui

  Como gerar o token no GitHub:
    Settings -> Developer settings -> Personal access tokens -> Fine-grained tokens
    Selecione o repositório e conceda permissão: Issues (Read and write)
`);
}

function parseArgs(argv) {
  const opcoes = {
    dryRun: false,
    syncLabels: false,
    repo: null,
    file: path.join(__dirname, 'backlog.json'),
    only: null,
    milestone: null,
    help: false,
  };

  for (const arg of argv) {
    if (arg === '--dry-run') {
      opcoes.dryRun = true;
    } else if (arg === '--sync-labels') {
      opcoes.syncLabels = true;
    } else if (arg === '--help' || arg === '-h') {
      opcoes.help = true;
    } else if (arg.startsWith('--repo=')) {
      opcoes.repo = arg.slice('--repo='.length).trim();
    } else if (arg.startsWith('--file=')) {
      opcoes.file = path.resolve(arg.slice('--file='.length).trim());
    } else if (arg.startsWith('--only=')) {
      opcoes.only = new Set(
        arg
          .slice('--only='.length)
          .split(',')
          .map((s) => s.trim().toUpperCase())
          .filter(Boolean)
      );
    } else if (arg.startsWith('--milestone=')) {
      opcoes.milestone = arg.slice('--milestone='.length).trim();
    } else {
      console.error(`Opção desconhecida: ${arg}`);
      console.error('Use --help para ver as opções disponíveis.');
      process.exit(1);
    }
  }

  return opcoes;
}

function carregarDotEnvSeExistir() {
  const caminhos = [
    path.resolve(__dirname, '..', '.env'),
    path.resolve(__dirname, '.env'),
  ];

  for (const caminho of caminhos) {
    if (!fs.existsSync(caminho)) continue;
    const linhas = fs.readFileSync(caminho, 'utf8').split(/\r?\n/);
    for (const linhaBruta of linhas) {
      const linha = linhaBruta.trim();
      if (!linha || linha.startsWith('#')) continue;
      const idx = linha.indexOf('=');
      if (idx === -1) continue;
      const chave = linha.slice(0, idx).trim();
      let valor = linha.slice(idx + 1).trim();
      if (
        (valor.startsWith('"') && valor.endsWith('"')) ||
        (valor.startsWith("'") && valor.endsWith("'"))
      ) {
        valor = valor.slice(1, -1);
      }
      if (!process.env[chave]) {
        process.env[chave] = valor;
      }
    }
  }
}

function dormir(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizar(texto) {
  return String(texto || '')
    .trim()
    .toLowerCase();
}

function carregarBacklog(caminhoArquivo) {
  if (!fs.existsSync(caminhoArquivo)) {
    throw new Error(`Arquivo de backlog não encontrado: ${caminhoArquivo}`);
  }

  const conteudo = fs.readFileSync(caminhoArquivo, 'utf8');
  const dados = JSON.parse(conteudo);

  if (!Array.isArray(dados.issues)) {
    throw new Error('O backlog.json precisa conter um array "issues".');
  }

  // Validação básica de integridade referencial
  const nomesLabels = new Set((dados.labels || []).map((l) => l.name));
  const titulosMilestones = new Set((dados.milestones || []).map((m) => m.title));

  for (const issue of dados.issues) {
    if (!issue.title || !issue.title.trim()) {
      throw new Error(`Issue sem título encontrada (id: ${issue.id || 'desconhecido'}).`);
    }
    if (issue.milestone && titulosMilestones.size > 0 && !titulosMilestones.has(issue.milestone)) {
      throw new Error(
        `Issue "${issue.title}" referencia milestone inexistente: "${issue.milestone}".`
      );
    }
    for (const label of issue.labels || []) {
      if (nomesLabels.size > 0 && !nomesLabels.has(label)) {
        throw new Error(`Issue "${issue.title}" referencia label não declarada: "${label}".`);
      }
    }
  }

  return dados;
}

function criarClienteGitHub(token) {
  async function request(method, endpoint, body = null) {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
    const headers = {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'financer-issue-organizer',
      Authorization: `Bearer ${token}`,
    };

    const init = { method, headers };
    if (body !== null) {
      headers['Content-Type'] = 'application/json';
      init.body = JSON.stringify(body);
    }

    const res = await fetch(url, init);
    const texto = await res.text();
    let json = null;
    try {
      json = texto ? JSON.parse(texto) : null;
    } catch {
      json = texto;
    }

    if (!res.ok) {
      const msgApi =
        (json && typeof json === 'object' && (json.message || JSON.stringify(json))) || texto;
      if (res.status === 401) {
        throw new Error(`Autenticação falhou (401). Verifique seu GITHUB_TOKEN. Detalhe: ${msgApi}`);
      }
      if (res.status === 403) {
        throw new Error(
          `Permissão negada ou rate limit (403). Garanta permissão "Issues: Read and write" no token. Detalhe: ${msgApi}`
        );
      }
      if (res.status === 404) {
        throw new Error(
          `Recurso não encontrado (404) em ${endpoint}. Verifique se o repositório existe e se o token tem acesso.`
        );
      }
      throw new Error(`Erro HTTP ${res.status} em ${method} ${endpoint}: ${msgApi}`);
    }

    return { data: json, headers: res.headers };
  }

  async function listarPaginado(endpoint) {
    const resultados = [];
    let page = 1;
    const separador = endpoint.includes('?') ? '&' : '?';

    while (true) {
      const { data } = await request('GET', `${endpoint}${separador}per_page=100&page=${page}`);
      if (!Array.isArray(data) || data.length === 0) break;
      resultados.push(...data);
      if (data.length < 100) break;
      page += 1;
    }

    return resultados;
  }

  return { request, listarPaginado };
}

async function sincronizarLabels(gh, repo, labels, syncExistentes) {
  console.log(`\n🏷️  Sincronizando labels (${labels.length})...`);
  const existentes = await gh.listarPaginado(`/repos/${repo}/labels`);
  const mapaExistentes = new Map(existentes.map((l) => [normalizar(l.name), l]));

  let criadas = 0;
  let atualizadas = 0;
  let mantidas = 0;

  for (const label of labels) {
    const cor = String(label.color || '6b7280').replace(/^#/, '');
    const existente = mapaExistentes.get(normalizar(label.name));

    if (!existente) {
      await gh.request('POST', `/repos/${repo}/labels`, {
        name: label.name,
        color: cor,
        description: label.description || '',
      });
      criadas += 1;
      console.log(`  [+] Label criada: ${label.name}`);
      await dormir(250);
    } else if (syncExistentes) {
      await gh.request('PATCH', `/repos/${repo}/labels/${encodeURIComponent(existente.name)}`, {
        new_name: label.name,
        color: cor,
        description: label.description || '',
      });
      atualizadas += 1;
      console.log(`  [~] Label atualizada: ${label.name}`);
      await dormir(250);
    } else {
      mantidas += 1;
    }
  }

  console.log(`  Resumo labels: ${criadas} criadas, ${atualizadas} atualizadas, ${mantidas} já existentes.`);
}

async function sincronizarMilestones(gh, repo, milestones) {
  console.log(`\n🎯 Sincronizando milestones (${milestones.length})...`);
  const existentes = await gh.listarPaginado(`/repos/${repo}/milestones?state=all`);
  const mapaMilestones = new Map(existentes.map((m) => [normalizar(m.title), m.number]));

  let criadas = 0;
  let mantidas = 0;

  for (const ms of milestones) {
    const chave = normalizar(ms.title);
    if (mapaMilestones.has(chave)) {
      mantidas += 1;
      console.log(`  [=] Milestone existente (#${mapaMilestones.get(chave)}): ${ms.title}`);
      continue;
    }

    const { data } = await gh.request('POST', `/repos/${repo}/milestones`, {
      title: ms.title,
      description: ms.description || '',
    });
    mapaMilestones.set(chave, data.number);
    criadas += 1;
    console.log(`  [+] Milestone criada (#${data.number}): ${ms.title}`);
    await dormir(250);
  }

  console.log(`  Resumo milestones: ${criadas} criadas, ${mantidas} já existentes.`);
  return mapaMilestones;
}

async function criarIssues(gh, repo, issues, mapaMilestones) {
  console.log(`\n📋 Verificando e criando issues (${issues.length})...`);
  const itensExistentes = await gh.listarPaginado(`/repos/${repo}/issues?state=all`);
  // Ignora Pull Requests (que a API de issues também retorna)
  const issuesExistentes = itensExistentes.filter((item) => !item.pull_request);
  const mapaTitulos = new Map(issuesExistentes.map((i) => [normalizar(i.title), i]));

  let criadas = 0;
  let puladas = 0;
  let erros = 0;

  for (const issue of issues) {
    const chaveTitulo = normalizar(issue.title);
    const jaExiste = mapaTitulos.get(chaveTitulo);

    if (jaExiste) {
      puladas += 1;
      console.log(`  [=] Pulada (já existe #${jaExiste.number}): ${issue.title}`);
      continue;
    }

    const payload = {
      title: issue.title,
      body: issue.body || '',
      labels: issue.labels || [],
    };

    if (issue.milestone) {
      const numeroMs = mapaMilestones.get(normalizar(issue.milestone));
      if (numeroMs) {
        payload.milestone = numeroMs;
      }
    }

    try {
      const { data } = await gh.request('POST', `/repos/${repo}/issues`, payload);
      criadas += 1;
      console.log(`  [+] Criada #${data.number}: ${issue.title}`);
      console.log(`      ${data.html_url}`);
      await dormir(DELAY_MS);
    } catch (erro) {
      erros += 1;
      console.error(`  [x] Falha ao criar "${issue.title}": ${erro.message}`);
    }
  }

  return { criadas, puladas, erros };
}

function executarDryRun(repo, labels, milestones, issues) {
  console.log('\n🧪 MODO DRY-RUN (nenhuma alteração será enviada ao GitHub)');
  console.log(`📦 Repositório: ${repo}`);
  console.log(`🏷️  Labels declaradas: ${labels.length}`);
  console.log(`🎯 Milestones declaradas: ${milestones.length}`);
  console.log(`📋 Issues selecionadas: ${issues.length}\n`);

  const porMilestone = new Map();
  for (const issue of issues) {
    const ms = issue.milestone || '(Sem milestone)';
    if (!porMilestone.has(ms)) porMilestone.set(ms, []);
    porMilestone.get(ms).push(issue);
  }

  for (const [ms, lista] of porMilestone.entries()) {
    console.log(`=== ${ms} (${lista.length}) ===`);
    for (const item of lista) {
      const id = item.id ? `[${item.id}] ` : '';
      const tags = (item.labels || []).join(', ');
      console.log(`  • ${id}${item.title}`);
      console.log(`    Labels: ${tags}`);
    }
    console.log('');
  }

  console.log('✅ Validação concluída com sucesso! Para criar de verdade no GitHub, rode:');
  console.log('   GITHUB_TOKEN=seu_token node scripts/criar-inssues.js');
}

async function main() {
  const opcoes = parseArgs(process.argv.slice(2));
  if (opcoes.help) {
    mostrarAjuda();
    return;
  }

  carregarDotEnvSeExistir();

  const backlog = carregarBacklog(opcoes.file);
  const repo = opcoes.repo || backlog.repo;
  if (!repo || !repo.includes('/')) {
    throw new Error('Repositório inválido. Informe "owner/repo" no backlog.json ou via --repo=');
  }

  const labels = backlog.labels || [];
  const milestones = backlog.milestones || [];
  let issues = backlog.issues || [];

  if (opcoes.only) {
    issues = issues.filter((i) => i.id && opcoes.only.has(String(i.id).toUpperCase()));
  }
  if (opcoes.milestone) {
    const alvo = normalizar(opcoes.milestone);
    issues = issues.filter((i) => normalizar(i.milestone) === alvo);
  }

  if (issues.length === 0) {
    console.log('⚠️  Nenhuma issue corresponde aos filtros informados.');
    return;
  }

  if (opcoes.dryRun) {
    executarDryRun(repo, labels, milestones, issues);
    return;
  }

  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (!token) {
    console.error('❌ Variável GITHUB_TOKEN (ou GH_TOKEN) não encontrada.');
    console.error('   Dica: teste primeiro com "node scripts/criar-inssues.js --dry-run"');
    console.error('   Ou rode: GITHUB_TOKEN=seu_token node scripts/criar-inssues.js');
    process.exit(1);
  }

  console.log(`🚀 Organizando issues no repositório ${repo}...`);
  const gh = criarClienteGitHub(token);

  if (labels.length > 0) {
    await sincronizarLabels(gh, repo, labels, opcoes.syncLabels);
  }

  const mapaMilestones =
    milestones.length > 0 ? await sincronizarMilestones(gh, repo, milestones) : new Map();

  const resultado = await criarIssues(gh, repo, issues, mapaMilestones);

  console.log('\n========================================');
  console.log('📊 RESUMO FINAL');
  console.log(`   Criadas : ${resultado.criadas}`);
  console.log(`   Puladas : ${resultado.puladas}`);
  console.log(`   Erros   : ${resultado.erros}`);
  console.log('========================================');

  if (resultado.erros > 0) {
    process.exit(1);
  }
}

main().catch((erro) => {
  console.error(`\n❌ Erro: ${erro.message}`);
  process.exit(1);
});
