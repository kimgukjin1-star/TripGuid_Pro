@echo off
title Travel Guide System Server
echo Starting local web server...
echo.
echo Please open your web browser and go to:
echo http://localhost:8000
echo.
echo Press Ctrl+C to stop the server.
echo.
python -m http.server 8000
