from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import date, timedelta

from database import get_db
import models
import schemas
from ai_service import AIService

router = APIRouter(
    prefix="/api/meal-plans",
    tags=["meal-plans"]
)

ai_service = AIService()

@router.post("/", response_model=schemas.PianoAlimentare)
async def create_meal_plan(
    piano: schemas.PianoAlimentareCreate,
    db: Session = Depends(get_db)
):
    """Crea un nuovo piano alimentare"""
    db_piano = models.PianoAlimentare(
        nome=piano.nome,
        obiettivo=piano.obiettivo,
        data_inizio=piano.data_inizio,
        data_fine=piano.data_fine,
        calorie_giornaliere=piano.calorie_giornaliere,
        proteine=piano.proteine,
        carboidrati=piano.carboidrati,
        grassi=piano.grassi,
        note=piano.note
    )
    db.add(db_piano)
    db.flush()  # Per ottenere l'ID del piano

    # Crea i giorni del piano
    for giorno in piano.giorni:
        db_giorno = models.GiornoDelPiano(
            piano_id=db_piano.id,
            giorno_settimana=giorno.giorno_settimana,
            data=giorno.data,
            calorie_totali=giorno.calorie_totali,
            note=giorno.note
        )
        db.add(db_giorno)
        db.flush()  # Per ottenere l'ID del giorno

        # Crea i pasti per ogni giorno
        for pasto in giorno.pasti:
            db_pasto = models.Pasto(
                giorno_id=db_giorno.id,
                tipo=pasto.tipo,
                orario=pasto.orario,
                calorie=pasto.calorie,
                proteine=pasto.proteine,
                carboidrati=pasto.carboidrati,
                grassi=pasto.grassi,
                note=pasto.note
            )
            db.add(db_pasto)
            db.flush()  # Per ottenere l'ID del pasto

            # Aggiungi gli alimenti al pasto
            for alimento in pasto.alimenti:
                db.execute(
                    models.pasto_alimento.insert().values(
                        pasto_id=db_pasto.id,
                        alimento_id=alimento.alimento_id,
                        quantita=alimento.quantita,
                        unita=alimento.unita
                    )
                )

    db.commit()
    return db_piano

@router.post("/generate", response_model=schemas.PianoAlimentare)
async def generate_meal_plan(
    goal: str,
    calories_target: int,
    start_date: date,
    dietary_restrictions: List[str] = [],
    db: Session = Depends(get_db)
):
    """Genera un nuovo piano alimentare usando l'AI"""
    # Genera il piano usando l'AI
    ai_response = await ai_service.generate_meal_plan_by_goal(
        goal=goal,
        calories_target=calories_target,
        dietary_restrictions=dietary_restrictions
    )

    if "error" in ai_response:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=ai_response["error"]
        )

    # Crea il piano nel database
    end_date = start_date + timedelta(days=6)  # Piano settimanale
    piano = schemas.PianoAlimentareCreate(
        nome=f"Piano {goal} - {start_date}",
        obiettivo=goal,
        data_inizio=start_date,
        data_fine=end_date,
        calorie_giornaliere=calories_target,
        proteine=ai_response["macronutrienti"]["proteine"],
        carboidrati=ai_response["macronutrienti"]["carboidrati"],
        grassi=ai_response["macronutrienti"]["grassi"],
        note=ai_response.get("note", ""),
        giorni=[]
    )

    # Converti la risposta AI in giorni del piano
    for i, giorno_ai in enumerate(ai_response["giorni"]):
        giorno_data = start_date + timedelta(days=i)
        giorno = schemas.GiornoDelPianoCreate(
            giorno_settimana=i,
            data=giorno_data,
            calorie_totali=sum(p["calorie"] for p in giorno_ai["pasti"]),
            note=giorno_ai.get("note", ""),
            pasti=[]
        )

        # Converti i pasti
        for pasto_ai in giorno_ai["pasti"]:
            pasto = schemas.PastoCreate(
                tipo=pasto_ai["tipo"],
                orario=pasto_ai["orario"],
                calorie=pasto_ai["calorie"],
                proteine=pasto_ai["macronutrienti"]["proteine"],
                carboidrati=pasto_ai["macronutrienti"]["carboidrati"],
                grassi=pasto_ai["macronutrienti"]["grassi"],
                note=pasto_ai.get("note", ""),
                alimenti=[]
            )

            # Converti gli alimenti
            for alimento_ai in pasto_ai["alimenti"]:
                # Cerca l'alimento nel database o creane uno nuovo
                db_alimento = db.query(models.Alimento).filter(
                    models.Alimento.nome == alimento_ai["nome"]
                ).first()
                
                if not db_alimento:
                    db_alimento = models.Alimento(
                        nome=alimento_ai["nome"],
                        calorie_per_100g=alimento_ai["calorie_per_100g"],
                        proteine_per_100g=alimento_ai["proteine_per_100g"],
                        carboidrati_per_100g=alimento_ai["carboidrati_per_100g"],
                        grassi_per_100g=alimento_ai["grassi_per_100g"],
                        unita_predefinita=alimento_ai["unita"],
                        categoria=alimento_ai.get("categoria", "altro")
                    )
                    db.add(db_alimento)
                    db.flush()

                pasto.alimenti.append(schemas.AlimentoPasto(
                    alimento_id=db_alimento.id,
                    quantita=alimento_ai["quantita"],
                    unita=alimento_ai["unita"]
                ))

            giorno.pasti.append(pasto)
        piano.giorni.append(giorno)

    # Salva il piano nel database
    return await create_meal_plan(piano, db)

@router.get("/{piano_id}", response_model=schemas.PianoAlimentare)
async def get_meal_plan(piano_id: int, db: Session = Depends(get_db)):
    """Ottiene un piano alimentare specifico"""
    try:
        piano = db.query(models.PianoAlimentare).filter(
            models.PianoAlimentare.id == piano_id
        ).first()
        if not piano:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"message": "Piano non trovato", "error": "Piano non trovato"}
            )
        return schemas.PianoAlimentare.from_orm(piano)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"message": "Errore nel recupero del piano alimentare", "error": str(e)}
        )

@router.get("/", response_model=List[schemas.PianoAlimentare])
async def get_meal_plans(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """Ottiene la lista dei piani alimentari"""
    try:
        piani = db.query(models.PianoAlimentare).offset(skip).limit(limit).all()
        if not piani:
            return []
        return [schemas.PianoAlimentare.from_orm(piano) for piano in piani]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"message": "Errore nel recupero dei piani alimentari", "error": str(e)}
        )

@router.delete("/{piano_id}")
async def delete_meal_plan(piano_id: int, db: Session = Depends(get_db)):
    """Elimina un piano alimentare"""
    try:
        piano = db.query(models.PianoAlimentare).filter(
            models.PianoAlimentare.id == piano_id
        ).first()
        if not piano:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"message": "Piano non trovato", "error": "Piano non trovato"}
            )
        db.delete(piano)
        db.commit()
        return {"message": "Piano eliminato con successo"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"message": "Errore nell'eliminazione del piano alimentare", "error": str(e)}
        )
