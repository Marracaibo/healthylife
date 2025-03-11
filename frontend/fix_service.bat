@echo off
echo **************************************************
echo * SOSTITUZIONE DEL SERVIZIO HYBRIDFOODSERVICE *
echo **************************************************
echo.

echo Creazione backup del file originale...
copy "%~dp0\src\services\hybridFoodService.ts" "%~dp0\src\services\hybridFoodService.ts.bak"

echo Sostituzione con la versione semplificata...
copy "%~dp0\src\services\hybridFoodService.simple.ts" "%~dp0\src\services\hybridFoodService.ts"

echo Pulizia della cache...
rd /s /q "%~dp0\node_modules\.cache" 2>nul

echo.
echo **************************************************
echo * SOSTITUZIONE COMPLETATA!                      *
echo *                                               *
echo * Riavvia il server frontend con:               *
echo * npm start                                     *
echo *                                               *
echo * Riavvia il browser e cancella la cache        *
echo **************************************************
echo.

pause
