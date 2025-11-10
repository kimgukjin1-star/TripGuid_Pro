@echo off
title Travel Guide System

:: Check for Python
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Python이 설치되어 있지 않거나 PATH에 추가되지 않았습니다.
    echo python.org에서 Python을 설치하고, 설치 시 "Add Python to PATH" 옵션을 선택하세요.
    pause
    exit /b
)

:: Check for Node.js/npm (via npx)
where npx >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js (npm)가 설치되어 있지 않거나 PATH에 추가되지 않았습니다.
    echo nodejs.org에서 Node.js를 설치하세요.
    pause
    exit /b
)

echo 필수 프로그램이 모두 확인되었습니다.
echo.

:: Start Tailwind CSS watch process in a new window
echo Tailwind CSS 빌드 프로세스를 시작합니다 (실시간 감시)...
start "Tailwind Watcher" npx @tailwindcss/cli -i ./css/input.css -o ./css/output.css --watch

:: Start Python backend server
echo Python 백엔드 서버를 시작합니다...
python server.py
