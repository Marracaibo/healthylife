# Guida all'Espansione del Dizionario di Traduzione

Questo documento fornisce istruzioni dettagliate su come espandere e mantenere il dizionario di traduzione italiano-inglese per i termini alimentari nell'app HealthyLife.

## Panoramica

Il dizionario di traduzione è una componente fondamentale del servizio che migliora la ricerca di alimenti per gli utenti italiani. La sua espansione continua e il suo miglioramento sono cruciali per offrire un'esperienza ottimale.

## Organizzazione del Dizionario

Il dizionario è strutturato come un dizionario Python nel file `services/translation_service.py`, con chiavi in italiano e valori in inglese. È organizzato in sezioni commentate per facilitare la manutenzione:

```python
ITALIAN_TO_ENGLISH_FOOD_TERMS = {
    # Verdure e ortaggi
    "pomodoro": "tomato",
    "pomodori": "tomatoes",
    # ...
    
    # Frutta
    "mela": "apple",
    "mele": "apples",
    # ...
    
    # Etc.
}
```

## Processo di Espansione

### 1. Identificare i Termini Mancanti

I termini mancanti possono essere identificati attraverso:

- **Analisi dei log**: cercare query in italiano che non sono state tradotte
- **Feedback degli utenti**: raccogliere segnalazioni di termini non riconosciuti
- **Test sistematici**: utilizzare lo script `test_translation.py` per verificare la copertura

### 2. Ricerca delle Traduzioni Corrette

Per ogni termine italiano da aggiungere:

- Utilizzare dizionari specializzati in terminologia alimentare
- Verificare l'uso comune del termine nei contesti alimentari inglesi
- Considerare varianti regionali e specializzate quando rilevanti
- Prestare attenzione a eventuali plurali o forme particolari

### 3. Aggiungere le Nuove Voci

Seguire queste linee guida quando si aggiungono nuove voci:

1. **Posizionamento**: aggiungere il termine nella sezione appropriata del dizionario
2. **Formato chiave**: mantenere le chiavi in minuscolo, senza accenti
3. **Plurali**: includere sia forme singolari che plurali come voci separate
4. **Consistenza**: mantenere uno stile coerente nelle traduzioni

Esempio di inserimento:

```python
ITALIAN_TO_ENGLISH_FOOD_TERMS = {
    # Sezione esistente
    # ...
    
    # Aggiunta di nuovi termini
    "radicchio": "radicchio",
    "radicchi": "radicchio",
    "indivia": "endive",
    "indivia belga": "belgian endive",
    
    # ...
}
```

### 4. Gestione delle Ambiguità

Alcuni termini possono avere traduzioni diverse in base al contesto:

- Se possibile, scegliere la traduzione più comune nel contesto alimentare
- Per termini con significati molto diversi, considerare l'aggiunta di termini composti che chiariscano il contesto

Esempio:

```python
ITALIAN_TO_ENGLISH_FOOD_TERMS = {
    # ...
    "pesca": "peach",           # Frutto
    "pesce": "fish",            # Animale acquatico
    "pesche": "peaches",
    # ...
}
```

### 5. Verifica e Test

Dopo aver aggiunto nuovi termini:

1. Eseguire lo script di test per verificare la corretta integrazione:
   ```
   python scripts/test_translation.py
   ```

2. Testare direttamente con query che includono i nuovi termini:
   ```
   python scripts/test_translation.py "nuovo termine aggiunto"
   ```

3. Verificare l'integrazione con il servizio di ricerca alimenti

## Priorità per l'Espansione

Consigliamo di dare priorità all'aggiunta di:

1. **Alimenti base**: ingredienti comuni nella cucina italiana
2. **Termini regionali**: specialità locali e prodotti DOP/IGP
3. **Metodi di preparazione**: tecniche di cottura e preparazione specifiche
4. **Piatti composti**: ricette e preparazioni tradizionali
5. **Termini stagionali**: alimenti legati a festività o stagioni specifiche

## Considerazioni Speciali

### Termini Senza Traduzione Diretta

Per termini italiani senza un equivalente inglese preciso (es. "puntarelle"):

- Mantenere il termine italiano anche nella traduzione inglese
- Eventualmente aggiungere una descrizione come commento nel codice

```python
# Termini senza traduzione diretta
"puntarelle": "puntarelle",  # Roman chicory shoots
```

### Varianti Regionali

Per varianti regionali dello stesso alimento:

- Includere tutte le varianti come chiavi separate
- Indirizzarle alla stessa traduzione inglese

```python
# Varianti regionali
"melanzana": "eggplant",
"petonciano": "eggplant",  # Variante toscana
"mulignana": "eggplant",   # Variante siciliana
```

## Manutenzione Continua

Per garantire un dizionario aggiornato:

1. **Revisione periodica**: controllare il dizionario ogni 3-6 mesi
2. **Monitoraggio dei log**: analizzare regolarmente i log per identificare termini non tradotti
3. **Test di regressione**: verificare che i termini esistenti continuino a essere tradotti correttamente
4. **Collaborazione**: coinvolgere esperti di cucina italiana ed inglese per revisioni della qualità

## Processo di Contribuzione

Per il team di sviluppo che desidera contribuire:

1. Creare un branch dedicato: `git checkout -b expand-dictionary`
2. Aggiungere i nuovi termini seguendo le linee guida
3. Eseguire test approfonditi
4. Inviare una pull request con un elenco dettagliato dei termini aggiunti
5. Attendere la revisione e l'approvazione

## Risorse Utili

- [Dizionario Gastronomico Multilingue](https://www.example.com/dict)
- [Database Alimenti Italiani](https://www.example.com/italian-foods)
- [Glossario Culinario Italiano-Inglese](https://www.example.com/glossary)

## Contatti

Per domande o suggerimenti su questa guida, contattare:
- Team di Localizzazione: [localization@healthylifeapp.example.com](mailto:localization@healthylifeapp.example.com)
- Responsabile Servizio Traduzione: [translation-lead@healthylifeapp.example.com](mailto:translation-lead@healthylifeapp.example.com)
