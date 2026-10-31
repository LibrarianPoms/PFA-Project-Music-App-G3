/**
 * Playlist Manager for Wavve Music Website
 * Handles creating, deleting, and managing user playlists
 */

// Playlist Manager Module
const PlaylistManager = {
    // Initialize playlists
    init: function() {
        // Load playlists from localStorage
        this.loadPlaylists();
        
        // Set up UI elements
        this.setupUI();
        
        // Set up event listeners
        this.setupEventListeners();
        
        console.log('Playlist Manager initialized');
    },
    
    // Load playlists from localStorage
    loadPlaylists: function() {
        try {
            const savedPlaylists = localStorage.getItem('wavvePlaylists');
            this.playlists = savedPlaylists ? JSON.parse(savedPlaylists) : [];
            
            // If no playlists exist, create a default one
            if (this.playlists.length === 0) {
                this.playlists = [
                    {
                        id: 'default-' + Date.now(),
                        name: 'My Favorites',
                        description: 'Your favorite tracks',
                        tracks: [],
                        createdAt: new Date().toISOString()
                    }
                ];
                this.savePlaylists();
            }
            
            console.log('Playlists loaded:', this.playlists.length);
        } catch (e) {
            console.error('Error loading playlists:', e);
            this.playlists = [];
        }
    },
    
    // Save playlists to localStorage
    savePlaylists: function() {
        try {
            localStorage.setItem('wavvePlaylists', JSON.stringify(this.playlists));
        } catch (e) {
            console.error('Error saving playlists:', e);
        }
    },
    
    // Create a new playlist
    createPlaylist: function(name, description = '') {
        const playlist = {
            id: 'playlist-' + Date.now(),
            name: name || 'New Playlist',
            description: description || 'Created on ' + new Date().toLocaleDateString(),
            tracks: [],
            createdAt: new Date().toISOString()
        };
        
        this.playlists.push(playlist);
        this.savePlaylists();
        
        // Update UI
        this.updatePlaylistsUI();
        
        // Show notification
        if (window.showNotification) {
            window.showNotification(`Playlist "${playlist.name}" created`, 'success');
        }
        
        return playlist;
    },
    
    // Delete a playlist
    deletePlaylist: function(playlistId) {
        const index = this.playlists.findIndex(p => p.id === playlistId);
        
        if (index !== -1) {
            const playlist = this.playlists[index];
            this.playlists.splice(index, 1);
            this.savePlaylists();
            
            // Update UI
            this.updatePlaylistsUI();
            
            // Show notification
            if (window.showNotification) {
                window.showNotification(`Playlist "${playlist.name}" deleted`, 'info');
            }
            
            return true;
        }
        
        return false;
    },
    
    // Add a track to a playlist
    addTrackToPlaylist: function(playlistId, track) {
        const playlist = this.playlists.find(p => p.id === playlistId);
        
        if (playlist) {
            // Check if track already exists in playlist
            const exists = playlist.tracks.some(t => t.id === track.id);
            
            if (!exists) {
                // Add track to playlist
                playlist.tracks.push(track);
                this.savePlaylists();
                
                // Update UI
                this.updatePlaylistsUI();
                
                // Show notification
                if (window.showNotification) {
                    window.showNotification(`Added "${track.title}" to "${playlist.name}"`, 'success');
                }
                
                return true;
            } else {
                // Show notification
                if (window.showNotification) {
                    window.showNotification(`Track already exists in "${playlist.name}"`, 'info');
                }
            }
        }
        
        return false;
    },
    
    // Remove a track from a playlist
    removeTrackFromPlaylist: function(playlistId, trackId) {
        const playlist = this.playlists.find(p => p.id === playlistId);
        
        if (playlist) {
            const index = playlist.tracks.findIndex(t => t.id === trackId);
            
            if (index !== -1) {
                const track = playlist.tracks[index];
                playlist.tracks.splice(index, 1);
                this.savePlaylists();
                
                // Update UI
                this.updatePlaylistsUI();
                
                // Show notification
                if (window.showNotification) {
                    window.showNotification(`Removed "${track.title}" from "${playlist.name}"`, 'info');
                }
                
                return true;
            }
        }
        
        return false;
    },
    
    // Get all playlists
    getPlaylists: function() {
        return this.playlists;
    },
    
    // Get a specific playlist
    getPlaylist: function(playlistId) {
        return this.playlists.find(p => p.id === playlistId);
    },
    
    // Set up UI elements
    setupUI: function() {
        // Create playlist modal if it doesn't exist
        if (!document.getElementById('playlist-modal')) {
            const modal = document.createElement('div');
            modal.id = 'playlist-modal';
            modal.className = 'playlist-modal';
            modal.innerHTML = `
                <div class="playlist-modal-content">
                    <div class="playlist-modal-header">
                        <h2>Playlists</h2>
                        <button class="close-modal"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="playlist-modal-body">
                        <div class="playlist-tabs">
                            <button class="playlist-tab active" data-tab="create-playlist">Create Playlist</button>
                        </div>
                        <div class="playlist-list"></div>
                        <div class="playlist-tab-content" id="create-playlist">
                            <form id="create-playlist-form">
                                <div class="form-group">
                                    <label for="playlist-name">Name</label>
                                    <input type="text" id="playlist-name" placeholder="Enter playlist name" required>
                                </div>
                                <div class="form-group">
                                    <label for="playlist-description">Description</label>
                                    <textarea id="playlist-description" placeholder="Enter playlist description"></textarea>
                                </div>
                                <button type="submit" class="create-playlist-btn">Create Playlist</button>
                            </form>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
        }
        
        // Create "Add to Playlist" modal
        if (!document.getElementById('add-to-playlist-modal')) {
            const modal = document.createElement('div');
            modal.id = 'add-to-playlist-modal';
            modal.className = 'playlist-modal';
            modal.innerHTML = `
                <div class="playlist-modal-content">
                    <div class="playlist-modal-header">
                        <h2>Add to Playlist</h2>
                        <button class="close-modal"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="playlist-modal-body">
                        <div class="track-info">
                            <img id="add-track-img" src="https://via.placeholder.com/60" alt="Track Image">
                            <div>
                                <h3 id="add-track-name">Track Name</h3>
                                <p id="add-track-artist">Artist Name</p>
                            </div>
                        </div>
                        <div class="playlist-select-list"></div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
        }
        
        // Add playlist button to header
        const header = document.querySelector('header nav ul');
        if (header && !document.getElementById('playlist-button')) {
            const playlistButton = document.createElement('li');
            playlistButton.innerHTML = '<a href="#" id="playlist-button">My Playlists</a>';
            header.appendChild(playlistButton);
        }
        
        // Update playlists UI
        this.updatePlaylistsUI();
    },
    
    // Set up event listeners
    setupEventListeners: function() {
        // Open playlist modal
        const playlistButton = document.getElementById('playlist-button');
        if (playlistButton) {
            playlistButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.openPlaylistModal();
            });
        }
        
        // Close modals
        const closeButtons = document.querySelectorAll('.close-modal');
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.closeAllModals();
            });
        });
        
        // Switch tabs
        const tabButtons = document.querySelectorAll('.playlist-tab');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all tabs
                document.querySelectorAll('.playlist-tab').forEach(tab => tab.classList.remove('active'));
                document.querySelectorAll('.playlist-tab-content').forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked tab
                button.classList.add('active');
                const tabId = button.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
            });
        });
        
        // Create playlist form
        const createForm = document.getElementById('create-playlist-form');
        if (createForm) {
            createForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const name = document.getElementById('playlist-name').value;
                const description = document.getElementById('playlist-description').value;
                
                this.createPlaylist(name, description);
                
                // Reset form
                createForm.reset();
                
                // Switch to My Playlists tab
                document.querySelector('.playlist-tab[data-tab="my-playlists"]').click();
            });
        }
        
        // Add "Add to Playlist" buttons to music cards
        this.addPlaylistButtonsToCards();
    },
    
    // Update playlists UI
    updatePlaylistsUI: function() {
        // Update playlist list
        const playlistList = document.querySelector('.playlist-list');
        if (playlistList) {
            playlistList.innerHTML = '';
            
            if (this.playlists.length === 0) {
                playlistList.innerHTML = '<p class="no-playlists">You don\'t have any playlists yet. Create one!</p>';
            } else {
                this.playlists.forEach(playlist => {
                    const playlistEl = document.createElement('div');
                    playlistEl.className = 'playlist-item';
                    playlistEl.innerHTML = `
                        <div class="playlist-item-info">
                            <h3>${playlist.name}</h3>
                            <p>${playlist.tracks.length} tracks</p>
                        </div>
                        <div class="playlist-item-actions">
                            <button class="view-playlist" data-id="${playlist.id}">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="delete-playlist" data-id="${playlist.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;
                    
                    playlistList.appendChild(playlistEl);
                    
                    // Add event listeners
                    const viewButton = playlistEl.querySelector('.view-playlist');
                    const deleteButton = playlistEl.querySelector('.delete-playlist');
                    
                    viewButton.addEventListener('click', () => {
                        this.viewPlaylist(playlist.id);
                    });
                    
                    deleteButton.addEventListener('click', () => {
                        if (confirm(`Are you sure you want to delete "${playlist.name}"?`)) {
                            this.deletePlaylist(playlist.id);
                        }
                    });
                });
            }
        }
        
        // Update "Add to Playlist" modal
        const playlistSelectList = document.querySelector('.playlist-select-list');
        if (playlistSelectList) {
            playlistSelectList.innerHTML = '';
            
            if (this.playlists.length === 0) {
                playlistSelectList.innerHTML = '<p class="no-playlists">You don\'t have any playlists yet. Create one!</p>';
            } else {
                this.playlists.forEach(playlist => {
                    const playlistEl = document.createElement('div');
                    playlistEl.className = 'playlist-select-item';
                    playlistEl.setAttribute('data-id', playlist.id);
                    playlistEl.innerHTML = `
                        <div class="playlist-select-info">
                            <h3>${playlist.name}</h3>
                            <p>${playlist.tracks.length} tracks</p>
                        </div>
                    `;
                    
                    playlistSelectList.appendChild(playlistEl);
                    
                    // Add event listener
                    playlistEl.addEventListener('click', () => {
                        const trackData = JSON.parse(playlistSelectList.getAttribute('data-track'));
                        this.addTrackToPlaylist(playlist.id, trackData);
                        this.closeAllModals();
                    });
                });
            }
        }
        
        // Update "Add to Playlist" buttons
        this.addPlaylistButtonsToCards();
    },
    
    // Add "Add to Playlist" buttons to music cards
    addPlaylistButtonsToCards: function() {
        // Add observer for new music cards
        if (!this.observer) {
            this.observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.addedNodes) {
                        mutation.addedNodes.forEach(node => {
                            if (node.classList && node.classList.contains('music-card')) {
                                this.addPlaylistButtonToCard(node);
                            }
                        });
                    }
                });
            });
            
            // Observe music containers
            const containers = [
                document.getElementById('discover-container'),
                document.getElementById('trending-container')
            ];
            
            containers.forEach(container => {
                if (container) {
                    this.observer.observe(container, { childList: true, subtree: true });
                }
            });
        }
        
        // Add buttons to existing cards
        const cards = document.querySelectorAll('.music-card');
        cards.forEach(card => {
            this.addPlaylistButtonToCard(card);
        });
    },
    
    // Add "Add to Playlist" button to a single music card
    addPlaylistButtonToCard: function(card) {
        // Don't add button if it already exists
        if (card.querySelector('.add-to-playlist')) {
            return;
        }
        
        // Get card info
        const trackId = card.getAttribute('data-track-id');
        if (!trackId) return;
        
        // Create button container for better positioning
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'playlist-buttons-container';
        
        // Create add to playlist button
        const addButton = document.createElement('button');
        addButton.className = 'add-to-playlist';
        addButton.title = 'Add to Playlist';
        addButton.innerHTML = '<i class="fas fa-plus"></i>';
        
        // Create play button
        const playButton = document.createElement('button');
        playButton.className = 'play-from-card';
        playButton.title = 'Play Track';
        playButton.innerHTML = '<i class="fas fa-play"></i>';
        
        // Add event listener for add button
        addButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card click
            
            // Get track data
            const trackTitle = card.querySelector('.music-info h3')?.textContent;
            const trackArtist = card.querySelector('.music-info p')?.textContent;
            const trackImg = card.querySelector('img')?.src;
            
            // Try to get full track data from global variable
            let trackData = this.getTrackDataFromId(trackId, {
                title: trackTitle,
                artist: trackArtist,
                image: trackImg
            });
            
            // Open "Add to Playlist" modal
            this.openAddToPlaylistModal(trackData);
        });
        
        // Add event listener for play button
        playButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card click
            
            // Get track data
            const trackTitle = card.querySelector('.music-info h3')?.textContent;
            const trackArtist = card.querySelector('.music-info p')?.textContent;
            const trackImg = card.querySelector('img')?.src;
            
            // Try to get full track data from global variable
            let trackData = this.getTrackDataFromId(trackId, {
                title: trackTitle,
                artist: trackArtist,
                image: trackImg
            });
            
            // Check if preview URL exists first
            if (!trackData.preview) {
                // Try to fetch the track data from Deezer if missing preview URL
                this.fetchTrackDataIfNeeded(trackData).then(updatedTrack => {
                                    // Check if we got a preview URL
                    if (updatedTrack && updatedTrack.preview) {
                        console.log('Playing track with preview URL:', updatedTrack.preview);
                        if (window.playTrack) {
                            window.playTrack(updatedTrack);
                        } else {
                            this.playTrackFallback(updatedTrack);
                        }
                    } else {
                        // Try to find the track directly in app.js currentPlaylist as last resort
                        if (window.currentPlaylist && window.currentPlaylist.length > 0) {
                            const appTrack = window.currentPlaylist.find(t => t.id === track.id || 
                                (t.title?.toLowerCase() === track.title?.toLowerCase() && 
                                 t.artist?.name?.toLowerCase() === track.artist?.name?.toLowerCase()));
                            
                            if (appTrack && appTrack.preview) {
                                console.log('Found matching track in app playlist:', appTrack);
                                if (window.playTrack) {
                                    window.playTrack(appTrack);
                                } else {
                                    this.playTrackFallback(appTrack);
                                }
                                return;
                            }
                        }
                        
                        // Show error notification if all else fails
                        console.error('No preview available for track after all attempts');
                        if (window.showNotification) {
                            window.showNotification('No preview available for this track', 'error');
                        } else {
                            alert('No preview available for this track');
                        }
                    }
                });
            } else {
                // Play track
                if (window.playTrack) {
                    window.playTrack(trackData);
                } else {
                    this.playTrackFallback(trackData);
                }
            }
        });
        
        // Add buttons to container
        buttonContainer.appendChild(addButton);
        buttonContainer.appendChild(playButton);
        
        // Add container to card
        const cardImageContainer = card.querySelector('.card-image-container');
        if (cardImageContainer) {
            // Add to card image container if exists
            cardImageContainer.appendChild(buttonContainer);
        } else {
            // Otherwise, add directly to card
            card.appendChild(buttonContainer);
        }
    },
    
    // Helper function to get track data from ID
    getTrackDataFromId: function(trackId, fallbackData = {}) {
        // Try to get full track data from global variables
        let trackData = null;
        
        // Check current track
        if (window.currentTrack && window.currentTrack.id.toString() === trackId) {
            trackData = window.currentTrack;
        } 
        // Check current playlist
        else if (window.currentPlaylist) {
            trackData = window.currentPlaylist.find(t => t.id.toString() === trackId);
        }
        // Check all playlists
        else {
            for (const playlist of this.playlists) {
                const track = playlist.tracks.find(t => t.id.toString() === trackId);
                if (track) {
                    trackData = track;
                    break;
                }
            }
        }
        
        // If no track data found, create minimal data
        if (!trackData) {
            trackData = {
                id: parseInt(trackId),
                title: fallbackData.title || 'Unknown Track',
                artist: { name: fallbackData.artist || 'Unknown Artist' },
                album: { cover_medium: fallbackData.image || 'https://via.placeholder.com/60' }
            };
        }
        
        // Ensure preview URL exists if not trying to fetch from the server
        if (!trackData.preview && fallbackData.fetchFromServer && trackData.id) {
            // Set to be fetched later when needed
            trackData.needsFetch = true;
        }
        
        return trackData;
    },
    
    // Open playlist modal
    openPlaylistModal: function() {
        const modal = document.getElementById('playlist-modal');
        if (modal) {
            modal.classList.add('open');
        }
    },
    
    // Open "Add to Playlist" modal
    openAddToPlaylistModal: function(track) {
        const modal = document.getElementById('add-to-playlist-modal');
        if (modal) {
            // Update track info
            document.getElementById('add-track-name').textContent = track.title;
            document.getElementById('add-track-artist').textContent = track.artist?.name || 'Unknown Artist';
            document.getElementById('add-track-img').src = track.album?.cover_medium || 'https://via.placeholder.com/60';
            
            // Store track data
            document.querySelector('.playlist-select-list').setAttribute('data-track', JSON.stringify(track));
            
            // Open modal
            modal.classList.add('open');
        }
    },
    
    // View playlist
    viewPlaylist: function(playlistId) {
        const playlist = this.getPlaylist(playlistId);
        
        if (playlist) {
            // Create view modal if it doesn't exist
            if (!document.getElementById('view-playlist-modal')) {
                const modal = document.createElement('div');
                modal.id = 'view-playlist-modal';
                modal.className = 'playlist-modal';
                modal.innerHTML = `
                    <div class="playlist-modal-content">
                        <div class="playlist-modal-header">
                            <h2 id="view-playlist-name">Playlist Name</h2>
                            <button class="close-modal"><i class="fas fa-times"></i></button>
                        </div>
                        <div class="playlist-modal-body">
                            <p id="view-playlist-description">Playlist Description</p>
                            <div id="view-playlist-tracks" class="playlist-tracks-container"></div>
                        </div>
                    </div>
                `;
                
                document.body.appendChild(modal);
                
                // Add event listener for close button
                modal.querySelector('.close-modal').addEventListener('click', () => {
                    this.closeAllModals();
                });
            }
            
            // Update view modal
            const modal = document.getElementById('view-playlist-modal');
            document.getElementById('view-playlist-name').textContent = playlist.name;
            document.getElementById('view-playlist-description').textContent = playlist.description;
            
            // Update tracks
            const tracksContainer = document.getElementById('view-playlist-tracks');
            tracksContainer.innerHTML = '';
            
            if (playlist.tracks.length === 0) {
                tracksContainer.innerHTML = '<p class="no-tracks">This playlist is empty. Add some tracks!</p>';
            } else {
                playlist.tracks.forEach(track => {
                    const trackEl = document.createElement('div');
                    trackEl.className = 'playlist-track-item';
                    trackEl.innerHTML = `
                        <img src="${track.album?.cover_medium || 'https://via.placeholder.com/60'}" alt="${track.title}">
                        <div class="track-info">
                            <h3>${track.title}</h3>
                            <p>${track.artist?.name || 'Unknown Artist'}</p>
                        </div>
                        <div class="track-actions">
                            <button class="play-track" data-track-id="${track.id}">
                                <i class="fas fa-play"></i>
                            </button>
                            <button class="remove-track" data-track-id="${track.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;
                    
                    tracksContainer.appendChild(trackEl);
                    
                    // Add event listeners
                    const playButton = trackEl.querySelector('.play-track');
                    const removeButton = trackEl.querySelector('.remove-track');
                    
                    playButton.addEventListener('click', () => {
                        // Check if preview URL exists first
                        if (!track.preview) {
                            // Try to fetch the track data from Deezer if missing preview URL
                            this.fetchTrackDataIfNeeded(track).then(updatedTrack => {
                                // Store the updated track in the playlist
                                const trackIndex = playlist.tracks.findIndex(t => t.id === track.id);
                                if (trackIndex !== -1) {
                                    playlist.tracks[trackIndex] = updatedTrack;
                                    this.savePlaylists();
                                }
                                
                                // Check if we got a preview URL
                                if (updatedTrack && updatedTrack.preview) {
                                    console.log('Playing track with preview URL from playlist:', updatedTrack.preview);
                                    // Close the modal first to avoid UI overlap
                                    this.closeAllModals();
                                    
                                    // Play the track with all playlist tracks as context
                                    if (window.playTrack) {
                                        window.playTrack(updatedTrack, playlist.tracks);
                                    } else {
                                        this.playTrackFallback(updatedTrack);
                                    }
                                    
                                    // Show notification
                                    if (window.showNotification) {
                                        window.showNotification(`Playing: ${updatedTrack.title}`, 'success');
                                    }
                                } else {
                                    // Try to find the track directly in app.js currentPlaylist as last resort
                                    if (window.currentPlaylist && window.currentPlaylist.length > 0) {
                                        const appTrack = window.currentPlaylist.find(t => t.id === track.id || 
                                            (t.title?.toLowerCase() === track.title?.toLowerCase() && 
                                             t.artist?.name?.toLowerCase() === track.artist?.name?.toLowerCase()));
                                        
                                        if (appTrack && appTrack.preview) {
                                            console.log('Found matching track in app playlist:', appTrack);
                                            this.closeAllModals();
                                            
                                            // Update track in playlist with data from app
                                            const trackIndex = playlist.tracks.findIndex(t => t.id === track.id);
                                            if (trackIndex !== -1) {
                                                playlist.tracks[trackIndex] = appTrack;
                                                this.savePlaylists();
                                            }
                                            
                                            if (window.playTrack) {
                                                window.playTrack(appTrack, playlist.tracks);
                                            } else {
                                                this.playTrackFallback(appTrack);
                                            }
                                            
                                            if (window.showNotification) {
                                                window.showNotification(`Playing: ${appTrack.title}`, 'success');
                                            }
                                            return;
                                        }
                                    }
                                    
                                    // Show error notification if all else fails
                                    console.error('No preview available for track after all attempts');
                                    if (window.showNotification) {
                                        window.showNotification('No preview available for this track', 'error');
                                    } else {
                                        alert('No preview available for this track');
                                    }
                                }
                            });
                        } else {
                            // Close the modal first to avoid UI overlap
                            this.closeAllModals();
                            
                            // Play the track with all playlist tracks as context
                            if (window.playTrack) {
                                window.playTrack(track, playlist.tracks);
                                
                                // Show notification
                                if (window.showNotification) {
                                    window.showNotification(`Playing: ${track.title}`, 'success');
                                }
                            } else {
                                console.warn('playTrack function not available');
                                // Fallback method if playTrack is not available
                                this.playTrackFallback(track);
                            }
                        }
                    });
                    
                    removeButton.addEventListener('click', () => {
                        this.removeTrackFromPlaylist(playlist.id, track.id);
                        // Update view
                        this.viewPlaylist(playlist.id);
                    });
                });
            }
            
            // Open modal
            modal.classList.add('open');
        }
    },
    
    // Close all modals
    closeAllModals: function() {
        const modals = document.querySelectorAll('.playlist-modal');
        modals.forEach(modal => modal.classList.remove('open'));
    },
    
    // Helper function to fetch track data from Deezer if needed
    fetchTrackDataIfNeeded: async function(track) {
        // If we already have a preview URL, return the track as is
        if (track.preview) {
            return track;
        }
        
        // If no track ID, can't fetch
        if (!track.id) {
            return track;
        }
        
        try {
            console.log(`Fetching track data for ID: ${track.id}`);
            // Use Deezer API through our Flask proxy - match the format in app.js
            const response = await fetch(`/api?endpoint=track/${track.id}`);
            
            if (!response.ok) {
                throw new Error(`API returned ${response.status}`);
            }
            
            const trackData = await response.json();
            
            // Merge the new data with existing track data
            const mergedTrack = {
                ...track,
                ...trackData,
                // Make sure these fields are properly structured
                artist: trackData.artist || track.artist,
                album: trackData.album || track.album,
                preview: trackData.preview || null
            };
            
            console.log('Successfully fetched track data:', mergedTrack);
            return mergedTrack;
        } catch (error) {
            console.error('Error fetching track data:', error);
            // Use the window's playTrack function directly as fallback
            if (window.playTrack && window.currentPlaylist && window.currentPlaylist.length > 0) {
                // Try to find the track in the current playlist
                const matchingTrack = window.currentPlaylist.find(t => t.id === track.id);
                if (matchingTrack && matchingTrack.preview) {
                    console.log('Found matching track in current playlist:', matchingTrack);
                    return matchingTrack;
                }
            }
            // Return original track if fetch fails and no fallback available
            return track;
        }
    },
    
    // Fallback method to play a track if playTrack is not available
    playTrackFallback: function(track) {
        // Check if track has preview URL
        if (!track || !track.preview) {
            if (window.showNotification) {
                window.showNotification('No preview available for this track', 'error');
            } else {
                console.error('No preview URL available for this track');
            }
            return;
        }
        
        // Update global variables to match the app.js implementation
        window.currentTrack = track;
        window.currentPlaylist = [track]; // Single track as playlist
        window.currentIndex = 0;
        
        // Update player UI
        const currentTrackImg = document.getElementById('current-track-img');
        const currentTrackName = document.getElementById('current-track-name');
        const currentTrackArtist = document.getElementById('current-track-artist');
        
        if (currentTrackImg) {
            currentTrackImg.src = track.album?.cover_medium || track.artist?.picture_medium || 'https://via.placeholder.com/60';
        }
        
        if (currentTrackName) {
            currentTrackName.textContent = track.title;
        }
        
        if (currentTrackArtist) {
            currentTrackArtist.textContent = track.artist?.name || 'Unknown Artist';
        }
        
        // Set audio source and play
        if (window.audioPlayer) {
            // Add a console log to debug the preview URL
            console.log('Setting audio source to:', track.preview);
            window.audioPlayer.src = track.preview;
            window.audioPlayer.play()
                .then(() => {
                    window.isPlaying = true;
                    console.log('Track playback started successfully');
                    
                    // Update UI
                    this.updatePlayButton();
                    
                    // Update the visualizer if available
                    if (window.forceVisualizer && window.forceVisualizer.toggleVisualizer) {
                        window.forceVisualizer.toggleVisualizer(true);
                    }
                    
                    // Show notification
                    if (window.showNotification) {
                        window.showNotification(`Now playing: ${track.title}`, 'success');
                    }
                })
                .catch(error => {
                    console.error('Error playing track:', error);
                    if (window.showNotification) {
                        window.showNotification('Failed to play track', 'error');
                    }
                });
        }
    },
    
    // Update play button to match current state
    updatePlayButton: function() {
        const playButton = document.getElementById('play-button');
        const icon = playButton?.querySelector('i');
        
        if (icon) {
            if (window.isPlaying) {
                icon.className = 'fas fa-pause';
                playButton.classList.add('playing');
            } else {
                icon.className = 'fas fa-play';
                playButton.classList.remove('playing');
            }
        }
        
        // Also update fullscreen player button if it exists
        const fsPlayButton = document.getElementById('fs-play-button');
        const fsIcon = fsPlayButton?.querySelector('i');
        
        if (fsIcon) {
            fsIcon.className = window.isPlaying ? 'fas fa-pause' : 'fas fa-play';
        }
    }
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize after a short delay to ensure app.js is loaded
    setTimeout(() => {
        PlaylistManager.init();
    }, 1000);
});

// Export to window for access from other scripts
window.PlaylistManager = PlaylistManager;
