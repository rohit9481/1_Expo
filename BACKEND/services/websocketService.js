const WebSocket = require('ws');
const DataProcessingService = require('./dataProcessingService');

const setupWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', async (message) => {
      const data = JSON.parse(message);
      
      if (data.type === 'subscribe') {
        ws.userId = data.userId;
      }
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  return wss;
};

const broadcastReadings = (wss, reading) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client.userId === reading.userId) {
      client.send(JSON.stringify({
        type: 'reading',
        data: reading
      }));
    }
  });
};

module.exports = { setupWebSocket, broadcastReadings };