from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import date, datetime

from database import get_db
import models
import schemas

router = APIRouter(
    prefix="/api/food-diary",
    tags=["food-diary"]
)

@router.post("/", response_model=schemas.DiarioAlimentare)
async def create_diary_entry(
    diario: schemas.DiarioAlimentareCreate,
    db: Session = Depends(get_db)
):
    """Crea una nuova voce nel diario alimentare"""
    # Verifica che il piano alimentare esista
    piano = db.query(models.PianoAlimentare).filter(
        models.PianoAlimentare.id == diario.piano_id
    ).first()
    if not piano:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Piano alimentare non trovato"
        )

    # Crea la voce del diario
    db_diario = models.DiarioAlimentare(
        data=diario.data,
        piano_id=diario.piano_id,
        calorie_totali=diario.calorie_totali,
        note=diario.note
    )
    db.add(db_diario)
    db.flush()

    # Crea le voci per ogni alimento
    for voce in diario.voci:
        db_voce = models.VoceDiario(
            diario_id=db_diario.id,
            pasto_id=voce.pasto_id,
            alimento_id=voce.alimento_id,
            quantita=voce.quantita,
            unita=voce.unita,
            completato=voce.completato,
            note=voce.note,
            orario=voce.orario
        )
        db.add(db_voce)

    db.commit()
    return db_diario

@router.get("/date/{data}", response_model=schemas.DiarioAlimentare)
async def get_diary_by_date(data: date, db: Session = Depends(get_db)):
    """Ottiene la voce del diario per una data specifica"""
    diario = db.query(models.DiarioAlimentare).filter(
        models.DiarioAlimentare.data == data
    ).first()
    if not diario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nessuna voce trovata per questa data"
        )
    return diario

@router.get("/range", response_model=List[schemas.DiarioAlimentare])
async def get_diary_range(
    start_date: date,
    end_date: date,
    db: Session = Depends(get_db)
):
    """Ottiene le voci del diario in un intervallo di date"""
    diario = db.query(models.DiarioAlimentare).filter(
        models.DiarioAlimentare.data >= start_date,
        models.DiarioAlimentare.data <= end_date
    ).all()
    return diario

@router.patch("/entry/{voce_id}", response_model=schemas.VoceDiario)
async def update_diary_entry(
    voce_id: int,
    voce: schemas.VoceDiarioCreate,
    db: Session = Depends(get_db)
):
    """Aggiorna una voce del diario"""
    db_voce = db.query(models.VoceDiario).filter(
        models.VoceDiario.id == voce_id
    ).first()
    if not db_voce:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Voce non trovata"
        )

    # Aggiorna i campi
    for var, value in vars(voce).items():
        setattr(db_voce, var, value)

    db.commit()
    return db_voce

@router.delete("/entry/{voce_id}")
async def delete_diary_entry(voce_id: int, db: Session = Depends(get_db)):
    """Elimina una voce del diario"""
    db_voce = db.query(models.VoceDiario).filter(
        models.VoceDiario.id == voce_id
    ).first()
    if not db_voce:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Voce non trovata"
        )

    db.delete(db_voce)
    db.commit()
    return {"message": "Voce eliminata con successo"}
