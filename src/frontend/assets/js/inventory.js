// Cerner Inventory Management
const InventoryManager = {
    inventory: JSON.parse(localStorage.getItem('cerner_inventory')) || [],
    
    init() {
        if (this.inventory.length === 0) {
            this.inventory = [
                { drug: 'Metformin 500mg', stock: 250, reorderLevel: 50, expiry: '2025-12-31' },
                { drug: 'Lisinopril 10mg', stock: 180, reorderLevel: 30, expiry: '2025-08-15' },
                { drug: 'Atorvastatin 20mg', stock: 95, reorderLevel: 25, expiry: '2025-10-20' },
                { drug: 'Oxycodone 5mg', stock: 45, reorderLevel: 20, expiry: '2025-06-30' }
            ];
            this.saveInventory();
        }
    },
    
    checkStock(medication) {
        return this.inventory.find(item => item.drug === medication);
    },
    
    updateStock(medication, quantity) {
        const item = this.inventory.find(item => item.drug === medication);
        if (item) {
            item.stock -= quantity;
            this.saveInventory();
            if (item.stock <= item.reorderLevel) {
                this.triggerReorderAlert(medication);
            }
        }
    },
    
    triggerReorderAlert(medication) {
        console.log(`Reorder alert: ${medication} is below minimum stock level`);
    },
    
    saveInventory() {
        localStorage.setItem('cerner_inventory', JSON.stringify(this.inventory));
    }
};

InventoryManager.init();