/* ============================================================
   CINETOP — main.js
   Lógica completa de la tienda de electrónica
   Autor: Jefferson Bustos
   
   Tabla de contenido:
   1.  Base de datos de productos (array de objetos)
   2.  Estado global de la aplicación (carrito, filtros)
   3.  Selectores del DOM
   4.  Módulo: Renderizado de productos
   5.  Módulo: Filtros y ordenamiento
   6.  Módulo: Carrito de compras (agregar, quitar, actualizar)
   7.  Módulo: Carrito lateral (abrir, cerrar, renderizar)
   8.  Módulo: Modal de detalle del producto
   9.  Módulo: Búsqueda en tiempo real
   10. Módulo: Formulario de contacto con validación
   11. Módulo: UI general (scroll, header, toast, hamburguesa)
   12. Inicialización y event listeners
   ============================================================ */

/* ============================================================
   1. BASE DE DATOS DE PRODUCTOS
   Cada objeto representa un producto con sus propiedades.
   Agrega o modifica productos aquí y la UI se actualiza sola.
   ============================================================ */
const PRODUCTS = [
  {
    id: 1,
    name: 'MacBook Air M3',
    category: 'laptops',          // Coincide con data-filter del HTML
    emoji: '💻',
    price: 5800000,               // Precio en pesos colombianos
    oldPrice: 6200000,            // Precio anterior (para mostrar descuento)
    rating: 5,
    badge: 'Oferta',              // Texto del badge (null = sin badge)
    badgeType: 'sale',            // 'sale' (naranja) | 'new' (amarillo)
    description: 'El laptop más poderoso de Apple con chip M3. Batería de hasta 18 horas, pantalla Liquid Retina de 13.6" y diseño ultradelgado. Perfecto para profesionales creativos.'
  },
  {
    id: 2,
    name: 'Sony WH-1000XM5',
    category: 'audio',
    emoji: '🎧',
    price: 1200000,
    oldPrice: null,
    rating: 5,
    badge: null,
    badgeType: null,
    description: 'Los mejores auriculares inalámbricos con cancelación de ruido del mercado. Hasta 30h de batería, sonido Hi-Res y micrófono AI para llamadas cristalinas.'
  },
  {
    id: 3,
    name: 'Samsung Galaxy S25 Ultra',
    category: 'moviles',
    emoji: '📱',
    price: 4200000,
    oldPrice: null,
    rating: 4,
    badge: 'Nuevo',
    badgeType: 'new',
    description: 'El smartphone definitivo de Samsung. Pantalla Dynamic AMOLED 2X de 6.8", cámara de 200MP con IA, S Pen integrado y batería de 5000mAh con carga de 45W.'
  },
  {
    id: 4,
    name: 'Logitech MX Master 3S',
    category: 'accesorios',
    emoji: '🖱️',
    price: 420000,
    oldPrice: 500000,
    rating: 4,
    badge: 'Oferta',
    badgeType: 'sale',
    description: 'El ratón más avanzado para productividad. Sensor de 8000 DPI, scroll electromagnético MagSpeed y batería de hasta 70 días. Compatible con macOS y Windows.'
  },
  {
    id: 5,
    name: 'PlayStation 5 Slim',
    category: 'gaming',
    emoji: '🎮',
    price: 2800000,
    oldPrice: null,
    rating: 5,
    badge: null,
    badgeType: null,
    description: 'La consola de nueva generación de Sony. Procesador AMD Zen 2, GPU RDNA 2, SSD de 825GB ultra-rápido, soporte para 4K/120fps y ray tracing en tiempo real.'
  },
  {
    id: 6,
    name: 'Dell XPS 15 OLED',
    category: 'laptops',
    emoji: '🖥️',
    price: 7200000,
    oldPrice: null,
    rating: 4,
    badge: null,
    badgeType: null,
    description: 'Potencia y elegancia en una sola máquina. Pantalla OLED 3.5K de 15.6", Intel Core i9, NVIDIA RTX 4060 y 32GB RAM. Ideal para diseño y video profesional.'
  },
  {
    id: 7,
    name: 'AirPods Pro 2da Gen',
    category: 'audio',
    emoji: '🎵',
    price: 980000,
    oldPrice: 1100000,
    rating: 5,
    badge: 'Oferta',
    badgeType: 'sale',
    description: 'Los AirPods más avanzados de Apple. Cancelación activa de ruido 2x más potente, modo Transparencia adaptable, audio espacial personalizado y batería de 30h.'
  },
  {
    id: 8,
    name: 'iPad Pro M4 12.9"',
    category: 'moviles',
    emoji: '📟',
    price: 5100000,
    oldPrice: null,
    rating: 5,
    badge: 'Nuevo',
    badgeType: 'new',
    description: 'El iPad más potente jamás creado. Chip M4 de Apple, pantalla Ultra Retina XDR con ProMotion a 120Hz, cámara TrueDepth y compatibilidad con Apple Pencil Pro.'
  },
  {
    id: 9,
    name: 'Teclado Keychron Q1 Pro',
    category: 'accesorios',
    emoji: '⌨️',
    price: 650000,
    oldPrice: null,
    rating: 4,
    badge: null,
    badgeType: null,
    description: 'Teclado mecánico de aluminio 75%. Switches Gateron G Pro, iluminación RGB por tecla, modo inalámbrico Bluetooth 5.1 y compatibilidad total con Mac y Windows.'
  },
  {
    id: 10,
    name: 'Xbox Series X',
    category: 'gaming',
    emoji: '🕹️',
    price: 2500000,
    oldPrice: 2800000,
    rating: 4,
    badge: 'Oferta',
    badgeType: 'sale',
    description: 'La consola más poderosa de Microsoft. SSD de 1TB NVMe, velocidad de carga hasta 40x más rápida, retrocompatibilidad con miles de juegos y Xbox Game Pass.'
  },
  {
    id: 11,
    name: 'Monitor LG 4K 27"',
    category: 'accesorios',
    emoji: '🖥️',
    price: 1450000,
    oldPrice: null,
    rating: 4,
    badge: null,
    badgeType: null,
    description: 'Monitor IPS 4K UHD de 27 pulgadas con 99% sRGB, refresh rate de 144Hz, FreeSync Premium y 2x altavoces integrados de 7W. Ideal para gaming y diseño.'
  },
  {
    id: 12,
    name: 'Nothing Phone (2)',
    category: 'moviles',
    emoji: '📲',
    price: 1850000,
    oldPrice: 2000000,
    rating: 4,
    badge: 'Oferta',
    badgeType: 'sale',
    description: 'El smartphone más original del mercado. Diseño trasero transparente con Glyph Interface LED, Snapdragon 8+ Gen 1, cámara dual de 50MP y OLED de 120Hz.'
  }
];

