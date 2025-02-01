// services/notificationService.js
const createNotificationService = (wss) => {
    return {
      sendAlert: (userId, message) => {
        wss.clients.forEach(client => {
          if (client.userId === userId && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: 'ALERT',
              message
            }));
          }
        });
      },
      
      broadcastAchievement: (userId, achievement) => {
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: 'ACHIEVEMENT',
              userId,
              achievement
            }));
          }
        });
      }
    };
  };

  class NotificationService {
    constructor(wss) {
      this.wss = wss;
    }
  
    sendRealTimeAlert(userId, message) {
      this.wss.clients.forEach(client => {
        if(client.userId === userId && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'ENERGY_ALERT',
            message,
            timestamp: new Date()
          }));
        }
      });
    }
  }