@echo off
echo ***************************************************************
echo *                RISOLUZIONE COMPLETA DEI PROBLEMI                *
echo ***************************************************************
echo.

echo Creazione backup dei file originali...
md "%~dp0\backups" 2>nul
copy "%~dp0\src\services\hybridFoodService.ts" "%~dp0\backups\hybridFoodService.ts.bak"
copy "%~dp0\src\components\HybridFoodSearchDialog.tsx" "%~dp0\backups\HybridFoodSearchDialog.tsx.bak"

echo Sostituzione con versione semplificata...
copy "%~dp0\src\services\hybridFoodService.simple.ts" "%~dp0\src\services\hybridFoodService.ts"

echo Pulizia della cache del progetto...
rd /s /q "%~dp0\node_modules\.cache" 2>nul
rd /s /q "%~dp0\.next" 2>nul

echo Terminazione di eventuali processi npm in esecuzione...
taskkill /f /im node.exe

echo Riavvio del progetto...
start cmd /k "cd "%~dp0" && npm start"

echo.
echo ***************************************************************
echo * IMPLEMENTATE TUTTE LE CORREZIONI! *
echo * *
echo * 1. Pulita la cache di compilazione *
echo * 2. Sostituito il file hybridFoodService.ts *
echo * 3. Riavviato il server di sviluppo *
echo * *
echo * ORA: *
echo * 1. Ricarica completamente il browser (Ctrl+F5) *
echo * 2. Prova la ricerca di nuovo *
echo ***************************************************************
echo.

pause
