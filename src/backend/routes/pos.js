const express = require('express');
const router = express.Router();

// Mock database
let products = [
  { id: 1, name: 'Aspirin 100mg', price: 12.99, category: 'Pain Relief', stock: 50, barcode: '123456789012' },
  { id: 2, name: 'Ibuprofen 200mg', price: 15.49, category: 'Pain Relief', stock: 30, barcode: '123456789013' },
  { id: 3, name: 'Paracetamol 500mg', price: 8.99, category: 'Pain Relief', stock: 75, barcode: '123456789014' },
  { id: 4, name: 'Vitamin D3', price: 22.99, category: 'Vitamins', stock: 25, barcode: '123456789015' },
  { id: 5, name: 'Multivitamin', price: 18.99, category: 'Vitamins', stock: 40, barcode: '123456789016' }
];

let sales = [];
let heldSales = [];

// GET /api/pos/products
router.get('/products', (req, res) => {
  const { search, category } = req.query;
  let filteredProducts = products;

  if (search) {
    filteredProducts = products.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.barcode.includes(search)
    );
  }

  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }

  res.json(filteredProducts);
});

// GET /api/pos/product/:barcode
router.get('/product/:barcode', (req, res) => {
  const product = products.find(p => p.barcode === req.params.barcode);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// POST /api/pos/sale
router.post('/sale', (req, res) => {
  try {
    const { items, paymentMethod, amountPaid, customerInfo } = req.body;
    
    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;
    
    // Validate payment
    if (paymentMethod === 'cash' && amountPaid < total) {
      return res.status(400).json({ error: 'Insufficient payment' });
    }
    
    // Update stock
    items.forEach(item => {
      const product = products.find(p => p.id === item.id);
      if (product) {
        product.stock -= item.quantity;
      }
    });
    
    // Create sale record
    const sale = {
      id: Date.now(),
      items,
      subtotal,
      tax,
      total,
      paymentMethod,
      amountPaid: paymentMethod === 'cash' ? amountPaid : total,
      change: paymentMethod === 'cash' ? amountPaid - total : 0,
      customerInfo,
      timestamp: new Date().toISOString()
    };
    
    sales.push(sale);
    
    res.json({
      success: true,
      sale,
      receipt: generateReceipt(sale)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process sale' });
  }
});

// POST /api/pos/hold-sale
router.post('/hold-sale', (req, res) => {
  const { items } = req.body;
  const heldSale = {
    id: Date.now(),
    items,
    timestamp: new Date().toISOString()
  };
  heldSales.push(heldSale);
  res.json({ success: true, heldSale });
});

// GET /api/pos/held-sales
router.get('/held-sales', (req, res) => {
  res.json(heldSales);
});

// POST /api/pos/retrieve-sale/:id
router.post('/retrieve-sale/:id', (req, res) => {
  const saleId = parseInt(req.params.id);
  const saleIndex = heldSales.findIndex(s => s.id === saleId);
  
  if (saleIndex === -1) {
    return res.status(404).json({ error: 'Held sale not found' });
  }
  
  const sale = heldSales[saleIndex];
  heldSales.splice(saleIndex, 1);
  
  res.json({ success: true, sale });
});

// GET /api/pos/sales
router.get('/sales', (req, res) => {
  const { date, limit = 50 } = req.query;
  let filteredSales = sales;
  
  if (date) {
    const targetDate = new Date(date).toDateString();
    filteredSales = sales.filter(s => 
      new Date(s.timestamp).toDateString() === targetDate
    );
  }
  
  res.json(filteredSales.slice(-limit));
});

// GET /api/pos/reports/daily
router.get('/reports/daily', (req, res) => {
  const today = new Date().toDateString();
  const todaySales = sales.filter(s => 
    new Date(s.timestamp).toDateString() === today
  );
  
  const totalSales = todaySales.length;
  const totalRevenue = todaySales.reduce((sum, sale) => sum + sale.total, 0);
  const averageSale = totalSales > 0 ? totalRevenue / totalSales : 0;
  
  res.json({
    date: today,
    totalSales,
    totalRevenue,
    averageSale,
    sales: todaySales
  });
});

function generateReceipt(sale) {
  return `
MEDTECHAI PHARMACY
==================
Date: ${new Date(sale.timestamp).toLocaleString()}
Sale ID: ${sale.id}

${sale.items.map(item => 
  `${item.name}\n${item.quantity} x $${item.price.toFixed(2)} = $${(item.quantity * item.price).toFixed(2)}`
).join('\n\n')}

------------------
Subtotal: $${sale.subtotal.toFixed(2)}
Tax (8%): $${sale.tax.toFixed(2)}
Total: $${sale.total.toFixed(2)}

Payment: ${sale.paymentMethod.toUpperCase()}
${sale.paymentMethod === 'cash' ? `Paid: $${sale.amountPaid.toFixed(2)}\nChange: $${sale.change.toFixed(2)}` : ''}

Thank you for your business!
  `.trim();
}

module.exports = router;