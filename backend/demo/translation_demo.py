"""
Demo per il servizio di traduzione alimentare.
Questa applicazione dimostrativa permette di testare interattivamente
il servizio di traduzione italiano-inglese per termini alimentari.
"""

import sys
import os
from pathlib import Path
import tkinter as tk
from tkinter import ttk, scrolledtext
import json
import time

# Aggiungiamo il percorso del backend al PATH di Python
demo_dir = Path(__file__).resolve().parent
backend_dir = demo_dir.parent
sys.path.append(str(backend_dir))

try:
    from services.translation_service import translate_food_query, is_italian, ITALIAN_TO_ENGLISH_FOOD_TERMS
except ImportError:
    print("Errore: Impossibile importare il servizio di traduzione.")
    print(f"Verifica che il percorso sia corretto: {backend_dir}")
    
    # Definiamo delle funzioni di fallback per la demo
    def is_italian(text):
        return True  # Assumiamo che il testo sia in italiano
        
    def translate_food_query(query):
        return f"[DEMO] {query} (traduzione simulata)"
        
    ITALIAN_TO_ENGLISH_FOOD_TERMS = {
        "pomodoro": "tomato",
        "pasta": "pasta",
        "pizza": "pizza",
        "mela": "apple"
    }

class TranslationDemoApp:
    """Applicazione demo per il servizio di traduzione alimentare."""
    
    def __init__(self, root):
        """Inizializza l'interfaccia utente."""
        self.root = root
        root.title("HealthyLife - Demo Traduzione Alimentare")
        root.geometry("800x600")
        root.minsize(600, 400)
        
        # Stile e colori
        self.style = ttk.Style()
        self.style.configure("TFrame", background="#f5f5f5")
        self.style.configure("TLabel", background="#f5f5f5", font=("Arial", 11))
        self.style.configure("TButton", font=("Arial", 11))
        self.style.configure("Header.TLabel", font=("Arial", 14, "bold"))
        self.style.configure("Result.TLabel", font=("Arial", 12))
        
        # Frame principale
        main_frame = ttk.Frame(root, padding="20")
        main_frame.pack(fill=tk.BOTH, expand=True)
        
        # Titolo
        header = ttk.Label(
            main_frame, 
            text="Demo del Servizio di Traduzione Italiano-Inglese per Alimenti",
            style="Header.TLabel"
        )
        header.pack(pady=(0, 20))
        
        # Descrizione
        description = ttk.Label(
            main_frame,
            text="Inserisci un termine alimentare in italiano per vedere la traduzione in inglese.",
            wraplength=700
        )
        description.pack(pady=(0, 10))
        
        # Frame per la ricerca
        search_frame = ttk.Frame(main_frame)
        search_frame.pack(fill=tk.X, pady=10)
        
        # Label per la ricerca
        search_label = ttk.Label(search_frame, text="Termine alimentare:")
        search_label.pack(side=tk.LEFT, padx=(0, 10))
        
        # Campo di input
        self.search_var = tk.StringVar()
        self.search_entry = ttk.Entry(search_frame, textvariable=self.search_var, width=30, font=("Arial", 11))
        self.search_entry.pack(side=tk.LEFT, padx=(0, 10))
        self.search_entry.bind("<Return>", self.translate)
        
        # Pulsante di ricerca
        search_button = ttk.Button(search_frame, text="Traduci", command=self.translate)
        search_button.pack(side=tk.LEFT)
        
        # Frame per i risultati
        results_frame = ttk.LabelFrame(main_frame, text="Risultati", padding=(10, 5))
        results_frame.pack(fill=tk.BOTH, expand=True, pady=10)
        
        # Label per i risultati
        result_labels_frame = ttk.Frame(results_frame)
        result_labels_frame.pack(fill=tk.X, pady=(0, 10))
        
        # Query originale
        ttk.Label(result_labels_frame, text="Query originale:").grid(row=0, column=0, sticky=tk.W, padx=(0, 10), pady=5)
        self.original_query_label = ttk.Label(result_labels_frame, text="", style="Result.TLabel")
        self.original_query_label.grid(row=0, column=1, sticky=tk.W, pady=5)
        
        # Rilevamento lingua
        ttk.Label(result_labels_frame, text="Rilevata come italiano:").grid(row=1, column=0, sticky=tk.W, padx=(0, 10), pady=5)
        self.is_italian_label = ttk.Label(result_labels_frame, text="", style="Result.TLabel")
        self.is_italian_label.grid(row=1, column=1, sticky=tk.W, pady=5)
        
        # Traduzione
        ttk.Label(result_labels_frame, text="Traduzione:").grid(row=2, column=0, sticky=tk.W, padx=(0, 10), pady=5)
        self.translation_label = ttk.Label(result_labels_frame, text="", style="Result.TLabel")
        self.translation_label.grid(row=2, column=1, sticky=tk.W, pady=5)
        
        # Area di log
        log_frame = ttk.LabelFrame(main_frame, text="Log e Dettagli", padding=(10, 5))
        log_frame.pack(fill=tk.BOTH, expand=True, pady=(0, 10))
        
        self.log_text = scrolledtext.ScrolledText(log_frame, height=10, wrap=tk.WORD, font=("Consolas", 10))
        self.log_text.pack(fill=tk.BOTH, expand=True)
        self.log_text.config(state=tk.DISABLED)
        
        # Frame per i suggerimenti
        suggestions_frame = ttk.LabelFrame(main_frame, text="Esempi di Termini", padding=(10, 5))
        suggestions_frame.pack(fill=tk.X, pady=(0, 10))
        
        suggestions = [
            "pomodoro", "pasta al pesto", "parmigiana di melanzane", 
            "insalata mista", "risotto ai funghi", "bistecca alla fiorentina"
        ]
        
        for i, suggestion in enumerate(suggestions):
            btn = ttk.Button(
                suggestions_frame, 
                text=suggestion,
                command=lambda s=suggestion: self.use_suggestion(s)
            )
            row, col = divmod(i, 3)
            btn.grid(row=row, column=col, padx=5, pady=5, sticky=tk.W)
        
        # Versione e copyright
        footer = ttk.Label(
            main_frame, 
            text="HealthyLife App - Servizio di Traduzione Alimentare v1.0",
            font=("Arial", 9)
        )
        footer.pack(side=tk.BOTTOM, pady=(10, 0))
        
        # Focus sul campo di ricerca
        self.search_entry.focus()
        
        # Log iniziale
        self.log("Demo del servizio di traduzione avviata")
        self.log(f"Dizionario di traduzione caricato con {len(ITALIAN_TO_ENGLISH_FOOD_TERMS)} termini")
    
    def translate(self, event=None):
        """Esegue la traduzione della query inserita."""
        query = self.search_var.get().strip()
        
        if not query:
            self.log("Errore: Inserire un termine da tradurre", level="ERROR")
            return
            
        self.log(f"Traduzione richiesta: '{query}'")
        
        # Rilevamento lingua
        is_it = is_italian(query)
        italian_status = "Sì" if is_it else "No"
        
        # Traduzione
        start_time = time.time()
        translated = translate_food_query(query)
        elapsed = (time.time() - start_time) * 1000  # Millisecondi
        
        # Aggiorniamo le etichette
        self.original_query_label.config(text=query)
        self.is_italian_label.config(text=italian_status)
        self.translation_label.config(text=translated)
        
        # Log
        self.log(f"Rilevato come italiano: {italian_status}")
        self.log(f"Traduzione: '{translated}'")
        self.log(f"Tempo di traduzione: {elapsed:.2f} ms")
        
        if query == translated and is_it:
            self.log("Nota: Alcuni termini potrebbero non essere nel dizionario", level="WARNING")
    
    def use_suggestion(self, suggestion):
        """Utilizza un suggerimento come query."""
        self.search_var.set(suggestion)
        self.translate()
    
    def log(self, message, level="INFO"):
        """Aggiunge un messaggio all'area di log."""
        timestamp = time.strftime("%H:%M:%S")
        log_entry = f"[{timestamp}] [{level}] {message}\n"
        
        self.log_text.config(state=tk.NORMAL)
        
        # Coloriamo il testo in base al livello
        tag = f"tag_{int(time.time() * 1000)}"  # Tag unico
        
        if level == "ERROR":
            self.log_text.tag_config(tag, foreground="red")
        elif level == "WARNING":
            self.log_text.tag_config(tag, foreground="orange")
        else:
            self.log_text.tag_config(tag, foreground="black")
            
        self.log_text.insert(tk.END, log_entry, tag)
        self.log_text.see(tk.END)
        self.log_text.config(state=tk.DISABLED)


def main():
    """Funzione principale per avviare l'applicazione."""
    root = tk.Tk()
    app = TranslationDemoApp(root)
    root.mainloop()

if __name__ == "__main__":
    main()
