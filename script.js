  let activeLang = 'all';
  let activeCat = 'all';

  function switchLang(lang, btn) {
    activeLang = lang;
    activeCat = 'all';

    // Update lang tab styles
    document.querySelectorAll('.lang-tab').forEach(t => {
      t.classList.remove('active-html', 'active-css', 'active-js', 'active-tools');
    });
    const cls = lang === 'all' ? 'active-html' : 'active-' + lang;
    btn.classList.add(cls);

    // Show/hide language blocks
    const blocks = { html: document.getElementById('block-html'), css: document.getElementById('block-css'), js: document.getElementById('block-js'), tools: document.getElementById('block-tools') };
    if (lang === 'all') {
      Object.values(blocks).forEach(b => b.classList.add('visible'));
    } else {
      Object.values(blocks).forEach(b => b.classList.remove('visible'));
      blocks[lang].classList.add('visible');
    }

    // Reset cat buttons
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.cat-btn[onclick*="\'all\'"]').classList.add('active');

    applyFilters();
  }

  function filterCat(cat, btn) {
    activeCat = cat;
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilters();
  }

  function applyFilters() {
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

      if (!langMatch || !catMatch) { table.style.display = 'none'; return; }

      table.style.display = '';

      if (!query) {
        table.querySelectorAll('tbody tr').forEach(r => r.style.display = '');
        return;
      }

      let anyVisible = false;
      table.querySelectorAll('tbody tr').forEach(row => {
        const visible = row.textContent.toLowerCase().includes(query);
        row.style.display = visible ? '' : 'none';
        if (visible) anyVisible = true;
      });

      if (!anyVisible) table.style.display = 'none';
    });
  }

