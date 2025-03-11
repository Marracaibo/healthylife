@echo off
echo Testing Hybrid Service...
cd /d %~dp0
call venv\Scripts\activate.bat
python test_hybrid_service.py
pause
