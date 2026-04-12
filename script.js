let activeLang = 'all';
let activeCat = 'all';
let activeLevel = 'all';
let studyMode = 'all';
let selectedRow = null;
let selectedDetailRow = null;

function updateCategoryButtons() {
  const langClass = activeLang + '-cat';

  document.querySelectorAll('.cat-btn').forEach(btn => {
    const isAllButton = btn.getAttribute('onclick')?.includes("filterCat('all'");
    if (isAllButton) {
      btn.hidden = false;
      return;
    }

    btn.hidden = activeLang !== 'all' && !btn.classList.contains(langClass);
  });
}

function switchLang(lang, btn) {
  activeLang = lang;
  activeCat = 'all';

  document.querySelectorAll('.lang-tab').forEach(t => {
    t.classList.remove('active-html', 'active-css', 'active-js', 'active-tools');
  });
  const cls = lang === 'all' ? 'active-html' : 'active-' + lang;
  btn.classList.add(cls);

  const blocks = {
    html: document.getElementById('block-html'),
    css: document.getElementById('block-css'),
    js: document.getElementById('block-js'),
    tools: document.getElementById('block-tools')
  };

  if (lang === 'all') {
    Object.values(blocks).forEach(b => b.classList.add('visible'));
  } else {
    Object.values(blocks).forEach(b => b.classList.remove('visible'));
    blocks[lang].classList.add('visible');
  }

  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.cat-btn[onclick*="\'all\'"]').classList.add('active');
  updateCategoryButtons();

  applyFilters();
}

function filterCat(cat, btn) {
  activeCat = cat;
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  applyFilters();
}

