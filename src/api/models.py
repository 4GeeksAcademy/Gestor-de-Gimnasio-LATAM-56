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
        # Manejo defensivo por si fecha_nacimiento o fecha_registro son None
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
        """Valida formato de email"""
        patron = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(patron, email) is not None

    @staticmethod
    def validar_telefono(telefono):
        """Valida formato de teléfono (10 dígitos)"""
        telefono_limpio = re.sub(r'\s', '', telefono)
        return len(telefono_limpio) == 10 and telefono_limpio.isdigit()

    @staticmethod
    def validar_password(password):
        """Valida fortaleza de contraseña"""
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
