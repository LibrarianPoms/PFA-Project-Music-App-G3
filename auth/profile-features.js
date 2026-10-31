/**
 * Profile Features Module
 * Handles displaying user profiles and their featured playlists on the home page
 */

const ProfileFeatures = {
    /**
     * Initialize the profile features
     */
    init() {
        console.log('Profile Features module initialized');
        this.loadFeaturedProfiles();
        this.setupScrollArrows();
    },

    /**
     * Set up the scroll arrows for the user profiles container
     */
    setupScrollArrows() {
        const scrollLeftBtn = document.getElementById('profile-scroll-left');
        const scrollRightBtn = document.getElementById('profile-scroll-right');
        const profilesContainer = document.getElementById('user-profiles-container');

        if (scrollLeftBtn && scrollRightBtn && profilesContainer) {
            scrollLeftBtn.addEventListener('click', () => {
                profilesContainer.scrollBy({ left: -300, behavior: 'smooth' });
            });

            scrollRightBtn.addEventListener('click', () => {
                profilesContainer.scrollBy({ left: 300, behavior: 'smooth' });
            });
        }
    },

    /**
     * Load featured profiles from the server
     */
    loadFeaturedProfiles() {
        const profilesContainer = document.getElementById('user-profiles-container');
        
        if (!profilesContainer) return;

        // Show loading indicator
        profilesContainer.innerHTML = '<div class="loading"></div>';

        // Fetch profiles with featured playlists from the server
        fetch('/api/featured-profiles')
            .then(response => response.json())
            .then(data => {
                if (data.success && data.profiles && data.profiles.length > 0) {
                    this.renderProfiles(data.profiles, profilesContainer);
                } else {
                    this.renderNoProfilesMessage(profilesContainer);
                }
            })
            .catch(error => {
                console.error('Error loading featured profiles:', error);
                this.renderNoProfilesMessage(profilesContainer);
            });
    },

    /**
     * Render user profiles with their featured playlists
     * @param {Array} profiles - Array of user profile data
     * @param {HTMLElement} container - Container element
     */
    renderProfiles(profiles, container) {
        container.innerHTML = '';

        profiles.forEach(profile => {
            const profileCard = document.createElement('div');
            profileCard.className = 'user-profile-card';
            
            // Parse featured playlists
            let featuredPlaylists = [];
            try {
                featuredPlaylists = JSON.parse(profile.featured_playlist_ids || '[]');
            } catch (e) {
                console.error('Error parsing featured playlists for user:', profile.username, e);
            }

            // Only show profiles that have featured playlists
            if (profile.showcase_playlists && featuredPlaylists.length > 0) {
                profileCard.innerHTML = `
                    <div class="user-profile-header" style="background-image: url('${profile.profile_header_image || 'https://via.placeholder.com/500x150'}')">
                        <img src="${profile.profile_image || 'https://via.placeholder.com/60'}" alt="${profile.display_name || profile.username}" class="user-profile-avatar">
                    </div>
                    <div class="user-profile-info">
                        <h3 class="user-display-name">${profile.display_name || profile.username}</h3>
                        <div class="user-username">@${profile.username}</div>
                    </div>
                    <div class="user-playlists-container">
                        <h4 class="user-playlists-title"><i class="fas fa-music"></i> Featured Playlists</h4>
                        <div class="featured-playlists">
                            ${this.renderFeaturedPlaylists(profile.playlists, featuredPlaylists)}
                        </div>
                    </div>
                    <a href="/profile/${profile.username}" class="view-profile-link">View Profile</a>
                `;
                
                container.appendChild(profileCard);
            }
        });

        // If no profiles were actually rendered (maybe none had featured playlists)
        if (container.children.length === 0) {
            this.renderNoProfilesMessage(container);
        }
    },

    /**
     * Render featured playlists HTML
     * @param {Array} allPlaylists - All user playlists 
     * @param {Array} featuredPlaylistIds - IDs of featured playlists
     * @returns {string} HTML for featured playlists
     */
    renderFeaturedPlaylists(allPlaylists, featuredPlaylistIds) {
        if (!allPlaylists || allPlaylists.length === 0) {
            return '<p>No playlists available</p>';
        }

        // Filter to only include featured playlists
        const featured = allPlaylists.filter(playlist => 
            featuredPlaylistIds.includes(playlist.id.toString())
        );

        // Limit to max 3 playlists
        const displayPlaylists = featured.slice(0, 3);

        if (displayPlaylists.length === 0) {
            return '<p>No playlists available</p>';
        }

        return displayPlaylists.map(playlist => `
            <div class="featured-playlist-item" data-playlist-id="${playlist.id}">
                <img src="${playlist.cover_image || 'https://via.placeholder.com/45'}" alt="${playlist.title}" class="featured-playlist-cover">
                <div class="featured-playlist-info">
                    <div class="featured-playlist-name">${playlist.title}</div>
                    <div class="featured-playlist-tracks">${playlist.tracks_count || 0} tracks</div>
                </div>
                <div class="featured-playlist-play">
                    <i class="fas fa-play"></i>
                </div>
            </div>
        `).join('');
    },

    /**
     * Render a message when no profiles are available
     * @param {HTMLElement} container - Container element
     */
    renderNoProfilesMessage(container) {
        container.innerHTML = `
            <div class="no-profiles-message" style="text-align: center; padding: 30px; width: 100%;">
                <i class="fas fa-users" style="font-size: 32px; margin-bottom: 15px; opacity: 0.5;"></i>
                <p>No featured profiles available yet. Users need to customize their profiles and showcase playlists.</p>
            </div>
        `;
    },

    /**
     * Set up event listeners for playlist interactions
     */
    setupPlaylistListeners() {
        document.addEventListener('click', e => {
            const playlistItem = e.target.closest('.featured-playlist-item');
            if (playlistItem) {
                const playlistId = playlistItem.getAttribute('data-playlist-id');
                if (playlistId) {
                    this.openPlaylist(playlistId);
                }
            }
        });
    },

    /**
     * Open a playlist
     * @param {string} playlistId - ID of the playlist to open
     */
    openPlaylist(playlistId) {
        // Check if PlaylistManager is available
        if (window.PlaylistManager && typeof window.PlaylistManager.viewPlaylist === 'function') {
            window.PlaylistManager.viewPlaylist(playlistId);
        } else {
            // Fallback to using a direct API call
            fetch(`/api/playlist/${playlistId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success && data.playlist) {
                        // If we have a custom UI for viewing playlists, show it
                        const event = new CustomEvent('playlist:view', { detail: data.playlist });
                        document.dispatchEvent(event);
                    }
                })
                .catch(error => {
                    console.error('Error opening playlist:', error);
                });
        }
    }
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize after a short delay to ensure other components are loaded
    setTimeout(() => {
        ProfileFeatures.init();
    }, 500);
});
