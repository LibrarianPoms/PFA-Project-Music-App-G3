// API Configuration
const API_BASE_URL = '/api?endpoint=';

// DOM Elements
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const discoverContainer = document.getElementById('discover-container');
const trendingContainer = document.getElementById('trending-container');
const playlistContainer = document.getElementById('playlist-container');
const currentTrackImg = document.getElementById('current-track-img');
const currentTrackName = document.getElementById('current-track-name');
const currentTrackArtist = document.getElementById('current-track-artist');
const playButton = document.getElementById('play-button');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
const progressBar = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const volumeControl = document.getElementById('volume');
const ctaButton = document.querySelector('.cta-button');
const header = document.querySelector('header');
const logo = document.querySelector('.logo h1');
const navLinks = document.querySelectorAll('nav ul li a');
const heroSection = document.querySelector('.hero');

// Full-screen player elements
const fullscreenPlayer = document.getElementById('fullscreen-player');
const closeFullscreenBtn = document.getElementById('close-fullscreen-player');
const fsAlbumCover = document.getElementById('fs-album-cover');
const fsTrackName = document.getElementById('fs-track-name');
const fsArtistName = document.getElementById('fs-artist-name');
const fsPlayButton = document.getElementById('fs-play-button');
const fsPrevButton = document.getElementById('fs-prev-button');
const fsNextButton = document.getElementById('fs-next-button');
const fsProgress = document.getElementById('fs-progress');
const fsCurrentTime = document.getElementById('fs-current-time');
const fsDuration = document.getElementById('fs-duration');
const fsProgressBar = document.querySelector('.fs-progress-bar');

// Audio Player
let audioPlayer = new Audio();
let isPlaying = false;
let currentTrack = null;
let currentPlaylist = [];
let currentIndex = 0;

// Animation configuration
const animationConfig = {
    fadeInDelay: 100,
    staggerDelay: 100,
    scrollRevealThreshold: 0.2
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Add initial animations
    animateHeroElements();
    initScrollAnimations();
    
    // Load initial data
    fetchNewReleases();
    fetchTrendingTracks();
    fetchFeaturedPlaylists();
    
    // Set up event listeners
    setupEventListeners();
    addTrackEventListeners();
    
    // Add particle background
    initParticleBackground();
    
    // Set up fullscreen player
    setupFullscreenPlayer();
    
    // Handle Authentication
    if (typeof window.WavveAuth !== 'undefined') {
        initializeAuthUI();
    } else {
        // Load auth script dynamically if not already loaded
        const authScript = document.createElement('script');
        authScript.src = 'auth/auth.js';
        authScript.onload = initializeAuthUI;
        document.head.appendChild(authScript);
    }
});

// Set up event listeners
function setupEventListeners() {
    // Search functionality
    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Player controls
    playButton.addEventListener('click', togglePlay);
    prevButton.addEventListener('click', playPrevious);
    nextButton.addEventListener('click', playNext);
    volumeControl.addEventListener('input', adjustVolume);
    
    // Progress bar updates
    audioPlayer.addEventListener('timeupdate', () => {
        updateProgress();
        updateFullscreenProgress();
    });
    audioPlayer.addEventListener('ended', playNext);
    
    // Progress bar interaction
    progressBar.addEventListener('click', (e) => {
        const progressWidth = progressBar.clientWidth;
        const clickPosition = e.offsetX;
        const seekTime = (clickPosition / progressWidth) * audioPlayer.duration;
        audioPlayer.currentTime = seekTime;
    });
    
    // CTA button
    ctaButton.addEventListener('click', () => {
        document.getElementById('discover').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    });
    
    // Scroll events for header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Simple hash-based navigation
    window.addEventListener('hashchange', handleHashChange);
    
    // Also handle navigation for initial page load
    handleHashChange();
    
    // Hover effects for nav links
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            if (!link.classList.contains('active')) {
                link.style.transform = 'translateY(-3px)';
            }
        });
        
        link.addEventListener('mouseleave', () => {
            if (!link.classList.contains('active')) {
                link.style.transform = 'translateY(0)';
            }
        });
    });
}

// Add event listeners for track actions
function addTrackEventListeners() {
    // Add to favorites
    document.querySelectorAll('.track-action-favorite, .card-favorite-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const trackId = this.closest('.track-item, .music-card').getAttribute('data-id');
            if (trackId) {
                // Get track data
                fetchTrack(trackId)
                    .then(track => {
                        addToFavorites(track);
                    })
                    .catch(error => {
                        console.error('Error fetching track:', error);
                    });
            }
        });
    });
    
    // Add to playlist
    document.querySelectorAll('.track-action-playlist, .card-playlist-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const trackId = this.closest('.track-item, .music-card').getAttribute('data-id');
            if (trackId) {
                // Show playlist selection modal
                showPlaylistModal(trackId);
            }
        });
    });
    
    // Play track
    document.querySelectorAll('.track-play, .card-play-btn, .play-overlay').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const trackId = this.closest('.track-item, .music-card').getAttribute('data-id');
            if (trackId) {
                // Get track data
                fetchTrack(trackId)
                    .then(track => {
                        playTrack(track);
                        addToHistory(track);
                    })
                    .catch(error => {
                        console.error('Error fetching track:', error);
                    });
            }
        });
    });
}

