let activeLang = 'all';
let activeCat = 'all';
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
      a: '<a href="https://exemplo.com">Abrir site</a>',
      img: '<img src="foto.jpg" alt="Descricao da imagem">',
      input: '<input type="text" placeholder="Digite aqui">',
      button: '<button type="button">Enviar</button>',
      section: '<section>\n  <h2>Titulo da secao</h2>\n</section>',
      article: '<article>\n  <h2>Post</h2>\n  <p>Conteudo do artigo.</p>\n</article>',
      header: '<header>\n  <h1>Minha pagina</h1>\n</header>',
      footer: '<footer>\n  <p>Rodape do site</p>\n</footer>',
      nav: '<nav>\n  <a href="#inicio">Inicio</a>\n</nav>',
      ul: '<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>',
      ol: '<ol>\n  <li>Primeiro</li>\n  <li>Segundo</li>\n</ol>',
      li: '<li>Item da lista</li>',
      p: '<p>Este e um paragrafo.</p>',
      h1: '<h1>Titulo principal</h1>',
      div: '<div class="caixa">Conteudo</div>',
      span: '<span>Destaque curto</span>',
      form: '<form>\n  <input type="email" name="email">\n  <button type="submit">Enviar</button>\n</form>',
      table: '<table>\n  <tr><th>Nome</th></tr>\n  <tr><td>Ana</td></tr>\n</table>',
      tr: '<tr>\n  <td>Celula</td>\n</tr>',
      td: '<td>Conteudo da celula</td>',
      th: '<th>Titulo da coluna</th>',
      script: '<script src="script.js"></script>',
      style: '<style>\n  body { color: #fff; }\n</style>',
      meta: '<meta name="description" content="Descricao da pagina">',
      link: '<link rel="stylesheet" href="style.css">'
    };

    const example = exampleMap[tagName] || (isVoid ? opening : `${opening}Conteudo${`</${tagName}>`}`);
    return { opening, closing, example };
  }

  if (lang === 'css') {
    const property = token.replace(/\(\)$/, '').trim();
    return {
      opening: `${property}: valor;`,
      closing: 'Nao tem fechamento',
      example: `.exemplo {\n  ${property}: valor;\n}`
    };
  }

  if (lang === 'js') {
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
          <button type="button" class="example-close" aria-label="Fechar exemplo">Fechar</button>
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
          <span class="example-label">Exemplo pratico</span>
          <pre class="example-code">${escapeHtml(details.example)}</pre>
        </div>
      </div>
    </td>
  `;

  row.insertAdjacentElement('afterend', detailRow);
  detailRow.querySelector('.example-close').addEventListener('click', closeInlineExample);
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

    if (!query) {
      table.querySelectorAll('tbody tr:not(.example-row)').forEach(r => r.style.display = '');
      return;
    }

    let anyVisible = false;
    table.querySelectorAll('tbody tr:not(.example-row)').forEach(row => {
      const visible = row.textContent.toLowerCase().includes(query);
      row.style.display = visible ? '' : 'none';
      if (visible) anyVisible = true;
    });

    if (!anyVisible) table.style.display = 'none';
  });
}

enhanceReferenceTables();
updateCategoryButtons();
applyFilters();
