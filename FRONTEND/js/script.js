// Hamburger menu functionality
document.querySelector('.hamburger').addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('active');
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add scroll effect to navbar
window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
        document.querySelector('.navbar').classList.add('scrolled');
    } else {
        document.querySelector('.navbar').classList.remove('scrolled');
    }
});

// Real-Time Consumption Chart
const ctxLive = document.getElementById('liveChart').getContext('2d');
const liveChart = new Chart(ctxLive, {
    type: 'line',
    data: {
        labels: ['6 AM', '12 PM', '6 PM', '12 AM'], // Example time labels
        datasets: [{
            label: 'Power Consumption (kWh)',
            data: [5, 10, 15, 12], // Reduced example data
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
            tension: 0.4 // Smooth the line
        }]
    },
    options: {
        responsive: true,
        animation: {
            duration: 1000, // Animation duration in milliseconds
            easing: 'easeInOutQuad' // Easing function for the animation
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Carbon Footprint Chart
const ctxCarbon = document.getElementById('carbonChart').getContext('2d');
const carbonChart = new Chart(ctxCarbon, {
    type: 'bar',
    data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], // Example week labels
        datasets: [{
            label: 'Carbon Footprint (g)',
            data: [30, 20, 15, 10], // Example data
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        animation: {
            duration: 1000, // Animation duration in milliseconds
            easing: 'easeInOutQuad' // Easing function for the animation
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});


// Monthly Consumption Chart
const ctxMonthly = document.getElementById('monthlyConsumptionChart').getContext('2d');
const monthlyConsumptionChart = new Chart(ctxMonthly, {
    type: 'bar',
    data: {
        labels: ['January', 'February', 'March', 'April'], // Example month labels
        datasets: [{
            label: 'Monthly Consumption (kWh)',
            data: [200, 300, 250, 400], // Example data
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        animation: {
            duration: 1000, // Animation duration in milliseconds
            easing: 'easeInOutQuad' // Easing function for the animation
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Usage Distribution Chart (Animated Pie Chart)
const ctxUsage = document.getElementById('usageChart').getContext('2d');
const usageChart = new Chart(ctxUsage, {
    type: 'pie',
    data: {
        labels: ['HVAC', 'Lighting', 'Appliances', 'Others'], // Example categories
        datasets: [{
            label: 'Usage Distribution',
            data: [25, 35, 20, 20], // Example data
            backgroundColor: [
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 99, 132, 0.2)'
            ],
            borderColor: [
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 99, 132, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        animation: {
            animateScale: true, // Enable scale animation
            animateRotate: true // Enable rotation animation
        }
    }
});

// Energy Consumption by Category Chart
const ctxCategory = document.getElementById('categoryChart').getContext('2d');
const categoryChart = new Chart(ctxCategory, {
    type: 'radar',
    data: {
        labels: ['HVAC', 'Lighting', 'Appliances', 'EV Charger'], // Example categories
        datasets: [{
            label: 'Energy Consumption by Category',
            data: [15, 25, 30, 20], // Example data
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        scales: {
            r: {
                beginAtZero: true
            }
        }
    }
}); 