class AdvancedPharmacyPOS extends PharmacyPOS {
  constructor() {
    super();
    this.customers = [
      { id: 1, name: 'John Smith', phone: '555-0123', insurance: 'Blue Cross', discount: 10 },
      { id: 2, name: 'Mary Johnson', phone: '555-0456', insurance: 'Aetna', discount: 5 },
      { id: 3, name: 'Robert Brown', phone: '555-0789', insurance: 'Medicare', discount: 15 }
    ];
    this.currentCustomer = null;
    this.discountAmount = 0;
    this.discountType = 'amount';
    this.saleNumber = 1;
    this.initAdvanced();
  }

  initAdvanced() {
    this.bindAdvancedEvents();
    this.updateSaleNumber();
    this.addStockBadges();
  }

  bindAdvancedEvents() {
    // Customer management
    document.getElementById('customerBtn').addEventListener('click', () => this.showCustomerDialog());
    
    // Filters
    document.getElementById('categoryFilter').addEventListener('change', (e) => this.filterByCategory(e.target.value));
    document.getElementById('lowStockBtn').addEventListener('click', () => this.filterLowStock());
    document.getElementById('expiringSoonBtn').addEventListener('click', () => this.filterExpiringSoon());
    
    // Discount
    document.getElementById('applyDiscount').addEventListener('click', () => this.applyDiscount());
    
    // Advanced actions
    document.getElementById('retrieveSale').addEventListener('click', () => this.showRetrieveSaleDialog());
    document.getElementById('voidSale').addEventListener('click', () => this.voidCurrentSale());
    document.getElementById('emailReceipt').addEventListener('click', () => this.emailReceipt());
    document.getElementById('shiftBtn').addEventListener('click', () => this.endShift());
    document.getElementById('reportsBtn').addEventListener('click', () => this.showReports());
  }

