document.addEventListener("DOMContentLoaded", function () {
    // 📌 Real-Time Consumption Chart
    const liveCtx = document.getElementById('liveChart').getContext('2d');
    const liveChart = new Chart(liveCtx, {
        type:'line',
        data: {
            labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
            datasets: [{
                label: 'Power Usage (kWh)',
                data: [4.2, 3.8, 3.2, 5.7, 6.8, 5.9, 7.2, 6.5],
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
                tension: 0.4,
                fill: true
            }]
        },
        
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // 📌 Carbon Footprint Pie Chart
    const carbonCtx = document.getElementById('carbonChart').getContext('2d');
    const carbonChart = new Chart(carbonCtx, {
        type: 'pie',
        data: {
            labels: ['HVAC', 'EV Charger', 'Lighting', 'Other'],
            datasets: [{
                data: [30, 25, 20, 25],  // Dummy values
                backgroundColor: ['#e74c3c', '#f1c40f', '#2ecc71', '#9b59b6']
            }]
        },
        options: {
            responsive: true
        }
    });

    // 📌 Monthly Consumption Bar Chart
    const monthlyCtx = document.getElementById('monthlyConsumptionChart').getContext('2d');
    const monthlyChart = new Chart(monthlyCtx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Monthly Energy Usage (kWh)',
                data: [420, 380, 390, 450, 470, 480, 500, 510, 530, 550, 600, 620],
                backgroundColor: '#f39c12'
            }]
        },
        options: {
            responsive: true
        }
    });

    // 📌 Usage Distribution Doughnut Chart
    const usageCtx = document.getElementById('usageChart').getContext('2d');
    const usageChart = new Chart(usageCtx, {
        type: 'doughnut',
        data: {
            labels: ['Heating', 'Cooling', 'Lighting', 'Appliances'],
            datasets: [{
                data: [40, 20, 25, 15], // Dummy values
                backgroundColor: ['#ff5733', '#33ff57', '#337aff', '#ff33a6']
            }]
        },
        options: {
            responsive: true
        }
    });
    

    // 📌 Energy Category Radar Chart
    const categoryCtx = document.getElementById('categoryChart').getContext('2d');
    const categoryChart = new Chart(categoryCtx, {
        type: 'radar',
        data: {
            labels: ['Heating', 'Cooling', 'Lighting', 'EV Charging', 'Miscellaneous'],
            datasets: [{
                label: 'Category Usage',
                data: [70, 50, 40, 80, 60], // Dummy values
                borderColor: '#8e44ad',
                backgroundColor: 'rgba(142, 68, 173, 0.2)'
            }]
        },
        options: {
            responsive: true
        }
    });
});
