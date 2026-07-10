/* ===== TIENDA ===== */

const CATS = {
  all: 'Todos',
  led: 'LED Ambiental',
  techo: 'Techo Estrellado',
  cuadro: 'Cuadro Digital',
  personalizacion: 'Personalización'
};

function renderStore(category) {
  const grid = document.getElementById('store-grid');
  if (!grid) return;

  const products = getActiveProducts();
  const filtered = category && category !== 'all'
    ? products.filter(p => p.category === category)
    : products;

  if (filtered.length === 0) {
    grid.innerHTML = '<p style="text-align:center;color:#999;padding:40px;">No hay productos en esta categoría.</p>';
    return;
  }

  grid.innerHTML = filtered.map(p => `
    <div class="store-card">
      ${p.oldPrice ? `<div class="store-badge">-${Math.round((1 - p.price / p.oldPrice) * 100)}%</div>` : ''}
      ${p.featured ? `<div class="store-badge store-badge-feat">Destacado</div>` : ''}
      <div class="store-card-img">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
      </div>
      <div class="store-card-body">
        <div class="store-card-cat">${CATS[p.category] || p.category}</div>
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        ${p.features.length ? `
        <ul class="store-card-features">
          ${p.features.map(f => `<li>${f}</li>`).join('')}
        </ul>` : ''}
        <div class="store-card-footer">
          <div class="store-card-price">
            ${p.oldPrice ? `<span class="store-old-price">${p.oldPrice}€</span>` : ''}
            <span class="store-price">${p.price}€</span>
          </div>
          <a href="contacto.html" class="btn btn-primary btn-sm">Solicitar</a>
        </div>
      </div>
    </div>
  `).join('');
}

function renderFilters() {
  const bar = document.getElementById('store-filters');
  if (!bar) return;

  let active = 'all';
  const params = new URLSearchParams(window.location.search);
  if (params.get('cat')) active = params.get('cat');

  bar.innerHTML = Object.entries(CATS).map(([key, label]) => `
    <button class="store-filter ${active === key ? 'active' : ''}" onclick="filterStore('${key}')">${label}</button>
  `).join('');
}

function filterStore(cat) {
  const url = new URL(window.location);
  if (cat && cat !== 'all') url.searchParams.set('cat', cat);
  else url.searchParams.delete('cat');
  window.history.replaceState({}, '', url);
  renderFilters();
  renderStore(cat);
}

function initStore() {
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('cat') || 'all';
  seedProducts();
  renderFilters();
  renderStore(cat);
}
