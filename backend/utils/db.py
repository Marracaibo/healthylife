from contextlib import contextmanager
from typing import Generator
from sqlalchemy.orm import Session
from database import SessionLocal

@contextmanager
def get_db_session() -> Generator[Session, None, None]:
    """
    Context manager per gestire le sessioni del database in modo sicuro.
    Assicura che la sessione venga sempre chiusa dopo l'uso.
    """
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()

def safe_commit(db: Session) -> bool:
    """
    Esegue un commit sicuro della sessione del database.
    Ritorna True se il commit ha successo, False altrimenti.
    """
    try:
        db.commit()
        return True
    except Exception as e:
        db.rollback()
        raise e
