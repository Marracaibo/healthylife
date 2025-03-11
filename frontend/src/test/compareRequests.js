/**
 * Script per comparare richieste API con e senza traduzione
 * 
 * Questo script effettua chiamate dirette alle API food, testando sia termini inglesi che
 * italiani, e confrontando i risultati ottenuti.
 */

// Definizione costanti di configurazione
const API_BASE_URL = 'http://localhost:8000/api/hybrid-food';
const TEST_TERMS = [
  // Termini inglesi
  { term: 'bread', language: 'english' },
  { term: 'milk', language: 'english' },
  { term: 'apple', language: 'english' },
  { term: 'pasta', language: 'english' },
  
  // Termini italiani
  { term: 'pane', language: 'italian' },
  { term: 'latte', language: 'italian' },
  { term: 'mela', language: 'italian' },
  { term: 'pasta', language: 'italian' }, // Questo è uguale in entrambe le lingue
  
  // Termini composti
  { term: 'olive oil', language: 'english' },
  { term: 'olio d\'oliva', language: 'italian' },
];

// Elemento per mostrare i risultati
let resultsContainer;

// Inizializzazione interfaccia
function initUI() {
  // Crea l'interfaccia se non esiste già
  if (document.getElementById('compare-container')) {
    return;
  }
  
  const container = document.createElement('div');
  container.id = 'compare-container';
  container.style.cssText = `
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Segoe UI', Arial, sans-serif;
  `;
  
  // Titolo
  const title = document.createElement('h1');
  title.textContent = 'Comparazione Richieste API Food';
  title.style.color = '#2e7d32';
  
  // Descrizione
  const description = document.createElement('p');
  description.textContent = 'Questo test confronta le risposte delle API per termini inglesi e italiani.';
  
  // Pulsante test
  const runButton = document.createElement('button');
  runButton.textContent = 'Esegui test comparativo';
  runButton.style.cssText = `
    padding: 10px 16px;
    background-color: #2e7d32;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-bottom: 15px;
  `;
  runButton.onclick = runAllTests;
  
  // Container risultati
  resultsContainer = document.createElement('div');
  resultsContainer.id = 'results-container';
  
  // Assembla l'interfaccia
  container.appendChild(title);
  container.appendChild(description);
  container.appendChild(runButton);
  container.appendChild(resultsContainer);
  
  document.body.appendChild(container);
}

// Funzione per effettuare una singola richiesta API
async function makeAPIRequest(term) {
  try {
    const encodedTerm = encodeURIComponent(term);
    const url = `${API_BASE_URL}/search?query=${encodedTerm}`;
    
    console.log(`Richiesta API per: "${term}"`);
    const startTime = performance.now();
    
    const response = await fetch(url);
    const data = await response.json();
    
    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(1);
    
    return {
      term,
      successful: response.ok,
      statusCode: response.status,
      resultsCount: data.foods ? data.foods.length : 0,
      duration: `${duration}ms`,
      data
    };
  } catch (error) {
    console.error(`Errore per "${term}":`, error);
    return {
      term,
      successful: false,
      error: error.message
    };
  }
}

// Funzione per mostrare i risultati
function displayResult(result, language) {
  const resultItem = document.createElement('div');
  resultItem.style.cssText = `
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    margin-bottom: 15px;
    padding: 15px;
    background-color: ${language === 'english' ? '#e8f5e9' : '#e3f2fd'};
  `;
  
  const header = document.createElement('div');
  header.style.cssText = `
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 8px;
  `;
  
  const termInfo = document.createElement('div');
  termInfo.innerHTML = `<strong>"${result.term}"</strong> <span style="color: #666; font-style: italic;">(${language})</span>`;
  
  const statusInfo = document.createElement('div');
  if (result.successful) {
    statusInfo.innerHTML = `<span style="color: green">✓ ${result.statusCode}</span> • ${result.resultsCount} risultati • ${result.duration}`;
  } else {
    statusInfo.innerHTML = `<span style="color: red">✗ Errore</span> • ${result.error || 'Unknown error'}`;
  }
  
  header.appendChild(termInfo);
  header.appendChild(statusInfo);
  
  const content = document.createElement('div');
  if (result.data && result.data.foods) {
    const foods = result.data.foods.slice(0, 3); // Mostra solo i primi 3 risultati
    
    if (foods.length > 0) {
      const foodsList = document.createElement('ul');
      foodsList.style.cssText = `
        list-style-type: none;
        padding-left: 0;
        margin-top: 5px;
      `;
      
      foods.forEach(food => {
        const foodItem = document.createElement('li');
        foodItem.style.cssText = `
          padding: 5px 0;
          border-bottom: 1px dashed #e0e0e0;
        `;
        foodItem.innerHTML = `${food.food_name} ${food.brand_name ? `<span style="color: #666">(${food.brand_name})</span>` : ''}`;
        foodsList.appendChild(foodItem);
      });
      
      content.appendChild(foodsList);
      
      if (result.data.foods.length > 3) {
        const moreInfo = document.createElement('div');
        moreInfo.style.cssText = `
          font-style: italic;
          color: #666;
          margin-top: 5px;
          font-size: 0.9em;
        `;
        moreInfo.textContent = `...e altri ${result.data.foods.length - 3} risultati.`;
        content.appendChild(moreInfo);
      }
    } else {
      content.textContent = 'Nessun risultato trovato.';
      content.style.color = '#999';
    }
  } else {
    content.textContent = 'Nessun dato disponibile.';
    content.style.color = '#999';
  }
  
  resultItem.appendChild(header);
  resultItem.appendChild(content);
  
  resultsContainer.appendChild(resultItem);
}

