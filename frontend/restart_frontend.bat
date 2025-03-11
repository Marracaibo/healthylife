@echo off
echo Riavvio del frontend in corso...

echo Terminazione del processo npm se in esecuzione...
taskkill /f /im node.exe 2>nul

echo Pulizia della cache...
rd /s /q node_modules\.cache 2>nul

echo Avvio del frontend...
cd /d %~dp0
npm start

echo Frontend riavviato con successo!
