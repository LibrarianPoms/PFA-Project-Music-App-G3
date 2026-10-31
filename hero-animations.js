/**
 * Hero Section Animations for Wavve Music Website
 * Creates animated music wave bars and floating music notes
 */

class HeroAnimations {
    constructor() {
        this.waveContainer = document.querySelector('.music-wave');
        this.notesContainer = document.querySelector('.floating-notes');
        this.barCount = 20; // Number of bars in the music wave
        this.minHeight = 5; // Minimum height for bars in px
        this.maxHeight = 60; // Maximum height for bars in px
        this.animationSpeed = 0.2; // Speed of the animation
        this.noteSymbols = ['♪', '♫', '♬', '♩', '♭', '♮']; // Music note symbols
        
        this.init();
    }
    
    init() {
        this.createMusicWave();
        this.animateMusicWave();
        this.startFloatingNotes();
    }
    
    createMusicWave() {
        // Create the bars for the music wave
        for (let i = 0; i < this.barCount; i++) {
            const bar = document.createElement('div');
            bar.className = 'bar';
            
            // Set random initial height
            const height = this.getRandomHeight();
            bar.style.height = `${height}px`;
            
            // Add transition for smooth animation
            bar.style.transition = `height ${this.animationSpeed}s ease`;
            
            this.waveContainer.appendChild(bar);
        }
    }
    
    animateMusicWave() {
        const bars = this.waveContainer.querySelectorAll('.bar');
        
        // Function to animate each bar
        const animateBars = () => {
            bars.forEach(bar => {
                const height = this.getRandomHeight();
                bar.style.height = `${height}px`;
            });
            
            // Schedule the next animation frame
            setTimeout(animateBars, this.animationSpeed * 1000);
        };
        
        // Start the animation
        animateBars();
    }
    
    startFloatingNotes() {
        // Create a floating note every 800ms
        setInterval(() => this.createFloatingNote(), 800);
    }
    
    createFloatingNote() {
        const note = document.createElement('div');
        note.className = 'note';
        
        // Random position along the width
        const leftPos = Math.random() * 100;
        note.style.left = `${leftPos}%`;
        
        // Random starting position at the bottom
        const bottomPos = Math.random() * 20;
        note.style.bottom = `${bottomPos}%`;
        
        // Random rotation
        const rotation = Math.random() * 40 - 20;
        note.style.transform = `rotate(${rotation}deg)`;
        
        // Random note symbol
        const symbolIndex = Math.floor(Math.random() * this.noteSymbols.length);
        note.textContent = this.noteSymbols[symbolIndex];
        
        // Add to container
        this.notesContainer.appendChild(note);
        
        // Remove note after animation completes
        setTimeout(() => {
            if (note.parentNode === this.notesContainer) {
                this.notesContainer.removeChild(note);
            }
        }, 4000);
    }
    
    getRandomHeight() {
        return Math.floor(Math.random() * (this.maxHeight - this.minHeight + 1)) + this.minHeight;
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const heroAnimations = new HeroAnimations();
});
