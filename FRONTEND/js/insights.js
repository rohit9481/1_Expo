document.addEventListener("DOMContentLoaded", () => {
  console.log("Page fully loaded. Initializing charts and setting up event listeners...");

  initializeMainChart();
  initializeDeviceChart();
  initializeAnomalyDetection();

  // Set up event listeners for time filter buttons
  setupTimeFilterButtons();

  // Set up event listener for Generate Report button
  setupReportButton();
});

let mainChart, deviceChart, anomalyChart;

const data = {
  day: {
    time: ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00"],
    energyUsage: [10, 15, 12, 14, 9, 8, 18, 22, 30, 25, 20, 15],
    devices: ["AC", "Fridge", "Washing Machine", "TV"],
    deviceUsage: [100, 50, 30, 70],
    anomalies: [
      { time: "01:00", value: 50 },
      { time: "08:00", value: 80 },
    ],
  },
  week: {
    time: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    energyUsage: [120, 110, 125, 130, 115, 140, 135],
    devices: ["AC", "Fridge", "Washing Machine", "TV"],
    deviceUsage: [350, 250, 120, 280],
    anomalies: [
      { time: "Wednesday", value: 50 },
      { time: "Friday", value: 70 },
    ],
  },
  month: {
    time: ["Week 1", "Week 2", "Week 3", "Week 4"],
    energyUsage: [500, 550, 600, 580],
    devices: ["AC", "Fridge", "Washing Machine", "TV"],
    deviceUsage: [1200, 900, 450, 1100],
    anomalies: [
      { time: "Week 2", value: 100 },
      { time: "Week 4", value: 90 },
    ],
  },
  year: {
    time: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    energyUsage: [1200, 1300, 1250, 1400, 1350, 1250, 1500, 1600, 1450, 1400, 1300, 1200],
    devices: ["AC", "Fridge", "Washing Machine", "TV"],
    deviceUsage: [4000, 3000, 1500, 3500],
    anomalies: [
      { time: "March", value: 200 },
      { time: "August", value: 150 },
    ],
  },
};

async function fetchSummaryFromDeepSeek() {
  const apiUrl = "https://cors-anywhere.herokuapp.com/https://api.openrouter.ai/v1/deepseek-r1/summary"; // Use the correct API endpoint

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://yourdomain.com", // Use your domain if required
        "X-Requested-With": "XMLHttpRequest", // Some APIs need this
        Authorization: "Bearer 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", // Add your OpenRouter API Key here
      },
      body: JSON.stringify({
        model: "deepseek-r1",
        prompt: `Summarize the following graph data: ${summaryText}`,
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    // Log the API response for debugging purposes
    console.log("API Response:", data);

    // Check if the response contains 'choices' and is not empty
    if (data.choices && data.choices.length > 0) {
      const summaryText = data.choices[0].text; // Extract the summary text from the response

      // Display the summary in the report
      document.getElementById("reportSummary").innerHTML = `<p>${summaryText}</p>`;
      console.log("Summary:", summaryText);
    } else {
      console.error("Error: No summary text available in the response");
    }
  } catch (error) {
    console.error("Error fetching summary:", error);
  }
}

function setupReportButton() {
  const reportButtons = document.querySelectorAll(".generate-report-btn");
  reportButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const parentElement = button.closest(".chart-container, .usage-breakdown");

      if (parentElement && parentElement.classList.contains("chart-container")) {
        generateReport();
      } else if (parentElement && parentElement.classList.contains("usage-breakdown")) {
        generateDeviceReport();
      } else {
        console.log("No specific report function assigned.");
      }
    });
  });
}

async function generateReport() {
  const activePeriod = document.querySelector(".time-filter .active").dataset.period;
  const periodData = data[activePeriod];

  // Prepare the report content
  const totalUsage = periodData.energyUsage.reduce((a, b) => a + b);
  const estimatedCost = (totalUsage * 0.2).toFixed(2);
  const carbonFootprint = (totalUsage * 0.5).toFixed(0);

  const reportSummary = `
    <h3>Report Summary for ${activePeriod}</h3>
    <p><strong>Total Energy Usage:</strong> ${totalUsage} kWh</p>
    <p><strong>Estimated Cost:</strong> $${estimatedCost}</p>
    <p><strong>Carbon Footprint:</strong> ${carbonFootprint} kg</p>
  `;

  const reportInterpretation = `
    <h3>Interpretation</h3>
    <p>This report provides insights into your energy consumption for the selected period. Consider optimizing usage during peak hours to reduce costs and environmental impact.</p>
  `;

  // Fetch summary from OpenAI
  const summaryText = `
    The total energy usage for ${activePeriod} is ${totalUsage} kWh. The estimated cost is $${estimatedCost}, and the carbon footprint is ${carbonFootprint} kg.
    Consider ways to optimize energy usage to reduce costs and environmental impact.
  `;

  const aiSummary = await fetchSummaryFromDeepSeek(summaryText);

  // Show the report modal
  document.getElementById("reportSummary").innerHTML = reportSummary + `<p><strong>AI Summary:</strong> ${aiSummary}</p>`;
  document.getElementById("reportInterpretation").innerHTML = reportInterpretation;
  document.getElementById("reportModal").style.display = "flex";
}

