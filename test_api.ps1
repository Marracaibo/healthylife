# Script di test per le API di HealthyLifeApp

$API_BASE_URL = "http://localhost:8000/api"

Write-Host "=== TEST DELLE API DI HEALTHYLIFEAPP ===" -ForegroundColor Cyan
Write-Host "Timestamp: $(Get-Date)" -ForegroundColor Gray
Write-Host ""

# Test 1: Connessione base al backend
Write-Host "Test 1: Verifica connessione al backend..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "$API_BASE_URL/docs" -Method GET -TimeoutSec 5
    Write-Host "Connessione al backend: OK (Status: $($response.StatusCode))" -ForegroundColor Green
    $backendOk = $true
} catch {
    Write-Host "Connessione al backend: FALLITA" -ForegroundColor Red
    Write-Host "Errore: $($_.Exception.Message)" -ForegroundColor Red
    $backendOk = $false
}

Write-Host ""

# Test 2: Ricerca alimenti (API hybrid-food)
if ($backendOk) {
    Write-Host "Test 2: Ricerca alimenti (query='bread')..." -ForegroundColor Yellow
    
    try {
        $response = Invoke-WebRequest -Uri "$API_BASE_URL/hybrid-food/search?query=bread&max_results=3" -Method GET -TimeoutSec 10
        $data = $response.Content | ConvertFrom-Json
        
        Write-Host "Ricerca alimenti: OK (Status: $($response.StatusCode))" -ForegroundColor Green
        
        if ($data.results.Count -gt 0) {
            Write-Host "Risultati trovati: $($data.results.Count)" -ForegroundColor Green
            Write-Host "Primi risultati:" -ForegroundColor Yellow
            
            for ($i = 0; $i -lt [Math]::Min(2, $data.results.Count); $i++) {
                $item = $data.results[$i]
                Write-Host "  - $($item.name) (Fonte: $($item.source))" -ForegroundColor Cyan
            }
        } else {
            Write-Host "Nessun risultato trovato per 'bread'" -ForegroundColor Red
        }
    } catch {
        Write-Host "Ricerca alimenti: FALLITA" -ForegroundColor Red
        Write-Host "Errore: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== FINE DEI TEST ===" -ForegroundColor Cyan
