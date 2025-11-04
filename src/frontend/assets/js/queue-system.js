// Cerner Queue Management System
const QueueSystem = {
    queue: JSON.parse(localStorage.getItem('cerner_queue')) || [],
    currentServing: null,
    nextTicket: parseInt(localStorage.getItem('next_ticket')) || 1,
    
    init() {
        this.loadQueue();
        this.updateDisplay();
    },
    
    generateTicket(patientName, priority = 'normal') {
        const ticket = {
            ticketNumber: this.nextTicket++,
            patientName: patientName,
            priority: priority,
            timestamp: new Date().toISOString(),
            status: 'waiting',
            estimatedWait: this.calculateWaitTime()
        };
        
        this.queue.push(ticket);
        this.sortQueue();
        this.saveQueue();
        this.updateDisplay();
        
        return ticket;
    },
    
    callNext() {
        if (this.queue.length > 0) {
            const nextPatient = this.queue.shift();
            this.currentServing = nextPatient;
            nextPatient.status = 'serving';
            nextPatient.servedAt = new Date().toISOString();
            
            this.saveQueue();
            this.updateDisplay();
            this.announcePatient(nextPatient);
            
            return nextPatient;
        }
        return null;
    },
    
    completeService() {
        if (this.currentServing) {
            this.currentServing.status = 'completed';
            this.currentServing.completedAt = new Date().toISOString();
            this.currentServing = null;
            this.updateDisplay();
        }
    },
    
    sortQueue() {
        const priorityOrder = { 'urgent': 3, 'high': 2, 'normal': 1 };
        this.queue.sort((a, b) => {
            if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            }
            return new Date(a.timestamp) - new Date(b.timestamp);
        });
    },
    
    calculateWaitTime() {
        const avgServiceTime = 5; // minutes
        return this.queue.length * avgServiceTime;
    },
    
    announcePatient(patient) {
        const announcement = `Now serving ticket number ${patient.ticketNumber}, ${patient.patientName}`;
        console.log(announcement);
        
        // Show announcement banner
        const banner = document.getElementById('announcement-banner');
        if (banner) {
            banner.innerHTML = `📢 ${announcement}`;
            banner.style.display = 'block';
            
            setTimeout(() => {
                banner.style.display = 'none';
            }, 10000);
        }
    },
    
    updateDisplay() {
        // Update queue status in sidebar
        const waitingCount = this.queue.length;
        const servingCount = this.currentServing ? 1 : 0;
        
        const waitingElement = document.getElementById('queue-waiting');
        const servingElement = document.getElementById('queue-serving');
        const nextTicketElement = document.getElementById('next-ticket');
        
        if (waitingElement) waitingElement.textContent = waitingCount;
        if (servingElement) servingElement.textContent = servingCount;
        if (nextTicketElement) nextTicketElement.textContent = this.nextTicket;
        
        // Update current serving display
        const currentServingDiv = document.getElementById('current-serving');
        if (currentServingDiv) {
            if (this.currentServing) {
                currentServingDiv.innerHTML = `🎫 Now Serving: ${this.currentServing.patientName} - Ticket #${this.currentServing.ticketNumber}`;
                currentServingDiv.style.display = 'block';
            } else {
                currentServingDiv.style.display = 'none';
            }
        }
    },
    
    getQueueStatus() {
        return {
            waiting: this.queue.length,
            serving: this.currentServing ? 1 : 0,
            nextTicket: this.nextTicket,
            averageWait: this.calculateWaitTime()
        };
    },
    
    saveQueue() {
        localStorage.setItem('cerner_queue', JSON.stringify(this.queue));
        localStorage.setItem('next_ticket', this.nextTicket.toString());
    },
    
    loadQueue() {
        this.queue = JSON.parse(localStorage.getItem('cerner_queue')) || [];
        this.nextTicket = parseInt(localStorage.getItem('next_ticket')) || 1;
    },
    
    clearQueue() {
        this.queue = [];
        this.currentServing = null;
        this.saveQueue();
        this.updateDisplay();
    }
};

// Initialize queue system
QueueSystem.init();