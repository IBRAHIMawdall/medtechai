// MedTechAI Shop JavaScript

class ShopApp {
  constructor() {
    this.products = [];
    this.cart = [];
    this.currentPage = 1;
    this.currentCategory = 'all';
    this.currentSort = 'created_at DESC';
    this.apiBase = '/api/shop';
    
    this.init();
  }

  async init() {
    this.loadCart();
    await this.loadProducts();
    this.attachEvents();
  }

  attachEvents() {
    // Cart toggle
    document.getElementById('cart-toggle').addEventListener('click', () => {
      document.getElementById('cart-sidebar').classList.toggle('active');
    });
    
    document.getElementById('cart-close').addEventListener('click', () => {
      document.getElementById('cart-sidebar').classList.remove('active');
    });

    // Search
    document.getElementById('search-btn').addEventListener('click', () => this.handleSearch());
    document.getElementById('search-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleSearch();
    });

    // Category filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentCategory = btn.dataset.category;
        this.loadProducts();
      });
    });

    // Sort
    document.getElementById('sort-select').addEventListener('change', (e) => {
      this.currentSort = e.target.value;
      this.loadProducts();
    });

    // Checkout
    document.getElementById('checkout-btn').addEventListener('click', () => this.handleCheckout());

    // Modal close
    document.getElementById('modal-close').addEventListener('click', () => {
      document.getElementById('product-modal').style.display = 'none';
    });
  }

  async loadProducts() {
    try {
      document.getElementById('loading').style.display = 'block';
      
      const params = new URLSearchParams({
        page: this.currentPage,
        limit: 24,
        sort: this.currentSort
      });
      
      if (this.currentCategory !== 'all') {
        params.append('category', this.currentCategory);
      }
      
      const response = await fetch(`${this.apiBase}/products?${params}`);
      const data = await response.json();
      
      this.products = data.products || [];
      
      // Load featured
      const featuredResponse = await fetch(`${this.apiBase}/featured`);
      const featuredData = await featuredResponse.json();
      
      this.renderFeaturedProducts(featuredData);
      this.renderProducts(data.products);
      this.renderPagination(data.pagination);
      
      document.getElementById('loading').style.display = 'none';
    } catch (error) {
      console.error('Error loading products:', error);
      document.getElementById('loading').innerHTML = 'Error loading products. Please try again.';
    }
  }

  renderFeaturedProducts(products) {
    const container = document.getElementById('featured-products');
    container.innerHTML = '';
    
    products.slice(0, 6).forEach(product => {
      container.appendChild(this.createProductCard(product));
    });
  }

  renderProducts(products) {
    const container = document.getElementById('products-grid');
    container.innerHTML = '';
    
    if (products.length === 0) {
      container.innerHTML = '<p style="text-align:center;padding:2rem;">No products found</p>';
      return;
    }
    
    products.forEach(product => {
      container.appendChild(this.createProductCard(product));
    });
  }

  createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.onclick = () => this.showProductDetail(product);
    
    const currentPrice = product.sale_price || product.base_price;
    const originalPrice = product.sale_price ? product.base_price : null;
    
    let badges = '';
    if (product.is_featured) badges += '<span class="badge badge-featured">Featured</span>';
    if (product.is_new) badges += '<span class="badge badge-new">New</span>';
    if (product.sale_price) badges += '<span class="badge badge-sale">Sale</span>';
    if (product.is_hsa_eligible) badges += '<span class="badge badge-hsa">HSA Eligible</span>';
    
    card.innerHTML = `
      <div class="product-image">
        ${product.name.charAt(0)}${product.category.charAt(0)}
        ${badges ? `<div class="product-badges">${badges}</div>` : ''}
      </div>
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <div class="product-name">${product.name}</div>
        <div class="product-description">${product.description || product.short_description || ''}</div>
        <div class="product-rating">
          <span class="stars">${this.generateStars(product.avg_rating || 0)}</span>
          <span class="rating-text">(${product.review_count || 0} reviews)</span>
        </div>
        <div class="product-price">
          <span class="price-current">$${currentPrice.toFixed(2)}</span>
          ${originalPrice ? `<span class="price-original">$${originalPrice.toFixed(2)}</span>` : ''}
        </div>
        <div class="product-actions">
          <button class="btn-add-cart" onclick="event.stopPropagation(); shopApp.addToCart('${product.id}')">
            Add to Cart
          </button>
          <button class="btn-wishlist" onclick="event.stopPropagation(); shopApp.toggleWishlist('${product.id}')">
            ❤️
          </button>
        </div>
      </div>
    `;
    
    return card;
  }

  generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '★'.repeat(fullStars);
    if (hasHalfStar) stars += '☆';
    stars += '☆'.repeat(5 - fullStars - (hasHalfStar ? 1 : 0));
    return stars;
  }

  renderPagination(pagination) {
    const container = document.getElementById('pagination');
    if (pagination.totalPages <= 1) {
      container.innerHTML = '';
      return;
    }
    
    let html = '';
    for (let i = 1; i <= pagination.totalPages; i++) {
      html += `<button class="page-btn ${i === pagination.page ? 'active' : ''}" onclick="shopApp.goToPage(${i})">${i}</button>`;
    }
    container.innerHTML = html;
  }

  goToPage(page) {
    this.currentPage = page;
    this.loadProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async addToCart(productId) {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Please login to add items to cart');
        window.location.href = '/auth/login';
        return;
      }
      
      const response = await fetch(`${this.apiBase}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ product_id: productId, quantity: 1 })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add to cart');
      }
      
      await this.loadCart();
      this.showNotification('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert(error.message || 'Failed to add to cart');
    }
  }

  async loadCart() {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;
      
      const response = await fetch(`${this.apiBase}/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        this.cart = await response.json();
        this.renderCart();
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  }

  renderCart() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    const countEl = document.getElementById('cart-count');
    
    countEl.textContent = this.cart.length;
    
    if (this.cart.length === 0) {
      container.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
      totalEl.textContent = '$0.00';
      return;
    }
    
    let total = 0;
    let html = '';
    
    this.cart.forEach(item => {
      const price = item.sale_price || item.base_price;
      const subtotal = price * item.quantity;
      total += subtotal;
      
      html += `
        <div class="cart-item">
          <div class="cart-item-image">${item.name.charAt(0)}</div>
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">$${price.toFixed(2)}</div>
            <div class="cart-item-quantity">
              <button class="quantity-btn" onclick="shopApp.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
              <span>${item.quantity}</span>
              <button class="quantity-btn" onclick="shopApp.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
            </div>
          </div>
          <button class="cart-item-remove" onclick="shopApp.removeFromCart('${item.id}')">✕</button>
        </div>
      `;
    });
    
    container.innerHTML = html;
    totalEl.textContent = `$${total.toFixed(2)}`;
  }

  async updateQuantity(itemId, newQuantity) {
    if (newQuantity < 1) {
      this.removeFromCart(itemId);
      return;
    }
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${this.apiBase}/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity: newQuantity })
      });
      
      if (response.ok) {
        await this.loadCart();
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  }

  async removeFromCart(itemId) {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${this.apiBase}/cart/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        await this.loadCart();
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  }

  handleSearch() {
    const query = document.getElementById('search-input').value;
    if (query) {
      window.location.href = `/shop/search.html?q=${encodeURIComponent(query)}`;
    }
  }

  async handleCheckout() {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Please login to checkout');
      window.location.href = '/auth/login';
      return;
    }
    
    if (this.cart.length === 0) {
      alert('Your cart is empty');
      return;
    }
    
    window.location.href = '/shop/checkout.html';
  }

  async showProductDetail(product) {
    const modal = document.getElementById('product-modal');
    modal.style.display = 'block';
    
    const container = document.getElementById('modal-body');
    const currentPrice = product.sale_price || product.base_price;
    
    container.innerHTML = `
      <h2>${product.name}</h2>
      <p class="product-category">${product.category}</p>
      <div class="product-price" style="margin:1rem 0;">
        <span class="price-current">$${currentPrice.toFixed(2)}</span>
        ${product.sale_price ? `<span class="price-original">$${product.base_price.toFixed(2)}</span>` : ''}
      </div>
      <p><strong>Description:</strong> ${product.description || product.short_description}</p>
      <div class="product-actions" style="margin-top:2rem;">
        <button class="btn-add-cart" onclick="shopApp.addToCart('${product.id}')">
          Add to Cart
        </button>
      </div>
    `;
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#667eea;color:white;padding:1rem 2rem;border-radius:8px;z-index:9999;';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
  }
}

// Initialize shop when DOM is ready
let shopApp;
document.addEventListener('DOMContentLoaded', () => {
  shopApp = new ShopApp();
});

