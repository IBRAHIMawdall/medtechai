// Cerner PowerChart Pharmacy JavaScript
let prescriptions = JSON.parse(localStorage.getItem('cerner_prescriptions')) || [];
let queueSystem = JSON.parse(localStorage.getItem('cerner_queue')) || [];
let currentServing = null;
let nextTicketNumber = parseInt(localStorage.getItem('next_ticket')) || 1;

// Initialize system on load
document.addEventListener('DOMContentLoaded', function() {
    initializeSystem();
    updateDashboard();
    renderPrescriptionQueue();
    updateQueueDisplay();
});

function initializeSystem() {
    // Load sample data if empty
    if (prescriptions.length === 0) {
        prescriptions = [
            {
                id: 'RX001',
                patientName: 'Johnson, Mary',
                patientDOB: '1985-03-15',
                medication: 'Metformin 500mg',
                quantity: 30,
                daysSupply: 30,
                prescriber: 'Dr. Smith',
                status: 'pending',
                priority: 'normal',
                timestamp: new Date().toISOString(),
                interactions: []
            },
            {
                id: 'RX002',
                patientName: 'Davis, Robert',
                patientDOB: '1972-08-22',
                medication: 'Lisinopril 10mg',
                quantity: 30,
                daysSupply: 30,
                prescriber: 'Dr. Johnson',
                status: 'ready',
                priority: 'normal',
                timestamp: new Date().toISOString(),
                interactions: []
            },
            {
                id: 'RX003',
                patientName: 'Wilson, Sarah',
                patientDOB: '1990-12-05',
                medication: 'Oxycodone 5mg',
                quantity: 20,
                daysSupply: 10,
                prescriber: 'Dr. Brown',
                status: 'interaction',
                priority: 'high',
                timestamp: new Date().toISOString(),
                interactions: ['Potential respiratory depression with concurrent benzodiazepines']
            }
        ];
        savePrescriptions();
    }
}

function updateDashboard() {
    const pending = prescriptions.filter(p => p.status === 'pending').length;
    const ready = prescriptions.filter(p => p.status === 'ready').length;
    const interactions = prescriptions.filter(p => p.status === 'interaction').length;
    const total = prescriptions.length;

    document.getElementById('pending-count').textContent = pending;
    document.getElementById('ready-count').textContent = ready;
    document.getElementById('interaction-count').textContent = interactions;
    document.getElementById('total-count').textContent = total;

    document.getElementById('sidebar-pending').textContent = pending;
    document.getElementById('sidebar-ready').textContent = ready;
    document.getElementById('sidebar-interactions').textContent = interactions;
}

