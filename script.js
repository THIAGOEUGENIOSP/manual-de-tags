let activeLang = "all";
let activeCat = "all";
let activeLevel = "all";
let studyMode = "all";
let selectedRow = null;
let selectedDetailRow = null;

function updateCategoryButtons() {
  const langClass = activeLang + "-cat";

  document.querySelectorAll(".cat-btn").forEach((btn) => {
    const isAllButton = btn
      .getAttribute("onclick")
      ?.includes("filterCat('all'");
    if (isAllButton) {
      btn.hidden = false;
      return;
    }

    btn.hidden = activeLang !== "all" && !btn.classList.contains(langClass);
  });
}

function switchLang(lang, btn) {
  activeLang = lang;
  activeCat = "all";

  document.querySelectorAll(".lang-tab").forEach((t) => {
    t.classList.remove(
      "active-html",
      "active-css",
      "active-js",
      "active-tools",
    );
  });
  const cls = lang === "all" ? "active-html" : "active-" + lang;
  btn.classList.add(cls);

  const blocks = {
    html: document.getElementById("block-html"),
    css: document.getElementById("block-css"),
    js: document.getElementById("block-js"),
    tools: document.getElementById("block-tools"),
  };

  if (lang === "all") {
    Object.values(blocks).forEach((b) => b.classList.add("visible"));
  } else {
    Object.values(blocks).forEach((b) => b.classList.remove("visible"));
    blocks[lang].classList.add("visible");
  }

  document
    .querySelectorAll(".cat-btn")
    .forEach((b) => b.classList.remove("active"));
  document
    .querySelector(".cat-btn[onclick*=\"'all'\"]")
    .classList.add("active");
  updateCategoryButtons();

  applyFilters();
}

