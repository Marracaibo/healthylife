from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date, datetime

class AlimentoBase(BaseModel):
    nome: str
    calorie_per_100g: float
    proteine_per_100g: float
    carboidrati_per_100g: float
    grassi_per_100g: float
    unita_predefinita: str
    categoria: str

class AlimentoCreate(AlimentoBase):
    pass

class Alimento(AlimentoBase):
    id: int

    class Config:
        from_attributes = True

class PastoBase(BaseModel):
    tipo: str
    orario: str
    calorie: int
    proteine: float
    carboidrati: float
    grassi: float
    note: Optional[str] = None

class AlimentoPasto(BaseModel):
    alimento_id: int
    quantita: float
    unita: str

class PastoCreate(PastoBase):
    alimenti: List[AlimentoPasto]

class Pasto(PastoBase):
    id: int
    giorno_id: int
    alimenti: List[Alimento]

    class Config:
        from_attributes = True

class GiornoDelPianoBase(BaseModel):
    giorno_settimana: int
    data: date
    calorie_totali: int
    note: Optional[str] = None

class GiornoDelPianoCreate(GiornoDelPianoBase):
    pasti: List[PastoCreate]

class GiornoDelPiano(GiornoDelPianoBase):
    id: int
    piano_id: int
    pasti: List[Pasto]

    class Config:
        from_attributes = True

class PianoAlimentareBase(BaseModel):
    nome: str
    obiettivo: str
    data_inizio: date
    data_fine: date
    calorie_giornaliere: int
    proteine: int
    carboidrati: int
    grassi: int
    note: Optional[str] = None

class PianoAlimentareCreate(PianoAlimentareBase):
    giorni: List[GiornoDelPianoCreate]

class PianoAlimentare(PianoAlimentareBase):
    id: int
    created_at: datetime
    giorni: List[GiornoDelPiano]

    class Config:
        from_attributes = True

class VoceDiarioBase(BaseModel):
    quantita: float
    unita: str
    completato: bool = False
    note: Optional[str] = None
    orario: datetime

class VoceDiarioCreate(VoceDiarioBase):
    diario_id: int
    pasto_id: int
    alimento_id: int

class VoceDiario(VoceDiarioBase):
    id: int
    pasto: Pasto
    alimento: Alimento

    class Config:
        from_attributes = True

class DiarioAlimentareBase(BaseModel):
    data: date
    calorie_totali: Optional[int] = None
    note: Optional[str] = None

class DiarioAlimentareCreate(DiarioAlimentareBase):
    piano_id: int
    voci: List[VoceDiarioCreate]

class DiarioAlimentare(DiarioAlimentareBase):
    id: int
    created_at: datetime
    voci: List[VoceDiario]

    class Config:
        from_attributes = True

class ListaSpesaBase(BaseModel):
    quantita: float
    unita: str
    acquistato: bool = False
    note: Optional[str] = None

class ListaSpesaCreate(ListaSpesaBase):
    piano_id: int
    alimento_id: int

class ListaSpesa(ListaSpesaBase):
    id: int
    piano: PianoAlimentare
    alimento: Alimento

    class Config:
        from_attributes = True