function filterLevel(level, btn) {
  activeLevel = level;
  document.querySelectorAll('.level-filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  applyFilters();
}

function toggleStudyMode(mode, btn) {
  studyMode = mode;
  document.querySelectorAll('.study-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  applyFilters();
}

function getCleanToken(cell) {
  const clone = cell.cloneNode(true);
  clone.querySelectorAll('.badge').forEach(badge => badge.remove());
  return clone.textContent.replace(/\s+/g, ' ').trim();
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function inferLevel(lang, token, row) {
  const cat = row.closest('table')?.dataset.cat || '';
  const lowerToken = token.toLowerCase();

  if (lang === 'html') {
    const advancedHtml = new Set([
      '<canvas>',
      '<iframe>',
      '<template>',
      '<noscript>',
      '<picture>',
      '<source>',
      '<track>',
      '<embed>'
    ]);
    const intermediateHtml = new Set([
      '<section>',
      '<article>',
      '<main>',
      '<aside>',
      '<header>',
      '<footer>',
      '<nav>',
      '<table>',
      '<form>',
      '<video>',
      '<audio>',
      '<select>',
      '<textarea>'
    ]);

    if (advancedHtml.has(lowerToken) || cat === 'grafico' || cat === 'script-meta') return 'Avancado';
    if (intermediateHtml.has(lowerToken) || cat === 'formularios' || cat === 'tabelas' || cat === 'semantico') return 'Intermediario';
    return 'Basico';
  }

  if (lang === 'css') {
    const advancedCss = new Set([
      'grid-template-columns',
      'grid-template-rows',
      'animation',
      'transform',
      'transition',
      '@keyframes',
      'filter',
      'backdrop-filter'
    ]);
    const intermediateCss = new Set([
      'display',
      'position',
      'justify-content',
      'align-items',
      'gap',
      'flex',
      'box-shadow',
      'border-radius',
      'z-index',
      'overflow'
    ]);

    if (advancedCss.has(lowerToken) || cat === 'css-animacao' || cat === 'css-transform' || cat === 'css-media') return 'Avancado';
    if (intermediateCss.has(lowerToken) || cat === 'css-layout' || cat === 'css-posicao' || cat === 'css-bg') return 'Intermediario';
    return 'Basico';
  }

  if (lang === 'js') {
    const advancedJs = new Set([
      'promise.all([])',
      'promise.allsettled([])',
      'promise.race([])',
      'promise.any([])',
      'async function',
      'await',
      'for await...of',
      'async generator',
      'fetch(url)',
      'abortcontroller',
      'worker'
    ]);
    const intermediateJs = new Set([
      'document.queryselector()',
      'document.queryselectorall()',
      '.addeventlistener()',
      '.map()',
      '.filter()',
      '.find()',
      '.reduce()',
      'settimeout(fn, ms)',
      'setinterval(fn, ms)',
      'json.stringify()',
      'json.parse()',
      'localstorage.setitem()',
      'localstorage.getitem()'
    ]);

    if (advancedJs.has(lowerToken) || cat === 'js-async') return 'Avancado';
    if (intermediateJs.has(lowerToken) || cat === 'js-dom' || cat === 'js-eventos' || cat === 'js-array' || cat === 'js-storage' || cat === 'js-json') return 'Intermediario';
    return 'Basico';
  }

  if (lang === 'tools') {
    if (cat === 'git' || cat === 'vercel') return 'Intermediario';
    return 'Basico';
  }

  return 'Basico';
}

function inferEssential(lang, token, row) {
  const cat = row.closest('table')?.dataset.cat || '';
  const lowerToken = token.toLowerCase();

  const essentialByLang = {
    html: new Set([
      '<!doctype html>',
      '<body>',
      '<h1>',
      '<p>',
      '<a>',
      '<img>',
      '<div>',
      '<ul>',
      '<li>',
      '<form>',
      '<label>',
      '<input>',
      '<button>',
      '<section>'
    ]),
    css: new Set([
      'color',
      'background',
      'display',
      'margin',
      'padding',
      'border',
      'font-size',
      'text-align',
      'justify-content',
      'align-items',
      'flex'
    ]),
    js: new Set([
      'document.queryselector()',
      '.addeventlistener()',
      '.map()',
      '.filter()',
      'settimeout(fn, ms)',
      'console.log()',
      'fetch(url)'
    ]),
    tools: new Set([
      'git status',
      'git add .',
      'git commit -m ""',
      'git push',
      'vercel'
    ])
  };

  if (essentialByLang[lang]?.has(lowerToken)) return true;
  if (lang === 'html' && (cat === 'estrutura' || cat === 'texto')) return ['<h1>', '<p>', '<a>'].includes(token);
  if (lang === 'css' && cat === 'css-layout') return ['display', 'gap', 'justify-content', 'align-items', 'flex'].includes(lowerToken);
  if (lang === 'js' && cat === 'js-dom') return ['document.queryselector()', '.addeventlistener()'].includes(lowerToken);
  return false;
}

function inferRowDetails(lang, token, row) {
  const lowerToken = token.toLowerCase();
  const hasVoidBadge = row.querySelector('.badge-void');

  if (lang === 'html') {
    if (lowerToken.startsWith('<!doctype')) {
      return {
        opening: '<!DOCTYPE html>',
        closing: 'Nao tem fechamento',
        example: '<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n  <meta charset="UTF-8">\n  <title>Pagina</title>\n</head>\n<body>\n  <h1>Ola mundo</h1>\n</body>\n</html>'
      };
    }

    const match = token.match(/<\s*([a-z0-9-]+)/i);
    const tagName = match ? match[1].toLowerCase() : '';
    const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
    const isVoid = hasVoidBadge || voidTags.has(tagName);

    const opening = tagName ? `<${tagName}>` : token;
    const closing = isVoid ? 'Nao tem fechamento' : `Fecha com </${tagName}>`;
    const exampleMap = {
      a: '<a href="https://exemplo.com" target="_blank">Visitar site</a>',
      img: '<img src="foto.jpg" alt="Pessoa sorrindo em um escritorio">',
      input: '<input type="text" name="nome" placeholder="Digite seu nome">',
      button: '<button type="button">Salvar alteracoes</button>',
      section: '<section>\n  <h2>Destaques da semana</h2>\n  <p>Confira as novidades do projeto.</p>\n</section>',
      article: '<article>\n  <h2>Como aprender HTML</h2>\n  <p>Comece entendendo a estrutura semantica.</p>\n</article>',
      header: '<header>\n  <h1>Portal de Estudos</h1>\n  <p>Guias praticos de front-end</p>\n</header>',
      footer: '<footer>\n  <p>Contato: equipe@exemplo.com</p>\n</footer>',
      nav: '<nav>\n  <a href="#inicio">Inicio</a>\n  <a href="#guias">Guias</a>\n  <a href="#contato">Contato</a>\n</nav>',
      main: '<main>\n  <h2>Conteudo principal</h2>\n  <p>Esta area concentra as informacoes centrais da pagina.</p>\n</main>',
      aside: '<aside>\n  <h3>Dica rapida</h3>\n  <p>Use tags semanticas para organizar o layout.</p>\n</aside>',
      ul: '<ul>\n  <li>HTML</li>\n  <li>CSS</li>\n  <li>JavaScript</li>\n</ul>',
      ol: '<ol>\n  <li>Criar estrutura</li>\n  <li>Aplicar estilos</li>\n  <li>Adicionar interacao</li>\n</ol>',
      li: '<li>Item da lista</li>',
      p: '<p>Este texto explica uma ideia de forma objetiva.</p>',
      h1: '<h1>Guia de HTML</h1>',
      h2: '<h2>Conceitos basicos</h2>',
      div: '<div class="card">Conteudo do cartao</div>',
      span: '<span class="tag">Novo</span>',
      form: '<form>\n  <label for="email">E-mail</label>\n  <input id="email" type="email" name="email" placeholder="voce@exemplo.com" required>\n  <button type="submit">Cadastrar</button>\n</form>',
      label: '<label for="nome">Nome completo</label>',
      textarea: '<textarea name="mensagem" rows="4" placeholder="Escreva sua mensagem"></textarea>',
      select: '<select name="nivel">\n  <option>Basico</option>\n  <option>Intermediario</option>\n  <option>Avancado</option>\n</select>',
      option: '<option value="html">HTML</option>',
      table: '<table>\n  <thead>\n    <tr><th>Nome</th><th>Nivel</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>Ana</td><td>Intermediario</td></tr>\n    <tr><td>Caio</td><td>Basico</td></tr>\n  </tbody>\n</table>',
      thead: '<thead>\n  <tr><th>Produto</th><th>Preco</th></tr>\n</thead>',
      tbody: '<tbody>\n  <tr><td>Mouse</td><td>R$ 99</td></tr>\n</tbody>',
      tr: '<tr>\n  <td>Celula 1</td>\n  <td>Celula 2</td>\n</tr>',
      td: '<td>Conteudo da celula</td>',
      th: '<th>Titulo da coluna</th>',
      video: '<video controls width="320">\n  <source src="video.mp4" type="video/mp4">\n  Seu navegador nao suporta video.\n</video>',
      audio: '<audio controls>\n  <source src="audio.mp3" type="audio/mpeg">\n</audio>',
      source: '<source src="video.mp4" type="video/mp4">',
      iframe: '<iframe src="https://exemplo.com" title="Pagina incorporada"></iframe>',
      canvas: '<canvas id="grafico" width="240" height="120"></canvas>\n<script>\n  const ctx = document.getElementById("grafico").getContext("2d");\n  ctx.fillStyle = "#2563eb";\n  ctx.fillRect(20, 20, 80, 60);\n</script>',
      noscript: '<noscript>Ative o JavaScript para usar todos os recursos.</noscript>',
      script: '<script src="script.js"></script>',
      style: '<style>\n  .destaque {\n    color: #2563eb;\n    font-weight: 700;\n  }\n</style>',
      meta: '<meta name="description" content="Descricao da pagina">',
      link: '<link rel="stylesheet" href="style.css">',
      br: '<br>',
      hr: '<hr>'
    };

    const example = exampleMap[tagName] || (isVoid ? opening : `${opening}Conteudo${`</${tagName}>`}`);
    return { opening, closing, example };
  }

  if (lang === 'css') {
    const property = token.replace(/\(\)$/, '').trim();
    const cssExampleMap = {
      color: '.exemplo {\n  color: #2563eb;\n}',
      'background-color': '.exemplo {\n  background-color: #e0f2fe;\n}',
      background: '.exemplo {\n  background: linear-gradient(135deg, #dbeafe, #bfdbfe);\n}',
      display: '.exemplo {\n  display: flex;\n  gap: 12px;\n}',
      position: '.exemplo {\n  position: relative;\n  top: 8px;\n}',
      width: '.exemplo {\n  width: 320px;\n}',
      height: '.exemplo {\n  height: 120px;\n}',
      margin: '.exemplo {\n  margin: 24px auto;\n}',
      padding: '.exemplo {\n  padding: 16px 24px;\n}',
      border: '.exemplo {\n  border: 2px solid #2563eb;\n}',
      'border-radius': '.exemplo {\n  border-radius: 16px;\n}',
      'box-shadow': '.exemplo {\n  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.18);\n}',
      'font-size': '.exemplo {\n  font-size: 1.25rem;\n}',
      'font-weight': '.exemplo {\n  font-weight: 700;\n}',
      'text-align': '.exemplo {\n  text-align: center;\n}',
      'line-height': '.exemplo {\n  line-height: 1.6;\n}',
      'grid-template-columns': '.exemplo {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 12px;\n}',
      gap: '.exemplo {\n  display: flex;\n  gap: 16px;\n}',
      'justify-content': '.exemplo {\n  display: flex;\n  justify-content: space-between;\n}',
      'align-items': '.exemplo {\n  display: flex;\n  align-items: center;\n}',
      flex: '.exemplo {\n  display: flex;\n  flex: 1;\n}',
      transform: '.exemplo {\n  transform: translateY(-4px) scale(1.02);\n}',
      transition: '.exemplo {\n  transition: all 0.25s ease;\n}',
      animation: '.exemplo {\n  animation: pulse 1.5s infinite;\n}\n\n@keyframes pulse {\n  50% {\n    transform: scale(1.04);\n  }\n}',
      opacity: '.exemplo {\n  opacity: 0.85;\n}'
    };
    return {
      opening: `${property}: valor;`,
      closing: 'Nao tem fechamento',
      example: cssExampleMap[property] || `.exemplo {\n  ${property}: valor;\n}`
    };
  }

  if (lang === 'js') {
    const jsExampleMap = {
      'document.querySelector()': "const botao = document.querySelector('#botao');\nbotao.textContent = 'Texto atualizado';",
      'document.querySelectorAll()': "const itens = document.querySelectorAll('.item');\nitens.forEach(item => item.classList.add('ativo'));",
      '.addEventListener()': "document.getElementById('botao').addEventListener('click', () => {\n  document.getElementById('saida').textContent = 'Evento executado com sucesso.';\n});",
      '.classList.add()': "const card = document.querySelector('.card');\ncard.classList.add('ativo');",
      '.classList.remove()': "const menu = document.querySelector('.menu');\nmenu.classList.remove('aberto');",
      '.classList.toggle()': "const painel = document.querySelector('.painel');\npainel.classList.toggle('visivel');",
      '.setAttribute()': "const link = document.querySelector('a');\nlink.setAttribute('target', '_blank');",
      '.getAttribute()': "const imagem = document.querySelector('img');\nconst descricao = imagem.getAttribute('alt');",
      'fetch(url)': "fetch('https://api.exemplo.com/usuarios')\n  .then(resposta => resposta.json())\n  .then(dados => {\n    document.getElementById('saida').textContent = dados[0]?.nome || 'Sem dados';\n  })\n  .catch(() => {\n    document.getElementById('saida').textContent = 'Falha ao carregar';\n  });",
      '.map()': "const precos = [10, 20, 30];\nconst comDesconto = precos.map(preco => preco * 0.9);",
      '.filter()': "const numeros = [3, 8, 12, 15];\nconst maiores = numeros.filter(numero => numero > 10);",
      '.find()': "const usuarios = [{ id: 1 }, { id: 2 }];\nconst usuario = usuarios.find(item => item.id === 2);",
      '.forEach()': "['HTML', 'CSS', 'JS'].forEach(item => {\n  console.log(item);\n});",
      '.reduce()': "const valores = [10, 20, 30];\nconst total = valores.reduce((soma, item) => soma + item, 0);",
      '.includes()': "const tecnologias = ['HTML', 'CSS', 'JS'];\nconst temCss = tecnologias.includes('CSS');",
      'setTimeout(fn, ms)': "setTimeout(() => {\n  document.getElementById('saida').textContent = 'setTimeout executou.';\n}, 1000);",
      'setInterval(fn, ms)': "const timer = setInterval(() => {\n  console.log('Executando a cada segundo');\n}, 1000);",
      'JSON.stringify()': "const usuario = { nome: 'Ana', nivel: 'intermediario' };\nconst json = JSON.stringify(usuario);",
      'JSON.parse()': "const texto = '{\"nome\":\"Ana\"}';\nconst objeto = JSON.parse(texto);",
      'localStorage.setItem()': "localStorage.setItem('tema', 'escuro');",
      'localStorage.getItem()': "const tema = localStorage.getItem('tema');",
      'console.log()': "console.log('Aplicacao iniciada');",
      'Promise.all([])': "Promise.all([buscarUsuario(), buscarPedidos()])\n  .then(([usuario, pedidos]) => {\n    console.log(usuario, pedidos);\n  });"
    };

    if (jsExampleMap[token]) {
      return {
        opening: token.includes('()') ? `${token.replace('()', '(...)')}` : token,
        closing: 'Nao tem fechamento',
        example: jsExampleMap[token]
      };
    }

    if (token.includes('()')) {
      return {
        opening: `${token.replace('()', '(...)')}`,
        closing: 'Nao tem fechamento',
        example: `// Exemplo pratico\nconst resultado = ${token.replace('()', '(...)')};`
      };
    }

    if (token.startsWith('.')) {
      return {
        opening: `objeto${token.replace(/\(\)/g, '(...)')}`,
        closing: 'Nao tem fechamento',
        example: `const valor = objeto${token.replace(/\(\)/g, '(...)')};`
      };
    }

    return {
      opening: token,
      closing: 'Nao tem fechamento',
      example: `// Exemplo pratico\n${token}`
    };
  }

  return {
    opening: token,
    closing: 'Nao tem fechamento',
    example: `${token}\n# Exemplo de uso no terminal`
  };
}

function createMetaLine(lang, details) {
  const wrap = document.createElement('div');
  wrap.className = 'usage-meta';

  const langLabel = lang === 'html' ? 'Abertura' : 'Uso';
  wrap.innerHTML = `
    <span class="usage-pill">${langLabel}: <code>${escapeHtml(details.opening)}</code></span>
    <span class="usage-pill">Fechamento: <code>${escapeHtml(details.closing)}</code></span>
  `;

  return wrap;
}

function createLevelBadge(level) {
  const badge = document.createElement('span');
  badge.className = `level-badge level-${level.toLowerCase()}`;
  badge.textContent = level;
  return badge;
}

function createEssentialBadge() {
  const badge = document.createElement('span');
  badge.className = 'essential-badge';
  badge.textContent = 'Essencial';
  return badge;
}

function copyText(text, button) {
  const finish = label => {
    if (!button) return;
    const original = button.dataset.label || button.textContent;
    button.textContent = label;
    window.setTimeout(() => {
      button.textContent = original;
    }, 1200);
  };

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => finish('Copiado')).catch(() => finish('Falhou'));
    return;
  }

  const field = document.createElement('textarea');
  field.value = text;
  field.setAttribute('readonly', '');
  field.style.position = 'absolute';
  field.style.left = '-9999px';
  document.body.appendChild(field);
  field.select();

  try {
    document.execCommand('copy');
    finish('Copiado');
  } catch (error) {
    finish('Falhou');
  } finally {
    field.remove();
  }
}

function buildHtmlPreview(code) {
  return /<html[\s>]|<!doctype/i.test(code)
    ? code
    : `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 16px;
      color: #111827;
      background: #ffffff;
    }
  </style>
</head>
<body>
${code}
</body>
</html>`;
}

function buildCssPreview(code, token) {
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
    .exemplo {
      padding: 16px;
      border: 1px solid #cbd5e1;
      background: linear-gradient(135deg, #ffffff, #e8f1ff);
    }
    ${code}
  </style>
</head>
<body>
  <div class="exemplo">Preview da propriedade ${escapeHtml(token)}</div>
</body>
</html>`;
}

function buildJsPreview(token, code) {
  const previewMap = {
    'document.querySelector()': `<!DOCTYPE html>
<html lang="pt-BR">
<body>
  <button id="botao">Clique</button>
  <p id="saida">Aguardando...</p>
  <script>
${code}
  </script>
</body>
</html>`,
    '.addEventListener()': `<!DOCTYPE html>
<html lang="pt-BR">
<body>
  <button id="botao">Clique aqui</button>
  <p id="saida">Nenhum clique ainda.</p>
  <script>
${code}
  </script>
</body>
</html>`,
    'setTimeout(fn, ms)': `<!DOCTYPE html>
<html lang="pt-BR">
<body>
  <p id="saida">Esperando 1 segundo...</p>
  <script>
${code}
  </script>
</body>
</html>`
  };

  return previewMap[token] || null;
}

function validatePreviewContent(lang, token, code) {
  if (lang === 'html') {
    const hasOpenTag = /<([a-z][a-z0-9-]*)\b/i.test(code);
    if (!hasOpenTag) {
      return { ok: false, message: 'Adicione pelo menos uma tag HTML valida para gerar preview.' };
    }
    return { ok: true, message: 'Preview atualizado com sucesso.' };
  }

  if (lang === 'css') {
    if (!code.includes('{') || !code.includes('}')) {
      return { ok: false, message: 'Use uma regra CSS completa, por exemplo .exemplo { color: blue; }.' };
    }
    return { ok: true, message: `Preview aplicado para ${token}.` };
  }

  if (lang === 'js') {
    if (!buildJsPreview(token, code)) {
      return { ok: false, message: 'Este item nao possui preview dinamico editavel.' };
    }

    try {
      new Function(code);
      return { ok: true, message: 'JavaScript valido. Use o preview para testar a interacao.' };
    } catch (error) {
      return { ok: false, message: `JavaScript invalido: ${error.message}` };
    }
  }

  return { ok: true, message: '' };
}

function updatePreviewState(detailRow, validation, srcdoc) {
  const status = detailRow.querySelector('.example-preview-status');
  const frame = detailRow.querySelector('.example-preview-frame');
  if (!status || !frame) return;

  status.textContent = validation.message;
  status.classList.toggle('is-error', !validation.ok);
  status.classList.toggle('is-success', validation.ok);

  if (validation.ok && srcdoc) {
    frame.srcdoc = srcdoc;
    frame.classList.remove('is-hidden');
  } else {
    frame.srcdoc = '<!DOCTYPE html><html><body></body></html>';
    frame.classList.add('is-hidden');
  }
}

function getPreviewConfig(lang, token, details) {
  if (lang === 'html') {
    return {
      title: 'Preview',
      buildSrcdoc: code => buildHtmlPreview(code)
    };
  }

  if (lang === 'css') {
    return {
      title: 'Preview',
      buildSrcdoc: code => buildCssPreview(code, token)
    };
  }

  if (lang === 'js') {
    if (buildJsPreview(token, details.example)) {
      return {
        title: 'Preview',
        buildSrcdoc: code => buildJsPreview(token, code)
      };
    }
  }

  return null;
}

function getRelatedItems(lang, token) {
  const relatedMap = {
    html: {
      '<form>': ['<label>', '<input>', '<button>', '<textarea>', '<select>'],
      '<input>': ['<label>', '<form>', '<button>'],
      '<label>': ['<input>', '<textarea>', '<select>'],
      '<table>': ['<thead>', '<tbody>', '<tr>', '<th>', '<td>'],
      '<video>': ['<source>', '<track>'],
      '<audio>': ['<source>'],
      '<nav>': ['<a>', '<ul>', '<li>'],
      '<ul>': ['<li>'],
      '<ol>': ['<li>'],
      '<picture>': ['<source>', '<img>'],
      '<canvas>': ['<script>'],
      '<iframe>': ['<title>', '<a>'],
      '<header>': ['<nav>', '<h1>', '<p>'],
      '<main>': ['<section>', '<article>', '<aside>'],
      '<section>': ['<h2>', '<p>', '<article>'],
      '<article>': ['<h2>', '<p>', '<footer>']
    },
    css: {
      display: ['justify-content', 'align-items', 'gap', 'flex'],
      flex: ['display', 'justify-content', 'align-items', 'gap'],
      'grid-template-columns': ['display', 'gap', 'grid-template-rows'],
      position: ['top', 'right', 'bottom', 'left', 'z-index'],
      background: ['background-color', 'background-image', 'background-size'],
      transition: ['transform', 'opacity', 'animation'],
      animation: ['@keyframes', 'transform', 'transition'],
      'font-size': ['font-weight', 'line-height', 'text-align'],
      border: ['border-radius', 'box-shadow'],
      width: ['max-width', 'min-width'],
      height: ['min-height', 'max-height']
    },
    js: {
      'document.querySelector()': ['document.querySelectorAll()', '.addEventListener()', '.classList.add()'],
      'document.querySelectorAll()': ['.forEach()', '.classList.add()'],
      '.addEventListener()': ['document.querySelector()', '.classList.toggle()', 'setTimeout(fn, ms)'],
      '.map()': ['.filter()', '.reduce()', '.forEach()'],
      '.filter()': ['.map()', '.find()', '.reduce()'],
      '.reduce()': ['.map()', '.filter()', '.forEach()'],
      'fetch(url)': ['response.json()', '.then(fn)', '.catch(fn)', 'AbortController'],
      'JSON.stringify()': ['JSON.parse()', 'localStorage.setItem()'],
      'JSON.parse()': ['JSON.stringify()', 'fetch(url)'],
      'localStorage.setItem()': ['localStorage.getItem()', 'JSON.stringify()'],
      'localStorage.getItem()': ['localStorage.setItem()', 'JSON.parse()'],
      'Promise.all([])': ['.then(fn)', '.catch(fn)', 'fetch(url)'],
      'setTimeout(fn, ms)': ['setInterval(fn, ms)', 'clearTimeout(id)']
    },
    tools: {
      git: ['vercel', 'outros'],
      vercel: ['git', 'outros']
    }
  };

  return relatedMap[lang]?.[token] || [];
}

function findRowByToken(lang, token) {
  return Array.from(document.querySelectorAll(`table[data-lang="${lang}"] tbody tr`)).find(row => {
    if (row.classList.contains('example-row')) return false;
    const tagCell = row.querySelector('.tag-cell');
    if (!tagCell) return false;
    return getCleanToken(tagCell) === token;
  });
}

function closeInlineExample() {
  if (selectedRow) selectedRow.classList.remove('row-selected');
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
  row.classList.add('row-selected');
  const preview = getPreviewConfig(lang, token, details);
  const relatedItems = getRelatedItems(lang, token);
  const exampleLabel = lang === 'tools' ? 'Comando / exemplo' : 'Exemplo pratico';
  const canEdit = lang !== 'tools';

  const detailRow = document.createElement('tr');
  detailRow.className = 'example-row';
  detailRow.innerHTML = `
    <td colspan="${row.children.length}">
      <div class="example-inline-panel">
        <div class="example-inline-head">
          <div>
            <div class="example-kicker">Exemplo pratico</div>
            <h3>${escapeHtml(token)} - ${escapeHtml(name)}</h3>
          </div>
          <div class="example-actions">
            ${canEdit ? '<button type="button" class="example-reset" aria-label="Restaurar exemplo" data-label="Restaurar">Restaurar</button>' : ''}
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
          ${canEdit
            ? `<textarea class="example-editor" spellcheck="false">${escapeHtml(details.example)}</textarea>`
            : `<pre class="example-code">${escapeHtml(details.example)}</pre>`}
        </div>
        ${preview ? `
        <div class="example-card example-preview-card">
          <span class="example-label">${preview.title}</span>
          <div class="example-preview-status"></div>
          <iframe class="example-preview-frame" title="Preview de ${escapeHtml(name)}" sandbox="allow-scripts"></iframe>
        </div>
        ` : ''}
        ${relatedItems.length ? `
        <div class="example-card example-related-card">
          <span class="example-label">Relacionados</span>
          <div class="related-list">
            ${relatedItems.map(item => `<button type="button" class="related-chip" data-token="${escapeHtml(item)}">${escapeHtml(item)}</button>`).join('')}
          </div>
        </div>
        ` : ''}
      </div>
    </td>
  `;

  row.insertAdjacentElement('afterend', detailRow);
  if (preview) {
    const validation = validatePreviewContent(lang, token, details.example);
    const srcdoc = validation.ok ? preview.buildSrcdoc(details.example) : '';
    updatePreviewState(detailRow, validation, srcdoc);
  }
  detailRow.querySelector('.example-close').addEventListener('click', closeInlineExample);
  detailRow.querySelector('.example-copy').addEventListener('click', event => {
    event.stopPropagation();
    const editor = detailRow.querySelector('.example-editor');
    const text = editor ? editor.value : details.example;
    copyText(text, event.currentTarget);
  });
  if (canEdit) {
    const editor = detailRow.querySelector('.example-editor');
    const resetButton = detailRow.querySelector('.example-reset');

    editor.addEventListener('click', event => event.stopPropagation());
    editor.addEventListener('input', () => {
      if (preview) {
        const validation = validatePreviewContent(lang, token, editor.value);
        const srcdoc = validation.ok ? preview.buildSrcdoc(editor.value) : '';
        updatePreviewState(detailRow, validation, srcdoc);
      }
    });

    resetButton.addEventListener('click', event => {
      event.stopPropagation();
      editor.value = details.example;
      if (preview) {
        const validation = validatePreviewContent(lang, token, editor.value);
        const srcdoc = validation.ok ? preview.buildSrcdoc(editor.value) : '';
        updatePreviewState(detailRow, validation, srcdoc);
      }
    });
  }
  detailRow.querySelectorAll('.related-chip').forEach(button => {
    button.addEventListener('click', event => {
      event.stopPropagation();
      const relatedToken = event.currentTarget.dataset.token;
      const relatedRow = findRowByToken(lang, relatedToken);
      if (!relatedRow) return;
      relatedRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
      relatedRow.click();
    });
  });
  selectedDetailRow = detailRow;
}

function enhanceReferenceTables() {
  document.querySelectorAll('table[data-lang] tbody tr').forEach(row => {
    if (row.dataset.enhanced === 'true') return;

    const table = row.closest('table');
    const lang = table.dataset.lang;
    const tagCell = row.querySelector('.tag-cell');
    const nameCell = row.querySelector('.name-cell');
    const descCell = row.querySelector('.desc-cell');

    if (!tagCell || !nameCell || !descCell) return;

    const token = getCleanToken(tagCell);
    const name = nameCell.textContent.trim();
    const details = inferRowDetails(lang, token, row);
    const level = inferLevel(lang, token, row);
    const essential = inferEssential(lang, token, row);

    row.dataset.level = level;
    row.dataset.essential = essential ? 'true' : 'false';
    if (essential) nameCell.appendChild(createEssentialBadge());
    nameCell.appendChild(createLevelBadge(level));
    descCell.appendChild(createMetaLine(lang, details));
    row.classList.add('clickable-row');
    row.dataset.enhanced = 'true';

    row.addEventListener('click', () => openInlineExample(row, lang, token, name, details));
  });
}

function applyFilters() {
  closeInlineExample();
  const query = document.getElementById('searchInput').value.toLowerCase().trim();

  document.querySelectorAll('.lang-block').forEach(block => {
    const blockLang = block.id.replace('block-', '');
    const langMatch = activeLang === 'all' || activeLang === blockLang;
    block.classList.toggle('visible', langMatch);
  });

  document.querySelectorAll('.section-title[data-cat]').forEach(sec => {
    const cat = sec.dataset.cat;
    const lang = sec.dataset.lang;
    const langMatch = activeLang === 'all' || activeLang === lang;
    const catMatch = activeCat === 'all' || activeCat === cat;
    sec.style.display = langMatch && catMatch ? '' : 'none';
  });

  document.querySelectorAll('table[data-cat]').forEach(table => {
    const cat = table.dataset.cat;
    const lang = table.dataset.lang;
    const langMatch = activeLang === 'all' || activeLang === lang;
    const catMatch = activeCat === 'all' || activeCat === cat;

    if (!langMatch || !catMatch) {
      table.style.display = 'none';
      return;
    }

    table.style.display = '';

    let anyVisible = false;
    table.querySelectorAll('tbody tr:not(.example-row)').forEach(row => {
      const searchMatch = !query || row.textContent.toLowerCase().includes(query);
      const levelMatch = activeLevel === 'all' || row.dataset.level === activeLevel;
      const studyMatch = studyMode === 'all' || row.dataset.essential === 'true';
      const visible = searchMatch && levelMatch && studyMatch;
      row.style.display = visible ? '' : 'none';
      if (visible) anyVisible = true;
    });

    if (!anyVisible) table.style.display = 'none';
  });
}

enhanceReferenceTables();
updateCategoryButtons();
applyFilters();