// Funzione per eseguire tutti i test
async function runAllTests() {
  // Pulisci i risultati precedenti
  resultsContainer.innerHTML = '<div style="color: #1976d2; margin-bottom: 15px;">Test in esecuzione...</div>';
  
  // Mostra intestazione per i risultati
  setTimeout(() => {
    resultsContainer.innerHTML = `
      <h2>Risultati dei test</h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
        <div style="padding: 8px; background-color: #e8f5e9; border-radius: 4px; text-align: center;">Termini inglesi</div>
        <div style="padding: 8px; background-color: #e3f2fd; border-radius: 4px; text-align: center;">Termini italiani</div>
      </div>
      <div id="results-comparison" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;"></div>
    `;
    
    // Esegui i test uno alla volta
    runTestsSequentially();
  }, 100);
}

// Esegue i test uno dopo l'altro
async function runTestsSequentially() {
  const resultsComparison = document.getElementById('results-comparison');
  if (!resultsComparison) return;
  
  // Crea le colonne per inglese e italiano
  const englishColumn = document.createElement('div');
  const italianColumn = document.createElement('div');
  resultsComparison.appendChild(englishColumn);
  resultsComparison.appendChild(italianColumn);
  
  // Filtra i termini per lingua
  const englishTerms = TEST_TERMS.filter(item => item.language === 'english');
  const italianTerms = TEST_TERMS.filter(item => item.language === 'italian');
  
  // Esegui prima i test inglesi
  for (const item of englishTerms) {
    const result = await makeAPIRequest(item.term);
    const resultElement = document.createElement('div');
    englishColumn.appendChild(resultElement);
    
    // Mostra il risultato
    displayResultInElement(resultElement, result, 'english');
    
    // Piccola pausa tra le richieste
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Poi esegui i test italiani
  for (const item of italianTerms) {
    const result = await makeAPIRequest(item.term);
    const resultElement = document.createElement('div');
    italianColumn.appendChild(resultElement);
    
    // Mostra il risultato
    displayResultInElement(resultElement, result, 'italian');
    
    // Piccola pausa tra le richieste
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

// Visualizza un risultato in un elemento specifico
function displayResultInElement(element, result, language) {
  element.style.cssText = `
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    margin-bottom: 15px;
    padding: 15px;
    background-color: ${language === 'english' ? '#f1f8e9' : '#e1f5fe'};
  `;
  
  const header = document.createElement('div');
  header.style.cssText = `
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    border-bottom: 1px solid #e0e0e0;
    padding-bottom: 8px;
  `;
  
  const termInfo = document.createElement('div');
  termInfo.innerHTML = `<strong>"${result.term}"</strong>`;
  
  const statusInfo = document.createElement('div');
  if (result.successful) {
    statusInfo.innerHTML = `<span style="color: green">${result.resultsCount} risultati</span> • ${result.duration}`;
  } else {
    statusInfo.innerHTML = `<span style="color: red">Errore</span>`;
  }
  
  header.appendChild(termInfo);
  header.appendChild(statusInfo);
  
  const content = document.createElement('div');
  if (result.data && result.data.foods) {
    const foods = result.data.foods.slice(0, 3); // Mostra solo i primi 3 risultati
    
    if (foods.length > 0) {
      const foodsList = document.createElement('ul');
      foodsList.style.cssText = `
        list-style-type: none;
        padding-left: 0;
        margin-top: 5px;
      `;
      
      foods.forEach(food => {
        const foodItem = document.createElement('li');
        foodItem.style.cssText = `
          padding: 5px 0;
          border-bottom: 1px dashed #e0e0e0;
        `;
        foodItem.innerHTML = `${food.food_name} ${food.brand_name ? `<span style="color: #666">(${food.brand_name})</span>` : ''}`;
        foodsList.appendChild(foodItem);
      });
      
      content.appendChild(foodsList);
      
      if (result.data.foods.length > 3) {
        const moreInfo = document.createElement('div');
        moreInfo.style.cssText = `
          font-style: italic;
          color: #666;
          margin-top: 5px;
          font-size: 0.9em;
        `;
        moreInfo.textContent = `...e altri ${result.data.foods.length - 3} risultati.`;
        content.appendChild(moreInfo);
      }
    } else {
      content.textContent = 'Nessun risultato trovato.';
      content.style.color = '#999';
    }
  } else {
    content.textContent = 'Nessun dato disponibile.';
    content.style.color = '#999';
  }
  
  element.appendChild(header);
  element.appendChild(content);
}

// Funzione principale
function init() {
  // Inizializza l'interfaccia
  initUI();
  
  console.log('Script di comparazione richieste API inizializzato.');
}

// Avvia lo script quando la pagina è caricata
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
