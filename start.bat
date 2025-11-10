@echo off
chcp 65001
title Travel Guide System

:: Start Tailwind CSS watch process in a new window
echo Tailwind CSS 빌드 프로세스를 시작합니다...
start "Tailwind Watcher" npx @tailwindcss/cli -i ./css/input.css -o ./css/output.css --watch

:: Start the local web server
echo 로컬 웹 서버를 시작합니다...
echo.
echo 웹 브라우저에서 다음 주소로 접속하세요:
echo http://localhost:8000
echo.
echo 이 창에서 Ctrl+C를 누르면 서버가 중지됩니다.
echo.
python -m http.server 8000
