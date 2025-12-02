# src/api/models.py
"""
Modelos de la base de datos.
Contiene dos modelos:
 - User: modelo mínimo (para compatibilidad con otras partes del proyecto)
 - Usuario: modelo principal usado por la API de registro/login
"""
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import re

db = SQLAlchemy()


class User(db.Model):
    """
    Modelo auxiliar (mantener para compatibilidad).
    No se usa para el registro principal.
    """
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(
        Boolean(), nullable=False, default=True)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
        }


class Usuario(db.Model):
    """
    Modelo de Usuario para el sistema de registro del gimnasio
    """
    __tablename__ = 'usuarios'

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50), nullable=False)
    apellido = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    telefono = db.Column(db.String(15), nullable=False)
    fecha_nacimiento = db.Column(db.Date, nullable=False)
    fecha_registro = db.Column(db.DateTime, default=datetime.utcnow)
    activo = db.Column(db.Boolean, default=True)

    # Métodos de seguridad
    def set_password(self, password):
        """Encripta y guarda la contraseña"""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Verifica si la contraseña es correcta"""
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        """Convierte el objeto a diccionario (sin password)"""
        fecha_nac = self.fecha_nacimiento.isoformat() if self.fecha_nacimiento else None
        fecha_reg = self.fecha_registro.isoformat() if self.fecha_registro else None

        return {
            'id': self.id,
            'nombre': self.nombre,
            'apellido': self.apellido,
            'email': self.email,
            'telefono': self.telefono,
            'fecha_nacimiento': fecha_nac,
            'fecha_registro': fecha_reg,
            'activo': self.activo
        }

    # Validaciones estáticas
    @staticmethod
    def validar_email(email):
        patron = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(patron, email) is not None

    @staticmethod
    def validar_telefono(telefono):
        telefono_limpio = re.sub(r'\s', '', telefono)
        return len(telefono_limpio) == 10 and telefono_limpio.isdigit()

    @staticmethod
    def validar_password(password):
        if len(password) < 8:
            return False, "La contraseña debe tener al menos 8 caracteres"
        if not re.search(r'[A-Z]', password):
            return False, "La contraseña debe tener al menos una mayúscula"
        if not re.search(r'[a-z]', password):
            return False, "La contraseña debe tener al menos una minúscula"
        if not re.search(r'\d', password):
            return False, "La contraseña debe tener al menos un número"
        return True, ""

    def __repr__(self):
        return f'<Usuario {self.email}>'


# ========== MODELO: OBJETIVO ==========
class Objetivo(db.Model):
    """
    Modelo para almacenar objetivos personales de fitness
    """
    __tablename__ = 'objetivos'

    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)

    titulo = db.Column(db.String(200), nullable=False)
    categoria = db.Column(db.String(50), nullable=False)
    meta = db.Column(db.Float, nullable=False)
    actual = db.Column(db.Float, default=0)
    unidad = db.Column(db.String(20), nullable=False)
    fecha_inicio = db.Column(db.Date, default=datetime.utcnow)
    fecha_meta = db.Column(db.Date, nullable=False)
    fecha_completado = db.Column(db.DateTime, nullable=True)
    fecha_ultima_actualizacion = db.Column(db.DateTime, default=datetime.utcnow)
    completado = db.Column(db.Boolean, default=False)

    usuario = db.relationship('Usuario', backref=db.backref('objetivos', lazy=True))

    def to_dict(self):
        """Convierte el objetivo a diccionario con nombres camelCase"""
        return {
            'id': self.id,
            'titulo': self.titulo,
            'categoria': self.categoria,
            'meta': float(self.meta),
            'actual': float(self.actual),
            'unidad': self.unidad,
            'fecha_inicio': self.fecha_inicio.strftime('%Y-%m-%d') if self.fecha_inicio else None,
            'fecha_meta': self.fecha_meta.strftime('%Y-%m-%d') if self.fecha_meta else None,
            'fecha_completado': self.fecha_completado.strftime('%Y-%m-%d') if self.fecha_completado else None,
            'completado': self.completado
        }

    def __repr__(self):
        return f'<Objetivo {self.titulo} - {self.actual}/{self.meta} {self.unidad}>'


# ========== MODELO: PERFIL CORPORAL ==========
class PerfilCorporal(db.Model):
    """
    Modelo para almacenar datos corporales y medidas del usuario
    """
    __tablename__ = 'perfil_corporal'

    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False, unique=True)

    # Datos básicos
    peso = db.Column(db.Float, default=0)
    altura = db.Column(db.Integer, default=0)
    edad = db.Column(db.Integer, default=0)
    genero = db.Column(db.String(20), default='masculino')
    fecha_registro = db.Column(db.DateTime, default=datetime.utcnow)

    # Medidas corporales (cm)
    cuello = db.Column(db.Float, default=0)
    pecho = db.Column(db.Float, default=0)
    cintura = db.Column(db.Float, default=0)
    cadera = db.Column(db.Float, default=0)
    muslo_izq = db.Column(db.Float, default=0)
    muslo_der = db.Column(db.Float, default=0)
    pantorrilla_izq = db.Column(db.Float, default=0)
    pantorrilla_der = db.Column(db.Float, default=0)
    brazo_izq = db.Column(db.Float, default=0)
    brazo_der = db.Column(db.Float, default=0)
    antebrazo_izq = db.Column(db.Float, default=0)
    antebrazo_der = db.Column(db.Float, default=0)

    usuario = db.relationship('Usuario', backref=db.backref('perfil_corporal', uselist=False))

    def to_dict(self):
        """
        🔥 FIX CRÍTICO: Devuelve estructura plana compatible con el frontend
        El frontend espera las medidas en el nivel superior, no anidadas
        """
        return {
            'id': self.id,
            'peso': float(self.peso) if self.peso else 0,
            'altura': int(self.altura) if self.altura else 0,
            'edad': int(self.edad) if self.edad else 0,
            'genero': self.genero,
            'fecha_registro': self.fecha_registro.strftime('%Y-%m-%d') if self.fecha_registro else None,
            # Medidas en el nivel superior (sin anidación)
            'cuello': float(self.cuello) if self.cuello else 0,
            'pecho': float(self.pecho) if self.pecho else 0,
            'cintura': float(self.cintura) if self.cintura else 0,
            'cadera': float(self.cadera) if self.cadera else 0,
            'muslo_izq': float(self.muslo_izq) if self.muslo_izq else 0,
            'muslo_der': float(self.muslo_der) if self.muslo_der else 0,
            'pantorrilla_izq': float(self.pantorrilla_izq) if self.pantorrilla_izq else 0,
            'pantorrilla_der': float(self.pantorrilla_der) if self.pantorrilla_der else 0,
            'brazo_izq': float(self.brazo_izq) if self.brazo_izq else 0,
            'brazo_der': float(self.brazo_der) if self.brazo_der else 0,
            'antebrazo_izq': float(self.antebrazo_izq) if self.antebrazo_izq else 0,
            'antebrazo_der': float(self.antebrazo_der) if self.antebrazo_der else 0
        }

    def __repr__(self):
        return f'<PerfilCorporal Usuario {self.usuario_id}>'


# ========== MODELO: HISTORIAL DE PROGRESO ==========
class HistorialProgreso(db.Model):
    """
    Modelo para almacenar el historial de progreso del usuario
    """
    __tablename__ = 'historial_progreso'

    id = db.Column(db.Integer, primary_key=True)
    usuario_id = db.Column(db.Integer, db.ForeignKey('usuarios.id'), nullable=False)

    fecha = db.Column(db.Date, nullable=False)
    peso = db.Column(db.Float, nullable=False)
    grasa_corporal = db.Column(db.Float, default=0)
    musculo = db.Column(db.Float, default=0)
    imc = db.Column(db.Float, default=0)

    usuario = db.relationship('Usuario', backref=db.backref('historial_progreso', lazy=True))

    def to_dict(self):
        """Convierte el registro a diccionario"""
        return {
            'id': self.id,
            'fecha': self.fecha.strftime('%Y-%m-%d'),
            'peso': float(self.peso),
            'grasaCorporal': float(self.grasa_corporal),
            'musculo': float(self.musculo),
            'imc': float(self.imc)
        }

    def __repr__(self):
        return f'<HistorialProgreso {self.fecha} - {self.peso}kg>'