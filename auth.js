// Authentication functionality
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    window.showTab = function(tabName) {
        // Hide all forms
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
        });

        // Remove active class from all tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected form and activate tab
        document.getElementById(tabName + '-form').classList.add('active');
        event.target.classList.add('active');
    };

    // Show forgot password form
    window.showForgotPassword = function() {
        document.querySelectorAll('.auth-form').forEach(form => {
            form.classList.remove('active');
        });
        document.getElementById('forgot-form').classList.add('active');
    };

    // Sign In Form Handler
    document.getElementById('signin-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const email = document.getElementById('signin-email').value;
        const password = document.getElementById('signin-password').value;

        // Simple validation
        if (!email || !password) {
            showMessage('Please fill in all fields', 'error');
            return;
        }

        // Simulate authentication (replace with real API call)
        const users = JSON.parse(localStorage.getItem('poetry_users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            localStorage.setItem('current_user', JSON.stringify(user));
            showMessage('Sign in successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            showMessage('Invalid email or password', 'error');
        }
    });

    // Sign Up Form Handler
    document.getElementById('signup-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;

        // Validation
        if (!name || !email || !password || !confirmPassword) {
            showMessage('Please fill in all fields', 'error');
            return;
        }

        if (password !== confirmPassword) {
            showMessage('Passwords do not match', 'error');
            return;
        }

        if (password.length < 6) {
            showMessage('Password must be at least 6 characters', 'error');
            return;
        }

        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('poetry_users') || '[]');
        if (users.find(u => u.email === email)) {
            showMessage('Email already registered', 'error');
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            name: name,
            email: email,
            password: password,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('poetry_users', JSON.stringify(users));

        showMessage('Account created successfully! Please sign in.', 'success');
        setTimeout(() => {
            showTab('signin');
        }, 1500);
    });

    // Forgot Password Form Handler
    document.getElementById('forgot-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const email = document.getElementById('forgot-email').value;

        if (!email) {
            showMessage('Please enter your email', 'error');
            return;
        }

        // Simulate password reset (replace with real API call)
        const users = JSON.parse(localStorage.getItem('poetry_users') || '[]');
        const user = users.find(u => u.email === email);

        if (user) {
            showMessage('Password reset link sent to your email', 'success');
        } else {
            showMessage('Email not found', 'error');
        }
    });

    // Message display function
    function showMessage(message, type) {
        // Remove existing message
        const existingMessage = document.querySelector('.auth-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `auth-message ${type}`;
        messageDiv.textContent = message;

        // Insert at top of auth card
        const authCard = document.querySelector('.auth-card');
        authCard.insertBefore(messageDiv, authCard.firstChild);

        // Auto remove after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    // Check if user is already logged in
    const currentUser = localStorage.getItem('current_user');
    if (currentUser) {
        window.location.href = 'index.html';
    }
});