/* ============================================================
   2. ESTADO GLOBAL DE LA APLICACIÓN
   Un solo objeto centraliza toda la información mutable.
   Nunca modifiques el DOM directamente sin actualizar el estado.
   ============================================================ */
const state = {
  cart: [],             // Array de ítems en el carrito [{...producto, qty: N}, ...]
  filter: 'all',        // Categoría activa (string)
  sort: 'default',      // Opción de ordenamiento activa (string)
  search: '',           // Término de búsqueda actual (string)
  cartOpen: false,      // Booleano: ¿está el carrito abierto?
  modalProduct: null    // Producto actualmente abierto en el modal (objeto | null)
};

/* ============================================================
   3. SELECTORES DEL DOM
   Guardamos referencias una sola vez para mejorar el rendimiento.
   Actualiza estos selectores si cambias los IDs en el HTML.
   ============================================================ */
const DOM = {
  productsGrid:  document.getElementById('productsGrid'),
  emptyMsg:      document.getElementById('emptyMsg'),
  cartBtn:       document.getElementById('cartBtn'),
  cartCount:     document.getElementById('cartCount'),
  cartSidebar:   document.getElementById('cartSidebar'),
  cartClose:     document.getElementById('cartClose'),
  cartItems:     document.getElementById('cartItems'),
  cartTotal:     document.getElementById('cartTotal'),
  checkoutBtn:   document.getElementById('checkoutBtn'),
  clearCartBtn:  document.getElementById('clearCartBtn'),
  overlay:       document.getElementById('overlay'),
  filterBtns:    document.querySelectorAll('.filter-btn'),
  sortSelect:    document.getElementById('sortSelect'),
  searchInput:   document.getElementById('searchInput'),
  header:        document.getElementById('header'),
  hamburger:     document.getElementById('hamburger'),
  mainNav:       document.getElementById('mainNav'),
  productModal:  document.getElementById('productModal'),
  modalClose:    document.getElementById('modalClose'),
  modalEmoji:    document.getElementById('modalEmoji'),
  modalCategory: document.getElementById('modalCategory'),
  modalName:     document.getElementById('modalProductName'),
  modalStars:    document.getElementById('modalStars'),
  modalDesc:     document.getElementById('modalDesc'),
  modalPrice:    document.getElementById('modalPrice'),
  modalAddBtn:   document.getElementById('modalAddBtn'),
  contactForm:   document.getElementById('contactForm'),
  toast:         document.getElementById('toast'),
  scrollTopBtn:  document.getElementById('scrollTop')
};

