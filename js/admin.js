/* ===== ADMIN ===== */
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'carled2024';
const KEYS = { products: 'cl_products', trabajos: 'cl_trabajos', clientes: 'cl_clientes' };

/* --- Auth --- */
function adminLogin(user, pass) {
  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    localStorage.setItem('cl_admin', '1');
    return true;
  }
  return false;
}

function adminLogout() {
  localStorage.removeItem('cl_admin');
  window.location.href = 'admin.html';
}

function adminCheck() {
  if (localStorage.getItem('cl_admin') !== '1') {
    document.getElementById('login-modal').classList.add('open');
  }
}

function handleLogin() {
  const user = document.getElementById('login-user').value;
  const pass = document.getElementById('login-pass').value;
  if (adminLogin(user, pass)) {
    document.getElementById('login-modal').classList.remove('open');
    renderAll();
  } else {
    document.getElementById('login-error').style.display = 'block';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const lp = document.getElementById('login-pass');
  if (lp) lp.addEventListener('keydown', e => { if (e.key === 'Enter') handleLogin(); });
});

/* --- Nav --- */
function initNav() {
  document.querySelectorAll('.admin-side-nav a').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const sec = a.dataset.section;
      document.querySelectorAll('.admin-side-nav a').forEach(x => x.classList.remove('active'));
      a.classList.add('active');
      document.querySelectorAll('.admin-section').forEach(x => x.classList.remove('active'));
      document.getElementById('sec-' + sec).classList.add('active');
      document.getElementById('section-title').textContent = a.querySelector('span:last-child').textContent;
      renderAll();
    });
  });
}

/* --- Generic Modal --- */
let modalContext = null;

function modalOpen(title, bodyHTML, ctx) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = bodyHTML;
  modalContext = ctx;
  document.getElementById('admin-modal').classList.add('open');
}

function modalClose() {
  document.getElementById('admin-modal').classList.remove('open');
  modalContext = null;
}

function modalSave() {
  if (!modalContext) return;
  const fn = saveHandlers[modalContext];
  if (fn) fn();
}

