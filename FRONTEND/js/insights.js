// Initialize Charts
document.addEventListener('DOMContentLoaded', () => {
    initializeMainChart();
    initializeDeviceChart();
    initializeAnomalyDetection();
});

// Main Energy Consumption Chart
function initializeMainChart() {
    const ctx = document.getElementById('mainChart').getContext('2d');
    const mainChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
            datasets: [{
                label: 'Energy Usage (kWh)',
                data: [4.2, 3.8, 3.2, 5.7, 6.8, 5.9, 7.2, 6.5],
                borderColor: '#2ecc71',
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(46, 204, 113, 0.1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Device Usage Breakdown Chart
function initializeDeviceChart() {
    const ctx = document.getElementById('deviceChart').getContext('2d');
    const deviceChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['AC', 'Refrigerator', 'Washing Machine', 'TV', 'Others'],
            datasets: [{
                data: [35, 25, 15, 15, 10],
                backgroundColor: [
                    '#2ecc71',
                    '#3498db',
                    '#e74c3c',
                    '#f1c40f',
                    '#95a5a6'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

// Time Filter Functionality
document.querySelectorAll('.time-filter button').forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        document.querySelectorAll('.time-filter button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Update charts based on selected time period
        updateCharts(button.dataset.period);
    });
});

// Update Charts based on Time Period
function updateCharts(period) {
    // Add logic to update charts based on selected time period
    console.log(`Updating charts for period: ${period}`);
}

// Anomaly Detection
function initializeAnomalyDetection() {
    const anomalies = [
        {
            device: 'AC',
            time: '2:30 PM',
            description: 'Unusual power spike detected',
            severity: 'high'
        },
        // Add more anomalies
    ];

    const timeline = document.querySelector('.anomaly-timeline');
    anomalies.forEach(anomaly => {
        const anomalyElement = createAnomalyElement(anomaly);
        timeline.appendChild(anomalyElement);
    });
}

// Create Anomaly Element
function createAnomalyElement(anomaly) {
    const div = document.createElement('div');
    div.className = `anomaly-item ${anomaly.severity}`;
    div.innerHTML = `
        <div class="anomaly-time">${anomaly.time}</div>
        <div class="anomaly-content">
            <h4>${anomaly.device}</h4>
            <p>${anomaly.description}</p>
        </div>
    `;
    return div;
}

// Apply Recommendation
function applyRecommendation(recommendationId) {
    // Add logic to apply recommendations
    console.log(`Applying recommendation: ${recommendationId}`);
} 