/* ============================================================
   4. MÓDULO: RENDERIZADO DE PRODUCTOS
   Convierte el array de productos en tarjetas HTML y las inserta
   en el DOM. Se llama cada vez que cambia el filtro, búsqueda
   o el ordenamiento.
   ============================================================ */

/**
 * Genera la cadena de estrellas ⭐ según el rating (1-5).
 * @param {number} rating - Número de estrellas del producto.
 * @returns {string} - Cadena con estrellas llenas y vacías.
 */
function renderStars(rating) {
  let stars = '';
  for (let i = 1; i <= 5; i++) {
    stars += i <= rating ? '★' : '☆';
  }
  return stars;
}

/**
 * Formatea un número como precio en pesos colombianos.
 * @param {number} amount - Valor numérico.
 * @returns {string} - Ejemplo: "$5.800.000"
 */
function formatPrice(amount) {
  return '$' + amount.toLocaleString('es-CO');
}

/**
 * Crea y devuelve el elemento <li> de una tarjeta de producto.
 * No inserta en el DOM — eso lo hace renderProducts().
 * @param {Object} product - Objeto con los datos del producto.
 * @returns {HTMLElement} - El elemento tarjeta creado.
 */
function createProductCard(product) {
  const card = document.createElement('article');
  card.className = 'product-card';
  card.setAttribute('data-id', product.id);

  // Construye el badge si existe
  const badgeHTML = product.badge
    ? `<span class="product-card__badge ${product.badgeType === 'new' ? 'product-card__badge--new' : ''}">${product.badge}</span>`
    : '';

  // Precio anterior tachado (si existe oldPrice)
  const oldPriceHTML = product.oldPrice
    ? `<span class="product-card__price-old">${formatPrice(product.oldPrice)}</span>`
    : '';

  // Inyecta el HTML interno de la tarjeta
  card.innerHTML = `
    <div class="product-card__img">
      <span>${product.emoji}</span>
      ${badgeHTML}
    </div>
    <div class="product-card__body">
      <span class="product-card__cat">${product.category}</span>
      <h3 class="product-card__name">${product.name}</h3>
      <div class="product-card__stars" aria-label="${product.rating} estrellas">
        ${renderStars(product.rating)}
      </div>
      <div>
        <span class="product-card__price">${formatPrice(product.price)}</span>
        ${oldPriceHTML}
      </div>
      <div class="product-card__actions">
        <button class="product-card__add" data-id="${product.id}" aria-label="Agregar ${product.name} al carrito">
          + Agregar
        </button>
        <button class="product-card__detail" data-id="${product.id}" aria-label="Ver detalle de ${product.name}">
          Ver detalle
        </button>
      </div>
    </div>
  `;

  return card;
}

/**
 * Filtra, ordena y renderiza los productos en la cuadrícula.
 * Se llama automáticamente cuando cambia el estado.
 */
