const cron = require('node-cron');

cron.schedule('0 0 * * 0', () => { // Weekly at midnight Sunday
  User.find().then(users => {
    users.forEach(u => UserClassifier.classifyUser(u._id));
  });
});

cron.schedule('0 0 1 * *', () => { // Monthly leaderboard reset
  redisClient.del('leaderboard');
});