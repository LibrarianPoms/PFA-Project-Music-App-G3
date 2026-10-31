from flask import Flask, request, jsonify, send_from_directory, render_template, redirect, url_for, flash, session

# AI composer removed
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import urllib.request
import json
import os
import urllib.parse
import random
import secrets

app = Flask(__name__, template_folder='templates')
app.config['SECRET_KEY'] = secrets.token_hex(16)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///wavve.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database
db = SQLAlchemy(app)

# Initialize login manager
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# User model
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    display_name = db.Column(db.String(80))
    profile_image = db.Column(db.String(255), default='https://via.placeholder.com/150')
    bio = db.Column(db.Text)
    location = db.Column(db.String(100))
    website = db.Column(db.String(200))
    favorite_genre = db.Column(db.String(100))
    twitter_username = db.Column(db.String(100))
    instagram_username = db.Column(db.String(100))
    profile_header_image = db.Column(db.String(255), default='https://via.placeholder.com/1200x300')
    profile_theme = db.Column(db.String(50), default='default')
    featured_playlist_ids = db.Column(db.Text, default='[]')  # Stored as JSON string of playlist IDs
    showcase_playlists = db.Column(db.Boolean, default=False)  # Whether to show featured playlists on profile
    spotify_username = db.Column(db.String(100))
    youtube_channel = db.Column(db.String(200))
    profile_public = db.Column(db.Boolean, default=True)  # Whether profile is public or private
    show_listening_activity = db.Column(db.Boolean, default=True)  # Whether to show listening activity
    show_playlists = db.Column(db.Boolean, default=True)  # Whether to show all playlists on profile
    joined_date = db.Column(db.DateTime, default=datetime.utcnow)
    playlists = db.relationship('Playlist', backref='owner', lazy=True)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

# Playlist model
class Playlist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    cover_image = db.Column(db.String(255), default='https://via.placeholder.com/300')
    created_date = db.Column(db.DateTime, default=datetime.utcnow)
    updated_date = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    tracks = db.relationship('PlaylistTrack', backref='playlist', lazy=True, cascade='all, delete-orphan')