function renderProducts() {
  // Paso 1: Filtrar por categoría
  let filtered = state.filter === 'all'
    ? [...PRODUCTS]
    : PRODUCTS.filter(p => p.category === state.filter);

  // Paso 2: Filtrar por búsqueda (insensible a mayúsculas)
  if (state.search.trim() !== '') {
    const query = state.search.toLowerCase();
    filtered = filtered.filter(
      p => p.name.toLowerCase().includes(query) ||
           p.category.toLowerCase().includes(query) ||
           p.description.toLowerCase().includes(query)
    );
  }

  // Paso 3: Ordenar según el criterio seleccionado
  switch (state.sort) {
    case 'price-asc':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'name-asc':
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'rating':
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    // 'default': sin ordenamiento extra
  }

  // Paso 4: Limpiar la cuadrícula antes de insertar
  DOM.productsGrid.innerHTML = '';

  // Paso 5: Mostrar mensaje vacío si no hay resultados
  DOM.emptyMsg.hidden = filtered.length > 0;

  // Paso 6: Insertar tarjetas con staggered animation (retardo por índice)
  filtered.forEach((product, index) => {
    const card = createProductCard(product);
    // Retardo escalonado para la animación de entrada
    card.style.animationDelay = `${index * 0.05}s`;
    DOM.productsGrid.appendChild(card);
  });
}

/* ============================================================
   5. MÓDULO: FILTROS Y ORDENAMIENTO
   ============================================================ */

/**
 * Maneja el clic en los botones de filtro de categoría.
 * Actualiza el estado y re-renderiza los productos.
 */
function handleFilterClick(e) {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;

  // Actualiza el estado
  state.filter = btn.dataset.filter;

  // Quita la clase activa de todos los botones y la pone en el clickeado
  DOM.filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
  btn.classList.add('filter-btn--active');

  // Re-renderiza
  renderProducts();
}

/**
 * Maneja el cambio en el select de ordenamiento.
 */
function handleSortChange() {
  state.sort = DOM.sortSelect.value;
  renderProducts();
}

/* ============================================================
   6. MÓDULO: CARRITO — LÓGICA INTERNA
   Gestiona agregar, quitar y actualizar cantidad de ítems.
   ============================================================ */

/**
 * Agrega un producto al carrito o incrementa su cantidad si ya existe.
 * @param {number} productId - ID del producto a agregar.
 */
function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  // Busca si el producto ya está en el carrito
  const existing = state.cart.find(item => item.id === productId);

  if (existing) {
    // Ya existe: incrementa la cantidad
    existing.qty += 1;
  } else {
    // No existe: agrega con cantidad 1
    state.cart.push({ ...product, qty: 1 });
  }

  // Actualiza la UI del carrito
  updateCartUI();
  showToast(`✅ ${product.name} agregado al carrito`);
}

/**
 * Cambia la cantidad de un ítem en el carrito.
 * Si la nueva cantidad es 0, elimina el ítem.
 * @param {number} productId - ID del producto.
 * @param {number} delta - Cambio: +1 o -1.
 */
function changeQty(productId, delta) {
  const item = state.cart.find(i => i.id === productId);
  if (!item) return;

  item.qty += delta;

  if (item.qty <= 0) {
    // Elimina el ítem si la cantidad llega a 0
    removeFromCart(productId);
  } else {
    updateCartUI();
  }
}

/**
 * Elimina completamente un ítem del carrito.
 * @param {number} productId - ID del producto a eliminar.
 */
function removeFromCart(productId) {
  state.cart = state.cart.filter(i => i.id !== productId);
  updateCartUI();
}

/**
 * Vacía todo el carrito.
 */
function clearCart() {
  state.cart = [];
  updateCartUI();
  showToast('🗑️ Carrito vaciado');
}

/**
 * Calcula el total del carrito sumando precio × cantidad de cada ítem.
 * @returns {number} - Total en pesos.
 */
