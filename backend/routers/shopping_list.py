from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import date

from database import get_db
import models
import schemas

router = APIRouter(
    prefix="/api/shopping-list",
    tags=["shopping-list"]
)

@router.post("/generate", response_model=schemas.ListaSpesa)
async def generate_shopping_list(
    piano_id: int,
    start_date: date,
    end_date: date,
    db: Session = Depends(get_db)
):
    """Genera una lista della spesa basata sul piano alimentare"""
    # Verifica che il piano esista
    piano = db.query(models.PianoAlimentare).filter(
        models.PianoAlimentare.id == piano_id
    ).first()
    if not piano:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Piano alimentare non trovato"
        )

    # Crea una nuova lista della spesa
    lista_spesa = models.ListaSpesa(
        piano_id=piano_id,
        data_inizio=start_date,
        data_fine=end_date,
        note="Lista generata automaticamente"
    )
    db.add(lista_spesa)
    db.flush()

    # Ottieni tutti gli alimenti necessari nel periodo specificato
    alimenti_necessari = {}  # Dict per aggregare le quantità

    giorni = db.query(models.GiornoDelPiano).filter(
        models.GiornoDelPiano.piano_id == piano_id,
        models.GiornoDelPiano.data >= start_date,
        models.GiornoDelPiano.data <= end_date
    ).all()

    for giorno in giorni:
        for pasto in giorno.pasti:
            for alimento in pasto.alimenti:
                key = (alimento.id, alimento.unita_predefinita)
                if key in alimenti_necessari:
                    alimenti_necessari[key]["quantita"] += alimento.quantita
                else:
                    alimenti_necessari[key] = {
                        "alimento": alimento,
                        "quantita": alimento.quantita,
                        "unita": alimento.unita_predefinita
                    }

    # Crea le voci della lista della spesa
    for key, info in alimenti_necessari.items():
        voce = models.VoceListaSpesa(
            lista_id=lista_spesa.id,
            alimento_id=info["alimento"].id,
            quantita=info["quantita"],
            unita=info["unita"],
            acquistato=False,
            note=""
        )
        db.add(voce)

    db.commit()
    return lista_spesa

@router.get("/{lista_id}", response_model=schemas.ListaSpesa)
async def get_shopping_list(lista_id: int, db: Session = Depends(get_db)):
    """Ottiene una lista della spesa specifica"""
    lista = db.query(models.ListaSpesa).filter(
        models.ListaSpesa.id == lista_id
    ).first()
    if not lista:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lista della spesa non trovata"
        )
    return lista

@router.patch("/item/{voce_id}", response_model=schemas.VoceListaSpesa)
async def update_shopping_list_item(
    voce_id: int,
    voce: schemas.VoceListaSpesaUpdate,
    db: Session = Depends(get_db)
):
    """Aggiorna una voce della lista della spesa"""
    db_voce = db.query(models.VoceListaSpesa).filter(
        models.VoceListaSpesa.id == voce_id
    ).first()
    if not db_voce:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Voce non trovata"
        )

    # Aggiorna i campi
    for var, value in vars(voce).items():
        if value is not None:  # Aggiorna solo i campi non nulli
            setattr(db_voce, var, value)

    db.commit()
    return db_voce

@router.delete("/{lista_id}")
async def delete_shopping_list(lista_id: int, db: Session = Depends(get_db)):
    """Elimina una lista della spesa"""
    lista = db.query(models.ListaSpesa).filter(
        models.ListaSpesa.id == lista_id
    ).first()
    if not lista:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lista della spesa non trovata"
        )

    db.delete(lista)
    db.commit()
    return {"message": "Lista della spesa eliminata con successo"}
