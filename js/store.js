/* ===== TIENDA ===== */

const CATS = {
  all: 'Todos',
  led: 'LED Ambiental',
  techo: 'Techo Estrellado',
  cuadro: 'Cuadro Digital',
  personalizacion: 'Personalización'
};

let storeCategory = 'all';
let storeSearch = '';
let storeSort = 'featured';

function getActiveProducts() {
  const raw = localStorage.getItem('cl_products');
  if (!raw) return [];
  try {
    return JSON.parse(raw).filter(p => p.active);
  } catch {
    return [];
  }
}

function getFilteredProducts() {
  let list = getActiveProducts();

  if (storeCategory && storeCategory !== 'all') {
    list = list.filter(p => p.category === storeCategory);
  }

  if (storeSearch) {
    const q = storeSearch.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.features || []).some(f => f.toLowerCase().includes(q))
    );
  }

  switch (storeSort) {
    case 'price-asc':
      list.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      list.sort((a, b) => b.price - a.price);
      break;
    case 'name':
      list.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'featured':
    default:
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      break;
  }

  return list;
}

function renderStoreCount() {
  const el = document.getElementById('store-count');
  if (!el) return;
  const total = getActiveProducts().length;
  const filtered = getFilteredProducts().length;
  el.textContent = storeSearch || storeCategory !== 'all'
    ? `${filtered} de ${total} productos`
    : `${total} productos`;
}

function renderStore(category) {
  storeCategory = category || 'all';
  const grid = document.getElementById('store-grid');
  if (!grid) return;

  const products = getFilteredProducts();
  renderStoreCount();

  if (products.length === 0) {
    grid.innerHTML = `
      <div class="store-empty">
        <div class="store-empty-icon">🔍</div>
        <h3>No se encontraron productos</h3>
        <p>Prueba con otra búsqueda o categoría.</p>
        <button class="btn btn-outline" onclick="resetStore()">Ver todos</button>
      </div>`;
    return;
  }

  grid.innerHTML = products.map(p => `
    <div class="store-card fade-in" onclick="openProductModal('${p.id}')">
      <div class="store-card-badges">
        ${p.oldPrice ? `<span class="store-badge-discount">-${Math.round((1 - p.price / p.oldPrice) * 100)}%</span>` : ''}
        ${p.featured ? `<span class="store-badge-feat">★ Destacado</span>` : ''}
      </div>
      <div class="store-card-img">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        <div class="store-card-overlay">
          <span class="store-card-quick">Ver detalles</span>
        </div>
      </div>
      <div class="store-card-body">
        <span class="store-card-cat">${CATS[p.category] || p.category}</span>
        <h3 class="store-card-name">${p.name}</h3>
        <p class="store-card-desc">${p.description}</p>
        ${p.features && p.features.length ? `
        <div class="store-card-features">
          ${p.features.map(f => `<span class="store-feature-tag">${f}</span>`).join('')}
        </div>` : ''}
        <div class="store-card-footer">
          <div class="store-card-prices">
            ${p.oldPrice ? `<span class="store-old-price">${p.oldPrice}€</span>` : ''}
            <span class="store-price">${p.price}€</span>
          </div>
          <a href="contacto.html?producto=${encodeURIComponent(p.name)}" class="btn btn-primary btn-sm" onclick="event.stopPropagation()">Solicitar</a>
        </div>
      </div>
    </div>
  `).join('');

  requestAnimationFrame(() => {
    grid.querySelectorAll('.fade-in').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 60);
    });
  });
}

function openProductModal(id) {
  const products = getActiveProducts();
  const p = products.find(x => x.id === id);
  if (!p) return;

  const modal = document.getElementById('product-modal');
  const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  const whatsappMsg = encodeURIComponent(`Hola, me interesa: ${p.name} — ${p.price}€. ¿Pueden darme más info?`);

  document.getElementById('pm-img').src = p.image;
  document.getElementById('pm-img').alt = p.name;
  document.getElementById('pm-cat').textContent = CATS[p.category] || p.category;
  document.getElementById('pm-name').textContent = p.name;
  document.getElementById('pm-desc').textContent = p.description;
  document.getElementById('pm-features').innerHTML = (p.features || [])
    .map(f => `<li>✓ ${f}</li>`).join('');

  const priceHtml = `
    ${p.oldPrice ? `<span class="pm-old-price">${p.oldPrice}€</span>` : ''}
    <span class="pm-price">${p.price}€</span>
    ${discount ? `<span class="pm-discount">-${discount}%</span>` : ''}
  `;
  document.getElementById('pm-prices').innerHTML = priceHtml;

  document.getElementById('pm-whatsapp').href = `https://wa.me/34644660888?text=${whatsappMsg}`;
  document.getElementById('pm-contact').href = `contacto.html?producto=${encodeURIComponent(p.name)}`;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  const modal = document.getElementById('product-modal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function renderFilters() {
  const bar = document.getElementById('store-filters');
  if (!bar) return;

  const params = new URLSearchParams(window.location.search);
  const cat = params.get('cat') || 'all';
  storeCategory = cat;

  bar.innerHTML = Object.entries(CATS).map(([key, label]) => `
    <button class="store-filter ${cat === key ? 'active' : ''}" onclick="filterStore('${key}')">${label}</button>
  `).join('');
}

function filterStore(cat) {
  const url = new URL(window.location);
  if (cat && cat !== 'all') url.searchParams.set('cat', cat);
  else url.searchParams.delete('cat');
  window.history.replaceState({}, '', url);
  storeCategory = cat;
  renderFilters();
  renderStore(cat);
}

function handleStoreSearch(e) {
  storeSearch = e.target.value.trim();
  renderStore(storeCategory);
}

function handleStoreSort(e) {
  storeSort = e.target.value;
  renderStore(storeCategory);
}

function resetStore() {
  storeSearch = '';
  storeCategory = 'all';
  storeSort = 'featured';
  const searchInput = document.getElementById('store-search');
  if (searchInput) searchInput.value = '';
  const sortSelect = document.getElementById('store-sort');
  if (sortSelect) sortSelect.value = 'featured';
  const url = new URL(window.location);
  url.searchParams.delete('cat');
  window.history.replaceState({}, '', url);
  renderFilters();
  renderStore('all');
}

function initStore() {
  seedData();
  renderFilters();
  renderStore(storeCategory);
  renderStoreCount();

  const searchInput = document.getElementById('store-search');
  if (searchInput) {
    searchInput.addEventListener('input', handleStoreSearch);
  }

  const sortSelect = document.getElementById('store-sort');
  if (sortSelect) {
    sortSelect.addEventListener('change', handleStoreSort);
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeProductModal();
  });

  const overlay = document.getElementById('product-modal');
  if (overlay) {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeProductModal();
    });
  }
}