// Show playlist selection modal
function showPlaylistModal(trackId) {
    // Get playlists
    const playlists = JSON.parse(localStorage.getItem('wavve_playlists') || '[]');
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Add to Playlist</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="playlist-list">
                    ${playlists.length > 0 ? 
                        playlists.map(playlist => `
                            <div class="playlist-item" data-id="${playlist.id}">
                                <div class="playlist-image">
                                    <img src="${playlist.cover || 'https://via.placeholder.com/50'}" alt="${playlist.title}">
                                </div>
                                <div class="playlist-info">
                                    <div class="playlist-name">${playlist.title}</div>
                                    <div class="playlist-tracks">${playlist.nb_tracks} tracks</div>
                                </div>
                            </div>
                        `).join('') : 
                        '<div class="empty-playlists">No playlists yet. Create one below.</div>'
                    }
                </div>
                <div class="create-playlist-form">
                    <input type="text" id="new-playlist-name" placeholder="New playlist name">
                    <button id="create-playlist-btn">Create</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Close modal
    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    });
    
    // Create new playlist
    modal.querySelector('#create-playlist-btn').addEventListener('click', () => {
        const name = modal.querySelector('#new-playlist-name').value.trim();
        if (name) {
            fetchTrack(trackId)
                .then(track => {
                    const newPlaylist = createPlaylist(name, [track]);
                    modal.classList.remove('show');
                    setTimeout(() => {
                        modal.remove();
                    }, 300);
                })
                .catch(error => {
                    console.error('Error fetching track:', error);
                });
        }
    });
    
    // Add to existing playlist
    modal.querySelectorAll('.playlist-item').forEach(item => {
        item.addEventListener('click', () => {
            const playlistId = item.getAttribute('data-id');
            fetchTrack(trackId)
                .then(track => {
                    addToPlaylist(playlistId, track);
                    modal.classList.remove('show');
                    setTimeout(() => {
                        modal.remove();
                    }, 300);
                })
                .catch(error => {
                    console.error('Error fetching track:', error);
                });
        });
    });
}

// Fetch track by ID
function fetchTrack(trackId) {
    return fetch(`/proxy/track/${trackId}`)
        .then(response => response.json());
}

// Set up fullscreen player
function setupFullscreenPlayer() {
    console.log('Setting up fullscreen player controls...');
    
    // Check if all elements are available
    if (!fullscreenPlayer) {
        console.error('Fullscreen player element not found!');
        return;
    }
    
    // Open fullscreen player when clicking on the current track in the player
    if (currentTrackImg) {
        currentTrackImg.addEventListener('click', () => {
            if (currentTrack) {
                openFullscreenPlayer();
                console.log('Opening fullscreen player');
            }
        });
    }
    
    // Close fullscreen player
    if (closeFullscreenBtn) {
        console.log('Setting up close button');
        closeFullscreenBtn.addEventListener('click', () => {
            console.log('Close button clicked');
            closeFullscreenPlayer();
        });
    } else {
        console.error('Close button not found!');
    }
    
    // Fullscreen player controls
    if (fsPlayButton) {
        console.log('Setting up play button');
        fsPlayButton.addEventListener('click', () => {
            console.log('Play button clicked');
            togglePlay();
        });
    } else {
        console.error('Play button not found!');
    }
    
    if (fsPrevButton) {
        fsPrevButton.addEventListener('click', () => {
            console.log('Previous button clicked');
            playPrevious();
        });
    }
    
    if (fsNextButton) {
        fsNextButton.addEventListener('click', () => {
            console.log('Next button clicked');
            playNext();
        });
    }
    
    // Fullscreen progress bar
    if (fsProgressBar) {
        fsProgressBar.addEventListener('click', (e) => {
            if (!audioPlayer.duration) return;
            
            const progressWidth = fsProgressBar.clientWidth;
            const clickPosition = e.offsetX;
            const seekTime = (clickPosition / progressWidth) * audioPlayer.duration;
            audioPlayer.currentTime = seekTime;
        });
    }
    
    // Update fullscreen player when track changes
    audioPlayer.addEventListener('play', updateFullscreenPlayer);
    
    // Ensure progress bar updates continuously
    audioPlayer.addEventListener('timeupdate', updateFullscreenProgress);
    
    console.log('Fullscreen player setup complete');
}