function getCartTotal() {
  return state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

/**
 * Calcula la cantidad total de artículos en el carrito (sumando cantidades).
 * @returns {number} - Número total de artículos.
 */
function getCartItemCount() {
  return state.cart.reduce((sum, item) => sum + item.qty, 0);
}

/* ============================================================
   7. MÓDULO: CARRITO LATERAL — UI
   Sincroniza el estado del carrito con el DOM (sidebar).
   ============================================================ */

/**
 * Re-renderiza la lista de ítems del carrito lateral,
 * actualiza el badge de cantidad y el precio total.
 */
function updateCartUI() {
  // 1. Actualizar badge del botón del carrito
  const count = getCartItemCount();
  DOM.cartCount.textContent = count;

  if (count > 0) {
    DOM.cartCount.classList.add('cart-btn__badge--visible');
  } else {
    DOM.cartCount.classList.remove('cart-btn__badge--visible');
  }

  // 2. Limpiar y re-renderizar la lista
  DOM.cartItems.innerHTML = '';

  state.cart.forEach(item => {
    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `
      <span class="cart-item__emoji">${item.emoji}</span>
      <div class="cart-item__info">
        <p class="cart-item__name" title="${item.name}">${item.name}</p>
        <p class="cart-item__price">${formatPrice(item.price * item.qty)}</p>
      </div>
      <div class="cart-item__qty">
        <button class="cart-item__qty-btn" data-id="${item.id}" data-delta="-1" aria-label="Reducir cantidad">−</button>
        <span class="cart-item__qty-count">${item.qty}</span>
        <button class="cart-item__qty-btn" data-id="${item.id}" data-delta="1" aria-label="Aumentar cantidad">+</button>
      </div>
      <button class="cart-item__remove" data-id="${item.id}" aria-label="Eliminar ${item.name}">✕</button>
    `;
    DOM.cartItems.appendChild(li);
  });

  // 3. Actualizar total
  DOM.cartTotal.textContent = formatPrice(getCartTotal());
}

/**
 * Abre el panel lateral del carrito y muestra el overlay.
 */
function openCart() {
  state.cartOpen = true;
  DOM.cartSidebar.classList.add('is-open');
  DOM.cartSidebar.setAttribute('aria-hidden', 'false');
  DOM.overlay.classList.add('is-active');
  document.body.style.overflow = 'hidden';  // Evita scroll del body
}

/**
 * Cierra el panel lateral del carrito.
 */
function closeCart() {
  state.cartOpen = false;
  DOM.cartSidebar.classList.remove('is-open');
  DOM.cartSidebar.setAttribute('aria-hidden', 'true');
  // El overlay se oculta solo si el modal también está cerrado
  if (!DOM.productModal.classList.contains('is-open')) {
    DOM.overlay.classList.remove('is-active');
    document.body.style.overflow = '';
  }
}

/* ============================================================
   8. MÓDULO: MODAL DE DETALLE DEL PRODUCTO
   ============================================================ */

/**
 * Abre el modal con los datos del producto seleccionado.
 * @param {number} productId - ID del producto a mostrar.
 */
function openModal(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  state.modalProduct = product;

  // Inyecta datos en el modal
  DOM.modalEmoji.textContent      = product.emoji;
  DOM.modalCategory.textContent   = product.category;
  DOM.modalName.textContent       = product.name;
  DOM.modalStars.textContent      = renderStars(product.rating);
  DOM.modalDesc.textContent       = product.description;
  DOM.modalPrice.textContent      = formatPrice(product.price);

  // El botón "Agregar" del modal también agrega al carrito
  DOM.modalAddBtn.onclick = () => {
    addToCart(product.id);
    closeModal();
  };

  // Muestra el modal y el overlay
  DOM.productModal.classList.add('is-open');
  DOM.productModal.setAttribute('aria-hidden', 'false');
  DOM.overlay.classList.add('is-active');
  document.body.style.overflow = 'hidden';
}

/**
 * Cierra el modal del producto.
 */
function closeModal() {
  state.modalProduct = null;
  DOM.productModal.classList.remove('is-open');
  DOM.productModal.setAttribute('aria-hidden', 'true');

  if (!state.cartOpen) {
    DOM.overlay.classList.remove('is-active');
    document.body.style.overflow = '';
  }
}

/* ============================================================
   9. MÓDULO: BÚSQUEDA EN TIEMPO REAL
   ============================================================ */

/**
 * Variable para el debounce de la búsqueda.
 * Evita filtrar en cada tecla, espera 300ms de inactividad.
 */
let searchTimeout = null;

/**
 * Maneja el evento de escritura en el input de búsqueda.
 * Usa debounce para no re-renderizar en cada keystroke.
 */
function handleSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    state.search = DOM.searchInput.value;
    renderProducts();
  }, 300);  // 300ms de espera antes de filtrar
}

