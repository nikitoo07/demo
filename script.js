// script.js
const products = [
    { id: 1, name: 'Conjunto Deportivo', category: 'Conjuntos', price: 45990, image: 'images/conjunto1.jpeg', sizes:[{size:'S',available:true},{size:'M',available:true},{size:'L',available:true}] },
    { id: 2, name: 'Conjunto Casual', category: 'Conjuntos', price: 52990, image: 'images/conjunto2.jpeg', sizes:[{size:'S',available:true},{size:'M',available:true},{size:'L',available:false}] },
    { id: 12, name: 'Conjunto Premium', category: 'Conjuntos', price: 89990, image: 'images/conjunto3.jpeg', sizes:[{size:'S',available:true},{size:'M',available:true},{size:'L',available:true}] },
    { id: 3, name: 'Polera Básica Blanca', category: 'Poleras', price: 14990, image: 'images/polera1.jpeg', sizes:[{size:'S',available:true},{size:'M',available:true},{size:'L',available:true},{size:'XL',available:true}] },
    { id: 4, name: 'Polera Oversized', category: 'Poleras', price: 18990, image: 'images/polera2.jpeg', sizes:[{size:'M',available:true},{size:'L',available:true},{size:'XL',available:false}] },
    { id: 11, name: 'Polera Estampada', category: 'Poleras', price: 16990, image: 'images/polera3.jpeg', sizes:[{size:'S',available:true},{size:'M',available:true},{size:'L',available:false}] },
    { id: 5, name: 'Short Cargo', category: 'Shorts', price: 29990, image: 'images/short1.jpeg', sizes:[{size:'S',available:true},{size:'M',available:true},{size:'L',available:true}] },
    { id: 6, name: 'Short Denim', category: 'Shorts', price: 25990, image: 'images/short2.jpeg', sizes:[{size:'S',available:true},{size:'M',available:false},{size:'L',available:true}] },
    { id: 7, name: 'Collar Dorado', category: 'Accesorios', price: 12990, image: 'images/accesorio1.jpeg', sizes:[{size:'Único',available:true}] },
    { id: 8, name: 'Gorro Urbano', category: 'Accesorios', price: 7990, image: 'images/accesorio2.jpeg', sizes:[{size:'Único',available:true}] },
    { id: 9, name: 'Zapatillas Urbanas', category: 'Calzado', price: 65990, image: 'images/calzado1.jpeg', sizes:[{size:'37',available:true},{size:'38',available:true},{size:'39',available:true},{size:'40',available:false}] },
    { id: 10, name: 'Zapatillas Running', category: 'Calzado', price: 74990, image: 'images/calzado2.jpeg', sizes:[{size:'38',available:true},{size:'39',available:true},{size:'40',available:true}] }
];

let cart = [];
let selectedSizes = {};

// Render products
function createProductCardHTML(product) {
    return `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <p class="product-category">${product.category}</p>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">${product.price.toLocaleString()}</p>
            <div class="sizes-container">
                <span class="sizes-label">Selecciona una talla:</span>
                <div class="sizes-grid">
                    ${product.sizes.map(s => `
                        <button 
                            class="size-btn ${!s.available ? 'unavailable' : ''}" 
                            onclick="selectSize(${product.id}, '${s.size}', ${s.available})"
                            data-product="${product.id}"
                            data-size="${s.size}"
                        >
                            ${s.size}
                            ${!s.available ? '<span class="unavailable-tooltip">¡No disponible!</span>' : ''}
                        </button>
                    `).join('')}
                </div>
            </div>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                Agregar al Carrito
            </button>
        </div>
    `;
}

function renderProducts() {
    const categories = ['Conjuntos','Poleras','Shorts','Accesorios','Calzado'];

    categories.forEach(cat => {
        const id = `${cat.toLowerCase()}Grid`;
        const grid = document.getElementById(id);
        if (!grid) return;
        const items = products.filter(p => p.category === cat);
        if (items.length === 0) {
            grid.innerHTML = '<div class="cart-empty">No hay productos</div>';
            return;
        }
        grid.innerHTML = items.map(createProductCardHTML).join('');
    });
}

// Smooth scroll is handled by CSS; add active nav link toggle on scroll
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 80; // offset for fixed navbar
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-menu a[href="#${id}"]`);
        if (!link) return;
        if (scrollPos >= top && scrollPos < top + height) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);
window.addEventListener('resize', updateActiveNav);

// Select size
function selectSize(productId, size, available) {
    if (!available) return;
    
    selectedSizes[productId] = size;
    
    const buttons = document.querySelectorAll(`[data-product="${productId}"]`);
    buttons.forEach(btn => {
        btn.classList.remove('selected');
        if (btn.dataset.size === size) {
            btn.classList.add('selected');
        }
    });
}

// Add to cart
function addToCart(productId) {
    if (!selectedSizes[productId]) {
        alert('Por favor selecciona una talla');
        return;
    }

    const product = products.find(p => p.id === productId);
    const cartItem = {
        ...product,
        selectedSize: selectedSizes[productId],
        cartId: Date.now()
    };

    cart.push(cartItem);
    updateCart();
    delete selectedSizes[productId];
    
    const buttons = document.querySelectorAll(`[data-product="${productId}"]`);
    buttons.forEach(btn => btn.classList.remove('selected'));
}

// Update cart
function updateCart() {
    const count = cart.length;
    const countEl = document.getElementById('cartCount');
    const itemCountEl = document.getElementById('cartItemCount');
    
    if (count > 0) {
        countEl.style.display = 'flex';
        countEl.textContent = count;
    } else {
        countEl.style.display = 'none';
    }
    
    itemCountEl.textContent = count;

    const cartItems = document.getElementById('cartItems');
    const cartFooter = document.getElementById('cartFooter');

    if (count === 0) {
        cartItems.innerHTML = '<div class="cart-empty">Tu carrito está vacío</div>';
        cartFooter.style.display = 'none';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-size">Talla: ${item.selectedSize}</div>
                    <div class="cart-item-price">${item.price.toLocaleString()}</div>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.cartId})">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + item.price, 0);
        document.getElementById('cartTotal').textContent = `${total.toLocaleString()}`;
        cartFooter.style.display = 'block';
    }
}

// Remove from cart
function removeFromCart(cartId) {
    cart = cart.filter(item => item.cartId !== cartId);
    updateCart();
}

// Toggle cart
function toggleCart() {
    const overlay = document.getElementById('cartOverlay');
    const sidebar = document.getElementById('cartSidebar');
    overlay.classList.toggle('active');
    sidebar.classList.toggle('active');
}

// Toggle mobile menu
function toggleMenu() {
    const menu = document.querySelector('.nav-menu');
    menu.classList.toggle('active');
}

// Contact functions
function contactWhatsApp() {
    const message = cart.map(item => 
        `${item.name} (Talla: ${item.selectedSize}) - ${item.price.toLocaleString()}`
    ).join('\n');
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const fullMessage = `Hola! Me interesan estos productos:\n\n${message}\n\nTotal: ${total.toLocaleString()}`;
    window.open(`https://wa.me/56912345678?text=${encodeURIComponent(fullMessage)}`, '_blank');
}

function contactInstagram() {
    window.open('', '_blank');
}

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    
    setTimeout(() => {
        const title = document.querySelector('.section-title');
        const cards = document.querySelectorAll('.product-card');
        
        if (title) observer.observe(title);
        cards.forEach(card => observer.observe(card));
    }, 100);
});