function filterCat(cat, btn) {
  activeCat = cat;
  document
    .querySelectorAll(".cat-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  applyFilters();
}

function filterLevel(level, btn) {
  activeLevel = level;
  document
    .querySelectorAll(".level-filter-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  applyFilters();
}

function toggleStudyMode(mode, btn) {
  studyMode = mode;
  document
    .querySelectorAll(".study-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  applyFilters();
}

function getCleanToken(cell) {
  const clone = cell.cloneNode(true);
  clone.querySelectorAll(".badge").forEach((badge) => badge.remove());
  return clone.textContent.replace(/\s+/g, " ").trim();
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function getRichHtmlExample(tagName, isVoid) {
  const richExamples = {
    a: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; background: #f8fbff; }
    .card { padding: 20px; border: 1px solid #d8e0f0; border-radius: 16px; background: white; }
    a { color: #2563eb; font-weight: 700; text-decoration: none; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Link em destaque</h1>
    <p>O elemento <strong>&lt;a&gt;</strong> leva o usuario para outro destino.</p>
    <a href="https://exemplo.com" target="_blank">Abrir pagina de exemplo</a>
  </div>
</body>
</html>`,
    button: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; background: #f8fbff; }
    button { padding: 12px 18px; border: 0; border-radius: 12px; background: #2563eb; color: white; font-weight: 700; cursor: pointer; }
    #saida { margin-top: 14px; color: #334155; }
  </style>
</head>
<body>
  <button id="acao" type="button">Clique no botao</button>
  <p id="saida">O botao dispara uma acao.</p>

  <script>
    document.getElementById('acao').addEventListener('click', () => {
      document.getElementById('saida').textContent = 'Voce clicou no elemento <button>.';
    });
  </script>
</body>
</html>`,
    form: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; background: #f8fbff; }
    form { display: grid; gap: 12px; max-width: 360px; padding: 20px; border-radius: 16px; background: white; border: 1px solid #d8e0f0; }
    input, button { padding: 12px; border-radius: 12px; font: inherit; }
    input { border: 1px solid #cbd5e1; }
    button { border: 0; background: #2563eb; color: white; font-weight: 700; }
    #mensagem { margin-top: 12px; color: #334155; }
  </style>
</head>
<body>
  <form id="cadastro">
    <label for="email">E-mail</label>
    <input id="email" type="email" placeholder="voce@exemplo.com" required>
    <button type="submit">Cadastrar</button>
  </form>
  <p id="mensagem">O <strong>&lt;form&gt;</strong> agrupa campos e envio.</p>

  <script>
    document.getElementById('cadastro').addEventListener('submit', event => {
      event.preventDefault();
      document.getElementById('mensagem').textContent = 'Formulario enviado sem recarregar a pagina.';
    });
  </script>
</body>
</html>`,
    input: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; background: #f8fbff; }
    .box { max-width: 380px; padding: 20px; border-radius: 16px; background: white; border: 1px solid #d8e0f0; }
    input { width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 12px; font: inherit; }
    small { display: block; margin-top: 10px; color: #475569; }
  </style>
</head>
<body>
  <div class="box">
    <label for="nome">Nome</label>
    <input id="nome" type="text" placeholder="Digite seu nome">
    <small>O <strong>&lt;input&gt;</strong> captura um valor digitado pelo usuario.</small>
  </div>
</body>
</html>`,
    nav: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { margin: 0; font-family: Arial, sans-serif; background: #f8fbff; }
    nav { display: flex; gap: 16px; padding: 18px 24px; background: linear-gradient(135deg, #1e3a8a, #2563eb); }
    nav a { color: white; text-decoration: none; font-weight: 700; }
    main { padding: 24px; }
  </style>
</head>
<body>
  <nav>
    <a href="#inicio">Inicio</a>
    <a href="#guias">Guias</a>
    <a href="#contato">Contato</a>
  </nav>
  <main>
    <h1>O elemento &lt;nav&gt; organiza a navegacao</h1>
  </main>
</body>
</html>`,
    menu: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; background: #f8fbff; }
    .card { padding: 20px; border-radius: 16px; background: white; border: 1px solid #d8e0f0; }
    menu { display: flex; gap: 12px; list-style: none; padding: 0; margin: 16px 0 0; }
    menu li { list-style: none; }
    menu button { padding: 10px 14px; border: 0; border-radius: 12px; background: #2563eb; color: white; font-weight: 700; cursor: pointer; }
    #saida { margin-top: 14px; color: #475569; }
  </style>
</head>
<body>
  <div class="card">
    <h2>Acoes agrupadas em menu</h2>
    <p>O elemento <strong>&lt;menu&gt;</strong> pode organizar comandos ou acoes relacionadas.</p>
    <menu>
      <li><button type="button" data-acao="Salvar">Salvar</button></li>
      <li><button type="button" data-acao="Duplicar">Duplicar</button></li>
      <li><button type="button" data-acao="Compartilhar">Compartilhar</button></li>
    </menu>
    <p id="saida">Clique em uma das acoes do menu.</p>
  </div>

  <script>
    document.querySelectorAll('menu button').forEach(botao => {
      botao.addEventListener('click', () => {
        document.getElementById('saida').textContent = 'Acao escolhida: ' + botao.dataset.acao;
      });
    });
  </script>
</body>
</html>`,
    header: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { margin: 0; font-family: Arial, sans-serif; background: #f8fbff; }
    header { padding: 28px 24px; background: linear-gradient(135deg, #0f172a, #1d4ed8); color: white; }
    main { padding: 24px; }
  </style>
</head>
<body>
  <header>
    <h1>Cabecalho da pagina</h1>
    <p>O <strong>&lt;header&gt;</strong> introduz a pagina ou secao.</p>
  </header>
  <main>Conteudo abaixo do cabecalho.</main>
</body>
</html>`,
    section: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; background: #f8fbff; }
    section { padding: 20px; border-radius: 16px; background: white; border: 1px solid #d8e0f0; }
  </style>
</head>
<body>
  <section>
    <h2>Secao de destaque</h2>
    <p>O elemento <strong>&lt;section&gt;</strong> agrupa um tema dentro da pagina.</p>
  </section>
</body>
</html>`,
    article: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; background: #f8fbff; }
    article { padding: 20px; border-radius: 16px; background: white; border: 1px solid #d8e0f0; box-shadow: 0 10px 24px rgba(37,99,235,0.08); }
  </style>
</head>
<body>
  <article>
    <h2>Post independente</h2>
    <p>O <strong>&lt;article&gt;</strong> representa um bloco autonomo de conteudo.</p>
  </article>
</body>
</html>`,
    aside: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; background: #f8fbff; }
    .layout { display: grid; grid-template-columns: 1.7fr 1fr; gap: 16px; }
    main, aside { padding: 20px; border-radius: 16px; border: 1px solid #d8e0f0; background: white; }
    aside { background: #eef4ff; }
  </style>
</head>
<body>
  <div class="layout">
    <main>Conteudo principal da pagina.</main>
    <aside>Dica lateral: o <strong>&lt;aside&gt;</strong> guarda informacoes complementares.</aside>
  </div>
</body>
</html>`,
    table: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; background: #f8fbff; }
    table { width: 100%; border-collapse: collapse; background: white; border-radius: 16px; overflow: hidden; }
    th, td { padding: 12px; border: 1px solid #d8e0f0; text-align: left; }
    th { background: #eff6ff; color: #1d4ed8; }
  </style>
</head>
<body>
  <table>
    <thead>
      <tr><th>Nome</th><th>Nivel</th></tr>
    </thead>
    <tbody>
      <tr><td>Ana</td><td>Intermediario</td></tr>
      <tr><td>Caio</td><td>Basico</td></tr>
    </tbody>
  </table>
</body>
</html>`,
    img: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; background: #f0f4ff; }
    figure { max-width: 420px; margin: 0; padding: 16px; background: white; border: 1px solid #d8e0f0; border-radius: 16px; box-shadow: 0 4px 16px rgba(37,99,235,0.08); }
    .tag-label { display:inline-block; background:#dbeafe; color:#1d4ed8; font-size:11px; font-weight:700; padding:4px 10px; border-radius:999px; margin-bottom:12px; text-transform:uppercase; letter-spacing:.08em; }
    img { width: 100%; border-radius: 12px; display: block; }
    figcaption { margin-top: 10px; color: #475569; font-size:13px; }
    figcaption strong { color:#1d4ed8; }
  </style>
</head>
<body>
  <figure>
    <span class="tag-label">&lt;img&gt;</span>
    <img src="https://picsum.photos/640/360" alt="Paisagem de exemplo">
    <figcaption>O <strong>&lt;img&gt;</strong> insere uma imagem. O atributo <strong>alt</strong> é essencial para acessibilidade.</figcaption>
  </figure>
</body>
</html>`,
    details: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; background: #f0f4ff; }
    .card { padding: 20px; background: white; border: 1px solid #d8e0f0; border-radius: 16px; box-shadow: 0 4px 16px rgba(37,99,235,0.08); }
    .tag-label { display:inline-block; background:#dbeafe; color:#1d4ed8; font-size:11px; font-weight:700; padding:4px 10px; border-radius:999px; margin-bottom:14px; text-transform:uppercase; letter-spacing:.08em; }
    details { border: 1px solid #d8e0f0; border-radius: 12px; padding: 14px; margin-bottom: 10px; background: #f8fbff; }
    details[open] { background: #eff6ff; border-color: #93c5fd; }
    summary { font-weight: 700; cursor: pointer; color: #1d4ed8; list-style: none; display: flex; justify-content: space-between; align-items: center; }
    summary::after { content: '▼'; font-size: 12px; }
    details[open] summary::after { content: '▲'; }
    .content { margin-top: 10px; color: #475569; font-size: 14px; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="card">
    <span class="tag-label">&lt;details&gt; + &lt;summary&gt;</span>
    <details>
      <summary>O que é o elemento &lt;details&gt;?</summary>
      <div class="content">Cria um widget acordeão nativo sem JavaScript. O &lt;summary&gt; é o título clicável que expande/recolhe o conteúdo.</div>
    </details>
    <details>
      <summary>Quando usar?</summary>
      <div class="content">Ideal para FAQs, dicas e conteúdos opcionais que não precisam estar sempre visíveis.</div>
    </details>
  </div>
</body>
</html>`,
    dialog: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; background: #f0f4ff; }
    .card { padding: 20px; background: white; border: 1px solid #d8e0f0; border-radius: 16px; box-shadow: 0 4px 16px rgba(37,99,235,0.08); }
    .tag-label { display:inline-block; background:#dbeafe; color:#1d4ed8; font-size:11px; font-weight:700; padding:4px 10px; border-radius:999px; margin-bottom:14px; text-transform:uppercase; letter-spacing:.08em; }
    button { padding: 10px 18px; border: 0; border-radius: 10px; background: #2563eb; color: white; font-weight: 700; cursor: pointer; }
    dialog { border: none; border-radius: 16px; padding: 24px; box-shadow: 0 16px 48px rgba(15,23,42,0.18); min-width: 260px; }
    dialog h3 { margin: 0 0 8px; color: #0f172a; }
    dialog p { color: #475569; margin: 0 0 16px; font-size: 14px; }
    .btn-row { display: flex; gap: 8px; justify-content: flex-end; }
    .cancel { background: #f1f5f9; color: #334155; }
    dialog::backdrop { background: rgba(15,23,42,0.4); }
  </style>
</head>
<body>
  <div class="card">
    <span class="tag-label">&lt;dialog&gt;</span>
    <p style="margin:0 0 12px;color:#475569;font-size:14px;">O &lt;dialog&gt; é um modal nativo do navegador, sem JavaScript extra.</p>
    <button onclick="document.getElementById('modal').showModal()">Abrir modal nativo</button>
  </div>
  <dialog id="modal">
    <h3>Modal com &lt;dialog&gt;</h3>
    <p>Este é um diálogo nativo do HTML5. Sem bibliotecas externas!</p>
    <div class="btn-row">
      <button class="cancel" onclick="document.getElementById('modal').close()">Fechar</button>
    </div>
  </dialog>
</body>
</html>`,
    progress: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; background: #f0f4ff; }
    .card { padding: 20px; background: white; border: 1px solid #d8e0f0; border-radius: 16px; box-shadow: 0 4px 16px rgba(37,99,235,0.08); display:grid; gap:14px; }
    .tag-label { display:inline-block; background:#dbeafe; color:#1d4ed8; font-size:11px; font-weight:700; padding:4px 10px; border-radius:999px; text-transform:uppercase; letter-spacing:.08em; }
    progress { width: 100%; height: 14px; border-radius: 999px; appearance: none; border: none; }
    progress::-webkit-progress-bar { background: #e2e8f0; border-radius: 999px; }
    progress::-webkit-progress-value { background: linear-gradient(90deg, #2563eb, #06b6d4); border-radius: 999px; transition: width .3s; }
    .row { display:flex; gap:8px; }
    button { padding: 8px 14px; border: 0; border-radius: 10px; font-weight: 700; cursor: pointer; font-size:13px; }
    .up { background: #16a34a; color: white; }
    .dn { background: #dc2626; color: white; }
    p { color: #475569; font-size: 14px; margin: 0; }
  </style>
</head>
<body>
  <div class="card">
    <span class="tag-label">&lt;progress&gt;</span>
    <p>Progresso: <strong id="pct">50%</strong></p>
    <progress id="bar" value="50" max="100"></progress>
    <div class="row">
      <button class="up" onclick="ajustar(10)">+ 10%</button>
      <button class="dn" onclick="ajustar(-10)">− 10%</button>
    </div>
  </div>
  <script>
    function ajustar(delta) {
      const bar = document.getElementById('bar');
      bar.value = Math.max(0, Math.min(100, bar.value + delta));
      document.getElementById('pct').textContent = bar.value + '%';
    }
  </script>
</body>
</html>`,
    meter: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; background: #f0f4ff; }
    .card { padding: 20px; background: white; border: 1px solid #d8e0f0; border-radius: 16px; box-shadow: 0 4px 16px rgba(37,99,235,0.08); display:grid; gap:14px; }
    .tag-label { display:inline-block; background:#dbeafe; color:#1d4ed8; font-size:11px; font-weight:700; padding:4px 10px; border-radius:999px; text-transform:uppercase; letter-spacing:.08em; }
    meter { width: 100%; height: 18px; }
    .row { display:flex; justify-content:space-between; font-size:13px; color:#64748b; }
  </style>
</head>
<body>
  <div class="card">
    <span class="tag-label">&lt;meter&gt;</span>
    <p style="margin:0;color:#475569;font-size:14px;">Uso de disco — <strong>7.5 GB de 10 GB</strong></p>
    <meter value="7.5" min="0" max="10" low="3" high="8" optimum="2"></meter>
    <div class="row"><span>0 GB</span><span style="color:#dc2626;font-weight:700">75% usado ⚠</span><span>10 GB</span></div>
  </div>
</body>
</html>`,
  };

  if (richExamples[tagName]) return richExamples[tagName];
  if (isVoid) {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; background: #f8fbff; }
    .box { padding: 20px; border-radius: 16px; background: white; border: 1px solid #d8e0f0; }
  </style>
</head>
<body>
  <div class="box">
    <p>Exemplo da tag <strong>&lt;${tagName}&gt;</strong>:</p>
    <${tagName}>
  </div>
</body>
</html>`;
  }

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; background: #f8fbff; color: #0f172a; }
    .box { padding: 20px; border-radius: 16px; background: white; border: 1px solid #d8e0f0; box-shadow: 0 10px 24px rgba(37,99,235,0.06); }
    .label { display: inline-flex; margin-bottom: 12px; padding: 6px 10px; border-radius: 999px; background: #e8f0ff; color: #2457d6; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
    .demo { margin-top: 12px; padding: 16px; border: 1px dashed #c9d5ea; border-radius: 14px; background: #f8fbff; }
  </style>
</head>
<body>
  <div class="box">
    <span class="label">Tag em destaque</span>
    <p>Este exemplo foi montado para destacar o papel do elemento <strong>&lt;${tagName}&gt;</strong>.</p>
    <div class="demo">
      <${tagName}>Conteudo de exemplo dentro de &lt;${tagName}&gt;.</${tagName}>
    </div>
  </div>
</body>
</html>`;
}

function getRichCssExample(property) {
  const sampleValues = {
    "background-color": "#dbeafe",
    color: "#2563eb",
    background: "linear-gradient(135deg, #1d4ed8, #06b6d4)",
    display: "flex",
    "justify-content": "space-between",
    "align-items": "center",
    flex: "1",
    "grid-template-columns": "repeat(3, minmax(0, 1fr))",
    position: "relative",
    width: "320px",
    height: "120px",
    margin: "24px auto",
    padding: "20px",
    border: "2px solid #2563eb",
    "border-radius": "20px",
    "box-shadow": "0 16px 30px rgba(15, 23, 42, 0.14)",
    "font-size": "1.2rem",
    "font-weight": "700",
    "text-align": "center",
    "line-height": "1.7",
    gap: "16px",
    transform: "translateY(-4px) scale(1.02)",
    transition: "all 0.25s ease",
    animation: "pulse 1.4s infinite",
    opacity: "0.8",
  };

  const richExamples = {
    color: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; background: #f8fbff; }
    .card { padding: 20px; border-radius: 16px; background: white; border: 1px solid #d8e0f0; }
    .texto { color: #2563eb; font-size: 1.2rem; font-weight: 700; }
  </style>
</head>
<body>
  <div class="card">
    <p class="texto">A propriedade <strong>color</strong> muda a cor do texto.</p>
  </div>
</body>
</html>`,
    "background-color": `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; background: #f8fbff; }
    .card {
      padding: 24px;
      border-radius: 18px;
      background-color: #dbeafe;
      border: 1px solid #93c5fd;
    }
  </style>
</head>
<body>
  <div class="card">
    <h2>Fundo destacado</h2>
    <p>A propriedade <strong>background-color</strong> pinta o fundo do elemento.</p>
  </div>
</body>
</html>`,
    background: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; background: #eef4ff; }
    .banner {
      padding: 28px;
      border-radius: 20px;
      color: white;
      background: linear-gradient(135deg, #1d4ed8, #06b6d4);
    }
  </style>
</head>
<body>
  <div class="banner">
    <h1>Background em destaque</h1>
    <p>O fundo ajuda a criar atmosfera e contraste.</p>
  </div>
</body>
</html>`,
    display: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; background: #f8fbff; }
    .grupo {
      display: flex;
      gap: 12px;
      padding: 18px;
      border-radius: 16px;
      background: white;
      border: 1px solid #d8e0f0;
    }
    .grupo div {
      padding: 14px 16px;
      border-radius: 12px;
      background: #dbeafe;
      border: 1px solid #93c5fd;
    }
  </style>
</head>
<body>
  <div class="grupo">
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
  </div>
</body>
</html>`,
    "justify-content": `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; background: #f8fbff; }
    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 18px;
      border-radius: 16px;
      background: white;
      border: 1px solid #d8e0f0;
    }
    button { padding: 10px 14px; border: 0; border-radius: 12px; background: #2563eb; color: white; }
  </style>
</head>
<body>
  <div class="toolbar">
    <button>Voltar</button>
    <button>Salvar</button>
  </div>
</body>
</html>`,
    "align-items": `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; background: #f8fbff; }
    .linha {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 18px;
      border-radius: 16px;
      background: white;
      border: 1px solid #d8e0f0;
    }
    .icone {
      width: 42px;
      height: 42px;
      border-radius: 12px;
      background: #bfdbfe;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  </style>
</head>
<body>
  <div class="linha">
    <span class="icone">i</span>
    <strong>Texto alinhado ao centro verticalmente</strong>
  </div>
</body>
</html>`,
    flex: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; background: #f8fbff; }
    .layout { display: flex; gap: 14px; }
    .principal { flex: 2; padding: 20px; border-radius: 16px; background: white; border: 1px solid #d8e0f0; }
    .lateral { flex: 1; padding: 20px; border-radius: 16px; background: #eef4ff; border: 1px solid #c7d7f6; }
  </style>
</head>
<body>
  <div class="layout">
    <div class="principal">Coluna com flex maior</div>
    <div class="lateral">Coluna menor</div>
  </div>
</body>
</html>`,
    "grid-template-columns": `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; background: #f8fbff; }
    .grade {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
    }
    .grade div {
      padding: 20px;
      border-radius: 14px;
      background: white;
      border: 1px solid #d8e0f0;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="grade">
    <div>Card 1</div>
    <div>Card 2</div>
    <div>Card 3</div>
    <div>Card 4</div>
    <div>Card 5</div>
    <div>Card 6</div>
  </div>
</body>
</html>`,
    position: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; background: #f8fbff; }
    .area {
      position: relative;
      padding: 28px;
      border-radius: 16px;
      background: white;
      border: 1px solid #d8e0f0;
      min-height: 140px;
    }
    .aviso {
      position: absolute;
      top: 12px;
      right: 12px;
      padding: 8px 10px;
      border-radius: 10px;
      background: #1d4ed8;
      color: white;
      font-weight: 700;
    }
  </style>
</head>
<body>
  <div class="area">
    <div class="aviso">Posicionado</div>
    <p>position controla como o elemento se encaixa no layout.</p>
  </div>
</body>
</html>`,
    transform: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; background: #f8fbff; }
    .card {
      width: 220px;
      padding: 20px;
      border-radius: 16px;
      background: white;
      border: 1px solid #d8e0f0;
      transform: translateY(-6px) rotate(-1deg) scale(1.02);
      box-shadow: 0 14px 30px rgba(37,99,235,0.12);
    }
  </style>
</head>
<body>
  <div class="card">transform move, gira ou escala o elemento.</div>
</body>
</html>`,
    transition: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; background: #f8fbff; }
    button {
      padding: 12px 18px;
      border: 0;
      border-radius: 12px;
      background: #2563eb;
      color: white;
      font-weight: 700;
      cursor: pointer;
      transition: transform 0.2s ease, background 0.2s ease;
    }
    button:hover {
      transform: translateY(-2px);
      background: #1d4ed8;
    }
  </style>
</head>
<body>
  <button>Passe o mouse</button>
</body>
</html>`,
    animation: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; background: #f8fbff; }
    .bolha {
      width: 88px;
      height: 88px;
      border-radius: 999px;
      background: linear-gradient(135deg, #2563eb, #06b6d4);
      animation: pulse 1.4s infinite;
    }
    @keyframes pulse {
      50% { transform: scale(1.12); opacity: 0.75; }
    }
  </style>
</head>
<body>
  <div class="bolha"></div>
</body>
</html>`,
    "box-shadow": `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; background: #eef4ff; }
    .card {
      padding: 22px;
      border-radius: 18px;
      background: white;
      border: 1px solid #d8e0f0;
      box-shadow: 0 16px 36px rgba(15,23,42,0.12);
    }
  </style>
</head>
<body>
  <div class="card">box-shadow cria profundidade visual.</div>
</body>
</html>`,
    "border-radius": `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; background: #f0f4ff; }
    .grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; }
    .box { padding: 16px 8px; background: white; border: 2px solid #93c5fd; text-align: center; font-size: 12px; color: #1d4ed8; font-weight: 700; }
    .r0 { border-radius: 0; }
    .r8 { border-radius: 8px; }
    .r16 { border-radius: 16px; }
    .r24 { border-radius: 24px; }
    .r50p { border-radius: 50%; height: 72px; display:flex; align-items:center; justify-content:center; }
    .r999 { border-radius: 999px; }
    .label { font-size:11px; color:#64748b; margin-top:4px; font-family:monospace; }
  </style>
</head>
<body>
  <div class="grid">
    <div><div class="box r0">0px</div><div class="label">border-radius: 0</div></div>
    <div><div class="box r8">8px</div><div class="label">border-radius: 8px</div></div>
    <div><div class="box r16">16px</div><div class="label">border-radius: 16px</div></div>
    <div><div class="box r24">24px</div><div class="label">border-radius: 24px</div></div>
    <div><div class="box r50p">50%</div><div class="label">border-radius: 50%</div></div>
    <div><div class="box r999">999px</div><div class="label">border-radius: 999px</div></div>
  </div>
</body>
</html>`,
    "font-size": `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; background: #f0f4ff; }
    .card { padding: 20px; background: white; border: 1px solid #d8e0f0; border-radius: 16px; box-shadow: 0 4px 16px rgba(37,99,235,0.08); display:grid; gap:10px; }
    .row { display:flex; align-items:baseline; gap:10px; }
    .sz { color: #0f172a; font-weight: 700; }
    .label { font-size: 11px; color: #94a3b8; font-family: monospace; }
  </style>
</head>
<body>
  <div class="card">
    <span style="font-size:11px;font-weight:700;color:#1d4ed8;text-transform:uppercase;letter-spacing:.08em;">font-size</span>
    <div class="row"><span class="sz" style="font-size:12px">Texto 12px</span><span class="label">font-size: 12px</span></div>
    <div class="row"><span class="sz" style="font-size:16px">Texto 16px</span><span class="label">font-size: 16px (base)</span></div>
    <div class="row"><span class="sz" style="font-size:20px">Texto 20px</span><span class="label">font-size: 20px</span></div>
    <div class="row"><span class="sz" style="font-size:28px">Texto 28px</span><span class="label">font-size: 28px</span></div>
    <div class="row"><span class="sz" style="font-size:40px">Texto 40px</span><span class="label">font-size: 40px</span></div>
  </div>
</body>
</html>`,
    opacity: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; background: #f0f4ff; }
    .card { padding: 20px; background: white; border: 1px solid #d8e0f0; border-radius: 16px; box-shadow: 0 4px 16px rgba(37,99,235,0.08); }
    .tag-label { display:inline-block; background:#dbeafe; color:#1d4ed8; font-size:11px; font-weight:700; padding:4px 10px; border-radius:999px; margin-bottom:14px; text-transform:uppercase; letter-spacing:.08em; }
    .row { display:flex; gap:10px; align-items:flex-end; flex-wrap:wrap; }
    .box { width:60px; height:60px; border-radius:12px; background:linear-gradient(135deg,#2563eb,#06b6d4); display:flex; align-items:center; justify-content:center; color:white; font-weight:800; font-size:13px; flex-direction:column; gap:3px; }
    .label { font-size:10px; font-family:monospace; color:#64748b; margin-top:4px; text-align:center; }
  </style>
</head>
<body>
  <div class="card">
    <span class="tag-label">opacity</span>
    <div class="row">
      <div><div class="box" style="opacity:1">100%</div><div class="label">opacity: 1</div></div>
      <div><div class="box" style="opacity:.75">75%</div><div class="label">opacity: .75</div></div>
      <div><div class="box" style="opacity:.5">50%</div><div class="label">opacity: .5</div></div>
      <div><div class="box" style="opacity:.25">25%</div><div class="label">opacity: .25</div></div>
      <div><div class="box" style="opacity:.05">5%</div><div class="label">opacity: .05</div></div>
    </div>
  </div>
</body>
</html>`,
    cursor: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; background: #f0f4ff; }
    .card { padding: 20px; background: white; border: 1px solid #d8e0f0; border-radius: 16px; box-shadow: 0 4px 16px rgba(37,99,235,0.08); }
    .tag-label { display:inline-block; background:#dbeafe; color:#1d4ed8; font-size:11px; font-weight:700; padding:4px 10px; border-radius:999px; margin-bottom:14px; text-transform:uppercase; letter-spacing:.08em; }
    .grid { display:grid; grid-template-columns: repeat(3,1fr); gap:10px; }
    .chip { padding:12px 8px; border-radius:10px; background:#f8fbff; border:1px solid #d8e0f0; text-align:center; font-size:12px; font-weight:700; color:#334155; font-family:monospace; }
  </style>
</head>
<body>
  <div class="card">
    <span class="tag-label">cursor</span>
    <p style="color:#475569;font-size:13px;margin:0 0 12px;">Passe o mouse sobre cada caixa para ver o cursor:</p>
    <div class="grid">
      <div class="chip" style="cursor:default">default</div>
      <div class="chip" style="cursor:pointer">pointer</div>
      <div class="chip" style="cursor:text">text</div>
      <div class="chip" style="cursor:crosshair">crosshair</div>
      <div class="chip" style="cursor:move">move</div>
      <div class="chip" style="cursor:not-allowed">not-allowed</div>
    </div>
  </div>
</body>
</html>`,
  };

  if (richExamples[property]) return richExamples[property];
  const sampleValue = sampleValues[property] || "#2563eb";

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; background: #f8fbff; }
    .exemplo {
      ${property}: ${sampleValue};
      padding: 18px;
      border-radius: 16px;
      background: white;
      border: 1px solid #d8e0f0;
    }
  </style>
</head>
<body>
  <div class="exemplo">Exemplo da propriedade ${property}.</div>
</body>
</html>`;
}

function getRichJsExample(token) {
  const richExamples = {
    "document.querySelector()": `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; background: #f8fbff; }
    .card { padding: 20px; border-radius: 16px; background: white; border: 1px solid #d8e0f0; }
    button { padding: 12px 16px; border: 0; border-radius: 12px; background: #2563eb; color: white; font-weight: 700; cursor: pointer; }
    #saida { margin-top: 14px; color: #334155; }
  </style>
</head>
<body>
  <div class="card">
    <button id="botao">Alterar texto</button>
    <p id="saida">Texto inicial.</p>
  </div>

  <script>
    const botao = document.querySelector('#botao');
    const saida = document.querySelector('#saida');
    botao.addEventListener('click', () => {
      saida.textContent = 'querySelector encontrou e atualizou o elemento.';
    });
  </script>
</body>
</html>`,
    ".addEventListener()": `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; background: #f8fbff; }
    .card { padding: 20px; border-radius: 16px; background: white; border: 1px solid #d8e0f0; }
    button { padding: 12px 16px; border: 0; border-radius: 12px; background: #0f766e; color: white; font-weight: 700; cursor: pointer; }
    #saida { margin-top: 14px; color: #334155; }
  </style>
</head>
<body>
  <div class="card">
    <button id="botao">Clique aqui</button>
    <p id="saida">Aguardando um evento.</p>
  </div>

  <script>
    document.getElementById('botao').addEventListener('click', () => {
      document.getElementById('saida').textContent = 'O evento de clique foi disparado.';
    });
  </script>
</body>
</html>`,
    "setTimeout(fn, ms)": `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; background: #f8fbff; }
    .card { padding: 20px; border-radius: 16px; background: white; border: 1px solid #d8e0f0; }
    #saida { color: #334155; }
  </style>
</head>
<body>
  <div class="card">
    <p id="saida">Esperando 1 segundo...</p>
  </div>

  <script>
    setTimeout(() => {
      document.getElementById('saida').textContent = 'setTimeout executou depois do tempo definido.';
    }, 1000);
  </script>
</body>
</html>`,
    "fetch(url)": `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; background: #f0f4ff; }
    .card { padding: 20px; border-radius: 16px; background: white; border: 1px solid #d8e0f0; box-shadow: 0 4px 16px rgba(37,99,235,0.08); }
    .tag-label { display:inline-block; background:#dbeafe; color:#1d4ed8; font-size:11px; font-weight:700; padding:4px 10px; border-radius:999px; margin-bottom:12px; text-transform:uppercase; letter-spacing:.08em; }
    button { padding: 12px 18px; border: 0; border-radius: 12px; background: linear-gradient(135deg,#2563eb,#1d4ed8); color: white; font-weight: 700; cursor: pointer; font-size:14px; }
    button:active { transform:scale(.97); }
    #saida { margin-top: 14px; padding:12px; border-radius:10px; background:#f8fbff; border:1px solid #e2e8f0; color: #334155; font-size:14px; min-height:42px; }
    .spinner { display:none; width:18px; height:18px; border:3px solid #dbeafe; border-top-color:#2563eb; border-radius:50%; animation:spin .7s linear infinite; margin-left:10px; }
    @keyframes spin { to { transform:rotate(360deg); } }
  </style>
</head>
<body>
  <div class="card">
    <span class="tag-label">fetch(url)</span>
    <div style="display:flex;align-items:center;gap:8px;">
      <button id="carregar">Carregar usuario da API</button>
      <div class="spinner" id="spin"></div>
    </div>
    <div id="saida">Clique para buscar dados reais.</div>
  </div>
  <script>
    document.getElementById('carregar').addEventListener('click', () => {
      const saida = document.getElementById('saida');
      document.getElementById('spin').style.display = 'block';
      saida.textContent = 'Buscando...';
      fetch('https://jsonplaceholder.typicode.com/users/1')
        .then(r => r.json())
        .then(d => { saida.textContent = '✅ Usuario: ' + d.name + ' — Email: ' + d.email; })
        .catch(() => { saida.textContent = '❌ Erro ao buscar.'; })
        .finally(() => { document.getElementById('spin').style.display='none'; });
    });
  </script>
</body>
</html>`,
    ".map()": `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; background: #f0f4ff; }
    .card { padding: 20px; border-radius: 16px; background: white; border: 1px solid #d8e0f0; box-shadow: 0 4px 16px rgba(37,99,235,0.08); }
    .tag-label { display:inline-block; background:#dbeafe; color:#1d4ed8; font-size:11px; font-weight:700; padding:4px 10px; border-radius:999px; margin-bottom:12px; text-transform:uppercase; letter-spacing:.08em; }
    button { padding: 10px 16px; border: 0; border-radius: 10px; background: #7c3aed; color: white; font-weight: 700; cursor: pointer; margin-bottom:12px; }
    .row { display:flex; gap:8px; flex-wrap:wrap; margin:8px 0; }
    .chip { padding:8px 14px; border-radius:10px; font-size:13px; font-weight:600; }
    .before { background:#fef3c7; color:#92400e; border:1px solid #fde68a; }
    .after { background:#d1fae5; color:#065f46; border:1px solid #6ee7b7; }
    .arrow { display:flex; align-items:center; font-size:20px; color:#6b7280; }
    p { color:#475569; font-size:13px; margin:0 0 8px; }
  </style>
</head>
<body>
  <div class="card">
    <span class="tag-label">.map()</span>
    <p>Transforma cada elemento e retorna um <strong>novo array</strong>.</p>
    <button onclick="transformar()">Aplicar .map() — dobrar precos</button>
    <div id="vis"></div>
  </div>
  <script>
    const precos = [10, 25, 40, 15];
    function transformar() {
      const dobrados = precos.map(p => p * 2);
      document.getElementById('vis').innerHTML =
        '<p><strong>Antes:</strong></p><div class="row">' + precos.map(p=>'<span class="chip before">R$ '+p+'</span>').join('') + '</div>' +
        '<div class="arrow">⬇ .map(p => p * 2)</div>' +
        '<p><strong>Depois:</strong></p><div class="row">' + dobrados.map(p=>'<span class="chip after">R$ '+p+'</span>').join('') + '</div>';
    }
    transformar();
  </script>
</body>
</html>`,
    ".filter()": `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; background: #f0f4ff; }
    .card { padding: 20px; border-radius: 16px; background: white; border: 1px solid #d8e0f0; box-shadow: 0 4px 16px rgba(37,99,235,0.08); }
    .tag-label { display:inline-block; background:#dcfce7; color:#16a34a; font-size:11px; font-weight:700; padding:4px 10px; border-radius:999px; margin-bottom:12px; text-transform:uppercase; letter-spacing:.08em; }
    button { padding: 10px 16px; border: 0; border-radius: 10px; background: #16a34a; color: white; font-weight: 700; cursor: pointer; margin-bottom:12px; }
    .row { display:flex; gap:8px; flex-wrap:wrap; margin:8px 0; }
    .chip { padding:8px 14px; border-radius:10px; font-size:13px; font-weight:600; }
    .all { background:#f1f5f9; color:#334155; border:1px solid #e2e8f0; }
    .kept { background:#dcfce7; color:#16a34a; border:1px solid #86efac; }
    .removed { background:#fee2e2; color:#991b1b; border:1px solid #fca5a5; text-decoration:line-through; opacity:.5; }
    .arrow { color:#6b7280; font-size:13px; margin:6px 0; }
    p { color:#475569; font-size:13px; margin:0 0 8px; }
  </style>
</head>
<body>
  <div class="card">
    <span class="tag-label">.filter()</span>
    <p>Retorna apenas os elementos que passam na condição.</p>
    <button onclick="filtrar()">Filtrar maiores de 18 anos</button>
    <div id="vis"></div>
  </div>
  <script>
    const idades = [12, 22, 17, 30, 15, 25];
    function filtrar() {
      const adultos = idades.filter(i => i >= 18);
      document.getElementById('vis').innerHTML =
        '<p><strong>Array original:</strong></p><div class="row">' +
        idades.map(i => '<span class="chip '+(i>=18?'kept':'removed')+'">'+i+' anos</span>').join('') + '</div>' +
        '<div class="arrow">⬇ .filter(i => i >= 18)</div>' +
        '<p><strong>Resultado (' + adultos.length + ' itens):</strong></p><div class="row">' +
        adultos.map(i=>'<span class="chip kept">'+i+' anos</span>').join('') + '</div>';
    }
    filtrar();
  </script>
</body>
</html>`,
    "JSON.stringify()": `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; background: #f0f4ff; }
    .card { padding: 20px; border-radius: 16px; background: white; border: 1px solid #d8e0f0; box-shadow: 0 4px 16px rgba(37,99,235,0.08); }
    .tag-label { display:inline-block; background:#fef3c7; color:#92400e; font-size:11px; font-weight:700; padding:4px 10px; border-radius:999px; margin-bottom:12px; text-transform:uppercase; letter-spacing:.08em; }
    button { padding: 10px 16px; border: 0; border-radius: 10px; background: #d97706; color: white; font-weight: 700; cursor: pointer; margin-bottom:12px; }
    .box { padding:12px; border-radius:10px; font-family:monospace; font-size:13px; margin:8px 0; }
    .obj-box { background:#eff6ff; border:1px solid #bfdbfe; color:#1e40af; }
    .str-box { background:#fef3c7; border:1px solid #fde68a; color:#92400e; word-break:break-all; }
    .arrow { color:#6b7280; font-size:13px; margin:6px 0; text-align:center; }
    p { color:#475569; font-size:13px; margin:0 0 8px; }
  </style>
</head>
<body>
  <div class="card">
    <span class="tag-label">JSON.stringify()</span>
    <p>Converte um objeto JavaScript em string JSON.</p>
    <button onclick="converter()">Converter objeto para JSON</button>
    <div id="vis"></div>
  </div>
  <script>
    function converter() {
      const obj = { nome: 'Ana', nivel: 'intermediario', ativo: true };
      const json = JSON.stringify(obj, null, 2);
      document.getElementById('vis').innerHTML =
        '<p><strong>Objeto JS:</strong></p><div class="box obj-box">{ nome: "Ana", nivel: "intermediario", ativo: true }</div>' +
        '<div class="arrow">⬇ JSON.stringify(obj)</div>' +
        '<p><strong>String JSON:</strong></p><div class="box str-box">' + json.replace(/</g,'&lt;') + '</div>';
    }
    converter();
  </script>
</body>
</html>`,
    "localStorage.setItem()": `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; background: #f0f4ff; }
    .card { padding: 20px; border-radius: 16px; background: white; border: 1px solid #d8e0f0; box-shadow: 0 4px 16px rgba(37,99,235,0.08); }
    .tag-label { display:inline-block; background:#ede9fe; color:#6d28d9; font-size:11px; font-weight:700; padding:4px 10px; border-radius:999px; margin-bottom:12px; text-transform:uppercase; letter-spacing:.08em; }
    .row { display:flex; gap:8px; margin-bottom:12px; flex-wrap:wrap; }
    input { padding:10px 12px; border-radius:10px; border:1px solid #d8e0f0; font:inherit; flex:1; min-width:0; }
    button { padding:10px 16px; border:0; border-radius:10px; font-weight:700; cursor:pointer; }
    .save { background:#7c3aed; color:white; }
    .load { background:#2563eb; color:white; }
    .clear { background:#dc2626; color:white; }
    .storage-visual { background:#f8f7ff; border:1px solid #ddd6fe; border-radius:10px; padding:12px; font-family:monospace; font-size:13px; color:#4c1d95; min-height:48px; }
    p { color:#475569; font-size:13px; margin:0 0 8px; }
  </style>
</head>
<body>
  <div class="card">
    <span class="tag-label">localStorage</span>
    <p>Salva dados no navegador que persistem mesmo após fechar a aba.</p>
    <div class="row">
      <input id="val" placeholder="Digite um valor para salvar..." />
    </div>
    <div class="row">
      <button class="save" onclick="salvar()">💾 setItem()</button>
      <button class="load" onclick="carregar()">📖 getItem()</button>
      <button class="clear" onclick="limpar()">🗑 removeItem()</button>
    </div>
    <p><strong>LocalStorage agora:</strong></p>
    <div class="storage-visual" id="vis">Nenhum valor salvo ainda.</div>
  </div>
  <script>
    function salvar() {
      const v = document.getElementById('val').value || 'valorPadrao';
      localStorage.setItem('guia-exemplo', v);
      atualizar();
    }
    function carregar() { atualizar(); }
    function limpar() { localStorage.removeItem('guia-exemplo'); atualizar(); }
    function atualizar() {
      const v = localStorage.getItem('guia-exemplo');
      document.getElementById('vis').textContent = v ? 'guia-exemplo = "' + v + '"' : '(vazio)';
    }
    atualizar();
  </script>
</body>
</html>`,
    ".reduce()": `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; background: #f0f4ff; }
    .card { padding: 20px; border-radius: 16px; background: white; border: 1px solid #d8e0f0; box-shadow: 0 4px 16px rgba(37,99,235,0.08); }
    .tag-label { display:inline-block; background:#fce7f3; color:#9d174d; font-size:11px; font-weight:700; padding:4px 10px; border-radius:999px; margin-bottom:12px; text-transform:uppercase; letter-spacing:.08em; }
    button { padding:10px 16px; border:0; border-radius:10px; background:#9d174d; color:white; font-weight:700; cursor:pointer; margin-bottom:12px; }
    .row { display:flex; gap:8px; flex-wrap:wrap; margin:8px 0; align-items:center; }
    .chip { padding:8px 14px; border-radius:10px; font-size:14px; font-weight:700; background:#fce7f3; color:#9d174d; border:1px solid #fbcfe8; }
    .op { color:#6b7280; font-size:18px; }
    .total { padding:10px 18px; border-radius:10px; font-size:16px; font-weight:800; background:#4c1d95; color:white; }
    p { color:#475569; font-size:13px; margin:0 0 8px; }
  </style>
</head>
<body>
  <div class="card">
    <span class="tag-label">.reduce()</span>
    <p>Acumula todos os elementos em um único valor.</p>
    <button onclick="calcular()">Somar carrinho</button>
    <div id="vis"></div>
  </div>
  <script>
    const carrinho = [{ item:'Livro', preco:35 }, { item:'Curso', preco:97 }, { item:'Plugin', preco:18 }];
    function calcular() {
      const total = carrinho.reduce((soma, p) => soma + p.preco, 0);
      document.getElementById('vis').innerHTML =
        '<p><strong>Itens:</strong></p>' +
        '<div class="row">' + carrinho.map((p,i) => '<span class="chip">'+p.item+': R$'+p.preco+'</span>' + (i<carrinho.length-1?'<span class="op">+</span>':'')).join('') + '</div>' +
        '<p><strong>⬇ .reduce((soma, p) => soma + p.preco, 0)</strong></p>' +
        '<div class="row"><span class="total">Total: R$ '+total+'</span></div>';
    }
    calcular();
  </script>
</body>
</html>`,
    "setInterval(fn, ms)": `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; background: #f0f4ff; }
    .card { padding: 20px; border-radius: 16px; background: white; border: 1px solid #d8e0f0; box-shadow: 0 4px 16px rgba(37,99,235,0.08); text-align:center; }
    .tag-label { display:inline-block; background:#ecfdf5; color:#065f46; font-size:11px; font-weight:700; padding:4px 10px; border-radius:999px; margin-bottom:16px; text-transform:uppercase; letter-spacing:.08em; }
    .clock { font-size:3rem; font-weight:800; color:#1e40af; letter-spacing:.05em; margin:12px 0; font-family:monospace; }
    .row { display:flex; gap:8px; justify-content:center; margin-top:12px; }
    button { padding:10px 18px; border:0; border-radius:10px; font-weight:700; cursor:pointer; }
    .start { background:#16a34a; color:white; }
    .stop { background:#dc2626; color:white; }
    p { color:#475569; font-size:13px; }
  </style>
</head>
<body>
  <div class="card">
    <span class="tag-label">setInterval()</span>
    <p>Executa uma função repetidamente a cada intervalo.</p>
    <div class="clock" id="rel">00:00:00</div>
    <div class="row">
      <button class="start" onclick="iniciar()">▶ Iniciar</button>
      <button class="stop" onclick="parar()">■ Parar</button>
    </div>
  </div>
  <script>
    let timer = null, s = 0;
    function tick() {
      s++;
      const h = String(Math.floor(s/3600)).padStart(2,'0');
      const m = String(Math.floor(s%3600/60)).padStart(2,'0');
      const sec = String(s%60).padStart(2,'0');
      document.getElementById('rel').textContent = h+':'+m+':'+sec;
    }
    function iniciar() { if (!timer) timer = setInterval(tick, 1000); }
    function parar() { clearInterval(timer); timer = null; }
  </script>
</body>
</html>`,
  };

  return richExamples[token] || null;
}

function inferLevel(lang, token, row) {
  const cat = row.closest("table")?.dataset.cat || "";
  const lowerToken = token.toLowerCase();

  if (lang === "html") {
    const advancedHtml = new Set([
      "<canvas>",
      "<iframe>",
      "<template>",
      "<noscript>",
      "<picture>",
      "<source>",
      "<track>",
      "<embed>",
    ]);
    const intermediateHtml = new Set([
      "<section>",
      "<article>",
      "<main>",
      "<aside>",
      "<header>",
      "<footer>",
      "<nav>",
      "<table>",
      "<form>",
      "<video>",
      "<audio>",
      "<select>",
      "<textarea>",
    ]);

    if (
      advancedHtml.has(lowerToken) ||
      cat === "grafico" ||
      cat === "script-meta"
    )
      return "Avancado";
    if (
      intermediateHtml.has(lowerToken) ||
      cat === "formularios" ||
      cat === "tabelas" ||
      cat === "semantico"
    )
      return "Intermediario";
    return "Basico";
  }

  if (lang === "css") {
    const advancedCss = new Set([
      "grid-template-columns",
      "grid-template-rows",
      "animation",
      "transform",
      "transition",
      "@keyframes",
      "filter",
      "backdrop-filter",
    ]);
    const intermediateCss = new Set([
      "display",
      "position",
      "justify-content",
      "align-items",
      "gap",
      "flex",
      "box-shadow",
      "border-radius",
      "z-index",
      "overflow",
    ]);

    if (
      advancedCss.has(lowerToken) ||
      cat === "css-animacao" ||
      cat === "css-transform" ||
      cat === "css-media"
    )
      return "Avancado";
    if (
      intermediateCss.has(lowerToken) ||
      cat === "css-layout" ||
      cat === "css-posicao" ||
      cat === "css-bg"
    )
      return "Intermediario";
    return "Basico";
  }

  if (lang === "js") {
    const advancedJs = new Set([
      "promise.all([])",
      "promise.allsettled([])",
      "promise.race([])",
      "promise.any([])",
      "async function",
      "await",
      "for await...of",
      "async generator",
      "fetch(url)",
      "abortcontroller",
      "worker",
    ]);
    const intermediateJs = new Set([
      "document.queryselector()",
      "document.queryselectorall()",
      ".addeventlistener()",
      ".map()",
      ".filter()",
      ".find()",
      ".reduce()",
      "settimeout(fn, ms)",
      "setinterval(fn, ms)",
      "json.stringify()",
      "json.parse()",
      "localstorage.setitem()",
      "localstorage.getitem()",
    ]);

    if (advancedJs.has(lowerToken) || cat === "js-async") return "Avancado";
    if (
      intermediateJs.has(lowerToken) ||
      cat === "js-dom" ||
      cat === "js-eventos" ||
      cat === "js-array" ||
      cat === "js-storage" ||
      cat === "js-json"
    )
      return "Intermediario";
    return "Basico";
  }

  if (lang === "tools") {
    if (cat === "git" || cat === "vercel") return "Intermediario";
    return "Basico";
  }

  return "Basico";
}

function inferEssential(lang, token, row) {
  const cat = row.closest("table")?.dataset.cat || "";
  const lowerToken = token.toLowerCase();

  const essentialByLang = {
    html: new Set([
      "<!doctype html>",
      "<body>",
      "<h1>",
      "<p>",
      "<a>",
      "<img>",
      "<div>",
      "<ul>",
      "<li>",
      "<form>",
      "<label>",
      "<input>",
      "<button>",
      "<section>",
    ]),
    css: new Set([
      "color",
      "background",
      "display",
      "margin",
      "padding",
      "border",
      "font-size",
      "text-align",
      "justify-content",
      "align-items",
      "flex",
    ]),
    js: new Set([
      "document.queryselector()",
      ".addeventlistener()",
      ".map()",
      ".filter()",
      "settimeout(fn, ms)",
      "console.log()",
      "fetch(url)",
    ]),
    tools: new Set([
      "git status",
      "git add .",
      'git commit -m ""',
      "git push",
      "vercel",
    ]),
  };

  if (essentialByLang[lang]?.has(lowerToken)) return true;
  if (lang === "html" && (cat === "estrutura" || cat === "texto"))
    return ["<h1>", "<p>", "<a>"].includes(token);
  if (lang === "css" && cat === "css-layout")
    return [
      "display",
      "gap",
      "justify-content",
      "align-items",
      "flex",
    ].includes(lowerToken);
  if (lang === "js" && cat === "js-dom")
    return ["document.queryselector()", ".addeventlistener()"].includes(
      lowerToken,
    );
  return false;
}

function inferRowDetails(lang, token, row) {
  const lowerToken = token.toLowerCase();
  const hasVoidBadge = row.querySelector(".badge-void");

  if (lang === "html") {
    if (lowerToken.startsWith("<!doctype")) {
      return {
        opening: "<!DOCTYPE html>",
        closing: "Nao tem fechamento",
        example:
          '<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n  <meta charset="UTF-8">\n  <title>Pagina</title>\n</head>\n<body>\n  <h1>Ola mundo</h1>\n</body>\n</html>',
      };
    }

    const match = token.match(/<\s*([a-z0-9-]+)/i);
    const tagName = match ? match[1].toLowerCase() : "";
    const voidTags = new Set([
      "area",
      "base",
      "br",
      "col",
      "embed",
      "hr",
      "img",
      "input",
      "link",
      "meta",
      "source",
      "track",
      "wbr",
    ]);
    const isVoid = hasVoidBadge || voidTags.has(tagName);

    const opening = tagName ? `<${tagName}>` : token;
    const closing = isVoid ? "Nao tem fechamento" : `Fecha com </${tagName}>`;
    const example = getRichHtmlExample(tagName, isVoid);
    return { opening, closing, example };
  }

  if (lang === "css") {
    const property = token.replace(/\(\)$/, "").trim();
    return {
      opening: `${property}: valor;`,
      closing: "Nao tem fechamento",
      example: getRichCssExample(property),
    };
  }

  if (lang === "js") {
    const richJsExample = getRichJsExample(token);
    if (richJsExample) {
      return {
        opening: token.includes("()")
          ? `${token.replace("()", "(...)")}`
          : token,
        closing: "Nao tem fechamento",
        example: richJsExample,
      };
    }

    const jsExampleMap = {
      "document.querySelectorAll()":
        "const itens = document.querySelectorAll('.item');\nitens.forEach(item => item.classList.add('ativo'));",
      ".classList.add()":
        "const card = document.querySelector('.card');\ncard.classList.add('ativo');",
      ".classList.remove()":
        "const menu = document.querySelector('.menu');\nmenu.classList.remove('aberto');",
      ".classList.toggle()":
        "const painel = document.querySelector('.painel');\npainel.classList.toggle('visivel');",
      ".setAttribute()":
        "const link = document.querySelector('a');\nlink.setAttribute('target', '_blank');",
      ".getAttribute()":
        "const imagem = document.querySelector('img');\nconst descricao = imagem.getAttribute('alt');",
      ".map()":
        "const precos = [10, 20, 30];\nconst comDesconto = precos.map(preco => preco * 0.9);",
      ".filter()":
        "const numeros = [3, 8, 12, 15];\nconst maiores = numeros.filter(numero => numero > 10);",
      ".find()":
        "const usuarios = [{ id: 1 }, { id: 2 }];\nconst usuario = usuarios.find(item => item.id === 2);",
      ".forEach()":
        "['HTML', 'CSS', 'JS'].forEach(item => {\n  console.log(item);\n});",
      ".reduce()":
        "const valores = [10, 20, 30];\nconst total = valores.reduce((soma, item) => soma + item, 0);",
      ".includes()":
        "const tecnologias = ['HTML', 'CSS', 'JS'];\nconst temCss = tecnologias.includes('CSS');",
      "setInterval(fn, ms)":
        "const timer = setInterval(() => {\n  console.log('Executando a cada segundo');\n}, 1000);",
      "JSON.stringify()":
        "const usuario = { nome: 'Ana', nivel: 'intermediario' };\nconst json = JSON.stringify(usuario);",
      "JSON.parse()":
        'const texto = \'{"nome":"Ana"}\';\nconst objeto = JSON.parse(texto);',
      "localStorage.setItem()": "localStorage.setItem('tema', 'escuro');",
      "localStorage.getItem()": "const tema = localStorage.getItem('tema');",
      "console.log()": "console.log('Aplicacao iniciada');",
      "Promise.all([])":
        "Promise.all([buscarUsuario(), buscarPedidos()])\n  .then(([usuario, pedidos]) => {\n    console.log(usuario, pedidos);\n  });",
    };

    if (jsExampleMap[token]) {
      return {
        opening: token.includes("()")
          ? `${token.replace("()", "(...)")}`
          : token,
        closing: "Nao tem fechamento",
        example: jsExampleMap[token],
      };
    }

    if (token.includes("()")) {
      return {
        opening: `${token.replace("()", "(...)")}`,
        closing: "Nao tem fechamento",
        example: `// Exemplo pratico\nconst resultado = ${token.replace("()", "(...)")};`,
      };
    }

    if (token.startsWith(".")) {
      return {
        opening: `objeto${token.replace(/\(\)/g, "(...)")}`,
        closing: "Nao tem fechamento",
        example: `const valor = objeto${token.replace(/\(\)/g, "(...)")};`,
      };
    }

    return {
      opening: token,
      closing: "Nao tem fechamento",
      example: `// Exemplo pratico\n${token}`,
    };
  }

  return {
    opening: token,
    closing: "Nao tem fechamento",
    example: `${token}\n# Exemplo de uso no terminal`,
  };
}

function createMetaLine(lang, details) {
  const wrap = document.createElement("div");
  wrap.className = "usage-meta";

  const langLabel = lang === "html" ? "Abertura" : "Uso";
  wrap.innerHTML = `
    <span class="usage-pill">${langLabel}: <code>${escapeHtml(details.opening)}</code></span>
    <span class="usage-pill">Fechamento: <code>${escapeHtml(details.closing)}</code></span>
  `;

  return wrap;
}

function createLevelBadge(level) {
  const badge = document.createElement("span");
  badge.className = `level-badge level-${level.toLowerCase()}`;
  badge.textContent = level;
  return badge;
}

function createEssentialBadge() {
  const badge = document.createElement("span");
  badge.className = "essential-badge";
  badge.textContent = "Essencial";
  return badge;
}

function copyText(text, button) {
  const finish = (label) => {
    if (!button) return;
    const original = button.dataset.label || button.textContent;
    button.textContent = label;
    window.setTimeout(() => {
      button.textContent = original;
    }, 1200);
  };

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard
      .writeText(text)
      .then(() => finish("Copiado"))
      .catch(() => finish("Falhou"));
    return;
  }

  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "absolute";
  field.style.left = "-9999px";
  document.body.appendChild(field);
  field.select();

  try {
    document.execCommand("copy");
    finish("Copiado");
  } catch (error) {
    finish("Falhou");
  } finally {
    field.remove();
  }
}

function buildHtmlPreview(code, token) {
  const htmlScaffoldMap = {
    "<header>": `<div class="preview-stage preview-page"><div class="preview-caption">Cabecalho da pagina</div>${code}<main class="preview-main-card"><h2>Conteudo principal</h2><p>Area principal abaixo do header.</p></main></div>`,
    "<nav>": `<div class="preview-stage preview-page"><div class="preview-caption">Menu de navegacao</div><header class="preview-nav-shell">${code}</header><main class="preview-main-card"><p>O nav organiza os links de acesso.</p></main></div>`,
    "<section>": `<div class="preview-stage"><div class="preview-caption">Secao agrupando conteudo</div><div class="preview-section-wrap">${code}</div></div>`,
    "<article>": `<div class="preview-stage"><div class="preview-caption">Bloco autonomo de conteudo</div><div class="preview-article-wrap">${code}</div></div>`,
    "<aside>": `<div class="preview-stage preview-aside-layout"><main class="preview-main-card"><h2>Conteudo central</h2><p>Texto principal da pagina.</p></main><div class="preview-aside-wrap">${code}</div></div>`,
    "<footer>": `<div class="preview-stage preview-page"><main class="preview-main-card"><h2>Conteudo principal</h2><p>Informacoes da pagina.</p></main>${code}</div>`,
    "<form>": `<div class="preview-stage"><div class="preview-caption">Formulario em uso</div><div class="preview-form-wrap">${code}</div></div>`,
    "<table>": `<div class="preview-stage"><div class="preview-caption">Tabela renderizada</div><div class="preview-table-wrap">${code}</div></div>`,
    "<ul>": `<div class="preview-stage"><div class="preview-caption">Lista nao ordenada</div><div class="preview-list-wrap">${code}</div></div>`,
    "<ol>": `<div class="preview-stage"><div class="preview-caption">Lista ordenada</div><div class="preview-list-wrap">${code}</div></div>`,
    "<img>": `<div class="preview-stage"><div class="preview-caption">Imagem destacada</div><figure class="preview-media-card">${code}<figcaption>Imagem usada para ilustrar um conteudo.</figcaption></figure></div>`,
    "<video>": `<div class="preview-stage"><div class="preview-caption">Player de video</div><div class="preview-media-card">${code}<p>Area de reproducao de video.</p></div></div>`,
    "<audio>": `<div class="preview-stage"><div class="preview-caption">Player de audio</div><div class="preview-media-card">${code}<p>Controle de reproducao de audio.</p></div></div>`,
    "<canvas>": `<div class="preview-stage"><div class="preview-caption">Area de desenho</div><div class="preview-canvas-card">${code}<p>O canvas serve como superficie para desenho via JavaScript.</p></div></div>`,
    "<button>": `<div class="preview-stage"><div class="preview-caption">Acao clicavel</div><div class="preview-action-row">${code}<span class="preview-help">O botao chama uma acao do usuario.</span></div></div>`,
    "<a>": `<div class="preview-stage"><div class="preview-caption">Link de navegacao</div><div class="preview-action-row">${code}<span class="preview-help">Leva o usuario para outra rota ou pagina.</span></div></div>`,
    "<input>": `<div class="preview-stage"><div class="preview-caption">Campo de entrada</div><div class="preview-form-wrap">${code}<small class="preview-help">Aqui o usuario digita dados.</small></div></div>`,
    "<textarea>": `<div class="preview-stage"><div class="preview-caption">Campo de texto longo</div><div class="preview-form-wrap">${code}</div></div>`,
    "<select>": `<div class="preview-stage"><div class="preview-caption">Selecao de opcao</div><div class="preview-form-wrap">${code}</div></div>`,
  };

  const content = /<html[\s>]|<!doctype/i.test(code)
    ? code
    : `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    :root {
      color-scheme: light;
    }
    * {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      padding: 18px;
      color: #111827;
      background: linear-gradient(180deg, #ffffff, #f6f8fc);
    }
    .preview-stage {
      display: grid;
      gap: 14px;
      padding: 16px;
      border: 1px solid #d8e0f0;
      border-radius: 16px;
      background: white;
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
    }
    .preview-caption {
      display: inline-flex;
      width: fit-content;
      padding: 5px 12px;
      border-radius: 999px;
      background: linear-gradient(90deg, #dbeafe, #ede9fe);
      color: #2457d6;
      font: 700 11px Arial, sans-serif;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      gap: 5px;
      align-items: center;
    }
    .preview-caption::before {
      content: '●';
      color: #2563eb;
      animation: blink 1.4s ease infinite;
    }
    @keyframes blink { 50% { opacity: 0.3; } }
    .preview-main,
    .preview-shell {
      padding: 16px;
      border-radius: 14px;
      border: 1px dashed #c9d5ea;
      background: #f8fbff;
    }
    .preview-page {
      background:
        linear-gradient(180deg, rgba(255,255,255,1), rgba(247,250,255,1));
    }
    .preview-main-card,
    .preview-section-wrap,
    .preview-article-wrap,
    .preview-aside-wrap,
    .preview-form-wrap,
    .preview-media-card,
    .preview-canvas-card {
      padding: 16px;
      border-radius: 16px;
      border: 1px solid #d8e0f0;
      background: #ffffff;
      box-shadow: 0 8px 20px rgba(37, 99, 235, 0.06);
    }
    /* Highlight outline for the "active" tag */
    header, nav, section, article, aside, footer, dialog, details, form {
      outline: 2px dashed rgba(37, 99, 235, 0.35);
      outline-offset: 3px;
    }
    .preview-nav-shell {
      padding: 14px 16px;
      border-radius: 16px;
      background: linear-gradient(135deg, #1e3a8a, #2563eb);
      color: white;
    }
    .preview-nav-shell a {
      color: white;
      text-decoration: none;
      margin-right: 12px;
      font-weight: 700;
    }
    .preview-aside-layout {
      grid-template-columns: 1.6fr 0.9fr;
      align-items: start;
    }
    .preview-aside-wrap {
      background: linear-gradient(180deg, #eef4ff, #ffffff);
      border-style: dashed;
    }
    .preview-list-wrap li {
      margin: 8px 0;
      padding: 10px 12px;
      border-radius: 10px;
      background: #f8fbff;
      border: 1px solid #d8e0f0;
    }
    .preview-action-row {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      padding: 10px 0;
    }
    .preview-help {
      color: #475569;
      font-size: 14px;
    }
    .preview-table-wrap {
      overflow: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      border-radius: 14px;
      overflow: hidden;
    }
    th, td {
      padding: 10px 12px;
      border: 1px solid #d8e0f0;
      text-align: left;
    }
    th {
      background: #eff6ff;
      color: #1d4ed8;
    }
    input, textarea, select, button {
      font: inherit;
    }
    form {
      display: grid;
      gap: 10px;
    }
    input, textarea, select {
      width: 100%;
      padding: 11px 12px;
      border-radius: 12px;
      border: 1px solid #cbd5e1;
      background: #f8fafc;
    }
    button {
      padding: 11px 14px;
      border: 0;
      border-radius: 12px;
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      color: white;
      font-weight: 700;
      cursor: pointer;
    }
    a {
      color: #2563eb;
      font-weight: 700;
    }
    img, video, iframe, canvas {
      max-width: 100%;
      border-radius: 12px;
      border: 1px solid #d8e0f0;
      background: #f8fafc;
    }
    figure {
      margin: 0;
    }
    figcaption {
      margin-top: 10px;
      color: #475569;
      font-size: 14px;
    }
  </style>
</head>
<body>
${htmlScaffoldMap[token] || `<div class="preview-stage"><div class="preview-caption">Resultado renderizado</div>${code}</div>`}
</body>
</html>`;

  return content;
}

function buildCssPreview(code, token) {
  if (/<html[\s>]|<!doctype/i.test(code)) {
    return code;
  }

  const cssStageMap = {
    display:
      '<div class="exemplo"><div>Bloco 1</div><div>Bloco 2</div><div>Bloco 3</div></div>',
    flex: '<div class="exemplo"><div>Card A</div><div>Card B</div><div>Card C</div></div>',
    "grid-template-columns":
      '<div class="exemplo"><div>1</div><div>2</div><div>3</div><div>4</div><div>5</div><div>6</div></div>',
    "justify-content":
      '<div class="exemplo"><button>Voltar</button><button>Salvar</button></div>',
    "align-items":
      '<div class="exemplo"><span class="preview-mini">Icone</span><strong>Titulo alinhado</strong></div>',
    color: '<div class="exemplo">Texto com foco visual</div>',
    background: '<div class="exemplo">Area com fundo destacado</div>',
    border: '<div class="exemplo">Caixa com borda</div>',
    "border-radius": '<div class="exemplo">Caixa com cantos arredondados</div>',
    "box-shadow": '<div class="exemplo">Cartao elevado</div>',
    transform: '<div class="exemplo">Elemento transformado</div>',
    animation: '<div class="exemplo">Elemento animado</div>',
    position:
      '<div class="preview-position-wrap"><div class="exemplo">Caixa alvo</div><span class="preview-pin">Referencia</span></div>',
  };

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
      background: #f5f7fb;
      color: #111827;
    }
    .preview-caption {
      display: inline-flex;
      margin-bottom: 12px;
      padding: 5px 12px;
      border-radius: 999px;
      background: linear-gradient(90deg, #dbeafe, #ede9fe);
      color: #2457d6;
      font: 700 11px Arial, sans-serif;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      align-items: center;
      gap: 5px;
    }
    .preview-caption::before {
      content: '●';
      color: #2563eb;
      animation: blink 1.4s ease infinite;
    }
    @keyframes blink { 50% { opacity: 0.3; } }
    .exemplo {
      padding: 16px;
      border: 1px solid #cbd5e1;
      background: linear-gradient(135deg, #ffffff, #e8f1ff);
      border-radius: 14px;
      min-height: 64px;
    }
    .exemplo > * {
      padding: 8px 12px;
      border-radius: 10px;
      background: rgba(37, 99, 235, 0.12);
      border: 1px solid rgba(37, 99, 235, 0.18);
    }
    .preview-mini {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
    }
    .preview-position-wrap {
      position: relative;
      padding: 32px;
      border: 1px dashed #cbd5e1;
      border-radius: 14px;
      background: white;
    }
    .preview-pin {
      position: absolute;
      top: 10px;
      right: 12px;
      font-size: 12px;
      color: #2563eb;
    }
    ${code}
  </style>
</head>
<body>
  <div class="preview-caption">Preview da propriedade ${escapeHtml(token)}</div>
  ${cssStageMap[token] || '<div class="exemplo">Preview da propriedade</div>'}
</body>
</html>`;
}

function buildJsPreview(token, code) {
  if (/<html[\s>]|<!doctype/i.test(code)) {
    return code;
  }

  const previewMap = {
    "document.querySelector()": `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; background: #f8fbff; color: #111827; }
    .demo { display: grid; gap: 12px; padding: 16px; border: 1px solid #d8e0f0; border-radius: 16px; background: white; }
    button { padding: 10px 14px; border: 0; border-radius: 10px; background: #2563eb; color: white; }
  </style>
</head>
<body>
  <div class="demo">
    <strong>querySelector encontra um elemento e altera seu texto.</strong>
    <button id="botao">Clique</button>
    <p id="saida">Aguardando...</p>
  </div>
  <script>
${code}
  </script>
</body>
</html>`,
    ".addEventListener()": `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; background: #f8fbff; color: #111827; }
    .demo { display: grid; gap: 12px; padding: 16px; border: 1px solid #d8e0f0; border-radius: 16px; background: white; }
    button { padding: 10px 14px; border: 0; border-radius: 10px; background: #0f766e; color: white; }
  </style>
</head>
<body>
  <div class="demo">
    <strong>O evento reage ao clique do usuario.</strong>
    <button id="botao">Clique aqui</button>
    <p id="saida">Nenhum clique ainda.</p>
  </div>
  <script>
${code}
  </script>
</body>
</html>`,
    "setTimeout(fn, ms)": `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; background: #f8fbff; color: #111827; }
    .demo { display: grid; gap: 12px; padding: 16px; border: 1px solid #d8e0f0; border-radius: 16px; background: white; }
  </style>
</head>
<body>
  <div class="demo">
    <strong>O texto abaixo muda depois do tempo configurado.</strong>
    <p id="saida">Esperando 1 segundo...</p>
  </div>
  <script>
${code}
  </script>
</body>
</html>`,
  };

  // For tokens that have a full HTML rich example, use it as the preview
  const richEx = getRichJsExample(token);
  if (richEx && /<html[\s>]|<!doctype/i.test(richEx)) {
    return richEx;
  }

  return previewMap[token] || null;
}

function validatePreviewContent(lang, token, code) {
  if (lang === "html") {
    const hasOpenTag = /<([a-z][a-z0-9-]*)\b/i.test(code);
    if (!hasOpenTag) {
      return {
        ok: false,
        message: "Adicione pelo menos uma tag HTML valida para gerar preview.",
      };
    }
    return { ok: true, message: "Preview atualizado com sucesso." };
  }

  if (lang === "css") {
    if (/<html[\s>]|<!doctype/i.test(code)) {
      return { ok: true, message: `Preview completo montado para ${token}.` };
    }
    if (!code.includes("{") || !code.includes("}")) {
      return {
        ok: false,
        message:
          "Use uma regra CSS completa, por exemplo .exemplo { color: blue; }.",
      };
    }
    return { ok: true, message: `Preview aplicado para ${token}.` };
  }

  if (lang === "js") {
    if (/<html[\s>]|<!doctype/i.test(code)) {
      return {
        ok: true,
        message: `✅ Preview completo montado para ${token}.`,
      };
    }
    // If there's a rich full-HTML example for this token, preview is always valid
    const richEx = getRichJsExample(token);
    if (richEx && /<html[\s>]|<!doctype/i.test(richEx)) {
      return {
        ok: true,
        message: `✅ Preview interativo disponível para ${token}.`,
      };
    }
    if (!buildJsPreview(token, code)) {
      return {
        ok: false,
        message: "Este item não possui preview dinâmico editável.",
      };
    }

    try {
      new Function(code);
      return {
        ok: true,
        message: "✅ JavaScript válido. Use o preview para testar a interação.",
      };
    } catch (error) {
      return { ok: false, message: `❌ JavaScript inválido: ${error.message}` };
    }
  }

  return { ok: true, message: "" };
}

function updatePreviewState(detailRow, validation, srcdoc) {
  const status = detailRow.querySelector(".example-preview-status");
  const frame = detailRow.querySelector(".example-preview-frame");
  if (!status || !frame) return;

  status.textContent = validation.message;
  status.classList.toggle("is-error", !validation.ok);
  status.classList.toggle("is-success", validation.ok);

  if (validation.ok && srcdoc) {
    frame.srcdoc = srcdoc;
    frame.classList.remove("is-hidden");
  } else {
    frame.srcdoc = "<!DOCTYPE html><html><body></body></html>";
    frame.classList.add("is-hidden");
  }
}

function getPreviewConfig(lang, token, details) {
  if (lang === "html") {
    return {
      title: "Preview",
      buildSrcdoc: (code) => buildHtmlPreview(code, token),
    };
  }

  if (lang === "css") {
    return {
      title: "Preview",
      buildSrcdoc: (code) => buildCssPreview(code, token),
    };
  }

  if (lang === "js") {
    // First check rich example — if it's full HTML, use directly
    const richEx = getRichJsExample(token);
    if (richEx && /<html[\s>]|<!doctype/i.test(richEx)) {
      return {
        title: "Preview interativo",
        buildSrcdoc: () => richEx,
      };
    }
    if (buildJsPreview(token, details.example)) {
      return {
        title: "Preview interativo",
        buildSrcdoc: (code) => buildJsPreview(token, code),
      };
    }
  }

  return null;
}

function getRelatedItems(lang, token) {
  const relatedMap = {
    html: {
      "<form>": ["<label>", "<input>", "<button>", "<textarea>", "<select>"],
      "<input>": ["<label>", "<form>", "<button>"],
      "<label>": ["<input>", "<textarea>", "<select>"],
      "<table>": ["<thead>", "<tbody>", "<tr>", "<th>", "<td>"],
      "<video>": ["<source>", "<track>"],
      "<audio>": ["<source>"],
      "<nav>": ["<a>", "<ul>", "<li>"],
      "<ul>": ["<li>"],
      "<ol>": ["<li>"],
      "<picture>": ["<source>", "<img>"],
      "<canvas>": ["<script>"],
      "<iframe>": ["<title>", "<a>"],
      "<header>": ["<nav>", "<h1>", "<p>"],
      "<main>": ["<section>", "<article>", "<aside>"],
      "<section>": ["<h2>", "<p>", "<article>"],
      "<article>": ["<h2>", "<p>", "<footer>"],
    },
    css: {
      display: ["justify-content", "align-items", "gap", "flex"],
      flex: ["display", "justify-content", "align-items", "gap"],
      "grid-template-columns": ["display", "gap", "grid-template-rows"],
      position: ["top", "right", "bottom", "left", "z-index"],
      background: ["background-color", "background-image", "background-size"],
      transition: ["transform", "opacity", "animation"],
      animation: ["@keyframes", "transform", "transition"],
      "font-size": ["font-weight", "line-height", "text-align"],
      border: ["border-radius", "box-shadow"],
      width: ["max-width", "min-width"],
      height: ["min-height", "max-height"],
    },
    js: {
      "document.querySelector()": [
        "document.querySelectorAll()",
        ".addEventListener()",
        ".classList.add()",
      ],
      "document.querySelectorAll()": [".forEach()", ".classList.add()"],
      ".addEventListener()": [
        "document.querySelector()",
        ".classList.toggle()",
        "setTimeout(fn, ms)",
      ],
      ".map()": [".filter()", ".reduce()", ".forEach()"],
      ".filter()": [".map()", ".find()", ".reduce()"],
      ".reduce()": [".map()", ".filter()", ".forEach()"],
      "fetch(url)": [
        "response.json()",
        ".then(fn)",
        ".catch(fn)",
        "AbortController",
      ],
      "JSON.stringify()": ["JSON.parse()", "localStorage.setItem()"],
      "JSON.parse()": ["JSON.stringify()", "fetch(url)"],
      "localStorage.setItem()": ["localStorage.getItem()", "JSON.stringify()"],
      "localStorage.getItem()": ["localStorage.setItem()", "JSON.parse()"],
      "Promise.all([])": [".then(fn)", ".catch(fn)", "fetch(url)"],
      "setTimeout(fn, ms)": ["setInterval(fn, ms)", "clearTimeout(id)"],
    },
    tools: {
      git: ["vercel", "outros"],
      vercel: ["git", "outros"],
    },
  };

  return relatedMap[lang]?.[token] || [];
}

function findRowByToken(lang, token) {
  return Array.from(
    document.querySelectorAll(`table[data-lang="${lang}"] tbody tr`),
  ).find((row) => {
    if (row.classList.contains("example-row")) return false;
    const tagCell = row.querySelector(".tag-cell");
    if (!tagCell) return false;
    return getCleanToken(tagCell) === token;
  });
}

function closeInlineExample() {
  if (selectedRow) selectedRow.classList.remove("row-selected");
  if (selectedDetailRow) selectedDetailRow.remove();
  selectedRow = null;
  selectedDetailRow = null;
}

function openInlineExample(row, lang, token, name, details) {
  if (selectedRow === row && selectedDetailRow) {
    closeInlineExample();
    return;
  }

  closeInlineExample();
  selectedRow = row;
  row.classList.add("row-selected");
  const preview = getPreviewConfig(lang, token, details);
  const relatedItems = getRelatedItems(lang, token);
  const exampleLabel =
    lang === "tools" ? "Comando / exemplo" : "Exemplo pratico";
  const canEdit = lang !== "tools";

  const detailRow = document.createElement("tr");
  detailRow.className = "example-row";
  detailRow.innerHTML = `
    <td colspan="${row.children.length}">
      <div class="example-inline-panel">
        <div class="example-inline-head">
          <div>
            <div class="example-kicker">Exemplo pratico</div>
            <h3>${escapeHtml(token)} - ${escapeHtml(name)}</h3>
          </div>
          <div class="example-actions">
            ${canEdit ? '<button type="button" class="example-reset" aria-label="Restaurar exemplo" data-label="Restaurar">Restaurar</button>' : ""}
            <button type="button" class="example-copy" aria-label="Copiar exemplo" data-label="Copiar exemplo">Copiar exemplo</button>
            <button type="button" class="example-close" aria-label="Fechar exemplo">Fechar</button>
          </div>
        </div>
        <div class="example-grid">
          <div class="example-card">
            <span class="example-label">Abertura / Uso</span>
            <code class="example-inline">${escapeHtml(details.opening)}</code>
          </div>
          <div class="example-card">
            <span class="example-label">Fechamento</span>
            <code class="example-inline">${escapeHtml(details.closing)}</code>
          </div>
        </div>
        <div class="example-card example-code-card">
          <span class="example-label">${canEdit ? `${exampleLabel} - editavel` : exampleLabel}</span>
          ${
            canEdit
              ? `<textarea class="example-editor" spellcheck="false">${escapeHtml(details.example)}</textarea>`
              : `<pre class="example-code">${escapeHtml(details.example)}</pre>`
          }
        </div>
        ${
          preview
            ? `
        <div class="example-card example-preview-card">
          <span class="example-label">${preview.title}</span>
          <div class="example-preview-status"></div>
          <div class="preview-browser">
            <div class="preview-browser-bar">
              <div class="preview-browser-dots">
                <span class="preview-dot preview-dot-red"></span>
                <span class="preview-dot preview-dot-yellow"></span>
                <span class="preview-dot preview-dot-green"></span>
              </div>
              <div class="preview-browser-url">preview — ${escapeHtml(token)}</div>
              <span class="preview-browser-label">LIVE</span>
            </div>
            <iframe class="example-preview-frame" title="Preview de ${escapeHtml(name)}" sandbox="allow-scripts"></iframe>
          </div>
        </div>
        `
            : ""
        }
        ${
          relatedItems.length
            ? `
        <div class="example-card example-related-card">
          <span class="example-label">Relacionados</span>
          <div class="related-list">
            ${relatedItems.map((item) => `<button type="button" class="related-chip" data-token="${escapeHtml(item)}">${escapeHtml(item)}</button>`).join("")}
          </div>
        </div>
        `
            : ""
        }
      </div>
    </td>
  `;

  row.insertAdjacentElement("afterend", detailRow);
  if (preview) {
    const validation = validatePreviewContent(lang, token, details.example);
    const srcdoc = validation.ok ? preview.buildSrcdoc(details.example) : "";
    updatePreviewState(detailRow, validation, srcdoc);
  }
  detailRow
    .querySelector(".example-close")
    .addEventListener("click", closeInlineExample);
  detailRow
    .querySelector(".example-copy")
    .addEventListener("click", (event) => {
      event.stopPropagation();
      const editor = detailRow.querySelector(".example-editor");
      const text = editor ? editor.value : details.example;
      copyText(text, event.currentTarget);
    });
  if (canEdit) {
    const editor = detailRow.querySelector(".example-editor");
    const resetButton = detailRow.querySelector(".example-reset");

    editor.addEventListener("click", (event) => event.stopPropagation());
    editor.addEventListener("input", () => {
      if (preview) {
        const validation = validatePreviewContent(lang, token, editor.value);
        const srcdoc = validation.ok ? preview.buildSrcdoc(editor.value) : "";
        updatePreviewState(detailRow, validation, srcdoc);
      }
    });

    resetButton.addEventListener("click", (event) => {
      event.stopPropagation();
      editor.value = details.example;
      if (preview) {
        const validation = validatePreviewContent(lang, token, editor.value);
        const srcdoc = validation.ok ? preview.buildSrcdoc(editor.value) : "";
        updatePreviewState(detailRow, validation, srcdoc);
      }
    });
  }
  detailRow.querySelectorAll(".related-chip").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const relatedToken = event.currentTarget.dataset.token;
      const relatedRow = findRowByToken(lang, relatedToken);
      if (!relatedRow) return;
      relatedRow.scrollIntoView({ behavior: "smooth", block: "center" });
      relatedRow.click();
    });
  });
  selectedDetailRow = detailRow;
}

function enhanceReferenceTables() {
  document.querySelectorAll("table[data-lang] tbody tr").forEach((row) => {
    if (row.dataset.enhanced === "true") return;

    const table = row.closest("table");
    const lang = table.dataset.lang;
    const tagCell = row.querySelector(".tag-cell");
    const nameCell = row.querySelector(".name-cell");
    const descCell = row.querySelector(".desc-cell");

    if (!tagCell || !nameCell || !descCell) return;

    const token = getCleanToken(tagCell);
    const name = nameCell.textContent.trim();
    const details = inferRowDetails(lang, token, row);
    const level = inferLevel(lang, token, row);
    const essential = inferEssential(lang, token, row);

    row.dataset.level = level;
    row.dataset.essential = essential ? "true" : "false";
    if (essential) nameCell.appendChild(createEssentialBadge());
    nameCell.appendChild(createLevelBadge(level));
    descCell.appendChild(createMetaLine(lang, details));
    row.classList.add("clickable-row");
    row.dataset.enhanced = "true";

    row.addEventListener("click", () =>
      openInlineExample(row, lang, token, name, details),
    );
  });
}

function applyFilters() {
  closeInlineExample();
  const query = document
    .getElementById("searchInput")
    .value.toLowerCase()
    .trim();

  document.querySelectorAll(".lang-block").forEach((block) => {
    const blockLang = block.id.replace("block-", "");
    const langMatch = activeLang === "all" || activeLang === blockLang;
    block.classList.toggle("visible", langMatch);
  });

  document.querySelectorAll(".section-title[data-cat]").forEach((sec) => {
    const cat = sec.dataset.cat;
    const lang = sec.dataset.lang;
    const langMatch = activeLang === "all" || activeLang === lang;
    const catMatch = activeCat === "all" || activeCat === cat;
    sec.style.display = langMatch && catMatch ? "" : "none";
  });

  document.querySelectorAll("table[data-cat]").forEach((table) => {
    const cat = table.dataset.cat;
    const lang = table.dataset.lang;
    const langMatch = activeLang === "all" || activeLang === lang;
    const catMatch = activeCat === "all" || activeCat === cat;

    if (!langMatch || !catMatch) {
      table.style.display = "none";
      return;
    }

    table.style.display = "";

    let anyVisible = false;
    table.querySelectorAll("tbody tr:not(.example-row)").forEach((row) => {
      const searchMatch =
        !query || row.textContent.toLowerCase().includes(query);
      const levelMatch =
        activeLevel === "all" || row.dataset.level === activeLevel;
      const studyMatch =
        studyMode === "all" || row.dataset.essential === "true";
      const visible = searchMatch && levelMatch && studyMatch;
      row.style.display = visible ? "" : "none";
      if (visible) anyVisible = true;
    });

    if (!anyVisible) table.style.display = "none";
  });
}

enhanceReferenceTables();
updateCategoryButtons();
applyFilters();
