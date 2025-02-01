// routes/userRoutes.js
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile', authenticateToken, userController.getProfile);
router.put('/preferences', authenticateToken, userController.updatePreferences);

// routes/analyticsRoutes.js
router.get('/insights', authenticateToken, analyticsController.getUserInsights);
router.get('/recommendations', authenticateToken, recommendationController.getRecommendations);
router.get('/achievements', authenticateToken, gamificationController.getUserAchievements);