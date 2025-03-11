# HealthyLife App

Un'applicazione intelligente per la gestione della dieta e del benessere personale.

## Caratteristiche Principali

- 🍽️ Piani alimentari personalizzati basati su AI
- 📊 Tracciamento intelligente dei pasti e delle calorie
- 🎯 Monitoraggio dei progressi con visualizzazioni intuitive
- 🛒 Generazione automatica della lista della spesa
- 👩‍🍳 Database di ricette sane e gustose
- 🤖 Consigli personalizzati basati su AI
- 📱 Interfaccia user-friendly e responsive

## Stack Tecnologico

### Frontend
- React 18
- Material-UI
- Redux Toolkit
- Chart.js
- PWA support

### Backend
- Python 3.11+
- FastAPI
- SQLAlchemy
- PostgreSQL
- OpenAI API per personalizzazione AI

## Requisiti di Sistema

- Node.js 18+
- Python 3.11+
- PostgreSQL 14+

## Setup del Progetto

1. Clonare il repository
2. Installare le dipendenze frontend:
```bash
cd frontend
npm install
```

3. Installare le dipendenze backend:
```bash
cd backend
pip install -r requirements.txt
```

4. Configurare le variabili d'ambiente

5. Avviare il server di sviluppo:
```bash
# Backend
cd backend
uvicorn main:app --reload

# Frontend
cd frontend
npm run dev
```

## Struttura del Progetto

```
HealthyLife/
├── frontend/           # React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
├── backend/            # FastAPI server
│   ├── api/
│   ├── models/
│   ├── services/
│   └── utils/
└── docs/              # Documentazione
```
