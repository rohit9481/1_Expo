document.addEventListener("DOMContentLoaded", () => {
  console.log("Page fully loaded. Initializing charts and setting up event listeners...");

  initializeMainChart();
  initializeDeviceChart();
  initializeAnomalyDetection();

  // Set up event listeners for time filter buttons
  setupTimeFilterButtons();
});

function setupTimeFilterButtons() {
  console.log("Setting up event listeners for time filter buttons...");

  // Select all buttons inside the .time-filter class
  const buttons = document.querySelectorAll(".time-filter button");

  if (buttons.length === 0) {
    console.error("No buttons found! Check your HTML structure.");
  } else {
    console.log(`Found ${buttons.length} buttons.`);
  }

  buttons.forEach((button) => {
    console.log(`Attaching event listener to button: ${button.dataset.period}`);

    button.addEventListener("click", function () {
      console.log(`Button clicked: ${this.dataset.period}`);

      // Remove active class from all buttons
      buttons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to the clicked button
      this.classList.add("active");

      // Update the charts and summary
      updateChartsAndSummary(this.dataset.period);
    });
  });
}

function updateChartsAndSummary(period) {
  console.log(`Updating charts and summary for period: ${period}`);

  // Example: Fetch new data based on the selected period
  fetch(`/api/get-data?period=${period}`)
    .then((response) => response.json())
    .then((data) => {
      console.log("Data received from API:", data);
      updateMainChart(data);
      updateDeviceChart(data);
      updateAnomalyDetection(data);
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function initializeMainChart() {
  console.log("Initializing Main Chart...");
  // Your main chart initialization logic here
}

function initializeDeviceChart() {
  console.log("Initializing Device Chart...");
  // Your device chart initialization logic here
}

function initializeAnomalyDetection() {
  console.log("Initializing Anomaly Detection...");
  // Your anomaly detection logic here
}

function updateMainChart(data) {
  console.log("Updating Main Chart with new data...");
  // Logic to update the main chart
}

function updateDeviceChart(data) {
  console.log("Updating Device Chart with new data...");
  // Logic to update the device chart
}

function updateAnomalyDetection(data) {
  console.log("Updating Anomaly Detection Chart with new data...");
  // Logic to update the anomaly detection chart
}
