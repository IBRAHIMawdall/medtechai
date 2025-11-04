class PharmacyPOS {
  constructor() {
    this.cart = [];
    this.products = [
      { id: 1, name: 'Aspirin 100mg', price: 12.99, category: 'Pain Relief', stock: 50 },
      { id: 2, name: 'Ibuprofen 200mg', price: 15.49, category: 'Pain Relief', stock: 30 },
      { id: 3, name: 'Paracetamol 500mg', price: 8.99, category: 'Pain Relief', stock: 75 },
      { id: 4, name: 'Vitamin D3', price: 22.99, category: 'Vitamins', stock: 25 },
      { id: 5, name: 'Multivitamin', price: 18.99, category: 'Vitamins', stock: 40 },
      { id: 6, name: 'Cough Syrup', price: 14.99, category: 'Cold & Flu', stock: 20 },
      { id: 7, name: 'Throat Lozenges', price: 6.99, category: 'Cold & Flu', stock: 60 },
      { id: 8, name: 'Antacid Tablets', price: 9.99, category: 'Digestive', stock: 35 },
      { id: 9, name: 'Bandages', price: 4.99, category: 'First Aid', stock: 100 },
      { id: 10, name: 'Thermometer', price: 29.99, category: 'Medical Devices', stock: 15 }
    ];
    this.paymentMethod = null;
    this.init();
  }

  init() {
    this.renderProducts();
    this.updateTime();
    this.bindEvents();
    setInterval(() => this.updateTime(), 1000);
  }

  bindEvents() {
    // Product search
    document.getElementById('productSearch').addEventListener('input', (e) => {
      this.searchProducts(e.target.value);
    });

    // Payment method selection
    document.querySelectorAll('.payment-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.selectPaymentMethod(e.target.dataset.method);
      });
    });

    // Cart actions
    document.getElementById('clearCart').addEventListener('click', () => this.clearCart());
    document.getElementById('holdSale').addEventListener('click', () => this.holdSale());
    document.getElementById('printReceipt').addEventListener('click', () => this.printReceipt());
    document.getElementById('processPayment').addEventListener('click', () => this.processPayment());
  }

  renderProducts(filteredProducts = null) {
    const grid = document.getElementById('productGrid');
    const productsToShow = filteredProducts || this.products;
    
    grid.innerHTML = productsToShow.map(product => `
      <div class="product-card" onclick="pos.addToCart(${product.id})">
        <div class="product-name">${product.name}</div>
        <div class="product-price">$${product.price.toFixed(2)}</div>
        <div class="product-stock">Stock: ${product.stock}</div>
      </div>
    `).join('');
  }

  searchProducts(query) {
    if (!query) {
      this.renderProducts();
      return;
    }
    
    const filtered = this.products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    );
    this.renderProducts(filtered);
  }

  addToCart(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product || product.stock <= 0) return;

    const existingItem = this.cart.find(item => item.id === productId);
    
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        existingItem.quantity++;
      }
    } else {
      this.cart.push({
        ...product,
        quantity: 1
      });
    }
    
    this.renderCart();
    this.updateTotals();
  }

  removeFromCart(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.renderCart();
    this.updateTotals();
  }

  updateQuantity(productId, change) {
    const item = this.cart.find(item => item.id === productId);
    if (!item) return;

    const product = this.products.find(p => p.id === productId);
    const newQty = item.quantity + change;

    if (newQty <= 0) {
      this.removeFromCart(productId);
    } else if (newQty <= product.stock) {
      item.quantity = newQty;
      this.renderCart();
      this.updateTotals();
    }
  }

  renderCart() {
    const cartItems = document.getElementById('cartItems');
    
    if (this.cart.length === 0) {
      cartItems.innerHTML = '<div class="empty-cart">Cart is empty</div>';
      return;
    }

    cartItems.innerHTML = this.cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${item.price.toFixed(2)} each</div>
        </div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="pos.updateQuantity(${item.id}, -1)">-</button>
          <span>${item.quantity}</span>
          <button class="qty-btn" onclick="pos.updateQuantity(${item.id}, 1)">+</button>
          <button class="qty-btn" onclick="pos.removeFromCart(${item.id})" style="margin-left: 0.5rem; color: red;">×</button>
        </div>
      </div>
    `).join('');
  }

  updateTotals() {
    const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
  }

  selectPaymentMethod(method) {
    this.paymentMethod = method;
    
    // Update button states
    document.querySelectorAll('.payment-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-method="${method}"]`).classList.add('active');

    // Show payment input for cash
    const paymentInput = document.getElementById('paymentInput');
    if (method === 'cash') {
      paymentInput.style.display = 'flex';
      document.getElementById('amountPaid').focus();
    } else {
      paymentInput.style.display = 'none';
    }
  }

  processPayment() {
    if (!this.paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    if (this.cart.length === 0) {
      alert('Cart is empty');
      return;
    }

    const total = parseFloat(document.getElementById('total').textContent.replace('$', ''));
    
    if (this.paymentMethod === 'cash') {
      const amountPaid = parseFloat(document.getElementById('amountPaid').value);
      if (!amountPaid || amountPaid < total) {
        alert('Insufficient payment amount');
        return;
      }
      
      const change = amountPaid - total;
      if (change > 0) {
        alert(`Payment successful! Change: $${change.toFixed(2)}`);
      } else {
        alert('Payment successful!');
      }
    } else {
      alert(`Payment processed via ${this.paymentMethod}!`);
    }

    this.completeSale();
  }

  completeSale() {
    // Update stock
    this.cart.forEach(item => {
      const product = this.products.find(p => p.id === item.id);
      product.stock -= item.quantity;
    });

    // Clear cart and reset
    this.cart = [];
    this.paymentMethod = null;
    document.getElementById('amountPaid').value = '';
    document.getElementById('paymentInput').style.display = 'none';
    document.querySelectorAll('.payment-btn').forEach(btn => btn.classList.remove('active'));
    
    this.renderCart();
    this.renderProducts();
    this.updateTotals();
  }

  clearCart() {
    this.cart = [];
    this.renderCart();
    this.updateTotals();
  }

  holdSale() {
    if (this.cart.length === 0) return;
    
    const heldSales = JSON.parse(localStorage.getItem('heldSales') || '[]');
    heldSales.push({
      id: Date.now(),
      cart: [...this.cart],
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('heldSales', JSON.stringify(heldSales));
    
    this.clearCart();
    alert('Sale held successfully');
  }

  printReceipt() {
    if (this.cart.length === 0) return;

    const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    const receipt = `
      MEDTECHAI PHARMACY
      ==================
      Date: ${new Date().toLocaleString()}
      
      ${this.cart.map(item => 
        `${item.name}\n${item.quantity} x $${item.price.toFixed(2)} = $${(item.quantity * item.price).toFixed(2)}`
      ).join('\n\n')}
      
      ------------------
      Subtotal: $${subtotal.toFixed(2)}
      Tax (8%): $${tax.toFixed(2)}
      Total: $${total.toFixed(2)}
      
      Thank you for your business!
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`<pre>${receipt}</pre>`);
    printWindow.print();
  }

  updateTime() {
    document.getElementById('currentTime').textContent = new Date().toLocaleTimeString();
  }
}

// Initialize POS system
const pos = new PharmacyPOS();