function renderPrescriptionQueue() {
    const queueDiv = document.getElementById('prescription-queue');
    
    if (prescriptions.length === 0) {
        queueDiv.innerHTML = '<p style="text-align: center; color: #718096; padding: 20px;">No prescriptions in queue</p>';
        return;
    }

    const sortedPrescriptions = prescriptions.sort((a, b) => {
        const priorityOrder = { 'high': 3, 'urgent': 2, 'normal': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    queueDiv.innerHTML = sortedPrescriptions.map(rx => {
        const statusColors = {
            'pending': '#f6ad55',
            'ready': '#68d391',
            'interaction': '#fc8181',
            'dispensed': '#90cdf4'
        };

        return `
            <div class="prescription-item priority-${rx.priority}" onclick="selectPrescription('${rx.id}')">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>${rx.patientName}</strong> - ${rx.medication}
                        <br>
                        <small style="color: #4a5568;">
                            Rx: ${rx.id} | Prescriber: ${rx.prescriber} | Qty: ${rx.quantity}
                        </small>
                        ${rx.interactions.length > 0 ? `<br><small style="color: #e53e3e;">⚠️ ${rx.interactions.length} interaction(s)</small>` : ''}
                    </div>
                    <div style="text-align: right;">
                        <span style="background: ${statusColors[rx.status]}; color: white; padding: 4px 8px; border-radius: 12px; font-size: 0.8em; text-transform: uppercase;">
                            ${rx.status}
                        </span>
                        <br>
                        <small style="color: #718096; margin-top: 5px; display: block;">
                            ${new Date(rx.timestamp).toLocaleTimeString()}
                        </small>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function selectPrescription(rxId) {
    const prescription = prescriptions.find(p => p.id === rxId);
    if (prescription) {
        // Highlight selected prescription
        document.querySelectorAll('.prescription-item').forEach(item => {
            item.style.background = '#f7fafc';
        });
        event.target.closest('.prescription-item').style.background = '#bee3f8';
        
        // Show prescription details (could open a modal)
        showPrescriptionDetails(prescription);
    }
}

function showPrescriptionDetails(prescription) {
    alert(`Prescription Details:\n\nPatient: ${prescription.patientName}\nMedication: ${prescription.medication}\nStatus: ${prescription.status}\nPrescriber: ${prescription.prescriber}`);
}

function showNewRxModal() {
    document.getElementById('prescription-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('prescription-modal').style.display = 'none';
}

function addPrescription(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const newRx = {
        id: 'RX' + String(prescriptions.length + 1).padStart(3, '0'),
        patientName: formData.get('patientName'),
        patientDOB: formData.get('patientDOB'),
        medication: formData.get('medication'),
        quantity: parseInt(formData.get('quantity')),
        daysSupply: parseInt(formData.get('daysSupply')),
        prescriber: formData.get('prescriber'),
        status: 'pending',
        priority: 'normal',
        timestamp: new Date().toISOString(),
        interactions: []
    };

    prescriptions.push(newRx);
    savePrescriptions();
    updateDashboard();
    renderPrescriptionQueue();
    closeModal();
    event.target.reset();
    
    showAnnouncement(`New prescription ${newRx.id} added to queue`);
}

function checkInteractions() {
    document.getElementById('interaction-modal').style.display = 'block';
    
    // Sample interaction check
    const patientName = 'Johnson, Mary';
    const rxNumber = 'RX001';
    const medications = ['Metformin 500mg', 'Lisinopril 10mg', 'Aspirin 81mg'];
    
    document.getElementById('checker-patient-name').value = patientName;
    document.getElementById('checker-rx-number').value = rxNumber;
    
    const drugListDiv = document.getElementById('checker-drug-list');
    drugListDiv.innerHTML = medications.map(med => 
        `<div style="background: white; padding: 8px; margin: 4px 0; border-radius: 4px; border: 1px solid #e2e8f0;">${med}</div>`
    ).join('');
    
    // Simulate interaction results
    const resultsDiv = document.getElementById('interaction-results');
    resultsDiv.innerHTML = `
        <h4 style="color: #e53e3e; margin-bottom: 10px;">⚠️ Interaction Alert</h4>
        <p><strong>Moderate Interaction:</strong> Metformin + Lisinopril</p>
        <p style="font-size: 0.9em; color: #4a5568;">Monitor blood glucose levels closely. ACE inhibitors may enhance hypoglycemic effect of antidiabetic agents.</p>
        <p style="margin-top: 10px;"><strong>Recommendation:</strong> Monitor patient closely and adjust dosing as needed.</p>
    `;
}

function closeInteractionChecker() {
    document.getElementById('interaction-modal').style.display = 'none';
}

function showDataManager() {
    document.getElementById('data-modal').style.display = 'block';
    
    // Update storage stats
    const totalRecords = prescriptions.length + queueSystem.length;
    const dataSize = Math.round((JSON.stringify(prescriptions).length + JSON.stringify(queueSystem).length) / 1024);
    
    document.getElementById('total-records').textContent = totalRecords;
    document.getElementById('data-size').textContent = dataSize + ' KB';
}

function closeDataModal() {
    document.getElementById('data-modal').style.display = 'none';
}

function exportData() {
    const data = {
        prescriptions: prescriptions,
        queueSystem: queueSystem,
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cerner-pharmacy-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showAnnouncement('Data exported successfully');
}

function importData(input) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                if (data.prescriptions) {
                    prescriptions = data.prescriptions;
                    savePrescriptions();
                }
                if (data.queueSystem) {
                    queueSystem = data.queueSystem;
                    saveQueue();
                }
                updateDashboard();
                renderPrescriptionQueue();
                updateQueueDisplay();
                showAnnouncement('Data imported successfully');
            } catch (error) {
                alert('Error importing data: Invalid file format');
            }
        };
        reader.readAsText(file);
    }
}

function generateSample() {
    const sampleData = [
        {
            id: 'RX' + String(prescriptions.length + 1).padStart(3, '0'),
            patientName: 'Anderson, James',
            patientDOB: '1965-07-10',
            medication: 'Atorvastatin 20mg',
            quantity: 30,
            daysSupply: 30,
            prescriber: 'Dr. Wilson',
            status: 'pending',
            priority: 'normal',
            timestamp: new Date().toISOString(),
            interactions: []
        }
    ];
    
    prescriptions.push(...sampleData);
    savePrescriptions();
    updateDashboard();
    renderPrescriptionQueue();
    showAnnouncement('Sample data generated');
}

function clearData() {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
        prescriptions = [];
        queueSystem = [];
        nextTicketNumber = 1;
        localStorage.removeItem('cerner_prescriptions');
        localStorage.removeItem('cerner_queue');
        localStorage.removeItem('next_ticket');
        updateDashboard();
        renderPrescriptionQueue();
        updateQueueDisplay();
        showAnnouncement('All data cleared');
    }
}

function showQueueManager() {
    document.getElementById('queue-modal').style.display = 'block';
    renderQueueList();
}

function closeQueueModal() {
    document.getElementById('queue-modal').style.display = 'none';
}

function callNextPatient() {
    if (queueSystem.length > 0) {
        const nextPatient = queueSystem.shift();
        currentServing = nextPatient;
        saveQueue();
        updateQueueDisplay();
        renderQueueList();
        showCurrentServing(nextPatient);
        showAnnouncement(`Now serving: ${nextPatient.name} - Ticket #${nextPatient.ticketNumber}`);
    } else {
        alert('No patients in queue');
    }
}

function generateManualTicket() {
    const name = prompt('Enter patient name:');
    if (name) {
        const ticket = {
            ticketNumber: nextTicketNumber++,
            name: name,
            timestamp: new Date().toISOString(),
            status: 'waiting'
        };
        queueSystem.push(ticket);
        localStorage.setItem('next_ticket', nextTicketNumber);
        saveQueue();
        updateQueueDisplay();
        renderQueueList();
        showAnnouncement(`Ticket #${ticket.ticketNumber} generated for ${name}`);
    }
}

function renderQueueList() {
    const queueListDiv = document.getElementById('queue-list');
    
    if (queueSystem.length === 0) {
        queueListDiv.innerHTML = '<p style="text-align: center; color: #718096; padding: 20px;">No patients in queue</p>';
        return;
    }
    
    queueListDiv.innerHTML = queueSystem.map((patient, index) => `
        <div class="queue-item ${index === 0 ? 'serving' : ''}">
            <div>
                <strong>Ticket #${patient.ticketNumber}</strong> - ${patient.name}
                <br>
                <small>${new Date(patient.timestamp).toLocaleTimeString()}</small>
            </div>
            <div>
                <span style="background: ${index === 0 ? '#38a169' : '#3182ce'}; color: white; padding: 4px 8px; border-radius: 12px; font-size: 0.8em;">
                    ${index === 0 ? 'Next' : 'Waiting'}
                </span>
            </div>
        </div>
    `).join('');
}

function updateQueueDisplay() {
    const waiting = queueSystem.length;
    const serving = currentServing ? 1 : 0;
    
    document.getElementById('queue-waiting').textContent = waiting;
    document.getElementById('queue-serving').textContent = serving;
    document.getElementById('next-ticket').textContent = nextTicketNumber;
}

function showCurrentServing(patient) {
    const servingDiv = document.getElementById('current-serving');
    if (patient) {
        servingDiv.innerHTML = `🎫 Now Serving: ${patient.name} - Ticket #${patient.ticketNumber}`;
        servingDiv.style.display = 'block';
    } else {
        servingDiv.style.display = 'none';
    }
}

function showAnnouncement(message) {
    const banner = document.getElementById('announcement-banner');
    banner.innerHTML = `📢 ${message}`;
    banner.style.display = 'block';
    
    setTimeout(() => {
        banner.style.display = 'none';
    }, 5000);
}

function savePrescriptions() {
    localStorage.setItem('cerner_prescriptions', JSON.stringify(prescriptions));
}

function saveQueue() {
    localStorage.setItem('cerner_queue', JSON.stringify(queueSystem));
}

// Search functionality
document.getElementById('search-prescription').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const items = document.querySelectorAll('.prescription-item');
    
    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
});

// Auto-refresh dashboard every 30 seconds
setInterval(() => {
    updateDashboard();
    renderPrescriptionQueue();
    updateQueueDisplay();
}, 30000);