// New function to generate the report for device usage
async function generateDeviceReport() {
  const activePeriod = document.querySelector(".time-filter .active").dataset.period;
  const periodData = data[activePeriod];

  // Prepare the report content for device usage
  let deviceReportContent = `<h3>Device Usage Report for ${activePeriod}</h3>`;
  periodData.devices.forEach((device, index) => {
    const usage = periodData.deviceUsage[index];
    const estimatedCost = (usage * 0.2).toFixed(2); // Assuming cost per device unit is same
    const carbonFootprint = (usage * 0.5).toFixed(0); // Assuming carbon per device unit is same

    deviceReportContent += `
      <p><strong>${device}:</strong></p>
      <ul>
        <li><strong>Energy Usage:</strong> ${usage} kWh</li>
        <li><strong>Estimated Cost:</strong> $${estimatedCost}</li>
        <li><strong>Carbon Footprint:</strong> ${carbonFootprint} kg</li>
      </ul>
    `;
  });

  // Prepare the summary for OpenAI
  const deviceSummaryText = `
    The device usage for ${activePeriod} includes the following:
    ${periodData.devices
      .map((device, index) => {
        return `${device}: ${periodData.deviceUsage[index]} kWh. Estimated cost: $${(periodData.deviceUsage[index] * 0.2).toFixed(2)}. Carbon footprint: ${(periodData.deviceUsage[index] * 0.5).toFixed(0)} kg.`;
      })
      .join(" ")}
    Consider optimizing high-energy devices to reduce costs and environmental impact.
  `;

  const aiDeviceSummary = await fetchSummaryFromDeepSeek(deviceSummaryText);

  // Show the report modal with device-specific information
  document.getElementById("reportSummary").innerHTML = deviceReportContent + `<p><strong>AI Summary:</strong> ${aiDeviceSummary}</p>`;
  document.getElementById("reportInterpretation").innerHTML = `
    <h3>Interpretation</h3>
    <p>This report provides insights into your energy usage per device for the selected period. Consider optimizing high-energy devices to reduce costs and environmental impact.</p>
  `;
  document.getElementById("reportModal").style.display = "flex";
}

// Close the modal
document.getElementById("closeModalBtn").addEventListener("click", () => {
  document.getElementById("reportModal").style.display = "none";
});

function initializeAnomalyDetection() {
  console.log("Initializing Anomaly Detection...");

  const anomalyCanvas = document.getElementById("anomalyChart");
  if (!anomalyCanvas) {
    console.error("Anomaly chart canvas not found!");
    return;
  }

  const ctx = anomalyCanvas.getContext("2d");
  anomalyChart = new Chart(ctx, {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "Anomalies",
          data: [], // Initial data, will be updated later
          backgroundColor: "red",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: "Time" } },
        y: { title: { display: true, text: "Deviation (Wh)" } },
      },
    },
  });
}

function initializeMainChart() {
  console.log("Initializing Main Chart...");
  const ctx = document.getElementById("mainChart").getContext("2d");
  mainChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Energy Usage (Wh)",
          data: [],
          borderColor: "blue",
          backgroundColor: "rgba(0, 0, 255, 0.1)",
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: "Time" } },
        y: { title: { display: true, text: "Wh" } },
      },
    },
  });
}

function initializeDeviceChart() {
  console.log("Initializing Device Chart...");
  const ctx = document.getElementById("deviceChart").getContext("2d");
  deviceChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: [],
      datasets: [
        {
          label: "Device Energy Consumption",
          data: [],
          backgroundColor: "orange",
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: "Devices" } },
        y: { title: { display: true, text: "Energy (Wh)" } },
      },
    },
  });
}

function setupTimeFilterButtons() {
  const buttons = document.querySelectorAll(".time-filter button");
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const period = e.target.dataset.period;
      updateChartsAndSummary(period);
      buttons.forEach((btn) => btn.classList.remove("active"));
      e.target.classList.add("active");
    });
  });
}

function updateChartsAndSummary(period) {
  const periodData = data[period];

  mainChart.data.labels = periodData.time;
  mainChart.data.datasets[0].data = periodData.energyUsage;
  mainChart.update();

  deviceChart.data.labels = periodData.devices;
  deviceChart.data.datasets[0].data = periodData.deviceUsage;
  deviceChart.update();

  updateAnomalyDetection(periodData.anomalies);
}

function updateAnomalyDetection(anomalies) {
  anomalyChart.data.datasets[0].data = anomalies.map((anomaly) => ({
    x: anomaly.time,
    y: anomaly.value,
  }));
  anomalyChart.update();
}