/* ============================================================
   10. MÓDULO: FORMULARIO DE CONTACTO CON VALIDACIÓN
   ============================================================ */

/**
 * Valida un campo individual y muestra/oculta el mensaje de error.
 * @param {HTMLElement} input - El campo a validar.
 * @param {HTMLElement} errorEl - El <span> donde mostrar el error.
 * @param {string} errorMsg - Mensaje de error a mostrar si falla.
 * @param {Function} validationFn - Función que devuelve true si el campo es válido.
 * @returns {boolean} - true si válido, false si inválido.
 */
function validateField(input, errorEl, errorMsg, validationFn) {
  const isValid = validationFn(input.value);

  if (!isValid) {
    input.classList.add('is-invalid');
    errorEl.textContent = errorMsg;
  } else {
    input.classList.remove('is-invalid');
    errorEl.textContent = '';
  }

  return isValid;
}

/**
 * Maneja el envío del formulario de contacto.
 * Valida todos los campos y simula el envío (sin backend real).
 * @param {Event} e - El evento submit del formulario.
 */
function handleContactSubmit(e) {
  e.preventDefault();  // Evita recarga de la página

  const nameInput  = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const msgInput   = document.getElementById('contactMsg');

  // Valida cada campo con su función y mensaje de error
  const nameOk = validateField(
    nameInput,
    document.getElementById('nameError'),
    'Por favor ingresa tu nombre completo.',
    val => val.trim().length >= 2
  );

  const emailOk = validateField(
    emailInput,
    document.getElementById('emailError'),
    'Ingresa un correo electrónico válido.',
    // Expresión regular básica para email
    val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
  );

  const msgOk = validateField(
    msgInput,
    document.getElementById('msgError'),
    'El mensaje debe tener al menos 10 caracteres.',
    val => val.trim().length >= 10
  );

  // Solo "envía" si todos los campos son válidos
  if (nameOk && emailOk && msgOk) {
    const successEl = document.getElementById('formSuccess');

    // Simula envío mostrando mensaje de éxito
    successEl.hidden = false;
    e.target.reset();  // Limpia el formulario

    // Oculta el mensaje de éxito después de 5 segundos
    setTimeout(() => { successEl.hidden = true; }, 5000);

    showToast('📨 ¡Mensaje enviado correctamente!');
  }
}

/* ============================================================
   11. MÓDULO: UI GENERAL
   ============================================================ */

/**
 * Muestra un toast (mensaje emergente) temporal.
 * Desaparece automáticamente después de 3 segundos.
 * @param {string} message - Texto a mostrar en el toast.
 */
function showToast(message) {
  DOM.toast.textContent = message;
  DOM.toast.classList.add('is-visible');

  // Oculta el toast después de 3 segundos
  setTimeout(() => {
    DOM.toast.classList.remove('is-visible');
  }, 3000);
}

/**
 * Maneja el scroll de la ventana:
 * - Agrega clase al header para efecto glassmorphism
 * - Muestra/oculta el botón de "volver arriba"
 */
function handleScroll() {
  const scrollY = window.scrollY;

  // Header: fondo oscuro cuando el usuario baja más de 60px
  if (scrollY > 60) {
    DOM.header.classList.add('header--scrolled');
  } else {
    DOM.header.classList.remove('header--scrolled');
  }

  // Botón scroll-top: visible cuando baja más de 400px
  DOM.scrollTopBtn.hidden = scrollY <= 400;
}

/**
 * Maneja el botón hamburguesa en móvil.
 * Alterna la visibilidad del menú de navegación.
 */
function handleHamburger() {
  const isOpen = DOM.mainNav.classList.toggle('is-open');
  DOM.hamburger.classList.toggle('is-open', isOpen);
  DOM.hamburger.setAttribute('aria-expanded', String(isOpen));
}

/**
 * Manejador de clic para la cuadrícula de productos.
 * Usa delegación de eventos: un solo listener para toda la cuadrícula.
 * Detecta si el clic fue en "Agregar" o "Ver detalle".
 * @param {Event} e - Evento click.
 */
