# Integrazione Scansione Codice a Barre in HealthyLife App

## Panoramica
Questa integrazione aggiunge la possibilità di cercare alimenti tramite codice a barre nel diario alimentare, utilizzando l'API USDA FoodData Central.

## Funzionalità Implementate
- Endpoint backend per la ricerca tramite codice a barre/UPC
- Interfaccia frontend con pulsante per la scansione
- Supporto per la fotocamera del dispositivo (richiede https)
- Possibilità di inserire manualmente il codice
- Utilizzo della sola API USDA (supporto gratuito)

## Istruzioni per l'Uso
1. Dalla pagina del diario alimentare, seleziona un pasto (colazione, pranzo, cena, ecc.)
2. Clicca sul pulsante con l'icona del codice a barre accanto al pulsante "Aggiungi"
3. Consenti l'accesso alla fotocamera
4. Inquadra il codice a barre dell'alimento
5. In alternativa, puoi inserire manualmente il codice nella casella di testo
6. Seleziona l'alimento corrispondente dai risultati

## Note Tecniche
- La funzionalità di scansione richiede l'accesso alla fotocamera del dispositivo
- In un ambiente di produzione, potrebbe essere necessario utilizzare una libreria specifica per il riconoscimento dei codici a barre come quagga.js o zxing
- Il client web deve utilizzare HTTPS per accedere alla fotocamera
- L'API USDA supporta principalmente prodotti nordamericani; per prodotti italiani, la copertura potrebbe essere limitata

## Dipendenze
Per completare l'implementazione della scansione vera e propria, è necessario installare:

```bash
npm install quagga --save
# oppure
npm install @zxing/library --save
```

## Riferimenti API
- [USDA FoodData Central API](https://fdc.nal.usda.gov/api-guide.html)
- [MediaDevices Web API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
