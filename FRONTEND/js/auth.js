function switchTab(tab) {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const tabs = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(t => t.classList.remove('active'));
    
    if (tab === 'login') {
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
        tabs[0].classList.add('active');
    } else {
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
        tabs[1].classList.add('active');
    }
}

function handleLogin(e) {
    e.preventDefault();
    // Add login logic here
    window.location.href = 'dashboard.html';
}

function handleSignup(e) {
    e.preventDefault();
    // Add signup logic here
    window.location.href = 'dashboard.html';
} 