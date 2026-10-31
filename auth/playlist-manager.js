/**
 * Wavve Playlist Manager Module
 * Handles user playlist creation, editing, and track management
 */

const PlaylistManager = {
    /**
     * Initialize the playlist manager
     */
    init() {
        // Setup event listeners
        this.setupEventListeners();
    },

    /**
     * Set up event listeners for playlist-related elements
     */
    setupEventListeners() {
        // Add to playlist button click events will be attached dynamically
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-playlist-btn') || 
                e.target.closest('.add-to-playlist-btn')) {
                
                const trackElement = e.target.closest('.music-card');
                if (trackElement) {
                    const trackId = trackElement.getAttribute('data-track-id');
                    const trackData = JSON.parse(trackElement.getAttribute('data-track-json'));
                    this.showAddToPlaylistModal(trackId, trackData);
                }
            }
        });
    },

    /**
     * Show modal for adding track to playlist
     * @param {string} trackId - ID of the track to add
     * @param {Object} trackData - Track data object
     */
    showAddToPlaylistModal(trackId, trackData) {
        // Check if user is logged in
        fetch('/api/current_user')
            .then(response => response.json())
            .then(data => {
                if (!data.authenticated) {
                    this.showLoginPrompt();
                    return;
                }

                // Create modal element if it doesn't exist
                let modal = document.getElementById('playlist-modal');
                if (!modal) {
                    modal = document.createElement('div');
                    modal.id = 'playlist-modal';
                    modal.className = 'modal';
                    
                    modal.innerHTML = `
                        <div class="modal-content">
                            <div class="modal-header">
                                <h2>Add to Playlist</h2>
                                <button class="close-modal">&times;</button>
                            </div>
                            <div class="modal-body">
                                <div class="playlist-list">
                                    <h3>Select a playlist</h3>
                                    <div id="user-playlists">
                                        <div class="loading">Loading playlists...</div>
                                    </div>
                                </div>
                                <div class="create-playlist">
                                    <h3>Or create a new playlist</h3>
                                    <div class="form-group">
                                        <input type="text" id="new-playlist-name" placeholder="Playlist name" class="form-control">
                                    </div>
                                    <button id="create-playlist-btn" class="btn">Create Playlist</button>
                                </div>
                            </div>
                        </div>
                    `;
                    
                    document.body.appendChild(modal);
                    
                    // Event listener for closing the modal
                    modal.querySelector('.close-modal').addEventListener('click', () => {
                        modal.style.display = 'none';
                    });
                    
                    // Close when clicking outside the modal content
                    window.addEventListener('click', (e) => {
                        if (e.target === modal) {
                            modal.style.display = 'none';
                        }
                    });
                }
                
                // Store track info in modal for future use
                modal.setAttribute('data-track-id', trackId);
                modal.setAttribute('data-track-json', JSON.stringify(trackData));
                
                // Show the modal
                modal.style.display = 'block';
                
                // Fetch user playlists
                this.loadUserPlaylists();
                
                // Event listener for create playlist button
                const createBtn = document.getElementById('create-playlist-btn');
                if (createBtn) {
                    createBtn.onclick = (e) => {
                        e.preventDefault();
                        this.createPlaylistAndAddTrack(trackId, trackData);
                    };
                }
            })
            .catch(error => {
                console.error('Error checking user authentication:', error);
                this.showErrorNotification('Error checking authentication status');
            });
    },

    /**
     * Show login prompt for unauthenticated users
     */
    showLoginPrompt() {
        const notification = document.createElement('div');
        notification.className = 'notification login-prompt';
        notification.innerHTML = `
            <div class="notification-content">
                <p>You need to be logged in to use playlists</p>
                <div class="notification-buttons">
                    <a href="/auth/login" class="btn">Login</a>
                    <a href="/auth/register" class="btn">Sign Up</a>
                </div>
            </div>
        `;
        
        // Add to notification container
        const container = document.getElementById('notification-container');
        if (container) {
            container.appendChild(notification);
            
            // Auto remove after 5 seconds
            setTimeout(() => {
                notification.classList.add('fade-out');
                setTimeout(() => {
                    notification.remove();
                }, 500);
            }, 5000);
        }
    },

    /**
     * Load user playlists into the modal
     */
    loadUserPlaylists() {
        const playlistsContainer = document.getElementById('user-playlists');
        if (!playlistsContainer) return;
        
        playlistsContainer.innerHTML = '<div class="loading">Loading playlists...</div>';
        
        fetch('/api/user/playlists')
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    if (data.playlists && data.playlists.length > 0) {
                        let html = '<ul class="playlist-options">';
                        
                        data.playlists.forEach(playlist => {
                            html += `
                                <li class="playlist-option" data-playlist-id="${playlist.id}">
                                    <div class="playlist-info">
                                        <div class="playlist-thumb">
                                            <img src="${playlist.cover_image}" alt="${playlist.title}">
                                        </div>
                                        <div class="playlist-details">
                                            <h4>${playlist.title}</h4>
                                            <span>${playlist.tracks.length} tracks</span>
                                        </div>
                                    </div>
                                    <button class="add-to-this-playlist-btn" data-playlist-id="${playlist.id}">Add</button>
                                </li>
                            `;
                        });
                        
                        html += '</ul>';
                        playlistsContainer.innerHTML = html;
                        
                        // Add event listeners to "Add" buttons
                        document.querySelectorAll('.add-to-this-playlist-btn').forEach(button => {
                            button.addEventListener('click', (e) => {
                                const playlistId = e.target.getAttribute('data-playlist-id');
                                const trackId = document.getElementById('playlist-modal').getAttribute('data-track-id');
                                const trackData = JSON.parse(document.getElementById('playlist-modal').getAttribute('data-track-json'));
                                
                                this.addTrackToPlaylist(playlistId, trackId, trackData);
                            });
                        });
                    } else {
                        playlistsContainer.innerHTML = '<p class="no-playlists">You have no playlists yet. Create one below.</p>';
                    }
                } else {
                    playlistsContainer.innerHTML = '<p class="error">Failed to load playlists</p>';
                }
            })
            .catch(error => {
                console.error('Error loading playlists:', error);
                playlistsContainer.innerHTML = '<p class="error">An error occurred while loading playlists</p>';
            });
    },

    /**
     * Create a new playlist and add track to it
     * @param {string} trackId - ID of the track to add
     * @param {Object} trackData - Track data object
     */
    createPlaylistAndAddTrack(trackId, trackData) {
        const playlistName = document.getElementById('new-playlist-name').value.trim();
        
        if (!playlistName) {
            this.showErrorNotification('Please enter a playlist name');
            return;
        }
        
        // Create new playlist
        fetch('/api/playlists', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: playlistName,
                description: 'Created from Wavve Music'
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Add track to newly created playlist
                this.addTrackToPlaylist(data.playlist.id, trackId, trackData);
            } else {
                this.showErrorNotification(data.message || 'Failed to create playlist');
            }
        })
        .catch(error => {
            console.error('Error creating playlist:', error);
            this.showErrorNotification('An error occurred while creating the playlist');
        });
    },

    /**
     * Add a track to a playlist
     * @param {string} playlistId - ID of the playlist
     * @param {string} trackId - ID of the track to add
     * @param {Object} trackData - Track data object
     */
    addTrackToPlaylist(playlistId, trackId, trackData) {
        fetch(`/api/playlists/${playlistId}/tracks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                track_id: trackId,
                track_data: trackData
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Close modal
                document.getElementById('playlist-modal').style.display = 'none';
                
                // Show success notification
                this.showSuccessNotification('Track added to playlist');
            } else {
                this.showErrorNotification(data.message || 'Failed to add track to playlist');
            }
        })
        .catch(error => {
            console.error('Error adding track to playlist:', error);
            this.showErrorNotification('An error occurred while adding the track');
        });
    },

    /**
     * Show success notification
     * @param {string} message - Notification message
     */
    showSuccessNotification(message) {
        this.showNotification(message, 'success');
    },

    /**
     * Show error notification
     * @param {string} message - Notification message
     */
    showErrorNotification(message) {
        this.showNotification(message, 'error');
    },

    /**
     * Show notification
     * @param {string} message - Notification message
     * @param {string} type - Notification type ('success' or 'error')
     */
    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}-notification`;
        notification.innerHTML = `
            <div class="notification-content">
                <p>${message}</p>
            </div>
        `;
        
        // Add to notification container
        const container = document.getElementById('notification-container');
        if (container) {
            container.appendChild(notification);
            
            // Auto remove after 3 seconds
            setTimeout(() => {
                notification.classList.add('fade-out');
                setTimeout(() => {
                    notification.remove();
                }, 500);
            }, 3000);
        }
    }
};

// Initialize playlist manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    PlaylistManager.init();
});
