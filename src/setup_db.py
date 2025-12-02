# src/setup_db.py
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, Date, ForeignKey, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from datetime import datetime

# ==============================
# Configuración de la Base de Datos
# ==============================
DATABASE_URL = "postgresql://neondb_owner:npg_lkoUvjE1h6AK@ep-spring-wave-adppec3a-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"

engine = create_engine(DATABASE_URL, echo=True)
Base = declarative_base()
Session = sessionmaker(bind=engine)
session = Session()

# ==============================
# Modelos
# ==============================


class Usuario(Base):
    __tablename__ = "usuarios"
    id = Column(Integer, primary_key=True)
    nombre = Column(String, nullable=False)
    apellido = Column(String, nullable=True)
    email = Column(String, nullable=False, unique=True)
    password_hash = Column(String, nullable=True)

    objetivos = relationship("Objetivo", back_populates="usuario")
    perfil = relationship("PerfilCorporal", uselist=False,
                          back_populates="usuario")
    historial = relationship("HistorialProgreso", back_populates="usuario")


class Objetivo(Base):
    __tablename__ = "objetivos"
    id = Column(Integer, primary_key=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    titulo = Column(String, nullable=False)
    categoria = Column(String, nullable=False)
    meta = Column(Float, nullable=False)
    actual = Column(Float, default=0)
    unidad = Column(String, nullable=False)
    fecha_inicio = Column(Date, default=datetime.utcnow)
    fecha_meta = Column(Date, nullable=False)
    completado = Column(Boolean, default=False)

    usuario = relationship("Usuario", back_populates="objetivos")

    def to_dict(self):
        return {
            "id": self.id,
            "usuario_id": self.usuario_id,
            "titulo": self.titulo,
            "categoria": self.categoria,
            "meta": self.meta,
            "actual": self.actual,
            "unidad": self.unidad,
            "fecha_inicio": str(self.fecha_inicio),
            "fecha_meta": str(self.fecha_meta),
            "completado": self.completado
        }


class PerfilCorporal(Base):
    __tablename__ = "perfil_corporal"
    id = Column(Integer, primary_key=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    peso = Column(Float, default=0)
    altura = Column(Float, default=0)
    edad = Column(Integer, default=0)
    genero = Column(String, default="")
    cuello = Column(Float, default=0)
    pecho = Column(Float, default=0)
    cintura = Column(Float, default=0)
    cadera = Column(Float, default=0)
    muslo_izq = Column(Float, default=0)
    muslo_der = Column(Float, default=0)
    pantorrilla_izq = Column(Float, default=0)
    pantorrilla_der = Column(Float, default=0)
    brazo_izq = Column(Float, default=0)
    brazo_der = Column(Float, default=0)
    antebrazo_izq = Column(Float, default=0)
    antebrazo_der = Column(Float, default=0)
    fecha_registro = Column(DateTime, default=datetime.utcnow)

    usuario = relationship("Usuario", back_populates="perfil")

    def to_dict(self):
        return {
            "id": self.id,
            "usuario_id": self.usuario_id,
            "peso": self.peso,
            "altura": self.altura,
            "edad": self.edad,
            "genero": self.genero,
            "medidas": {
                "cuello": self.cuello,
                "pecho": self.pecho,
                "cintura": self.cintura,
                "cadera": self.cadera,
                "musloIzq": self.muslo_izq,
                "musloDer": self.muslo_der,
                "pantorrillaIzq": self.pantorrilla_izq,
                "pantorrillaDer": self.pantorrilla_der,
                "brazoIzq": self.brazo_izq,
                "brazoDer": self.brazo_der,
                "antebrazoIzq": self.antebrazo_izq,
                "antebrazoDer": self.antebrazo_der,
            },
            "fecha_registro": str(self.fecha_registro)
        }


class HistorialProgreso(Base):
    __tablename__ = "historial_progreso"
    id = Column(Integer, primary_key=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    fecha = Column(Date, nullable=False)
    peso = Column(Float, nullable=False)
    grasa_corporal = Column(Float, default=0)
    musculo = Column(Float, default=0)
    imc = Column(Float, default=0)

    usuario = relationship("Usuario", back_populates="historial")

    def to_dict(self):
        return {
            "id": self.id,
            "usuario_id": self.usuario_id,
            "fecha": str(self.fecha),
            "peso": self.peso,
            "grasaCorporal": self.grasa_corporal,
            "musculo": self.musculo,
            "imc": self.imc
        }

# ==============================
# Inicialización de Tablas
# ==============================


def init_db():
    Base.metadata.create_all(engine)
    print("Tablas creadas y listas en Neon")


if __name__ == "__main__":
    init_db()
