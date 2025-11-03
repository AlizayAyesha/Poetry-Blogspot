// Profile page functionality
$(document).ready(function() {
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
    const currentUser = JSON.parse(localStorage.getItem('current_user'));
    let userData = null;

    if (currentUser) {
        const users = JSON.parse(localStorage.getItem('poetry_users')) || [];
        userData = users.find(u => u.email === currentUser.email);
    }

    // Default profile data if no user is logged in
    const defaultData = {
        name: 'Guest User',
        email: 'guest@example.com',
        bio: '',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
    };

    const profileData = userData || defaultData;

    $('#userName').text(profileData.name || 'Guest User');
    $('#userEmail').text(profileData.email);
    $('#editName').val(profileData.name || '');
    $('#editEmail').val(profileData.email);
    $('#editBio').val(profileData.bio || '');

    // Set avatar initial
    const initial = (profileData.name || 'G').charAt(0).toUpperCase();
    $('#avatarInitial').text(initial);

    // Member since
    const memberSince = profileData.createdAt ? new Date(profileData.createdAt).toLocaleDateString() : 'Today';
    $('#memberSince').text(memberSince);

    // Last login
    const lastLogin = profileData.lastLogin ? new Date(profileData.lastLogin).toLocaleString() : 'Just now';
    $('#lastLogin').text(lastLogin);
}

function loadUserPoems() {
    const currentUser = JSON.parse(localStorage.getItem('current_user'));
    const poems = JSON.parse(localStorage.getItem('poems')) || [];
    let userPoems = [];

    if (currentUser) {
        userPoems = poems.filter(p => p.author === currentUser.email);
    } else {
        // For guest users, show some sample poems or empty
        userPoems = [];
    }

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
    } else {
        $('#userPoems').html('<p class="no-poems">No poems added yet</p>');
    }
}

function loadRecentActivity() {
    const currentUser = JSON.parse(localStorage.getItem('current_user'));
    const poems = JSON.parse(localStorage.getItem('poems')) || [];
    let userPoems = [];

    if (currentUser) {
        userPoems = poems.filter(p => p.author === currentUser.email);
    } else {
        // For guest users, no activity
        userPoems = [];
    }

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
    } else {
        $('#recentActivity').html('<p class="no-activity">No recent activity</p>');
    }
}

function updateUserProfile() {
    const currentUser = JSON.parse(localStorage.getItem('current_user'));

    if (currentUser) {
        const users = JSON.parse(localStorage.getItem('poetry_users')) || [];
        const userIndex = users.findIndex(u => u.email === currentUser.email);

        if (userIndex !== -1) {
            users[userIndex].name = $('#editName').val().trim();
            users[userIndex].email = $('#editEmail').val().trim();
            users[userIndex].bio = $('#editBio').val().trim();
            users[userIndex].lastLogin = new Date().toISOString();

            // Update current user session
            const updatedUser = users[userIndex];
            localStorage.setItem('current_user', JSON.stringify({
                email: updatedUser.email,
                name: updatedUser.name
            }));
            localStorage.setItem('poetry_users', JSON.stringify(users));

            // Show success message
            showMessage('Profile updated successfully!', 'success');

            // Reload profile data
            loadUserProfile();
        }
    } else {
        // For guest users, just update the display temporarily
        const guestName = $('#editName').val().trim();
        const guestEmail = $('#editEmail').val().trim();
        const guestBio = $('#editBio').val().trim();

        $('#userName').text(guestName || 'Guest User');
        $('#userEmail').text(guestEmail || 'guest@example.com');

        // Set avatar initial
        const initial = (guestName || 'G').charAt(0).toUpperCase();
        $('#avatarInitial').text(initial);

        // Show success message
        showMessage('Profile updated temporarily (guest mode)!', 'success');
    }
}

function logout() {
    const currentUser = JSON.parse(localStorage.getItem('current_user'));
    if (currentUser) {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('current_user');
            window.location.href = 'index.html';
        }
    } else {
        // For guest users, just redirect to home
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