# PlaylistTrack model (junction table for playlists and tracks)
class PlaylistTrack(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    playlist_id = db.Column(db.Integer, db.ForeignKey('playlist.id'), nullable=False)
    track_id = db.Column(db.Integer, nullable=False)  # Deezer track ID
    track_data = db.Column(db.Text)  # JSON data of the track
    added_date = db.Column(db.DateTime, default=datetime.utcnow)
    position = db.Column(db.Integer)  # For track ordering

# Composition model removed

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Base URL for Deezer API
DEEZER_API_BASE = 'https://api.deezer.com'

# Cache for API responses to avoid hitting rate limits
api_cache = {}

# List of working preview URLs for fallback
FALLBACK_PREVIEW_URLS = [
    "https://cdns-preview-c.dzcdn.net/stream/c-cca63b2c92773d54e61c5b4d17695bd2-8.mp3",
    "https://cdns-preview-d.dzcdn.net/stream/c-d6cfc27f7c4ab9639ea4c1b6dae84d1a-3.mp3",
    "https://cdns-preview-0.dzcdn.net/stream/c-0f21e8b9f5f8eb7b521f250795a7d48c-3.mp3",
    "https://cdns-preview-f.dzcdn.net/stream/c-f91f04f9a14b6589f4493458c4986720-4.mp3",
    "https://cdns-preview-1.dzcdn.net/stream/c-13039fed16a173733f227b0bec631034-4.mp3",
    "https://cdns-preview-b.dzcdn.net/stream/c-b2ce0ffd14a7b571d1a9047c3d0fe6a2-6.mp3"
]

@app.route('/')
def index():
    if current_user.is_authenticated:
        return redirect(url_for('home'))
    return render_template('landing.html')

@app.route('/home')
def home():
    return send_from_directory('.', 'index.html')
    
# AI Composer routes removed

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/api')
def proxy_api():
    # Get the endpoint from the request
    endpoint = request.args.get('endpoint', '')
    
    # Remove any leading slash
    endpoint = endpoint.lstrip('/')
    
    # Build the full URL
    url = f"{DEEZER_API_BASE}/{endpoint}"
    
    # Add any additional query parameters
    query_params = request.args.to_dict()
    if 'endpoint' in query_params:
        del query_params['endpoint']  # Remove the endpoint parameter
    
    # Add query parameters to URL
    if query_params:
        # Fix: Use proper URL encoding and format
        query_string = '&'.join([f"{k}={urllib.parse.quote(str(v))}" for k, v in query_params.items()])
        url = f"{url}{'?' if '?' not in url else '&'}{query_string}"
    
    print(f"DEBUG: Final URL: {url}")
    
    # Check cache first
    if url in api_cache:
        print(f"Cache hit for: {url}")
        return jsonify(api_cache[url])
    
    # Make the request to Deezer API
    try:
        print(f"Fetching from Deezer API: {url}")
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            data = response.read()
            result = json.loads(data)
            
            # Process the result to ensure all tracks have valid preview URLs
            if 'data' in result and isinstance(result['data'], list):
                for track in result['data']:
                    # Ensure track has a preview URL
                    if isinstance(track, dict) and ('preview' not in track or not track['preview']):
                        track['preview'] = random.choice(FALLBACK_PREVIEW_URLS)
                    
                    # Ensure track has album and artist info
                    if isinstance(track, dict):
                        if 'album' not in track or not track['album']:
                            track['album'] = {'cover_medium': 'https://via.placeholder.com/250'}
                        if 'artist' not in track or not track['artist']:
                            track['artist'] = {'name': 'Unknown Artist'}
            
            # Cache the result
            api_cache[url] = result
            
            # Debug the response
            print(f"API Response: {json.dumps(result)[:200]}...")
            
            return jsonify(result)
    except Exception as e:
        print(f"Error fetching from Deezer API: {str(e)}")
        
        # Return sample data if API fails
        if 'chart' in endpoint and 'tracks' in endpoint:
            sample_data = get_sample_tracks()
            print(f"Returning sample tracks data")
            return jsonify(sample_data)
        elif 'chart' in endpoint and 'playlists' in endpoint:
            sample_data = get_sample_playlists()
            print(f"Returning sample playlists data")
            return jsonify(sample_data)
        elif 'search' in endpoint:
            sample_data = get_sample_search_results()
            print(f"Returning sample search results")
            return jsonify(sample_data)
        else:
            return jsonify({"error": str(e)}), 500

# Sample data for fallback when API fails
def get_sample_tracks():
    return {
        "data": [
            {
                "id": 1,
                "title": "Blinding Lights",
                "preview": "https://cdns-preview-c.dzcdn.net/stream/c-cca63b2c92773d54e61c5b4d17695bd2-8.mp3",
                "artist": {"name": "The Weeknd"},
                "album": {"cover_medium": "https://e-cdns-images.dzcdn.net/images/cover/fd00ebd6d30d7253f813dcc1a76a72e7/250x250-000000-80-0-0.jpg"}
            },
            {
                "id": 2,
                "title": "As It Was",
                "preview": "https://cdns-preview-d.dzcdn.net/stream/c-d6cfc27f7c4ab9639ea4c1b6dae84d1a-3.mp3",
                "artist": {"name": "Harry Styles"},
                "album": {"cover_medium": "https://e-cdns-images.dzcdn.net/images/cover/b0153a7b550f0c5f29c19a0d1dcd0e0f/250x250-000000-80-0-0.jpg"}
            },
            {
                "id": 3,
                "title": "Stay",
                "preview": "https://cdns-preview-0.dzcdn.net/stream/c-0f21e8b9f5f8eb7b521f250795a7d48c-3.mp3",
                "artist": {"name": "The Kid LAROI, Justin Bieber"},
                "album": {"cover_medium": "https://e-cdns-images.dzcdn.net/images/cover/63932f7c75963d8a58c28e3d9455dd37/250x250-000000-80-0-0.jpg"}
            },
            {
                "id": 4,
                "title": "Easy On Me",
                "preview": "https://cdns-preview-f.dzcdn.net/stream/c-f91f04f9a14b6589f4493458c4986720-4.mp3",
                "artist": {"name": "Adele"},
                "album": {"cover_medium": "https://e-cdns-images.dzcdn.net/images/cover/878da868e1d0f6f9fbd00d6a3c20d7d9/250x250-000000-80-0-0.jpg"}
            },
            {
                "id": 5,
                "title": "INDUSTRY BABY",
                "preview": "https://cdns-preview-1.dzcdn.net/stream/c-13039fed16a173733f227b0bec631034-4.mp3",
                "artist": {"name": "Lil Nas X, Jack Harlow"},
                "album": {"cover_medium": "https://e-cdns-images.dzcdn.net/images/cover/5d3adaa64424e2cedb49e9f6c8b527e1/250x250-000000-80-0-0.jpg"}
            }
        ]
    }

def get_sample_playlists():
    return {
        "data": [
            {
                "id": 1,
                "title": "Today's Top Hits",
                "picture_medium": "https://e-cdns-images.dzcdn.net/images/playlist/3b5ee1c0cca6a5a4d7e54d53d5b9d0ae/250x250-000000-80-0-0.jpg",
                "nb_tracks": 50
            },
            {
                "id": 2,
                "title": "RapCaviar",
                "picture_medium": "https://e-cdns-images.dzcdn.net/images/playlist/b6e5ccd1c1b7adb9c5f8ea1c6d4a7e3a/250x250-000000-80-0-0.jpg",
                "nb_tracks": 50
            },
            {
                "id": 3,
                "title": "Rock Classics",
                "picture_medium": "https://e-cdns-images.dzcdn.net/images/playlist/a0c8c9c6c6a6d1d4e1f3b4d5e6f7a8b9/250x250-000000-80-0-0.jpg",
                "nb_tracks": 100
            },
            {
                "id": 4,
                "title": "Chill Hits",
                "picture_medium": "https://e-cdns-images.dzcdn.net/images/playlist/1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f/250x250-000000-80-0-0.jpg",
                "nb_tracks": 75
            }
        ]
    }

def get_sample_search_results():
    return {
        "data": [
            {
                "id": 1,
                "title": "Blinding Lights",
                "preview": "https://cdns-preview-c.dzcdn.net/stream/c-cca63b2c92773d54e61c5b4d17695bd2-8.mp3",
                "artist": {"name": "The Weeknd"},
                "album": {"cover_medium": "https://e-cdns-images.dzcdn.net/images/cover/fd00ebd6d30d7253f813dcc1a76a72e7/250x250-000000-80-0-0.jpg"}
            },
            {
                "id": 2,
                "title": "As It Was",
                "preview": "https://cdns-preview-d.dzcdn.net/stream/c-d6cfc27f7c4ab9639ea4c1b6dae84d1a-3.mp3",
                "artist": {"name": "Harry Styles"},
                "album": {"cover_medium": "https://e-cdns-images.dzcdn.net/images/cover/b0153a7b550f0c5f29c19a0d1dcd0e0f/250x250-000000-80-0-0.jpg"}
            },
            {
                "id": 3,
                "title": "Stay",
                "preview": "https://cdns-preview-0.dzcdn.net/stream/c-0f21e8b9f5f8eb7b521f250795a7d48c-3.mp3",
                "artist": {"name": "The Kid LAROI, Justin Bieber"},
                "album": {"cover_medium": "https://e-cdns-images.dzcdn.net/images/cover/63932f7c75963d8a58c28e3d9455dd37/250x250-000000-80-0-0.jpg"}
            }
        ]
    }

# Authentication routes
@app.route('/auth/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    
    if request.method == 'POST':
        data = request.json if request.is_json else request.form.to_dict()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        confirm_password = data.get('confirm_password')
        
        # Validate input
        if not username or not email or not password:
            if request.is_json:
                return jsonify({'status': 'error', 'message': 'All fields are required'}), 400
            flash('All fields are required', 'error')
            return render_template('auth/register.html')
        
        if password != confirm_password:
            if request.is_json:
                return jsonify({'status': 'error', 'message': 'Passwords do not match'}), 400
            flash('Passwords do not match', 'error')
            return render_template('auth/register.html')
        
        # Check if username or email already exists
        if User.query.filter_by(username=username).first():
            if request.is_json:
                return jsonify({'status': 'error', 'message': 'Username already taken'}), 400
            flash('Username already taken', 'error')
            return render_template('auth/register.html')
        
        if User.query.filter_by(email=email).first():
            if request.is_json:
                return jsonify({'status': 'error', 'message': 'Email already registered'}), 400
            flash('Email already registered', 'error')
            return render_template('auth/register.html')
        
        # Create new user
        user = User(username=username, email=email, display_name=username)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        
        # Instead of logging in, redirect to login page
        if request.is_json:
            return jsonify({'success': True, 'message': 'Registration successful! Please log in.', 'redirect': '/auth/login'})
        
        flash('Registration successful! Please log in with your new account.', 'success')
        return redirect(url_for('login'))
    
    return render_template('auth/register.html')

@app.route('/auth/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    
    if request.method == 'POST':
        data = request.json if request.is_json else request.form.to_dict()
        username = data.get('username')
        password = data.get('password')
        remember_me = data.get('remember_me', False)
        
        # Validate input
        if not username or not password:
            if request.is_json:
                return jsonify({'status': 'error', 'message': 'Username and password are required'}), 400
            flash('Username and password are required', 'error')
            return render_template('auth/login.html')
        
        # Attempt to find the user
        user = User.query.filter_by(username=username).first()
        
        # Check if user exists and password is correct
        if not user or not user.check_password(password):
            if request.is_json:
                return jsonify({'status': 'error', 'message': 'Invalid username or password'}), 401
            flash('Invalid username or password', 'error')
            return render_template('auth/login.html')
        
        # Log in the user
        login_user(user, remember=remember_me)
        
        # Return user data if JSON request
        if request.is_json:
            return jsonify({
                'status': 'success', 
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'display_name': user.display_name,
                    'profile_image': user.profile_image
                },
                'redirect': '/home'
            })
        
        flash('Login successful!', 'success')
        return redirect(url_for('home'))
    
    return render_template('auth/login.html')

@app.route('/auth/logout')
def logout():
    logout_user()
    if request.is_json:
        return jsonify({'status': 'success', 'message': 'Logged out successfully'})
    flash('Logged out successfully', 'success')
    return redirect(url_for('index'))

@app.route('/profile')
@login_required
def profile():
    # Get user's playlists count
    playlists_count = Playlist.query.filter_by(user_id=current_user.id).count()
    
    # Get total tracks in all user's playlists
    playlist_tracks = db.session.query(PlaylistTrack).join(Playlist).filter(Playlist.user_id == current_user.id).count()
    
    # Pass current datetime for template calculations
    now = datetime.utcnow()
    
    return render_template('auth/profile.html', 
                           user=current_user, 
                           playlists_count=playlists_count,
                           playlist_tracks=playlist_tracks,
                           now=now)

@app.route('/profile/edit', methods=['GET', 'POST'])
@login_required
def edit_profile():
    if request.method == 'POST':
        # Handle JSON or form data
        data = request.json if request.is_json else request.form
        
        # Update basic user profile information
        current_user.display_name = data.get('display_name', current_user.display_name)
        current_user.bio = data.get('bio', current_user.bio)
        current_user.email = data.get('email', current_user.email)
        current_user.location = data.get('location', current_user.location)
        current_user.website = data.get('website', current_user.website)
        current_user.favorite_genre = data.get('favorite_genre', current_user.favorite_genre)
        
        # Update social media profiles
        current_user.twitter_username = data.get('twitter_username', current_user.twitter_username)
        current_user.instagram_username = data.get('instagram_username', current_user.instagram_username)
        current_user.spotify_username = data.get('spotify_username', current_user.spotify_username)
        current_user.youtube_channel = data.get('youtube_channel', current_user.youtube_channel)
        
        # Update featured playlists settings
        showcase_playlists = data.get('showcase_playlists')
        if showcase_playlists is not None:
            # Convert to boolean if it's a string
            if isinstance(showcase_playlists, str):
                current_user.showcase_playlists = showcase_playlists.lower() == 'true'
            else:
                current_user.showcase_playlists = bool(showcase_playlists)
                
        # Update privacy settings
        profile_public = data.get('profile_public')
        if profile_public is not None:
            if isinstance(profile_public, str):
                current_user.profile_public = profile_public.lower() == 'true'
            else:
                current_user.profile_public = bool(profile_public)
                
        show_listening_activity = data.get('show_listening_activity')
        if show_listening_activity is not None:
            if isinstance(show_listening_activity, str):
                current_user.show_listening_activity = show_listening_activity.lower() == 'true'
            else:
                current_user.show_listening_activity = bool(show_listening_activity)
                
        show_playlists = data.get('show_playlists')
        if show_playlists is not None:
            if isinstance(show_playlists, str):
                current_user.show_playlists = show_playlists.lower() == 'true'
            else:
                current_user.show_playlists = bool(show_playlists)
        
        # Update featured playlist IDs
        featured_playlist_ids = data.get('featured_playlist_ids')
        if featured_playlist_ids is not None:
            # If it's a JSON string, store it directly
            if isinstance(featured_playlist_ids, str):
                current_user.featured_playlist_ids = featured_playlist_ids
            else:
                # If it's already parsed as a list/object, convert back to JSON string
                import json
                current_user.featured_playlist_ids = json.dumps(featured_playlist_ids)
        
        # Handle profile image file upload
        if 'profile_image_file' in request.files:
            profile_image = request.files['profile_image_file']
            if profile_image and profile_image.filename:
                # Create a secure filename
                import os
                from werkzeug.utils import secure_filename
                
                # Ensure the upload directory exists
                upload_dir = os.path.join(app.static_folder, 'uploads', 'profile_images')
                os.makedirs(upload_dir, exist_ok=True)
                
                # Save the file with a secure filename
                filename = secure_filename(f"{current_user.id}_{profile_image.filename}")
                file_path = os.path.join(upload_dir, filename)
                profile_image.save(file_path)
                
                # Update the user's profile image URL to point to the saved file
                relative_path = f"/static/uploads/profile_images/{filename}"
                current_user.profile_image = relative_path
        
        # For backward compatibility, still handle URL-based profile images
        elif not request.is_json:  # Only check form data, not JSON requests
            profile_image_url = data.get('profile_image_url') or data.get('profile_image')
            if profile_image_url:
                current_user.profile_image = profile_image_url
        
        # Handle header image file upload
        if 'header_image_file' in request.files:
            header_image = request.files['header_image_file']
            if header_image and header_image.filename:
                # Create a secure filename
                import os
                from werkzeug.utils import secure_filename
                
                # Ensure the upload directory exists
                upload_dir = os.path.join(app.static_folder, 'uploads', 'header_images')
                os.makedirs(upload_dir, exist_ok=True)
                
                # Save the file with a secure filename
                filename = secure_filename(f"{current_user.id}_{header_image.filename}")
                file_path = os.path.join(upload_dir, filename)
                header_image.save(file_path)
                
                # Update the user's header image URL to point to the saved file
                relative_path = f"/static/uploads/header_images/{filename}"
                current_user.profile_header_image = relative_path
        
        # For backward compatibility, still handle URL-based header images
        elif data.get('profile_header_image'):
            current_user.profile_header_image = data.get('profile_header_image')
        
        # Update appearance settings
        current_user.profile_theme = data.get('profile_theme', 'default')
        current_user.profile_layout = data.get('profile_layout', 'standard')
        current_user.profile_background = data.get('profile_background', 'none')
        current_user.profile_font = data.get('profile_font', 'default')
        current_user.accent_color = data.get('accent_color', '#9d4edd')
        
        # Handle password change if provided
        new_password = data.get('new_password')
        confirm_password = data.get('confirm_password')
        
        if new_password and confirm_password:
            if new_password == confirm_password:
                current_user.set_password(new_password)
                if not request.is_json:
                    flash('Password updated successfully!', 'success')
            else:
                if request.is_json:
                    return jsonify({'status': 'error', 'message': 'Passwords do not match!'})
                flash('Passwords do not match!', 'error')
                return render_template('auth/edit_profile.html', user=current_user)
        
        db.session.commit()
        
        if request.is_json:
            return jsonify({'status': 'success', 'message': 'Profile updated successfully!'})
        
        flash('Profile updated successfully!', 'success')
        return redirect(url_for('profile'))
        
    return render_template('auth/edit_profile.html', user=current_user)

@app.route('/api/current_user')
def get_current_user():
    if current_user.is_authenticated:
        return jsonify({
            'status': 'success',
            'authenticated': True,
            'user': {
                'id': current_user.id,
                'username': current_user.username,
                'display_name': current_user.display_name,
                'profile_image': current_user.profile_image,
                'bio': current_user.bio,
                'joined_date': current_user.joined_date.isoformat() if current_user.joined_date else None
            }
        })
    return jsonify({'status': 'success', 'authenticated': False})

# Playlist API endpoints
@app.route('/api/user/playlists')
@login_required
def get_user_playlists():
    playlists = Playlist.query.filter_by(user_id=current_user.id).all()
    return jsonify({
        'status': 'success',
        'playlists': [{
            'id': playlist.id,
            'title': playlist.title,
            'description': playlist.description,
            'cover_image': playlist.cover_image,
            'created_date': playlist.created_date.isoformat(),
            'updated_date': playlist.updated_date.isoformat(),
            'tracks': [{
                'id': track.id,
                'track_id': track.track_id,
                'position': track.position
            } for track in playlist.tracks]
        } for playlist in playlists]
    })

@app.route('/api/playlists', methods=['POST'])
@login_required
def create_playlist():
    data = request.json
    title = data.get('title')
    description = data.get('description', '')
    cover_image = data.get('cover_image', 'https://via.placeholder.com/300')
    
    if not title:
        return jsonify({'status': 'error', 'message': 'Title is required'}), 400
    
    playlist = Playlist(
        title=title,
        description=description,
        cover_image=cover_image,
        user_id=current_user.id
    )
    
    db.session.add(playlist)
    db.session.commit()
    
    return jsonify({
        'status': 'success',
        'playlist': {
            'id': playlist.id,
            'title': playlist.title,
            'description': playlist.description,
            'cover_image': playlist.cover_image,
            'created_date': playlist.created_date.isoformat(),
            'updated_date': playlist.updated_date.isoformat(),
            'tracks': []
        }
    })

@app.route('/api/playlists/<int:playlist_id>', methods=['GET'])
def get_playlist(playlist_id):
    playlist = Playlist.query.get_or_404(playlist_id)
    
    # Check if this is the owner or if the playlist is public
    if current_user.is_authenticated and current_user.id == playlist.user_id:
        is_owner = True
    else:
        is_owner = False
    
    # Get all tracks
    playlist_tracks = [{
        'id': track.id,
        'track_id': track.track_id,
        'track_data': json.loads(track.track_data) if track.track_data else None,
        'position': track.position,
        'added_date': track.added_date.isoformat()
    } for track in playlist.tracks]
    
    return jsonify({
        'status': 'success',
        'playlist': {
            'id': playlist.id,
            'title': playlist.title,
            'description': playlist.description,
            'cover_image': playlist.cover_image,
            'created_date': playlist.created_date.isoformat(),
            'updated_date': playlist.updated_date.isoformat(),
            'owner': {
                'id': playlist.owner.id,
                'username': playlist.owner.username,
                'display_name': playlist.owner.display_name
            },
            'is_owner': is_owner,
            'tracks': playlist_tracks
        }
    })

@app.route('/api/playlists/<int:playlist_id>/tracks', methods=['POST'])
@login_required
def add_track_to_playlist(playlist_id):
    playlist = Playlist.query.get_or_404(playlist_id)
    
    # Check if the user is the owner of the playlist
    if current_user.id != playlist.user_id:
        return jsonify({'status': 'error', 'message': 'You do not have permission to modify this playlist'}), 403
    
    data = request.json
    track_id = data.get('track_id')
    track_data = data.get('track_data')
    
    if not track_id:
        return jsonify({'status': 'error', 'message': 'Track ID is required'}), 400
    
    # Check if track already exists in playlist
    existing_track = PlaylistTrack.query.filter_by(playlist_id=playlist_id, track_id=track_id).first()
    if existing_track:
        return jsonify({'status': 'error', 'message': 'Track already exists in playlist'}), 400
    
    # Get position (last position + 1)
    position = db.session.query(db.func.max(PlaylistTrack.position)).filter_by(playlist_id=playlist_id).scalar() or 0
    position += 1
    
    # Add track to playlist
    playlist_track = PlaylistTrack(
        playlist_id=playlist_id,
        track_id=track_id,
        track_data=json.dumps(track_data) if track_data else None,
        position=position
    )
    
    db.session.add(playlist_track)
    db.session.commit()
    
    return jsonify({
        'status': 'success',
        'track': {
            'id': playlist_track.id,
            'track_id': playlist_track.track_id,
            'position': playlist_track.position,
            'added_date': playlist_track.added_date.isoformat()
        }
    })

@app.route('/api/playlists/<int:playlist_id>/tracks/<int:track_id>', methods=['DELETE'])
@login_required
def remove_track_from_playlist(playlist_id, track_id):
    playlist = Playlist.query.get_or_404(playlist_id)
    
    # Check if the user is the owner of the playlist
    if current_user.id != playlist.user_id:
        return jsonify({'status': 'error', 'message': 'You do not have permission to modify this playlist'}), 403
    
    # Find track in playlist
    playlist_track = PlaylistTrack.query.filter_by(playlist_id=playlist_id, id=track_id).first_or_404()
    
    # Remove track
    db.session.delete(playlist_track)
    db.session.commit()
    
    return jsonify({'status': 'success', 'message': 'Track removed from playlist'})

# User stats API endpoint
@app.route('/api/user/stats', methods=['GET'])
@login_required
def get_user_stats():
    # Get user stats
    user_id = current_user.id
    
    # Count number of playlists
    playlists_count = Playlist.query.filter_by(user_id=user_id).count()
    
    # Count total number of tracks across all playlists
    playlist_tracks_count = db.session.query(func.count(PlaylistTrack.id)).\
        join(Playlist, Playlist.id == PlaylistTrack.playlist_id).\
        filter(Playlist.user_id == user_id).scalar() or 0
    
    # Get latest playlist
    latest_playlist = Playlist.query.filter_by(user_id=user_id).order_by(Playlist.created_date.desc()).first()
    
    # Get latest activity (most recently added track)
    latest_track = db.session.query(PlaylistTrack).\
        join(Playlist, Playlist.id == PlaylistTrack.playlist_id).\
        filter(Playlist.user_id == user_id).\
        order_by(PlaylistTrack.added_date.desc()).first()
    
    # Create response object
    response = {
        'playlists_count': playlists_count,
        'tracks_count': playlist_tracks_count,
        'member_since': current_user.joined_date.strftime('%B %Y') if current_user.joined_date else None,
        'latest_playlist': None,
        'latest_track': None,
        'featured_playlists': []
    }
    
    # Add latest playlist info if available
    if latest_playlist:
        response['latest_playlist'] = {
            'id': latest_playlist.id,
            'title': latest_playlist.title,
            'date': latest_playlist.created_date.strftime('%Y-%m-%d')
        }
    
    # Add latest track info if available
    if latest_track:
        try:
            track_data = json.loads(latest_track.track_data) if latest_track.track_data else None
            if track_data:
                response['latest_track'] = {
                    'id': latest_track.track_id,
                    'title': track_data.get('title', 'Unknown'),
                    'artist': track_data.get('artist', {}).get('name', 'Unknown Artist'),
                    'playlist_id': latest_track.playlist_id,
                    'date': latest_track.added_date.strftime('%Y-%m-%d')
                }
        except Exception as e:
            print(f"Error parsing track data: {e}")
    
    # Add featured playlists
    if current_user.showcase_playlists and current_user.featured_playlist_ids:
        try:
            featured_ids = json.loads(current_user.featured_playlist_ids)
            if featured_ids:
                featured_playlists = Playlist.query.filter(Playlist.id.in_(featured_ids)).all()
                for playlist in featured_playlists:
                    tracks_count = PlaylistTrack.query.filter_by(playlist_id=playlist.id).count()
                    response['featured_playlists'].append({
                        'id': playlist.id,
                        'title': playlist.title,
                        'cover_image': playlist.cover_image,
                        'tracks_count': tracks_count
                    })
        except Exception as e:
            print(f"Error loading featured playlists: {e}")
    
    return jsonify({
        'success': True,
        'stats': response
    })


# Featured profiles API endpoint
@app.route('/api/featured-profiles', methods=['GET'])
def get_featured_profiles():
    # Get users who have enabled showcase_playlists and have featured_playlist_ids
    users = User.query.filter(User.showcase_playlists == True).\
        filter(User.featured_playlist_ids != '[]').\
        filter(User.profile_public == True).\
        limit(10).all()
    
    profiles = []
    for user in users:
        # Basic user data
        user_data = {
            'id': user.id,
            'username': user.username,
            'display_name': user.display_name,
            'profile_image': user.profile_image,
            'profile_header_image': user.profile_header_image,
            'profile_theme': user.profile_theme,
            'showcase_playlists': user.showcase_playlists,
            'featured_playlist_ids': user.featured_playlist_ids,
            'playlists': []
        }
        
        # Get all user playlists
        playlists = Playlist.query.filter_by(user_id=user.id).all()
        for playlist in playlists:
            tracks_count = PlaylistTrack.query.filter_by(playlist_id=playlist.id).count()
            user_data['playlists'].append({
                'id': playlist.id,
                'title': playlist.title,
                'description': playlist.description,
                'cover_image': playlist.cover_image,
                'tracks_count': tracks_count,
                'created_date': playlist.created_date.strftime('%Y-%m-%d')
            })
        
        profiles.append(user_data)
    
    return jsonify({
        'success': True,
        'profiles': profiles
    })

# Update password endpoint
@app.route('/api/user/update_password', methods=['POST'])
@login_required
def update_password():
    data = request.json
    current_password = data.get('current_password')
    new_password = data.get('new_password')
    confirm_password = data.get('confirm_password')
    
    if not current_password or not new_password or not confirm_password:
        return jsonify({'success': False, 'message': 'All password fields are required'})
    
    if not current_user.check_password(current_password):
        return jsonify({'success': False, 'message': 'Current password is incorrect'})
    
    if new_password != confirm_password:
        return jsonify({'success': False, 'message': 'New passwords do not match'})
    
    current_user.set_password(new_password)
    db.session.commit()
    
    return jsonify({'success': True, 'message': 'Password updated successfully'})

# We'll create database tables when the app starts instead of using the deprecated before_first_request

if __name__ == '__main__':
    # Create database tables if they don't exist
    with app.app_context():
        db.create_all()
    
    # Run the app with waitress for production or debug mode for development
    from waitress import serve
    print('Server running on http://localhost:5000')
    serve(app, host='0.0.0.0', port=5000)
