// Shop functionality
class ShopManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.products = [];
        this.init();
    }

    async init() {
        await this.loadProducts();
        this.renderProducts();
        this.updateCartUI();
        this.bindEvents();
    }

    async loadProducts() {
        try {
            this.products = await window.medTechAPI.getProducts();
        } catch (error) {
            console.error('Failed to load products:', error);
            // Fallback products
            this.products = [
                { id: 1, name: 'Digital Stethoscope', price: 299.99, category: 'Equipment', image: '🩺' },
                { id: 2, name: 'Infrared Thermometer', price: 49.99, category: 'Equipment', image: '🌡️' },
                { id: 3, name: 'Pain Relief Tablets', price: 12.99, category: 'Medication', image: '💊' },
                { id: 4, name: 'Adhesive Bandages', price: 8.99, category: 'First Aid', image: '🩹' },
                { id: 5, name: 'Blood Pressure Monitor', price: 79.99, category: 'Diagnostics', image: '💉' },
                { id: 6, name: 'Hand Sanitizer', price: 6.99, category: 'Personal Care', image: '🧴' }
            ];
        }
    }

    renderProducts() {
        const grid = document.getElementById('products-grid');
        if (!grid) return;

        grid.innerHTML = this.products.map(product => `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image">${product.image || '📦'}</div>
                <div class="product-info">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-rating">
                        <span class="stars">★★★★★</span>
                        <span class="rating-count">(${Math.floor(Math.random() * 200) + 50} reviews)</span>
                    </div>
                    <div class="product-footer">
                        <span class="product-price">$${product.price}</span>
                        <button class="add-to-cart-btn" onclick="shopManager.addToCart(${product.id})">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({ ...product, quantity: 1 });
        }

        this.saveCart();
        this.updateCartUI();
        this.showNotification(`${product.name} added to cart!`);
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartUI();
    }

    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(0, quantity);
            if (item.quantity === 0) {
                this.removeFromCart(productId);
            } else {
                this.saveCart();
                this.updateCartUI();
            }
        }
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    updateCartUI() {
        const cartCount = document.getElementById('cart-count');
        const cartTotal = document.getElementById('cart-total');
        const cartItems = document.getElementById('cart-items');

        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        if (cartCount) cartCount.textContent = totalItems;
        if (cartTotal) cartTotal.textContent = `$${totalPrice.toFixed(2)}`;

        if (cartItems) {
            if (this.cart.length === 0) {
                cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            } else {
                cartItems.innerHTML = this.cart.map(item => `
                    <div class="cart-item">
                        <div class="item-image">${item.image || '📦'}</div>
                        <div class="item-details">
                            <h4>${item.name}</h4>
                            <p>$${item.price}</p>
                        </div>
                        <div class="item-controls">
                            <button onclick="shopManager.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                            <span>${item.quantity}</span>
                            <button onclick="shopManager.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        </div>
                        <button class="remove-btn" onclick="shopManager.removeFromCart(${item.id})">×</button>
                    </div>
                `).join('');
            }
        }
    }

    bindEvents() {
        // Cart toggle
        const cartToggle = document.getElementById('cart-toggle');
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartClose = document.getElementById('cart-close');

        if (cartToggle && cartSidebar) {
            cartToggle.addEventListener('click', () => {
                cartSidebar.classList.toggle('open');
            });
        }

        if (cartClose && cartSidebar) {
            cartClose.addEventListener('click', () => {
                cartSidebar.classList.remove('open');
            });
        }

        // Search
        const searchBtn = document.getElementById('search-btn');
        const searchInput = document.getElementById('search-input');

        if (searchBtn && searchInput) {
            searchBtn.addEventListener('click', () => this.searchProducts());
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.searchProducts();
            });
        }

        // Category filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.filterProducts(e.target.dataset.category);
            });
        });
    }

    searchProducts() {
        const query = document.getElementById('search-input')?.value.toLowerCase();
        if (!query) return this.renderProducts();

        const filtered = this.products.filter(product => 
            product.name.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        );

        this.renderFilteredProducts(filtered);
    }

    filterProducts(category) {
        if (category === 'all') return this.renderProducts();

        const filtered = this.products.filter(product => 
            product.category === category
        );

        this.renderFilteredProducts(filtered);
    }

    renderFilteredProducts(products) {
        const grid = document.getElementById('products-grid');
        if (!grid) return;

        if (products.length === 0) {
            grid.innerHTML = '<p class="no-products">No products found</p>';
            return;
        }

        grid.innerHTML = products.map(product => `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image">${product.image || '📦'}</div>
                <div class="product-info">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-rating">
                        <span class="stars">★★★★★</span>
                        <span class="rating-count">(${Math.floor(Math.random() * 200) + 50} reviews)</span>
                    </div>
                    <div class="product-footer">
                        <span class="product-price">$${product.price}</span>
                        <button class="add-to-cart-btn" onclick="shopManager.addToCart(${product.id})">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize shop when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.shopManager = new ShopManager();
});