/* --- Toast --- */
function showToast(msg) {
  const el = document.getElementById('admin-toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2500);
}

/* ==============================
   SEED DATA
   ============================== */
const SEED_IMAGES = {
  p1: 'https://images.unsplash.com/photo-1583267746897-2cf415887172?w=400&q=80',
  p2: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=400&q=80',
  p3: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&q=80',
  p4: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=400&q=80',
  p5: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400&q=80',
  p6: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80',
  p7: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&q=80',
  p8: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=400&q=80',
  p9: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&q=80',
};
const SEED_TRAB_IMAGES = {
  t1: 'https://images.unsplash.com/photo-1583267746897-2cf415887172?w=400&q=80',
  t2: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&q=80',
  t3: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&q=80',
};

function updateExistingImages() {
  let changed = false;
  let prods = JSON.parse(localStorage.getItem(KEYS.products) || '[]');
  prods.forEach(p => {
    if (SEED_IMAGES[p.id] && p.image !== SEED_IMAGES[p.id]) {
      p.image = SEED_IMAGES[p.id];
      changed = true;
    }
  });
  if (changed) localStorage.setItem(KEYS.products, JSON.stringify(prods));

  changed = false;
  let trabs = JSON.parse(localStorage.getItem(KEYS.trabajos) || '[]');
  trabs.forEach(t => {
    if (SEED_TRAB_IMAGES[t.id] && t.images?.[0] !== SEED_TRAB_IMAGES[t.id]) {
      t.images = [SEED_TRAB_IMAGES[t.id]];
      changed = true;
    }
  });
  if (changed) localStorage.setItem(KEYS.trabajos, JSON.stringify(trabs));
}

function seedData() {
  updateExistingImages();
  const existingProds = JSON.parse(localStorage.getItem(KEYS.products) || '[]');
  if (!existingProds.length) {
    localStorage.setItem(KEYS.products, JSON.stringify([
      { id: 'p1', name: 'LED Ambiental Básico', description: '4 zonas de iluminación RGB, control por app, instalación oculta.', price: 140, oldPrice: null, category: 'led', image: 'https://images.unsplash.com/photo-1583267746897-2cf415887172?w=400&q=80', features: ['4 Zonas', 'App Móvil', 'Colores RGB', 'Instalación oculta'], featured: false, active: true },
      { id: 'p2', name: 'LED Ambiental Style', description: '8 zonas, efectos dinámicos, sincronización con música, acabado premium.', price: 190, oldPrice: null, category: 'led', image: 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=400&q=80', features: ['8 Zonas', 'Efectos dinámicos', 'Sincronización música', 'Acabado premium'], featured: true, active: true },
      { id: 'p3', name: 'LED Ambiental Premium', description: '16 zonas, todos los efectos, perfiles personalizados, asistentes de voz.', price: 290, oldPrice: 350, category: 'led', image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&q=80', features: ['16 Zonas', 'Perfiles personalizados', 'Asistentes de voz', 'Instalación invisible'], featured: false, active: true },
      { id: 'p4', name: 'Techo Estrellado Básico', description: '300 puntos de fibra óptica, color blanco cálido, 4 estrellas fugaces.', price: 349, oldPrice: null, category: 'techo', image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=400&q=80', features: ['300 puntos', 'Blanco cálido', '4 fugaces', 'Garantía 1 año'], featured: false, active: true },
      { id: 'p5', name: 'Techo Estrellado Pro', description: '500 puntos RGB, 8 estrellas fugaces, constelaciones personalizadas, app.', price: 499, oldPrice: 599, category: 'techo', image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400&q=80', features: ['500 puntos', 'RGB', '8 fugaces', 'Constelaciones', 'App'], featured: true, active: true },
      { id: 'p6', name: 'Techo Estrellado Ultra', description: '800+ puntos, RGB completo, 16 fugaces, diseño total personalizado.', price: 750, oldPrice: null, category: 'techo', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80', features: ['800+ puntos', 'RGB completo', '16 fugaces', 'Diseño total'], featured: false, active: true },
      { id: 'p7', name: 'Cuadro Digital', description: 'Pantalla digital con navegación, ADAS, información en tiempo real.', price: 650, oldPrice: null, category: 'cuadro', image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&q=80', features: ['Navegación', 'ADAS', 'Tiempo real', 'Plug & Play'], featured: false, active: true },
      { id: 'p8', name: 'Tapizado Premium', description: 'Renovación de tapicería en cuero, alcántara y materiales premium.', price: 400, oldPrice: null, category: 'personalizacion', image: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=400&q=80', features: ['Cuero', 'Alcántara', 'A medida', 'Acabado OEM'], featured: false, active: true },
      { id: 'p9', name: 'Logos Personalizados', description: 'Logos iluminados, proyección de bienvenida y emblemas a medida.', price: 120, oldPrice: null, category: 'personalizacion', image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&q=80', features: ['Iluminados', 'Proyección', 'Emblemas', 'A medida'], featured: false, active: true },
    ]));
  }
  if (!localStorage.getItem(KEYS.trabajos)) {
    localStorage.setItem(KEYS.trabajos, JSON.stringify([
      { id: 't1', title: 'BMW Serie 3 — LED + Techo', description: 'Instalación completa de iluminación ambiental LED 8 zonas y techo estrellado Pro.', category: 'led', images: ['https://images.unsplash.com/photo-1583267746897-2cf415887172?w=400&q=80'], client: 'Carlos M.', date: '2025-11-10', featured: true },
      { id: 't2', title: 'Audi A4 — Cuadro Digital', description: 'Sustitución del cuadro de instrumentos por pantalla digital con navegación.', category: 'cuadro', images: ['https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&q=80'], client: 'Ana G.', date: '2025-10-22', featured: true },
      { id: 't3', title: 'Mercedes Clase C — Premium Full', description: 'Restyling completo: LED 16 zonas, techo ultra, tapizado cuero + alcántara.', category: 'personalizacion', images: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&q=80'], client: 'Javier R.', date: '2025-09-15', featured: true },
    ]));
  }
  if (!localStorage.getItem(KEYS.clientes)) {
    localStorage.setItem(KEYS.clientes, JSON.stringify([
      { id: 'c1', name: 'Carlos Martínez', email: 'carlos@email.com', phone: '612 345 678', vehicle: 'BMW Serie 3 2020', notes: 'Cliente habitual, 3 trabajos realizados.', createdAt: '2025-09-01' },
      { id: 'c2', name: 'Ana García', email: 'ana@email.com', phone: '698 765 432', vehicle: 'Audi A4 2021', notes: 'Recomendación de amigo.', createdAt: '2025-08-15' },
      { id: 'c3', name: 'Javier Rodríguez', email: 'javier@email.com', phone: '655 123 987', vehicle: 'Mercedes Clase C 2022', notes: 'Interesado en techo estrellado.', createdAt: '2025-07-20' },
    ]));
  }
}

/* --- Generic CRUD --- */
function getList(key) { return JSON.parse(localStorage.getItem(key) || '[]'); }
function saveList(key, list) { localStorage.setItem(key, JSON.stringify(list)); }
function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

/* ==============================
   PRODUCTOS
   ============================== */
const ADMIN_CATS = { led: 'LED Ambiental', techo: 'Techo Estrellado', cuadro: 'Cuadro Digital', personalizacion: 'Personalización' };

function renderProd() {
  const el = document.getElementById('prod-list');
  if (!el) return;
  const list = getList(KEYS.products);
  if (!list.length) { el.innerHTML = '<div class="empty-state">No hay productos.</div>'; return; }
  el.innerHTML = list.map(p => `
    <div class="card-row">
      <img class="card-row-img" src="${p.image}" alt="${p.name}" loading="lazy">
      <div class="card-row-info">
        <div class="nm">${p.name}</div>
        <div class="mt">${ADMIN_CATS[p.category] || p.category}${p.featured ? ' · Destacado' : ''}${p.active ? '' : ' · Inactivo'}</div>
      </div>
      <div class="card-row-val">${p.price}€</div>
      <div class="card-row-actions">
        <button class="editar" onclick="editProd('${p.id}')">Editar</button>
        <button class="eliminar" onclick="delProd('${p.id}')">Eliminar</button>
      </div>
    </div>
  `).join('');
}

function openProdModal(prod) {
  const isEdit = !!prod;
  const p = prod || {};
  const catsOpts = Object.entries(ADMIN_CATS).map(([v, l]) =>
    `<option value="${v}"${v === (p.category || 'led') ? ' selected' : ''}>${l}</option>`
  ).join('');

  modalOpen(isEdit ? 'Editar Producto' : 'Nuevo Producto', `
    <div class="row">
      <div class="field">
        <label>Nombre</label>
        <input id="mp-name" value="${esc(p.name || '')}" required>
      </div>
      <div class="field">
        <label>Precio (€)</label>
        <input id="mp-price" type="number" value="${p.price || ''}" min="0" required>
      </div>
    </div>
    <div class="row">
      <div class="field">
        <label>Precio anterior</label>
        <input id="mp-oldprice" type="number" value="${p.oldPrice || ''}" min="0">
      </div>
      <div class="field">
        <label>Categoría</label>
        <select id="mp-category">${catsOpts}</select>
      </div>
    </div>
    <div class="field">
      <label>URL imagen</label>
      <input id="mp-image" value="${esc(p.image || '')}" required>
    </div>
    <div class="field">
      <label>Descripción</label>
      <textarea id="mp-desc">${esc(p.description || '')}</textarea>
    </div>
    <div class="field">
      <label>Características (separadas por coma)</label>
      <input id="mp-features" value="${esc((p.features || []).join(', '))}">
    </div>
    <div class="row">
      <div class="check"><input type="checkbox" id="mp-featured"${p.featured ? ' checked' : ''}><label for="mp-featured">Destacado</label></div>
      <div class="check"><input type="checkbox" id="mp-active"${p.active !== false ? ' checked' : ''}><label for="mp-active">Activo</label></div>
    </div>
  `, 'productos');

  document.getElementById('modal-form').dataset.editId = isEdit ? p.id : '';
}

function saveProd() {
  const form = document.getElementById('modal-form');
  const editId = form.dataset.editId;
  const data = {
    name: document.getElementById('mp-name').value.trim(),
    price: parseFloat(document.getElementById('mp-price').value) || 0,
    oldPrice: parseFloat(document.getElementById('mp-oldprice').value) || null,
    category: document.getElementById('mp-category').value,
    image: document.getElementById('mp-image').value.trim(),
    description: document.getElementById('mp-desc').value.trim(),
    features: document.getElementById('mp-features').value.split(',').map(s => s.trim()).filter(Boolean),
    featured: document.getElementById('mp-featured').checked,
    active: document.getElementById('mp-active').checked,
  };
  if (!data.name || !data.price) return;

  let list = getList(KEYS.products);
  if (editId) {
    const idx = list.findIndex(x => x.id === editId);
    if (idx > -1) { list[idx] = { ...list[idx], ...data }; }
    showToast('Producto actualizado');
  } else {
    data.id = genId();
    list.push(data);
    showToast('Producto creado');
  }
  saveList(KEYS.products, list);
  modalClose();
  renderAll();
}

function editProd(id) {
  const p = getList(KEYS.products).find(x => x.id === id);
  if (p) openProdModal(p);
}

function delProd(id) {
  const p = getList(KEYS.products).find(x => x.id === id);
  if (!p || !confirm(`¿Eliminar "${p.name}"?`)) return;
  saveList(KEYS.products, getList(KEYS.products).filter(x => x.id !== id));
  renderAll();
  showToast('Producto eliminado');
}

/* ==============================
   TRABAJOS
   ============================== */
function renderTrab() {
  const el = document.getElementById('trab-list');
  if (!el) return;
  const list = getList(KEYS.trabajos);
  if (!list.length) { el.innerHTML = '<div class="empty-state">No hay trabajos.</div>'; return; }
  el.innerHTML = list.map(t => `
    <div class="card-row">
      <img class="card-row-img" src="${t.images?.[0] || ''}" alt="${t.title}" loading="lazy">
      <div class="card-row-info">
        <div class="nm">${t.title}</div>
        <div class="mt">${ADMIN_CATS[t.category] || t.category}${t.featured ? ' · Destacado' : ''} · ${t.client || '—'}</div>
      </div>
      <div class="card-row-val" style="font-size:0.75rem;color:#888;font-weight:400">${t.date || ''}</div>
      <div class="card-row-actions">
        <button class="editar" onclick="editTrab('${t.id}')">Editar</button>
        <button class="eliminar" onclick="delTrab('${t.id}')">Eliminar</button>
      </div>
    </div>
  `).join('');
}

function openTrabModal(trab) {
  const isEdit = !!trab;
  const t = trab || {};
  const catsOpts = Object.entries(ADMIN_CATS).map(([v, l]) =>
    `<option value="${v}"${v === (t.category || 'led') ? ' selected' : ''}>${l}</option>`
  ).join('');

  modalOpen(isEdit ? 'Editar Trabajo' : 'Nuevo Trabajo', `
    <div class="field">
      <label>Título</label>
      <input id="mt-title" value="${esc(t.title || '')}" required>
    </div>
    <div class="field">
      <label>Descripción</label>
      <textarea id="mt-desc">${esc(t.description || '')}</textarea>
    </div>
    <div class="row">
      <div class="field">
        <label>Categoría</label>
        <select id="mt-category">${catsOpts}</select>
      </div>
      <div class="field">
        <label>Cliente</label>
        <input id="mt-client" value="${esc(t.client || '')}">
      </div>
    </div>
    <div class="row">
      <div class="field">
        <label>Fecha</label>
        <input id="mt-date" type="date" value="${t.date || ''}">
      </div>
      <div class="field">
        <label>URLs imagen (coma)</label>
        <input id="mt-images" value="${esc((t.images || []).join(', '))}">
      </div>
    </div>
    <div class="check">
      <input type="checkbox" id="mt-featured"${t.featured ? ' checked' : ''}>
      <label for="mt-featured">Destacado</label>
    </div>
  `, 'trabajos');

  document.getElementById('modal-form').dataset.editId = isEdit ? t.id : '';
}

function saveTrab() {
  const form = document.getElementById('modal-form');
  const editId = form.dataset.editId;
  const data = {
    title: document.getElementById('mt-title').value.trim(),
    description: document.getElementById('mt-desc').value.trim(),
    category: document.getElementById('mt-category').value,
    client: document.getElementById('mt-client').value.trim(),
    date: document.getElementById('mt-date').value,
    images: document.getElementById('mt-images').value.split(',').map(s => s.trim()).filter(Boolean),
    featured: document.getElementById('mt-featured').checked,
  };
  if (!data.title) return;

  let list = getList(KEYS.trabajos);
  if (editId) {
    const idx = list.findIndex(x => x.id === editId);
    if (idx > -1) { list[idx] = { ...list[idx], ...data }; }
    showToast('Trabajo actualizado');
  } else {
    data.id = genId();
    list.push(data);
    showToast('Trabajo creado');
  }
  saveList(KEYS.trabajos, list);
  modalClose();
  renderAll();
}

function editTrab(id) {
  const t = getList(KEYS.trabajos).find(x => x.id === id);
  if (t) openTrabModal(t);
}

function delTrab(id) {
  const t = getList(KEYS.trabajos).find(x => x.id === id);
  if (!t || !confirm(`¿Eliminar "${t.title}"?`)) return;
  saveList(KEYS.trabajos, getList(KEYS.trabajos).filter(x => x.id !== id));
  renderAll();
  showToast('Trabajo eliminado');
}

/* ==============================
   CLIENTES
   ============================== */
function renderCli() {
  const el = document.getElementById('cli-list');
  if (!el) return;
  const list = getList(KEYS.clientes);
  if (!list.length) { el.innerHTML = '<div class="empty-state">No hay clientes.</div>'; return; }
  el.innerHTML = list.map(c => `
    <div class="card-row">
      <div class="card-row-info">
        <div class="nm">${esc(c.name)}</div>
        <div class="mt">${esc(c.vehicle || '—')} · ${esc(c.email || '')} ${c.phone ? '· ' + esc(c.phone) : ''}</div>
      </div>
      <div class="card-row-val" style="font-size:0.7rem;color:#888;font-weight:400">${c.createdAt || ''}</div>
      <div class="card-row-actions">
        <button class="editar" onclick="editCli('${c.id}')">Editar</button>
        <button class="eliminar" onclick="delCli('${c.id}')">Eliminar</button>
      </div>
    </div>
  `).join('');
}

function openCliModal(cli) {
  const isEdit = !!cli;
  const c = cli || {};
  modalOpen(isEdit ? 'Editar Cliente' : 'Nuevo Cliente', `
    <div class="row">
      <div class="field">
        <label>Nombre</label>
        <input id="mc-name" value="${esc(c.name || '')}" required>
      </div>
      <div class="field">
        <label>Email</label>
        <input id="mc-email" type="email" value="${esc(c.email || '')}">
      </div>
    </div>
    <div class="row">
      <div class="field">
        <label>Teléfono</label>
        <input id="mc-phone" value="${esc(c.phone || '')}">
      </div>
      <div class="field">
        <label>Vehículo</label>
        <input id="mc-vehicle" value="${esc(c.vehicle || '')}">
      </div>
    </div>
    <div class="field">
      <label>Notas</label>
      <textarea id="mc-notes">${esc(c.notes || '')}</textarea>
    </div>
  `, 'clientes');

  document.getElementById('modal-form').dataset.editId = isEdit ? c.id : '';
}

function saveCli() {
  const form = document.getElementById('modal-form');
  const editId = form.dataset.editId;
  const data = {
    name: document.getElementById('mc-name').value.trim(),
    email: document.getElementById('mc-email').value.trim(),
    phone: document.getElementById('mc-phone').value.trim(),
    vehicle: document.getElementById('mc-vehicle').value.trim(),
    notes: document.getElementById('mc-notes').value.trim(),
  };
  if (!data.name) return;

  let list = getList(KEYS.clientes);
  if (editId) {
    const idx = list.findIndex(x => x.id === editId);
    if (idx > -1) { list[idx] = { ...list[idx], ...data }; }
    showToast('Cliente actualizado');
  } else {
    data.id = genId();
    data.createdAt = new Date().toISOString().slice(0, 10);
    list.push(data);
    showToast('Cliente creado');
  }
  saveList(KEYS.clientes, list);
  modalClose();
  renderAll();
}

function editCli(id) {
  const c = getList(KEYS.clientes).find(x => x.id === id);
  if (c) openCliModal(c);
}

function delCli(id) {
  const c = getList(KEYS.clientes).find(x => x.id === id);
  if (!c || !confirm(`¿Eliminar a "${c.name}"?`)) return;
  saveList(KEYS.clientes, getList(KEYS.clientes).filter(x => x.id !== id));
  renderAll();
  showToast('Cliente eliminado');
}

/* ==============================
   OVERVIEW
   ============================== */
function renderOv() {
  const el = document.getElementById('ov-cards');
  if (!el) return;
  const prods = getList(KEYS.products);
  const trabs = getList(KEYS.trabajos);
  const clis = getList(KEYS.clientes);

  el.innerHTML = `
    <div class="ov-card"><div class="num">${prods.length}</div><div class="lab">Productos</div></div>
    <div class="ov-card"><div class="num">${prods.filter(p => p.active).length}</div><div class="lab">Activos</div></div>
    <div class="ov-card"><div class="num">${trabs.length}</div><div class="lab">Trabajos</div></div>
    <div class="ov-card"><div class="num">${clis.length}</div><div class="lab">Clientes</div></div>
  `;

  // Recent products
  const rp = document.getElementById('ov-products');
  if (rp) {
    const recent = prods.slice(-3).reverse();
    rp.innerHTML = `
      <div style="font-size:0.8rem;color:#888;margin-bottom:10px">Últimos productos</div>
      ${recent.map(p => `
        <div class="card-row" style="padding:10px 14px">
          <img class="card-row-img" src="${p.image}" alt="${p.name}" loading="lazy">
          <div class="card-row-info"><div class="nm">${p.name}</div></div>
          <div class="card-row-val" style="font-size:0.85rem">${p.price}€</div>
        </div>
      `).join('')}
    `;
  }
}

/* ==============================
   SAVE HANDLERS
   ============================== */
const saveHandlers = {
  productos: saveProd,
  trabajos: saveTrab,
  clientes: saveCli,
};

/* ==============================
   RENDER ALL
   ============================== */
function renderAll() {
  renderOv();
  renderProd();
  renderTrab();
  renderCli();
}

/* ==============================
   HELPERS
   ============================== */
function esc(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

/* --- Remove old admin-productos redirect --- */
(function() {
  const p = window.location.pathname.split('/').pop();
  if (p === 'admin-productos.html') {
    window.location.href = 'admin.html';
  }
})();
