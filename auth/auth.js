/**
 * Wavve Authentication Module
 * Handles user authentication state and UI updates
 */

const AuthManager = {
    // DOM elements
    elements: {
        authButtons: document.querySelector('.auth-buttons'),
        loginLink: document.querySelector('.login-link'),
        registerLink: document.querySelector('.register-link'),
        profileLink: document.querySelector('.profile-link'),
        logoutButton: document.querySelector('.logout-link'),
        userMenu: document.querySelector('.user-menu'),
        userAvatar: document.getElementById('user-avatar'),
        usernameDisplay: document.getElementById('username-display'),
        logoutLink: document.getElementById('logout-link'),
        userMenuButton: document.getElementById('user-menu-button'),
        userDropdown: document.querySelector('.user-dropdown')
    },

    // Current user data
    currentUser: null,

    /**
     * Initialize the authentication manager
     */
    init() {
        this.checkAuthState();
        this.setupEventListeners();
    },

    /**
     * Set up event listeners for auth-related elements
     */
    setupEventListeners() {
        // Logout actions
        if (this.elements.logoutLink) {
            this.elements.logoutLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
        
        if (this.elements.logoutButton) {
            this.elements.logoutButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }

        // User menu toggle
        if (this.elements.userMenuButton) {
            this.elements.userMenuButton.addEventListener('click', () => {
                this.elements.userDropdown.classList.toggle('active');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.elements.userMenu.contains(e.target)) {
                    this.elements.userDropdown.classList.remove('active');
                }
            });
        }
    },

    /**
     * Check if the user is authenticated
     */
    async checkAuthState() {
        try {
            const response = await fetch('/api/current_user');
            const data = await response.json();

            if (data.authenticated) {
                this.currentUser = data.user;
                this.updateUIForAuthenticatedUser();
            } else {
                this.currentUser = null;
                this.updateUIForUnauthenticatedUser();
            }
        } catch (error) {
            console.error('Error checking authentication state:', error);
            this.updateUIForUnauthenticatedUser();
        }
    },

    /**
     * Log the user out
     */
    async logout() {
        try {
            await fetch('/auth/logout');
            this.currentUser = null;
            this.updateUIForUnauthenticatedUser();
            // Redirect to landing page
            window.location.href = '/';
        } catch (error) {
            console.error('Error logging out:', error);
        }
    },

    /**
     * Update UI for authenticated user
     */
    updateUIForAuthenticatedUser() {
        if (!this.elements.authButtons) return;

        // Hide login/register links
        if (this.elements.loginLink) this.elements.loginLink.style.display = 'none';
        if (this.elements.registerLink) this.elements.registerLink.style.display = 'none';
        
        // Show profile link and logout button
        if (this.elements.profileLink) this.elements.profileLink.style.display = 'inline-block';
        if (this.elements.logoutButton) this.elements.logoutButton.style.display = 'inline-block';

        // Show user menu
        if (this.elements.userMenu) {
            this.elements.userMenu.style.display = 'block';
            
            // Update user info
            if (this.elements.userAvatar) {
                this.elements.userAvatar.src = this.currentUser.profile_image || 'https://via.placeholder.com/24';
            }
            
            if (this.elements.usernameDisplay) {
                this.elements.usernameDisplay.textContent = this.currentUser.display_name || this.currentUser.username;
            }
        }
    },

    /**
     * Update UI for unauthenticated user
     */
    updateUIForUnauthenticatedUser() {
        if (!this.elements.authButtons) return;

        // Show login/register links
        if (this.elements.loginLink) this.elements.loginLink.style.display = 'inline-block';
        if (this.elements.registerLink) this.elements.registerLink.style.display = 'inline-block';
        
        // Hide profile link and logout button
        if (this.elements.profileLink) this.elements.profileLink.style.display = 'none';
        if (this.elements.logoutButton) this.elements.logoutButton.style.display = 'none';

        // Hide user menu
        if (this.elements.userMenu) {
            this.elements.userMenu.style.display = 'none';
        }
    }
};

// Initialize auth manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    AuthManager.init();
});
