@echo off
echo Testing APIs...
cd /d %~dp0
call venv\Scripts\activate.bat
python test_api_connections.py
pause
