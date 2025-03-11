from sqlalchemy import Column, Integer, Float, String, ForeignKey, Date, DateTime, JSON, Boolean, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
from typing import List

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    name = Column(String)
    age = Column(Integer)
    gender = Column(String)
    height = Column(Float)  # in cm
    weight = Column(Float)  # in kg
    activity_level = Column(String)  # sedentary, light, moderate, very_active
    goal = Column(String)  # weight_loss, maintenance, muscle_gain
    dietary_restrictions = Column(JSON)  # Array of restrictions
    target_weight = Column(Float)
    daily_calories = Column(Integer)  # Calculated based on profile
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    weight_logs = relationship("WeightLog", back_populates="user")
    meal_logs = relationship("MealLog", back_populates="user")
    settings = relationship("UserSettings", back_populates="user", uselist=False)

class WeightLog(Base):
    __tablename__ = "weight_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    weight = Column(Float)
    date = Column(Date)
    notes = Column(String, nullable=True)

    user = relationship("User", back_populates="weight_logs")

class Food(Base):
    __tablename__ = "foods"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    calories = Column(Integer)  # per 100g
    proteins = Column(Float)    # in g per 100g
    carbs = Column(Float)      # in g per 100g
    fats = Column(Float)       # in g per 100g
    fiber = Column(Float)      # in g per 100g
    serving_size = Column(Float)  # in g
    category = Column(String)     # e.g., "proteins", "carbs", "vegetables"

class MealLog(Base):
    __tablename__ = "meal_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    food_id = Column(Integer, ForeignKey("foods.id"))
    date = Column(Date)
    meal_type = Column(String)  # breakfast, lunch, dinner, snack
    quantity = Column(Float)    # in grams
    calories = Column(Integer)  # calculated based on quantity
    
    user = relationship("User", back_populates="meal_logs")
    food = relationship("Food")

class UserSettings(Base):
    __tablename__ = "user_settings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    weight_unit = Column(String, default="kg")  # kg or lbs
    height_unit = Column(String, default="cm")  # cm or inches
    language = Column(String, default="it")
    notifications_enabled = Column(Integer, default=1)
    meal_reminders = Column(Integer, default=1)
    weight_reminders = Column(Integer, default=1)

    user = relationship("User", back_populates="settings")

# Tabella di associazione per gli alimenti nei pasti
pasto_alimento = Table('pasto_alimento', Base.metadata,
    Column('pasto_id', Integer, ForeignKey('pasti.id'), primary_key=True),
    Column('alimento_id', Integer, ForeignKey('alimenti.id'), primary_key=True),
    Column('quantita', Float),
    Column('unita', String)
)

class PianoAlimentare(Base):
    __tablename__ = 'piani_alimentari'
    
    id = Column(Integer, primary_key=True)
    nome = Column(String, nullable=False)
    obiettivo = Column(String, nullable=False)  # weight_loss, muscle_gain, maintenance, general_health
    data_inizio = Column(Date, nullable=False)
    data_fine = Column(Date, nullable=False)
    calorie_giornaliere = Column(Integer)
    proteine = Column(Integer)  # percentuale
    carboidrati = Column(Integer)  # percentuale
    grassi = Column(Integer)  # percentuale
    note = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    giorni = relationship("GiornoDelPiano", back_populates="piano")

class GiornoDelPiano(Base):
    __tablename__ = 'giorni_piano'
    
    id = Column(Integer, primary_key=True)
    piano_id = Column(Integer, ForeignKey('piani_alimentari.id'))
    giorno_settimana = Column(Integer)  # 0 = Lunedì, 6 = Domenica
    data = Column(Date)
    calorie_totali = Column(Integer)
    note = Column(String)
    
    piano = relationship("PianoAlimentare", back_populates="giorni")
    pasti = relationship("Pasto", back_populates="giorno")

class Pasto(Base):
    __tablename__ = 'pasti'
    
    id = Column(Integer, primary_key=True)
    giorno_id = Column(Integer, ForeignKey('giorni_piano.id'))
    tipo = Column(String)  # colazione, spuntino_mattina, pranzo, spuntino_pomeriggio, cena
    orario = Column(String)
    calorie = Column(Integer)
    proteine = Column(Float)
    carboidrati = Column(Float)
    grassi = Column(Float)
    note = Column(String)
    
    giorno = relationship("GiornoDelPiano", back_populates="pasti")
    alimenti = relationship("Alimento", secondary=pasto_alimento, back_populates="pasti")

class Alimento(Base):
    __tablename__ = 'alimenti'
    
    id = Column(Integer, primary_key=True)
    nome = Column(String, nullable=False)
    calorie_per_100g = Column(Float)
    proteine_per_100g = Column(Float)
    carboidrati_per_100g = Column(Float)
    grassi_per_100g = Column(Float)
    unita_predefinita = Column(String)  # g, ml, pz
    categoria = Column(String)  # cereali, proteine, verdure, frutta, etc.
    
    pasti = relationship("Pasto", secondary=pasto_alimento, back_populates="alimenti")

class DiarioAlimentare(Base):
    __tablename__ = 'diario_alimentare'
    
    id = Column(Integer, primary_key=True)
    data = Column(Date, nullable=False)
    piano_id = Column(Integer, ForeignKey('piani_alimentari.id'))
    calorie_totali = Column(Integer)
    note = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    voci = relationship("VoceDiario", back_populates="diario")

class VoceDiario(Base):
    __tablename__ = 'voci_diario'
    
    id = Column(Integer, primary_key=True)
    diario_id = Column(Integer, ForeignKey('diario_alimentare.id'))
    pasto_id = Column(Integer, ForeignKey('pasti.id'))
    alimento_id = Column(Integer, ForeignKey('alimenti.id'))
    quantita = Column(Float)
    unita = Column(String)
    completato = Column(Boolean, default=False)
    note = Column(String)
    orario = Column(DateTime)
    
    diario = relationship("DiarioAlimentare", back_populates="voci")
    pasto = relationship("Pasto")
    alimento = relationship("Alimento")

class ListaSpesa(Base):
    __tablename__ = 'lista_spesa'
    
    id = Column(Integer, primary_key=True)
    piano_id = Column(Integer, ForeignKey('piani_alimentari.id'))
    alimento_id = Column(Integer, ForeignKey('alimenti.id'))
    quantita = Column(Float)
    unita = Column(String)
    acquistato = Column(Boolean, default=False)
    note = Column(String)
    
    piano = relationship("PianoAlimentare")
    alimento = relationship("Alimento")
