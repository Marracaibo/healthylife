@echo off
echo Test API Natural Language Processing di FatSecret
echo ========================================================

echo.
echo Per usare questo test, segui le istruzioni sotto:

1. Assicurati che le credenziali FatSecret siano configurate nel file .env
2. Usa lo script Python test_nlp_api.py per ottenere un token OAuth2
3. Testa direttamente con l'URL: https://platform.fatsecret.com/rest/natural-language-processing/v1

echo.
echo Esempio di richiesta curl (sostituisci TOKEN con il tuo token OAuth2):
echo curl -X POST "https://platform.fatsecret.com/rest/natural-language-processing/v1"
echo  -H "Content-Type: application/json"
echo  -H "Authorization: Bearer TOKEN"
echo  -d "{\"user_input\":\"Ho mangiato una pizza margherita e una coca cola\",\"region\":\"Italy\",\"language\":\"it\",\"include_food_data\":true,\"eaten_foods\":[]}"

echo.
echo Se preferisci usare Postman o un altro client API:
echo - URL: https://platform.fatsecret.com/rest/natural-language-processing/v1
echo - Metodo: POST
echo - Headers:
echo   * Content-Type: application/json
echo   * Authorization: Bearer TOKEN
echo - Body (JSON):
echo {
echo   "user_input": "Ho mangiato una pizza margherita e una coca cola",
echo   "region": "Italy",
echo   "language": "it",
echo   "include_food_data": true,
echo   "eaten_foods": []
echo }

echo.
echo Premi un tasto per chiudere...
pause > nul
