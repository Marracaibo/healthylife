@echo off
echo Pulizia della cache in corso...

rd /s /q .cache 2>nul
rd /s /q node_modules\.cache 2>nul
rd /s /q build 2>nul

echo Cache pulita!
echo.
echo Riavviare il server frontend con "npm start"

pause
