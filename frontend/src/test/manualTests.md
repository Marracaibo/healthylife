# Test Manuali per FatSecret Integration

Questo documento descrive i test manuali da eseguire per verificare che l'integrazione con FatSecret (o il servizio mock) funzioni correttamente.

## Prerequisiti

1. Assicurarsi che il frontend sia in esecuzione: `npm run dev`
2. Assicurarsi che il backend sia in esecuzione (opzionale per test mock): `py -m main` dalla cartella backend

## Test 1: Verifica della ricerca alimenti

**Obiettivo**: Verificare che la ricerca alimenti funzioni correttamente.

**Passi**:
1. Aprire l'applicazione nel browser
2. Navigare alla pagina di pianificazione pasti manuale
3. Cliccare su "Aggiungi Alimento"
4. Inserire un termine di ricerca (es. "pasta", "chicken", "apple")
5. Cliccare su "Cerca"

**Risultato atteso**:
- La ricerca dovrebbe mostrare risultati pertinenti al termine cercato
- Ogni risultato dovrebbe mostrare il nome dell'alimento

## Test 2: Selezione e aggiunta alimento

**Obiettivo**: Verificare che sia possibile selezionare e aggiungere un alimento a un pasto.

**Passi**:
1. Eseguire una ricerca come nel Test 1
2. Selezionare uno degli alimenti dalla lista dei risultati
3. Selezionare un pasto dal menu a tendina (es. "Colazione")
4. Cliccare su "Aggiungi"

**Risultato atteso**:
- L'alimento dovrebbe essere aggiunto al pasto selezionato
- Le calorie totali dovrebbero aumentare del valore corrispondente all'alimento aggiunto
- Il dialog di ricerca dovrebbe chiudersi

## Test 3: Rimozione alimento

**Obiettivo**: Verificare che sia possibile rimuovere un alimento da un pasto.

**Passi**:
1. Aggiungere un alimento a un pasto come nel Test 2
2. Cliccare sull'icona "Elimina" accanto all'alimento

**Risultato atteso**:
- L'alimento dovrebbe essere rimosso dal pasto
- Le calorie totali dovrebbero diminuire del valore corrispondente all'alimento rimosso

## Test 4: Comportamento offline

**Obiettivo**: Verificare che l'applicazione funzioni correttamente anche quando il backend non è disponibile.

**Passi**:
1. Se il backend è in esecuzione, arrestarlo
2. Aprire o ricaricare l'applicazione nel browser
3. Navigare alla pagina di pianificazione pasti manuale
4. Eseguire una ricerca come nel Test 1

**Risultato atteso**:
- La ricerca dovrebbe funzionare correttamente usando i dati mock
- Non dovrebbero apparire errori relativi alla connessione al backend

## Test 5: Ricerca con termini non validi

**Obiettivo**: Verificare che l'applicazione gestisca correttamente le ricerche senza risultati.

**Passi**:
1. Aprire il dialog di ricerca alimenti
2. Inserire un termine di ricerca improbabile (es. "xyznonexistentfood123456789")
3. Cliccare su "Cerca"

**Risultato atteso**:
- Dovrebbe apparire un messaggio che indica che non sono stati trovati risultati
- Non dovrebbero verificarsi errori o crash dell'applicazione

## Test 6: Calcolo delle calorie totali

**Obiettivo**: Verificare che il calcolo delle calorie totali sia corretto.

**Passi**:
1. Aggiungere diversi alimenti a diversi pasti
2. Annotare le calorie di ciascun alimento

**Risultato atteso**:
- Le calorie totali dovrebbero essere la somma esatta delle calorie di tutti gli alimenti aggiunti
- Le calorie dovrebbero aggiornarsi immediatamente dopo l'aggiunta o la rimozione di un alimento

## Test 7: Persistenza dei dati

**Obiettivo**: Verificare che i dati del piano pasti vengano salvati correttamente.

**Passi**:
1. Creare un piano pasti con diversi alimenti
2. Cliccare su "Salva Piano"
3. Inserire un nome per il piano
4. Ricaricare la pagina o navigare ad un'altra pagina e tornare alla pianificazione pasti
5. Selezionare il piano salvato

**Risultato atteso**:
- Il piano pasti dovrebbe essere salvato correttamente
- Dopo aver ricaricato la pagina, il piano dovrebbe essere ancora disponibile nella lista dei piani salvati
- Selezionando il piano, dovrebbero apparire tutti gli alimenti precedentemente aggiunti
