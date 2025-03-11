from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from database import get_db
import models
import schemas

router = APIRouter(
    prefix="/api/foods",
    tags=["foods"]
)

@router.post("/", response_model=schemas.Alimento)
async def create_food(
    alimento: schemas.AlimentoCreate,
    db: Session = Depends(get_db)
):
    """Crea un nuovo alimento nel database"""
    # Verifica se l'alimento esiste già
    db_alimento = db.query(models.Alimento).filter(
        models.Alimento.nome == alimento.nome
    ).first()
    if db_alimento:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Alimento già presente nel database"
        )

    # Crea il nuovo alimento
    db_alimento = models.Alimento(**alimento.dict())
    db.add(db_alimento)
    db.commit()
    db.refresh(db_alimento)
    return db_alimento

@router.get("/", response_model=List[schemas.Alimento])
async def get_foods(
    skip: int = 0,
    limit: int = 100,
    categoria: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Ottiene la lista degli alimenti, con opzioni di filtro"""
    query = db.query(models.Alimento)

    if categoria:
        query = query.filter(models.Alimento.categoria == categoria)
    
    if search:
        search = f"%{search}%"
        query = query.filter(models.Alimento.nome.ilike(search))

    alimenti = query.offset(skip).limit(limit).all()
    return alimenti

@router.get("/{alimento_id}", response_model=schemas.Alimento)
async def get_food(alimento_id: int, db: Session = Depends(get_db)):
    """Ottiene un alimento specifico"""
    alimento = db.query(models.Alimento).filter(
        models.Alimento.id == alimento_id
    ).first()
    if not alimento:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alimento non trovato"
        )
    return alimento

@router.put("/{alimento_id}", response_model=schemas.Alimento)
async def update_food(
    alimento_id: int,
    alimento: schemas.AlimentoUpdate,
    db: Session = Depends(get_db)
):
    """Aggiorna un alimento esistente"""
    db_alimento = db.query(models.Alimento).filter(
        models.Alimento.id == alimento_id
    ).first()
    if not db_alimento:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alimento non trovato"
        )

    # Aggiorna i campi
    for var, value in vars(alimento).items():
        if value is not None:  # Aggiorna solo i campi non nulli
            setattr(db_alimento, var, value)

    db.commit()
    db.refresh(db_alimento)
    return db_alimento

@router.delete("/{alimento_id}")
async def delete_food(alimento_id: int, db: Session = Depends(get_db)):
    """Elimina un alimento"""
    alimento = db.query(models.Alimento).filter(
        models.Alimento.id == alimento_id
    ).first()
    if not alimento:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alimento non trovato"
        )

    # Verifica se l'alimento è utilizzato in qualche piano
    in_uso = db.query(models.pasto_alimento).filter(
        models.pasto_alimento.c.alimento_id == alimento_id
    ).first()
    if in_uso:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Non è possibile eliminare un alimento in uso in uno o più piani alimentari"
        )

    db.delete(alimento)
    db.commit()
    return {"message": "Alimento eliminato con successo"}

@router.get("/categories", response_model=List[str])
async def get_food_categories(db: Session = Depends(get_db)):
    """Ottiene la lista delle categorie di alimenti disponibili"""
    categorie = db.query(models.Alimento.categoria).distinct().all()
    return [cat[0] for cat in categorie if cat[0]]  # Filtra le categorie nulle
