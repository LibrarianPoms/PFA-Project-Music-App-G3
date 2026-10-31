@echo off
echo Starting Python server for Wavve Music Website...
echo.
echo Installing required packages...
python -m pip install -r requirements.txt
echo.
echo Starting server...
echo Server will be available at: http://localhost:5000
echo Press Ctrl+C to stop the server
echo.
python server.py
