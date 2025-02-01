document.addEventListener('DOMContentLoaded', () => {
    initializeSettings();
});

function initializeSettings() {
    // Tab Navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked item
            item.classList.add('active');
            
            // Show corresponding panel
            const tabId = item.dataset.tab;
            showPanel(tabId);
        });
    });

    // Form Submission
    const settingsForms = document.querySelectorAll('.settings-form');
    settingsForms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });

    // Notification Toggles
    const notificationToggles = document.querySelectorAll('.notification-option input[type="checkbox"]');
    notificationToggles.forEach(toggle => {
        toggle.addEventListener('change', handleNotificationToggle);
    });

    // Profile Image Upload
    const changeAvatarBtn = document.querySelector('.change-avatar');
    if (changeAvatarBtn) {
        changeAvatarBtn.addEventListener('click', handleAvatarUpload);
    }
}

function showPanel(panelId) {
    // Hide all panels
    const panels = document.querySelectorAll('.settings-panel');
    panels.forEach(panel => panel.classList.remove('active'));
    
    // Show selected panel
    const selectedPanel = document.getElementById(panelId);
    if (selectedPanel) {
        selectedPanel.classList.add('active');
    }
}

function handleFormSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    // Show saving indicator
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Saving...';
    
    // Simulate API call
    setTimeout(() => {
        submitBtn.textContent = originalText;
        showNotification('Settings saved successfully!');
    }, 1000);
}

function handleNotificationToggle(event) {
    const setting = event.target.closest('.notification-option').querySelector('h4').textContent;
    const enabled = event.target.checked;
    
    // Simulate API call to save notification preferences
    console.log(`${setting} notifications ${enabled ? 'enabled' : 'disabled'}`);
    showNotification(`${setting} notifications ${enabled ? 'enabled' : 'disabled'}`);
}

function handleAvatarUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Simulate upload
            const reader = new FileReader();
            reader.onload = (e) => {
                document.querySelector('.profile-avatar img').src = e.target.result;
                showNotification('Profile picture updated successfully!');
            };
            reader.readAsDataURL(file);
        }
    };
    
    input.click();
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add these utility functions for the remaining panels
function initializeDeviceSettings() {
    // Device management logic
}

function initializePreferences() {
    // System preferences logic
}

function initializeBillingSettings() {
    // Billing information logic
}

function initializeSecuritySettings() {
    // Security settings logic
} 