function handleGridClick(e) {
  // Botón "Agregar al carrito"
  const addBtn = e.target.closest('.product-card__add');
  if (addBtn) {
    addToCart(Number(addBtn.dataset.id));
    return;
  }

  // Botón "Ver detalle"
  const detailBtn = e.target.closest('.product-card__detail');
  if (detailBtn) {
    openModal(Number(detailBtn.dataset.id));
    return;
  }
}

/**
 * Manejador de clic para los ítems del carrito.
 * Delegación de eventos para botones + y - y ✕.
 * @param {Event} e - Evento click.
 */
function handleCartItemsClick(e) {
  // Botones de cantidad (+ y -)
  const qtyBtn = e.target.closest('.cart-item__qty-btn');
  if (qtyBtn) {
    changeQty(Number(qtyBtn.dataset.id), Number(qtyBtn.dataset.delta));
    return;
  }

  // Botón de eliminar ítem
  const removeBtn = e.target.closest('.cart-item__remove');
  if (removeBtn) {
    removeFromCart(Number(removeBtn.dataset.id));
  }
}

/**
 * Simula la finalización de la compra.
 * En un proyecto real, aquí iría la integración con pasarela de pago.
 */
function handleCheckout() {
  if (state.cart.length === 0) {
    showToast('⚠️ Tu carrito está vacío');
    return;
  }

  const total = formatPrice(getCartTotal());
  clearCart();
  closeCart();
  showToast(`🎉 ¡Compra realizada! Total: ${total}`);
}

/* ============================================================
   12. INICIALIZACIÓN Y REGISTRO DE EVENT LISTENERS
   Se ejecuta cuando el DOM está completamente cargado.
   ============================================================ */
function init() {
  /* --- Render inicial de productos --- */
  renderProducts();

  /* --- Header: cambio al hacer scroll --- */
  window.addEventListener('scroll', handleScroll, { passive: true });

  /* --- Botón scroll al tope --- */
  DOM.scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* --- Hamburguesa (menú móvil) --- */
  DOM.hamburger.addEventListener('click', handleHamburger);

  /* --- Filtros de categoría (delegación) --- */
  document.querySelector('.categories__filters')
    .addEventListener('click', handleFilterClick);

  /* --- Select de ordenamiento --- */
  DOM.sortSelect.addEventListener('change', handleSortChange);

  /* --- Búsqueda en tiempo real --- */
  DOM.searchInput.addEventListener('input', handleSearch);

  /* --- Cuadrícula de productos (delegación de eventos) --- */
  DOM.productsGrid.addEventListener('click', handleGridClick);

  /* --- Carrito: abrir --- */
  DOM.cartBtn.addEventListener('click', openCart);

  /* --- Carrito: cerrar con X --- */
  DOM.cartClose.addEventListener('click', closeCart);

  /* --- Carrito: ítems (delegación de eventos) --- */
  DOM.cartItems.addEventListener('click', handleCartItemsClick);

  /* --- Carrito: finalizar compra --- */
  DOM.checkoutBtn.addEventListener('click', handleCheckout);

  /* --- Carrito: vaciar --- */
  DOM.clearCartBtn.addEventListener('click', clearCart);

  /* --- Modal: cerrar con X --- */
  DOM.modalClose.addEventListener('click', closeModal);

  /* --- Overlay: cerrar carrito o modal al hacer clic fuera --- */
  DOM.overlay.addEventListener('click', () => {
    if (state.cartOpen) closeCart();
    if (state.modalProduct) closeModal();
  });

  /* --- Cerrar con tecla Escape --- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (state.cartOpen) closeCart();
      if (state.modalProduct) closeModal();
    }
  });

  /* --- Formulario de contacto --- */
  DOM.contactForm.addEventListener('submit', handleContactSubmit);

  /* --- Smooth scroll en links del nav (cierra menú móvil) --- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', () => {
      // Cierra el menú móvil si está abierto
      DOM.mainNav.classList.remove('is-open');
      DOM.hamburger.classList.remove('is-open');
      DOM.hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* --- Inicializa el badge del carrito oculto --- */
  updateCartUI();

  console.log('🛒 CINETOP inicializado correctamente.');
  console.log(`📦 ${PRODUCTS.length} productos cargados.`);
}

/* Espera a que el DOM esté listo antes de iniciar */
document.addEventListener('DOMContentLoaded', init);