  showCustomerDialog() {
    const customerList = this.customers.map(c => 
      `<div class="customer-option" onclick="pos.selectCustomer(${c.id})">
        <strong>${c.name}</strong><br>
        <small>${c.phone} - ${c.insurance}</small>
      </div>`
    ).join('');

    const dialog = `
      <div class="modal-overlay" onclick="this.remove()">
        <div class="modal-content" onclick="event.stopPropagation()">
          <h3>Select Customer</h3>
          <div class="customer-search">
            <input type="text" placeholder="Search customers..." onkeyup="pos.searchCustomers(this.value)">
          </div>
          <div class="customer-list" id="customerList">
            ${customerList}
          </div>
          <div class="modal-actions">
            <button onclick="pos.addNewCustomer()">Add New Customer</button>
            <button onclick="this.closest('.modal-overlay').remove()">Cancel</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', dialog);
  }

  selectCustomer(customerId) {
    this.currentCustomer = this.customers.find(c => c.id === customerId);
    this.updateCustomerDisplay();
    document.querySelector('.modal-overlay').remove();
  }

  updateCustomerDisplay() {
    const customerInfo = document.getElementById('customerInfo');
    if (this.currentCustomer) {
      customerInfo.innerHTML = `
        <h4>Customer: ${this.currentCustomer.name}</h4>
        <div class="customer-details">
          <p><strong>Phone:</strong> ${this.currentCustomer.phone}</p>
          <p><strong>Insurance:</strong> ${this.currentCustomer.insurance}</p>
          <p><strong>Discount:</strong> ${this.currentCustomer.discount}%</p>
        </div>
      `;
    } else {
      customerInfo.innerHTML = '<h4>Customer: Walk-in</h4>';
    }
  }

  filterByCategory(category) {
    if (!category) {
      this.renderProducts();
      return;
    }
    const filtered = this.products.filter(p => p.category === category);
    this.renderProducts(filtered);
  }

  filterLowStock() {
    const lowStock = this.products.filter(p => p.stock <= 10);
    this.renderProducts(lowStock);
    this.toggleFilterButton('lowStockBtn');
  }

  filterExpiringSoon() {
    // Mock expiring products
    const expiring = this.products.filter(p => p.id <= 3);
    this.renderProducts(expiring);
    this.toggleFilterButton('expiringSoonBtn');
  }

  toggleFilterButton(buttonId) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(buttonId).classList.add('active');
  }

  applyDiscount() {
    const amount = parseFloat(document.getElementById('discountAmount').value) || 0;
    const type = document.getElementById('discountType').value;
    
    if (amount <= 0) return;
    
    this.discountAmount = amount;
    this.discountType = type;
    
    document.getElementById('discountLine').style.display = 'flex';
    this.updateTotals();
  }

  updateTotals() {
    const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Calculate discount
    let discountValue = 0;
    if (this.discountAmount > 0) {
      discountValue = this.discountType === 'percent' 
        ? subtotal * (this.discountAmount / 100)
        : this.discountAmount;
    }
    
    // Customer discount
    let customerDiscount = 0;
    if (this.currentCustomer && this.currentCustomer.discount > 0) {
      customerDiscount = subtotal * (this.currentCustomer.discount / 100);
    }
    
    const discountedSubtotal = subtotal - discountValue - customerDiscount;
    const tax = discountedSubtotal * 0.08;
    const total = discountedSubtotal + tax;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('discount').textContent = `-$${(discountValue + customerDiscount).toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
  }

  addStockBadges() {
    // Add stock level badges to products
    this.products.forEach(product => {
      let badgeClass = 'high';
      if (product.stock <= 5) badgeClass = 'low';
      else if (product.stock <= 15) badgeClass = 'medium';
      
      product.stockBadge = `<span class="stock-badge ${badgeClass}">${product.stock}</span>`;
    });
  }

  renderProducts(filteredProducts = null) {
    const grid = document.getElementById('productGrid');
    const productsToShow = filteredProducts || this.products;
    
    grid.innerHTML = productsToShow.map(product => {
      let cardClass = 'product-card';
      if (product.stock <= 5) cardClass += ' low-stock';
      else if (product.id <= 3) cardClass += ' expiring-soon';
      
      return `
        <div class="${cardClass}" onclick="pos.addToCart(${product.id})">
          ${product.stockBadge || ''}
          <div class="product-name">${product.name}</div>
          <div class="product-price">$${product.price.toFixed(2)}</div>
          <div class="product-stock">Stock: ${product.stock}</div>
        </div>
      `;
    }).join('');
  }

  voidCurrentSale() {
    if (confirm('Are you sure you want to void this sale?')) {
      this.cart = [];
      this.currentCustomer = null;
      this.discountAmount = 0;
      this.renderCart();
      this.updateTotals();
      this.updateCustomerDisplay();
      this.nextSale();
    }
  }

  emailReceipt() {
    if (this.cart.length === 0) return;
    
    const email = prompt('Enter customer email:');
    if (email) {
      alert(`Receipt sent to ${email}`);
    }
  }

  endShift() {
    const sales = JSON.parse(localStorage.getItem('dailySales') || '[]');
    const total = sales.reduce((sum, sale) => sum + sale.total, 0);
    
    alert(`Shift ended. Total sales: $${total.toFixed(2)}`);
  }

  showReports() {
    const sales = JSON.parse(localStorage.getItem('dailySales') || '[]');
    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
    
    alert(`Daily Report:\nSales: ${totalSales}\nRevenue: $${totalRevenue.toFixed(2)}`);
  }

  updateSaleNumber() {
    document.getElementById('saleNumber').textContent = String(this.saleNumber).padStart(3, '0');
  }

  nextSale() {
    this.saleNumber++;
    this.updateSaleNumber();
  }

  completeSale() {
    super.completeSale();
    
    // Save to daily sales
    const sales = JSON.parse(localStorage.getItem('dailySales') || '[]');
    const total = parseFloat(document.getElementById('total').textContent.replace('$', ''));
    
    sales.push({
      id: this.saleNumber,
      items: [...this.cart],
      customer: this.currentCustomer,
      total,
      timestamp: new Date().toISOString()
    });
    
    localStorage.setItem('dailySales', JSON.stringify(sales));
    
    this.currentCustomer = null;
    this.discountAmount = 0;
    this.updateCustomerDisplay();
    this.nextSale();
  }
}

// Add modal styles
const modalStyles = `
<style>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.customer-option {
  padding: 1rem;
  border: 1px solid #ddd;
  margin: 0.5rem 0;
  border-radius: 4px;
  cursor: pointer;
}

.customer-option:hover {
  background: #f8f9fa;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.modal-actions button {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', modalStyles);

// Replace the basic POS with advanced version
const pos = new AdvancedPharmacyPOS();