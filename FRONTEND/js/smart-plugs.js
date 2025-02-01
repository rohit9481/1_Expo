// Device Management
let devices = [
    {
        id: 'tv',
        name: 'Living Room TV',
        type: 'tv',
        power: 120,
        daily: 0.8,
        status: true
    }
    // Add more devices here
];

// Toggle device status
function toggleDevice(element, deviceId) {
    const device = devices.find(d => d.id === deviceId);
    if (device) {
        device.status = element.checked;
        // Add real-time update logic here
        updateDeviceCard(deviceId);
    }
}

// Show add device modal
function showAddDeviceModal() {
    document.getElementById('addDeviceModal').style.display = 'block';
}

// Close modal
function closeModal() {
    document.getElementById('addDeviceModal').style.display = 'none';
}

// Handle add device form submission
function handleAddDevice(event) {
    event.preventDefault();
    const form = event.target;
    const name = form.querySelector('input[type="text"]').value;
    const type = form.querySelector('select').value;
    
    // Add new device to the list
    const newDevice = {
        id: generateId(),
        name: name,
        type: type,
        power: 0,
        daily: 0,
        status: false
    };
    
    devices.push(newDevice);
    addDeviceToGrid(newDevice);
    closeModal();
    form.reset();
}

// Generate unique ID
function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// Add device card to grid
function addDeviceToGrid(device) {
    const deviceHtml = `
        <div class="device-card" id="device-${device.id}">
            <!-- Device card HTML -->
        </div>
    `;
    document.querySelector('.devices-grid').insertAdjacentHTML('beforeend', deviceHtml);
}

// Update device card
function updateDeviceCard(deviceId) {
    // Add real-time update logic here
}

// Show device details
function showDeviceDetails(deviceId) {
    // Add device details modal logic here
}

// Confirm delete device
function confirmDeleteDevice(deviceId) {
    if (confirm('Are you sure you want to remove this device?')) {
        devices = devices.filter(d => d.id !== deviceId);
        document.querySelector(`#device-${deviceId}`).remove();
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('addDeviceModal');
    if (event.target === modal) {
        closeModal();
    }
} 