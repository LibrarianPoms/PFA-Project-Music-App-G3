@echo off
echo Starting Wavve Music App...

REM Start the server in a new window
start "Wavve Server" cmd /c "cd /d %~dp0 && start_server.bat"

REM Wait a moment for the server to initialize
timeout /t 5 /nobreak > nul

REM Open the browser to the app
start http://localhost:5000

echo Wavve Music App is now running in your browser!