// Update fullscreen progress separately to ensure it's always updated
function updateFullscreenProgress() {
    if (!audioPlayer.duration || !fsProgress) return;
    
    const currentTime = audioPlayer.currentTime;
    const duration = audioPlayer.duration;
    const progressPercent = (currentTime / duration) * 100;
    
    // Update fullscreen player progress
    document.querySelector('#fs-progress').style.width = `${progressPercent}%`;
    if (fsCurrentTime) fsCurrentTime.textContent = formatTime(currentTime);
    if (fsDuration) fsDuration.textContent = formatTime(duration);
}

// Open fullscreen player
function openFullscreenPlayer() {
    if (!currentTrack) return;
    
    // Update fullscreen player UI
    updateFullscreenPlayer();
    
    // Show fullscreen player
    fullscreenPlayer.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

// Close fullscreen player
function closeFullscreenPlayer() {
    // Add exit animation
    fullscreenPlayer.classList.add('exiting');
    
    // Wait for animation to complete before hiding completely
    setTimeout(() => {
        fullscreenPlayer.classList.remove('active');
        fullscreenPlayer.classList.remove('exiting');
        document.body.style.overflow = ''; // Restore scrolling
    }, 300);
    
    // Provide feedback via subtle notification
    showNotification('Player minimized', 'info');
}

// Update fullscreen player UI
function updateFullscreenPlayer() {
    if (!currentTrack) return;
    
    // Update track info
    fsAlbumCover.src = currentTrack.album?.cover_xl || currentTrack.album?.cover_big || currentTrack.album?.cover_medium || currentTrack.artist?.picture_xl || 'https://via.placeholder.com/500';
    fsTrackName.textContent = currentTrack.title;
    fsArtistName.textContent = currentTrack.artist?.name || 'Unknown Artist';
    
    // Update play button
    updateFullscreenPlayButton();
}

// Update fullscreen play button
function updateFullscreenPlayButton() {
    const icon = fsPlayButton.querySelector('i');
    if (isPlaying) {
        icon.className = 'fas fa-pause';
    } else {
        icon.className = 'fas fa-play';
    }
}

// Add particle background to hero section
function initParticleBackground() {
    const particleContainer = document.createElement('div');
    particleContainer.classList.add('particles-container');
    heroSection.appendChild(particleContainer);
    
    for (let i = 0; i < 50; i++) {
        createParticle(particleContainer);
    }
}

// Create a single particle
function createParticle(container) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Random position, size and animation duration
    const size = Math.random() * 5 + 2;
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;
    const opacity = Math.random() * 0.5 + 0.1;
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${posX}%`;
    particle.style.top = `${posY}%`;
    particle.style.opacity = opacity;
    particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
    
    container.appendChild(particle);
}

// Animate hero section elements
function animateHeroElements() {
    const heroTitle = document.querySelector('.hero h2');
    const heroText = document.querySelector('.hero p');
    const heroButton = document.querySelector('.hero .cta-button');
    
    setTimeout(() => {
        heroTitle.style.opacity = '1';
        heroTitle.style.transform = 'translateY(0)';
    }, 300);
    
    setTimeout(() => {
        heroText.style.opacity = '1';
        heroText.style.transform = 'translateY(0)';
    }, 600);
    
    setTimeout(() => {
        heroButton.style.opacity = '1';
        heroButton.style.transform = 'translateY(0)';
    }, 900);
}

// Initialize scroll-based animations
function initScrollAnimations() {
    // Create an Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: animationConfig.scrollRevealThreshold
    });
    
    // Observe section titles
    const sectionTitles = document.querySelectorAll('section h2');
    sectionTitles.forEach(title => {
        title.classList.add('scroll-animate');
        observer.observe(title);
    });
}

// Apply staggered animations to cards
function applyStaggeredAnimations(elements) {
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, animationConfig.fadeInDelay + (index * animationConfig.staggerDelay));
    });
}

// Fetch new releases for the discover section
async function fetchNewReleases() {
    try {
        showLoading(discoverContainer);
        
        // For demo purposes, we'll use chart data since new releases endpoint requires authentication
        const response = await fetch(`${API_BASE_URL}chart/0/tracks&limit=10`);
        const data = await response.json();
        
        console.log('New releases data:', data);
        
        if (data && data.data && data.data.length > 0) {
            renderMusicCards(data.data, discoverContainer);
        } else {
            console.error('No data in response:', data);
            // Fallback to sample data
            renderMusicCards(getSampleTracks(), discoverContainer);
        }
    } catch (error) {
        console.error('Error fetching new releases:', error);
        showError(discoverContainer, 'Failed to load new releases');
        
        // Fallback to sample data if API fails
        renderMusicCards(getSampleTracks(), discoverContainer);
    }
}

// Fetch trending tracks
async function fetchTrendingTracks() {
    try {
        showLoading(trendingContainer);
        
        const response = await fetch(`${API_BASE_URL}chart/0/tracks&limit=10`);
        const data = await response.json();
        
        console.log('Trending tracks data:', data);
        
        if (data && data.data && data.data.length > 0) {
            renderMusicCards(data.data, trendingContainer);
        } else {
            console.error('No data in response:', data);
            // Fallback to sample data
            renderMusicCards(getSampleTracks(), trendingContainer);
        }
    } catch (error) {
        console.error('Error fetching trending tracks:', error);
        showError(trendingContainer, 'Failed to load trending tracks');
        
        // Fallback to sample data if API fails
        renderMusicCards(getSampleTracks(), trendingContainer);
    }
}

// Fetch featured playlists
async function fetchFeaturedPlaylists() {
    try {
        showLoading(playlistContainer);
        
        const response = await fetch(`${API_BASE_URL}chart/0/playlists&limit=6`);
        const data = await response.json();
        
        console.log('Playlists data:', data);
        
        if (data && data.data && data.data.length > 0) {
            renderPlaylistCards(data.data, playlistContainer);
        } else {
            console.error('No data in response:', data);
            // Fallback to sample data
            renderPlaylistCards(getSamplePlaylists(), playlistContainer);
        }
    } catch (error) {
        console.error('Error fetching playlists:', error);
        showError(playlistContainer, 'Failed to load playlists');
        
        // Fallback to sample data if API fails
        renderPlaylistCards(getSamplePlaylists(), playlistContainer);
    }
}

// Perform search
async function performSearch() {
    const query = searchInput.value.trim();
    
    if (!query) return;
    
    try {
        // Navigate to discover section
        window.location.hash = 'discover';
        
        // Update active navigation link
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => link.classList.remove('active'));
        document.getElementById('nav-discover').classList.add('active');
        
        // Show loading
        showLoading(discoverContainer);
        
        const response = await fetch(`${API_BASE_URL}search&q=${encodeURIComponent(query)}&limit=10`);
        const data = await response.json();
        
        console.log('Search results:', data);
        
        if (data && data.data && data.data.length > 0) {
            renderMusicCards(data.data, discoverContainer);
            // Add a search results heading
            const resultsHeading = document.createElement('h3');
            resultsHeading.textContent = `Search results for "${query}"`;  
            resultsHeading.className = 'search-results-heading';
            discoverContainer.prepend(resultsHeading);
            
            // Scroll to discover section
            document.getElementById('discover').scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            console.error('No search results found:', data);
            showError(discoverContainer, 'No results found for "' + query + '"');
        }
    } catch (error) {
        console.error('Error searching:', error);
        showError(discoverContainer, 'Search failed. Please try again.');
    }
}

// Load playlist tracks
async function loadPlaylist(playlistId) {
    try {
        showLoading(discoverContainer);
        
        const response = await fetch(`${API_BASE_URL}playlist/${playlistId}/tracks&limit=10`);
        const data = await response.json();
        
        console.log('Playlist tracks:', data);
        
        if (data && data.data && data.data.length > 0) {
            renderMusicCards(data.data, discoverContainer);
            document.getElementById('discover').scrollIntoView({ behavior: 'smooth' });
        } else {
            console.error('No playlist tracks found:', data);
            showError(discoverContainer, 'Failed to load playlist');
            
            // Fallback to sample data if API fails
            renderMusicCards(getSampleTracks(), discoverContainer);
        }
    } catch (error) {
        console.error('Error loading playlist:', error);
        showError(discoverContainer, 'Failed to load playlist');
        
        // Fallback to sample data if API fails
        renderMusicCards(getSampleTracks(), discoverContainer);
    }
}

// Play previous track
function playPrevious() {
    if (!currentTrack) {
        showNotification('No track is currently playing', 'info');
        return;
    }
    
    if (currentPlaylist.length === 0 || currentIndex === 0) {
        // If no playlist or first track, just restart current track
        if (audioPlayer.currentTime > 3) { // If more than 3 seconds in, just restart
            audioPlayer.currentTime = 0;
            showNotification('Restarting current track', 'info');
        } else {
            showNotification('This is the first track', 'info');
        }
        return;
    }
    
    currentIndex = (currentIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
    
    try {
        playTrack(currentPlaylist[currentIndex], currentPlaylist);
        showNotification('Playing previous track', 'info');
    } catch (error) {
        console.error('Error playing previous track:', error);
        showNotification('Failed to play previous track', 'error');
    }
}

// Play next track
function playNext() {
    if (!currentTrack) {
        showNotification('No track is currently playing', 'info');
        return;
    }
    
    if (!currentPlaylist.length) {
        showNotification('No playlist available', 'info');
        return;
    }
    
    currentIndex = (currentIndex + 1) % currentPlaylist.length;
    const nextTrack = currentPlaylist[currentIndex];
    
    if (nextTrack) {
        try {
            playTrack(nextTrack, currentPlaylist);
            showNotification('Playing next track', 'info');
        } catch (error) {
            console.error('Error playing next track:', error);
            showNotification('Failed to play next track', 'error');
            
            // Try to play the next track if this one fails
            if (currentPlaylist.length > currentIndex + 1) {
                setTimeout(() => {
                    currentIndex++;
                    playNext();
                }, 1000);
            }
        }
    } else {
        console.error('No next track available');
        showNotification('No next track available', 'error');
    }
}

// Play a track
function playTrack(track, playlist = []) {
    if (!track || !track.preview) {
        console.error('No preview URL available for this track');
        showNotification('No preview available for this track', 'error');
        return;
    }
    
    // Update current track and playlist
    currentTrack = track;
    
    if (playlist && playlist.length > 0) {
        currentPlaylist = [...playlist];
        currentIndex = currentPlaylist.findIndex(item => item.id === track.id);
        if (currentIndex === -1) currentIndex = 0;
    }
    
    // Update player UI
    currentTrackImg.src = track.album?.cover_medium || track.artist?.picture_medium || 'https://via.placeholder.com/60';
    currentTrackName.textContent = track.title;
    currentTrackArtist.textContent = track.artist?.name || 'Unknown Artist';
    
    // Set audio source and play
    audioPlayer.src = track.preview;
    audioPlayer.play()
        .then(() => {
            isPlaying = true;
            updatePlayButton();
            updateFullscreenPlayButton();
            
            // Add active class to the current track card
            const trackCards = document.querySelectorAll('.music-card');
            trackCards.forEach(card => {
                if (card.getAttribute('data-track-id') === track.id.toString()) {
                    card.classList.add('active');
                    
                    // Add pulse animation to active card
                    const pulseEffect = document.createElement('div');
                    pulseEffect.classList.add('pulse-effect');
                    card.appendChild(pulseEffect);
                } else {
                    card.classList.remove('active');
                    const existingPulse = card.querySelector('.pulse-effect');
                    if (existingPulse) {
                        existingPulse.remove();
                    }
                }
            });
            
            // Show notification
            showNotification(`Now playing: ${track.title}`, 'success');
        })
        .catch(error => {
            console.error('Error playing track:', error);
            showNotification('Failed to play track', 'error');
            
            // Try to play next track if current one fails
            if (currentPlaylist.length > 1) {
                setTimeout(() => playNext(), 1000);
            }
        });
}

// Toggle play/pause
function togglePlay() {
    if (!currentTrack) {
        console.log('No track selected');
        showNotification('No track selected. Please select a track first.', 'info');
        return;
    }
    
    // Add button press animation
    const playButtons = [playButton, fsPlayButton];
    playButtons.forEach(btn => {
        if (btn) {
            btn.classList.add('button-pressed');
            setTimeout(() => btn.classList.remove('button-pressed'), 200);
        }
    });
    
    if (isPlaying) {
        // Pause
        audioPlayer.pause();
        isPlaying = false;
        showNotification(`Paused: ${currentTrack.title}`, 'info', 1000);
    } else {
        // Play
        audioPlayer.play()
            .then(() => {
                isPlaying = true;
                // Update play buttons
                updatePlayButton();
                showNotification(`Now playing: ${currentTrack.title}`, 'success', 1500);
            })
            .catch(error => {
                console.error('Error playing audio:', error);
                showNotification('Error playing audio', 'error');
            });
    }
    
    updatePlayButton();
    updateFullscreenPlayButton();
}

// Update play button icon
function updatePlayButton() {
    const icon = playButton.querySelector('i');
    if (isPlaying) {
        icon.className = 'fas fa-pause';
        playButton.classList.add('playing');
    } else {
        icon.className = 'fas fa-play';
        playButton.classList.remove('playing');
    }
}

// Update progress bar
function updateProgress() {
    if (!audioPlayer.duration) return;
    
    const currentTime = audioPlayer.currentTime;
    const duration = audioPlayer.duration;
    const progressPercent = (currentTime / duration) * 100;
    
    // Update main player progress
    document.querySelector('#progress').style.width = `${progressPercent}%`;
    currentTimeEl.textContent = formatTime(currentTime);
    durationEl.textContent = formatTime(duration);
    
    // Add waveform effect to progress bar
    updateWaveformEffect(progressPercent);
}

// Update waveform effect on progress bar
function updateWaveformEffect(progressPercent) {
    const waveContainer = document.querySelector('.wave-container');
    
    if (!waveContainer) {
        const container = document.createElement('div');
        container.classList.add('wave-container');
        progressBar.appendChild(container);
        
        for (let i = 0; i < 10; i++) {
            const wave = document.createElement('div');
            wave.classList.add('wave');
            wave.style.left = `${i * 10}%`;
            wave.style.animationDelay = `${i * 0.1}s`;
            container.appendChild(wave);
        }
    }
}

// Format time in MM:SS
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Adjust volume
function adjustVolume() {
    audioPlayer.volume = volumeControl.value / 100;
}

// Show loading state
function showLoading(container) {
    container.innerHTML = '<div class="loading"></div>';
}

// Show error message
function showError(container, message) {
    container.innerHTML = `<div class="error-message">${message}</div>`;
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.classList.add('notification', type);
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <p>${message}</p>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Sample data for fallback when API fails
function getSampleTracks() {
    return [
        {
            id: 1,
            title: "Blinding Lights",
            preview: "https://cdns-preview-c.dzcdn.net/stream/c-cca63b2c92773d54e61c5b4d17695bd2-8.mp3",
            artist: { name: "The Weeknd" },
            album: { cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/fd00ebd6d30d7253f813dcc1a76a72e7/250x250-000000-80-0-0.jpg" }
        },
        {
            id: 2,
            title: "As It Was",
            preview: "https://cdns-preview-d.dzcdn.net/stream/c-d6cfc27f7c4ab9639ea4c1b6dae84d1a-3.mp3",
            artist: { name: "Harry Styles" },
            album: { cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/b0153a7b550f0c5f29c19a0d1dcd0e0f/250x250-000000-80-0-0.jpg" }
        },
        {
            id: 3,
            title: "Stay",
            preview: "https://cdns-preview-0.dzcdn.net/stream/c-0f21e8b9f5f8eb7b521f250795a7d48c-3.mp3",
            artist: { name: "The Kid LAROI, Justin Bieber" },
            album: { cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/63932f7c75963d8a58c28e3d9455dd37/250x250-000000-80-0-0.jpg" }
        },
        {
            id: 4,
            title: "Easy On Me",
            preview: "https://cdns-preview-f.dzcdn.net/stream/c-f91f04f9a14b6589f4493458c4986720-4.mp3",
            artist: { name: "Adele" },
            album: { cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/878da868e1d0f6f9fbd00d6a3c20d7d9/250x250-000000-80-0-0.jpg" }
        },
        {
            id: 5,
            title: "INDUSTRY BABY",
            preview: "https://cdns-preview-1.dzcdn.net/stream/c-13039fed16a173733f227b0bec631034-4.mp3",
            artist: { name: "Lil Nas X, Jack Harlow" },
            album: { cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/5d3adaa64424e2cedb49e9f6c8b527e1/250x250-000000-80-0-0.jpg" }
        },
        {
            id: 6,
            title: "Heat Waves",
            preview: "https://cdns-preview-b.dzcdn.net/stream/c-b2ce0ffd14a7b571d1a9047c3d0fe6a2-6.mp3",
            artist: { name: "Glass Animals" },
            album: { cover_medium: "https://e-cdns-images.dzcdn.net/images/cover/fd3cc55442f5f6c32f434c93116b4b3b/250x250-000000-80-0-0.jpg" }
        }
    ];
}

function getSamplePlaylists() {
    return [
        {
            id: 1,
            title: "Today's Top Hits",
            picture_medium: "https://e-cdns-images.dzcdn.net/images/playlist/3b5ee1c0cca6a5a4d7e54d53d5b9d0ae/250x250-000000-80-0-0.jpg",
            nb_tracks: 50
        },
        {
            id: 2,
            title: "RapCaviar",
            picture_medium: "https://e-cdns-images.dzcdn.net/images/playlist/b6e5ccd1c1b7adb9c5f8ea1c6d4a7e3a/250x250-000000-80-0-0.jpg",
            nb_tracks: 50
        },
        {
            id: 3,
            title: "Rock Classics",
            picture_medium: "https://e-cdns-images.dzcdn.net/images/playlist/a0c8c9c6c6a6d1d4e1f3b4d5e6f7a8b9/250x250-000000-80-0-0.jpg",
            nb_tracks: 100
        },
        {
            id: 4,
            title: "Chill Hits",
            picture_medium: "https://e-cdns-images.dzcdn.net/images/playlist/1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f/250x250-000000-80-0-0.jpg",
            nb_tracks: 75
        }
    ];
}

// Function to save a track to favorites
function addToFavorites(track) {
    // Get existing favorites from localStorage
    const favorites = JSON.parse(localStorage.getItem('wavve_favorites') || '[]');
    
    // Check if track is already in favorites
    const exists = favorites.some(item => item.id === track.id);
    
    if (!exists) {
        // Add track to favorites
        favorites.push(track);
        
        // Save back to localStorage
        localStorage.setItem('wavve_favorites', JSON.stringify(favorites));
        
        // Update user data if logged in
        const currentUser = localStorage.getItem('wavve_current_user');
        if (currentUser) {
            const userData = JSON.parse(currentUser);
            userData.favorites = favorites;
            localStorage.setItem('wavve_current_user', JSON.stringify(userData));
        }
        
        showNotification('Added to Favorites', `${track.title} has been added to your favorites`, 'success');
    } else {
        showNotification('Already in Favorites', `${track.title} is already in your favorites`, 'info');
    }
}

// Function to add track to history
function addToHistory(track) {
    // Get existing history from localStorage
    const history = JSON.parse(localStorage.getItem('wavve_history') || '[]');
    
    // Remove track if it already exists in history
    const filteredHistory = history.filter(item => item.id !== track.id);
    
    // Add track to beginning of history
    filteredHistory.unshift(track);
    
    // Limit history to 20 items
    const limitedHistory = filteredHistory.slice(0, 20);
    
    // Save back to localStorage
    localStorage.setItem('wavve_history', JSON.stringify(limitedHistory));
    
    // Update user data if logged in
    const currentUser = localStorage.getItem('wavve_current_user');
    if (currentUser) {
        const userData = JSON.parse(currentUser);
        userData.history = limitedHistory;
        localStorage.setItem('wavve_current_user', JSON.stringify(userData));
    }
}

// Function to create a new playlist
function createPlaylist(name, tracks = []) {
    // Get existing playlists from localStorage
    const playlists = JSON.parse(localStorage.getItem('wavve_playlists') || '[]');
    
    // Create new playlist
    const newPlaylist = {
        id: Date.now().toString(),
        title: name,
        cover: tracks.length > 0 ? tracks[0].album.cover_medium : 'https://via.placeholder.com/150',
        nb_tracks: tracks.length,
        tracks: tracks
    };
    
    // Add playlist to playlists
    playlists.push(newPlaylist);
    
    // Save back to localStorage
    localStorage.setItem('wavve_playlists', JSON.stringify(playlists));
    
    // Update user data if logged in
    const currentUser = localStorage.getItem('wavve_current_user');
    if (currentUser) {
        const userData = JSON.parse(currentUser);
        userData.playlists = playlists;
        localStorage.setItem('wavve_current_user', JSON.stringify(userData));
    }
    
    showNotification('Playlist Created', `${name} has been created`, 'success');
    return newPlaylist;
}

// Function to add track to playlist
function addToPlaylist(playlistId, track) {
    // Get existing playlists from localStorage
    const playlists = JSON.parse(localStorage.getItem('wavve_playlists') || '[]');
    
    // Find playlist
    const playlistIndex = playlists.findIndex(playlist => playlist.id === playlistId);
    
    if (playlistIndex !== -1) {
        // Check if track is already in playlist
        const exists = playlists[playlistIndex].tracks.some(item => item.id === track.id);
        
        if (!exists) {
            // Add track to playlist
            playlists[playlistIndex].tracks.push(track);
            playlists[playlistIndex].nb_tracks = playlists[playlistIndex].tracks.length;
            
            // Save back to localStorage
            localStorage.setItem('wavve_playlists', JSON.stringify(playlists));
            
            // Update user data if logged in
            const currentUser = localStorage.getItem('wavve_current_user');
            if (currentUser) {
                const userData = JSON.parse(currentUser);
                userData.playlists = playlists;
                localStorage.setItem('wavve_current_user', JSON.stringify(userData));
            }
            
            showNotification('Added to Playlist', `${track.title} has been added to ${playlists[playlistIndex].title}`, 'success');
        } else {
            showNotification('Already in Playlist', `${track.title} is already in ${playlists[playlistIndex].title}`, 'info');
        }
    }
}

// Render music cards
function renderMusicCards(tracks, container) {
    container.innerHTML = '';
    
    if (!tracks || tracks.length === 0) {
        container.innerHTML = '<p class="no-results">No tracks found</p>';
        return;
    }
    
    tracks.forEach(track => {
        const card = document.createElement('div');
        card.className = 'music-card';
        card.setAttribute('data-track-id', track.id);
        
        const coverImage = track.album?.cover_medium || track.artist?.picture_medium || 'https://via.placeholder.com/250';
        
        card.innerHTML = `
            <div class="card-image-container">
                <img src="${coverImage}" alt="${track.title}">
                <div class="play-overlay">
                    <i class="fas fa-play"></i>
                </div>
            </div>
            <div class="music-info">
                <h3>${track.title}</h3>
                <p>${track.artist?.name || 'Unknown Artist'}</p>
            </div>
        `;
        
        card.addEventListener('click', () => {
            playTrack(track, tracks);
            
            // Open fullscreen player
            openFullscreenPlayer();
            
            // Add ripple effect on click
            const ripple = document.createElement('div');
            ripple.classList.add('ripple');
            card.appendChild(ripple);
            
            const rect = card.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = `${size}px`;
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
        
        container.appendChild(card);
    });
    
    // Apply staggered animations to cards
    const cards = container.querySelectorAll('.music-card');
    applyStaggeredAnimations(cards);
}

// Render playlist cards
function renderPlaylistCards(playlists, container) {
    container.innerHTML = '';
    
    if (!playlists || playlists.length === 0) {
        container.innerHTML = '<p class="no-results">No playlists found</p>';
        return;
    }
    
    playlists.forEach(playlist => {
        const card = document.createElement('div');
        card.className = 'playlist-card';
        card.setAttribute('data-playlist-id', playlist.id);
        
        card.innerHTML = `
            <div class="card-image-container">
                <img src="${playlist.picture_medium || 'https://via.placeholder.com/250'}" alt="${playlist.title}">
                <div class="play-overlay">
                    <i class="fas fa-list"></i>
                </div>
            </div>
            <div class="playlist-info">
                <h3>${playlist.title}</h3>
                <p>${playlist.user?.name || 'Various Artists'}</p>
            </div>
        `;
        
        card.addEventListener('click', () => {
            loadPlaylist(playlist.id);
            
            // Add ripple effect on click
            const ripple = document.createElement('div');
            ripple.classList.add('ripple');
            card.appendChild(ripple);
            
            const rect = card.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = `${size}px`;
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
        
        container.appendChild(card);
    });
    
    // Apply staggered animations to cards
    const cards = container.querySelectorAll('.playlist-card');
    applyStaggeredAnimations(cards);
}

// Handle Authentication
function initializeAuthUI() {
    updateAuthDisplay();
    
    // Add event listener for logout
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (typeof window.WavveAuth !== 'undefined') {
                window.WavveAuth.logoutUser();
            } else {
                // Fallback if WavveAuth is not available
                localStorage.removeItem('wavve_current_user');
                window.location.reload();
            }
        });
    }
}

/**
 * Update the UI based on authentication status
 */
function updateAuthDisplay() {
    const authButtons = document.querySelector('.auth-buttons');
    if (!authButtons) return;
    
    const loginLink = document.querySelector('.login-link');
    const registerLink = document.querySelector('.register-link');
    const userMenu = document.querySelector('.user-menu');
    const usernameDisplay = document.getElementById('username-display');
    
    // Check if user is logged in
    const currentUser = localStorage.getItem('wavve_current_user');
    if (currentUser) {
        try {
            const userData = JSON.parse(currentUser);
            
            // Hide login and register links
            if (loginLink) loginLink.style.display = 'none';
            if (registerLink) registerLink.style.display = 'none';
            
            // Show user menu
            if (userMenu) {
                userMenu.style.display = 'block';
                if (usernameDisplay) {
                    usernameDisplay.textContent = userData.username || 'User';
                }
            }
            
            // Show welcome notification if just logged in (check for timestamp)
            const lastWelcome = sessionStorage.getItem('last_welcome');
            const loginTime = new Date(userData.loginTime).getTime();
            if (!lastWelcome || (loginTime > parseInt(lastWelcome))) {
                // Only show welcome message if logged in recently
                const now = new Date().getTime();
                if (now - loginTime < 5000) {
                    if (typeof window.WavveAuth !== 'undefined') {
                        window.WavveAuth.showNotification(
                            `Welcome, ${userData.username}!`, 
                            'Enjoy your personalized music experience', 
                            'success'
                        );
                    }
                }
                sessionStorage.setItem('last_welcome', now.toString());
            }
            
        } catch (e) {
            console.error('Error parsing user data:', e);
            // Reset auth UI if data is corrupted
            resetAuthUI();
        }
    } else {
        // No user is logged in
        resetAuthUI();
    }
}

/**
 * Reset the auth UI to show login/register links
 */
function resetAuthUI() {
    const loginLink = document.querySelector('.login-link');
    const registerLink = document.querySelector('.register-link');
    const userMenu = document.querySelector('.user-menu');
    
    if (loginLink) loginLink.style.display = '';
    if (registerLink) registerLink.style.display = '';
    if (userMenu) userMenu.style.display = 'none';
}

// Function to handle hash-based navigation
function handleHashChange() {
    // Get the current hash (without the # symbol)
    let hash = window.location.hash.substring(1) || 'home';
    
    // Remove active class from all nav links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to the current nav link
    const activeLink = document.getElementById('nav-' + hash);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Hide all sections
    document.querySelectorAll('section').forEach(section => {
        if (section.id && section.id !== 'music-player') {
            section.style.display = 'none';
        }
    });
    
    // Show hero section only for home
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.style.display = hash === 'home' ? 'flex' : 'none';
    }
    
    // Show the selected section
    if (hash !== 'home') {
        const targetSection = document.getElementById(hash);
        if (targetSection) {
            targetSection.style.display = 'block';
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

// Initialize application when document is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Wavve Music App...');
    
    // Setup all event listeners
    setupEventListeners();
    
    // Load initial content
    fetchNewReleases();
    fetchTrendingTracks();
    fetchFeaturedPlaylists();
    
    // Initialize auth UI
    initializeAuthUI();
    
    // Initialize animations
    animateHeroElements();
    initScrollAnimations();
    initParticleBackground();
    
    // Set up player controls
    setupFullscreenPlayer();
    
    // Handle initial hash if present
    handleHashChange();
    
    console.log('Wavve Music App initialized successfully');
});
