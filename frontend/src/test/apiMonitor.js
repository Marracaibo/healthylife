/**
 * API Monitor per tracciare le chiamate HTTP
 * 
 * Questo script può essere incluso in una pagina HTML per monitorare
 * e registrare tutte le chiamate HTTP effettuate dall'applicazione.
 */

// Salva i riferimenti originali per ripristinarli se necessario
const originalFetch = window.fetch;
const originalXHROpen = XMLHttpRequest.prototype.open;
const originalXHRSend = XMLHttpRequest.prototype.send;

// Crea un container per i log
function createMonitorUI() {
  // Se esiste già un container, usa quello
  const existingContainer = document.getElementById('api-monitor-container');
  if (existingContainer) return existingContainer;
  
  // Crea un container per i log
  const container = document.createElement('div');
  container.id = 'api-monitor-container';
  container.style.cssText = `
    position: fixed;
    bottom: 10px;
    right: 10px;
    width: 400px;
    max-height: 300px;
    background-color: rgba(0, 0, 0, 0.8);
    color: #00ff00;
    font-family: monospace;
    font-size: 12px;
    border-radius: 5px;
    z-index: 9999;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  `;
  
  // Crea l'header con i controlli
  const header = document.createElement('div');
  header.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 10px;
    background-color: rgba(0, 0, 0, 0.9);
    border-bottom: 1px solid #333;
  `;
  
  const title = document.createElement('div');
  title.textContent = 'API Monitor';
  title.style.fontWeight = 'bold';
  
  const controls = document.createElement('div');
  
  const clearButton = document.createElement('button');
  clearButton.textContent = 'Clear';
  clearButton.style.cssText = `
    background: #333;
    color: white;
    border: none;
    padding: 2px 5px;
    cursor: pointer;
    margin-right: 5px;
    border-radius: 3px;
  `;
  clearButton.onclick = () => {
    const logContainer = document.getElementById('api-monitor-logs');
    if (logContainer) logContainer.innerHTML = '';
  };
  
  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.style.cssText = `
    background: #333;
    color: white;
    border: none;
    padding: 2px 5px;
    cursor: pointer;
    border-radius: 3px;
  `;
  closeButton.onclick = () => {
    container.style.display = 'none';
  };
  
  controls.appendChild(clearButton);
  controls.appendChild(closeButton);
  
  header.appendChild(title);
  header.appendChild(controls);
  
  // Area per i log
  const logContainer = document.createElement('div');
  logContainer.id = 'api-monitor-logs';
  logContainer.style.cssText = `
    overflow-y: auto;
    flex-grow: 1;
    padding: 5px 10px;
  `;
  
  container.appendChild(header);
  container.appendChild(logContainer);
  
  document.body.appendChild(container);
  return container;
}

// Funzione per aggiungere un log
function logAPICall(method, url, status, data, error) {
  const container = createMonitorUI();
  const logContainer = document.getElementById('api-monitor-logs');
  if (!logContainer) return;
  
  const logEntry = document.createElement('div');
  logEntry.style.marginBottom = '5px';
  
  const timestamp = new Date().toISOString().substr(11, 12);
  
  let statusColor = '#00ff00'; // Verde per successo
  if (error || (status && status >= 400)) {
    statusColor = '#ff3333'; // Rosso per errore
  } else if (status && status >= 300) {
    statusColor = '#ffcc00'; // Giallo per redirezioni
  }
  
  logEntry.innerHTML = `
    <div>
      <span style="color: #888;">[${timestamp}]</span> 
      <span style="color: #6699ff;">${method}</span> 
      <span style="color: white;">${truncateUrl(url)}</span>
      ${status ? `<span style="color: ${statusColor};">${status}</span>` : ''}
    </div>
    ${data ? `<div style="margin-left: 10px; color: #aaa;">${truncateData(JSON.stringify(data))}</div>` : ''}
    ${error ? `<div style="margin-left: 10px; color: #ff6666;">${error}</div>` : ''}
  `;
  
  logContainer.appendChild(logEntry);
  logContainer.scrollTop = logContainer.scrollHeight;
}

// Funzioni di utilità
function truncateUrl(url) {
  try {
    const maxLength = 60;
    return url.length > maxLength ? url.substring(0, maxLength) + '...' : url;
  } catch (e) {
    return url || 'Unknown URL';
  }
}

function truncateData(dataStr) {
  try {
    const maxLength = 100;
    return dataStr.length > maxLength ? dataStr.substring(0, maxLength) + '...' : dataStr;
  } catch (e) {
    return dataStr || 'Unknown Data';
  }
}

// Sovrascrive fetch
window.fetch = async function(input, init) {
  const method = init?.method || 'GET';
  const url = typeof input === 'string' ? input : input.url;
  
  logAPICall(method, url, null, init?.body, null);
  
  try {
    const response = await originalFetch.apply(this, arguments);
    
    // Clone response to not consume it
    const clonedResponse = response.clone();
    try {
      const contentType = clonedResponse.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        clonedResponse.json().then(data => {
          logAPICall(method, url, response.status, data, null);
        }).catch(() => {
          logAPICall(method, url, response.status, null, 'Cannot parse JSON');
        });
      } else {
        logAPICall(method, url, response.status, null, null);
      }
    } catch (err) {
      logAPICall(method, url, response.status, null, null);
    }
    
    return response;
  } catch (error) {
    logAPICall(method, url, null, null, error.message);
    throw error;
  }
};

// Sovrascrive XMLHttpRequest
XMLHttpRequest.prototype.open = function(method, url) {
  this._apiMonitorMethod = method;
  this._apiMonitorUrl = url;
  originalXHROpen.apply(this, arguments);
};

XMLHttpRequest.prototype.send = function(body) {
  if (this._apiMonitorMethod && this._apiMonitorUrl) {
    logAPICall(this._apiMonitorMethod, this._apiMonitorUrl, null, body, null);
    
    this.addEventListener('load', function() {
      const status = this.status;
      let responseData = null;
      
      try {
        if (this.responseType === '' || this.responseType === 'text') {
          responseData = this.responseText;
        } else if (this.responseType === 'json') {
          responseData = this.response;
        }
      } catch (e) { }
      
      logAPICall(this._apiMonitorMethod, this._apiMonitorUrl, status, responseData, null);
    });
    
    this.addEventListener('error', function() {
      logAPICall(this._apiMonitorMethod, this._apiMonitorUrl, null, null, 'Network Error');
    });
  }
  
  originalXHRSend.apply(this, arguments);
};

// Monitora Axios se disponibile
if (window.axios) {
  const originalAxiosRequest = window.axios.request;
  
  window.axios.request = function(config) {
    const method = config.method || 'GET';
    const url = config.url;
    
    logAPICall(method.toUpperCase(), url, null, config.data, null);
    
    return originalAxiosRequest.apply(this, arguments)
      .then(response => {
        logAPICall(method.toUpperCase(), url, response.status, response.data, null);
        return response;
      })
      .catch(error => {
        let errorMsg = 'Network Error';
        let status = null;
        
        if (error.response) {
          status = error.response.status;
          errorMsg = `HTTP Error: ${status}`;
        } else if (error.request) {
          errorMsg = 'No response from server';
        } else {
          errorMsg = error.message;
        }
        
        logAPICall(method.toUpperCase(), url, status, null, errorMsg);
        throw error;
      });
  };
}

// Funzione di inizializzazione
function initAPIMonitor() {
  createMonitorUI();
  console.log('API Monitor attivato. Tutte le chiamate HTTP saranno registrate.');
}

// Auto-inizializzazione
initAPIMonitor();
