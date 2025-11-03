// Profile page functionality
$(document).ready(function() {
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'auth.html';
        return;
    }

    // Initialize profile
    loadUserProfile();
    loadUserPoems();
    loadRecentActivity();

    // Tab switching
    $('.tab-btn').on('click', function() {
        const tabName = $(this).data('tab');

        // Update active tab button
        $('.tab-btn').removeClass('active');
        $(this).addClass('active');

        // Show active tab content
        $('.tab-pane').removeClass('active');
        $('#' + tabName).addClass('active');
    });

    // Profile form submission
    $('#profileForm').on('submit', function(e) {
        e.preventDefault();
        updateUserProfile();
    });
});

function loadUserProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userData = users.find(u => u.email === currentUser.email);

    if (userData) {
        $('#userName').text(userData.name || 'User');
        $('#userEmail').text(userData.email);
        $('#editName').val(userData.name || '');
        $('#editEmail').val(userData.email);
        $('#editBio').val(userData.bio || '');

        // Set avatar initial
        const initial = (userData.name || 'U').charAt(0).toUpperCase();
        $('#avatarInitial').text(initial);

        // Member since
        const memberSince = userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'Not available';
        $('#memberSince').text(memberSince);

        // Last login
        const lastLogin = userData.lastLogin ? new Date(userData.lastLogin).toLocaleString() : 'Just now';
        $('#lastLogin').text(lastLogin);
    }
}

function loadUserPoems() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const poems = JSON.parse(localStorage.getItem('poems')) || [];
    const userPoems = poems.filter(p => p.author === currentUser.email);

    $('#poemsCount').text(userPoems.length);

    if (userPoems.length > 0) {
        const poemsHtml = userPoems.map(poem => `
            <div class="poem-card">
                <blockquote>"${escapeHtml(poem.text)}"</blockquote>
                <footer>- ${escapeHtml(poem.authorName || 'Anonymous')}</footer>
                <small class="poem-date">${new Date(poem.createdAt).toLocaleDateString()}</small>
            </div>
        `).join('');

        $('#userPoems').html(poemsHtml);
    }
}

function loadRecentActivity() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const poems = JSON.parse(localStorage.getItem('poems')) || [];
    const userPoems = poems.filter(p => p.author === currentUser.email);

    if (userPoems.length > 0) {
        const recentPoems = userPoems.slice(-5).reverse(); // Get last 5 poems, most recent first
        const activityHtml = recentPoems.map(poem => `
            <div class="activity-item">
                <div class="activity-icon">📝</div>
                <div class="activity-content">
                    <p>You added a new poem</p>
                    <small>${new Date(poem.createdAt).toLocaleString()}</small>
                </div>
            </div>
        `).join('');

        $('#recentActivity').html(activityHtml);
    }
}

function updateUserProfile() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.email === currentUser.email);

    if (userIndex !== -1) {
        users[userIndex].name = $('#editName').val().trim();
        users[userIndex].email = $('#editEmail').val().trim();
        users[userIndex].bio = $('#editBio').val().trim();
        users[userIndex].lastLogin = new Date().toISOString();

        // Update current user session
        const updatedUser = users[userIndex];
        localStorage.setItem('currentUser', JSON.stringify({
            email: updatedUser.email,
            name: updatedUser.name
        }));
        localStorage.setItem('users', JSON.stringify(users));

        // Show success message
        showMessage('Profile updated successfully!', 'success');

        // Reload profile data
        loadUserProfile();
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}

function showMessage(message, type) {
    // Remove existing messages
    $('.auth-message').remove();

    const messageDiv = $('<div>')
        .addClass(`auth-message ${type}`)
        .text(message);

    $('.settings-section').prepend(messageDiv);

    // Auto remove after 3 seconds
    setTimeout(() => {
        messageDiv.fadeOut(() => messageDiv.remove());
    }, 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
