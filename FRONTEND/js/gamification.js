// Sample data
const challenges = [
    {
        id: 1,
        title: 'Peak Hours Hero',
        description: 'Reduce energy usage during peak hours (2PM - 6PM)',
        progress: 75,
        reward: 500,
        icon: 'bolt'
    },
    // Add more challenges...
];

const leaderboard = [
    {
        rank: 1,
        name: 'John Doe',
        points: 3250,
        avatar: 'https://via.placeholder.com/40'
    },
    // Add more users...
];

const achievements = [
    {
        id: 1,
        title: 'Energy Saver',
        description: 'Reduce energy usage by 20%',
        icon: 'medal',
        unlocked: true
    },
    // Add more achievements...
];

// Update challenge progress
function updateChallengeProgress(challengeId, progress) {
    const challengeElement = document.querySelector(`#challenge-${challengeId}`);
    if (challengeElement) {
        const progressBar = challengeElement.querySelector('.progress');
        const progressText = challengeElement.querySelector('.progress-container span');
        
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${progress}%`;

        // Check if challenge is completed
        if (progress >= 100) {
            completeChallengeAndAwardPoints(challengeId);
        }
    }
}

// Complete challenge and award points
function completeChallengeAndAwardPoints(challengeId) {
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge) {
        // Update user points
        const currentPoints = parseInt(document.querySelector('.user-points span').textContent);
        const newPoints = currentPoints + challenge.reward;
        document.querySelector('.user-points span').textContent = `${newPoints} Points`;

        // Show completion notification
        showNotification(`Challenge Completed! +${challenge.reward} points`);
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize real-time updates
function initializeRealTimeUpdates() {
    // Simulate progress updates
    setInterval(() => {
        challenges.forEach(challenge => {
            const randomProgress = Math.min(challenge.progress + Math.random() * 5, 100);
            updateChallengeProgress(challenge.id, randomProgress);
        });
    }, 5000);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeRealTimeUpdates();
}); 