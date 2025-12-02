#!/usr/bin/env python
"""
Script para listar todos los usuarios registrados en la base de datos
Uso: python list_users.py
"""

from src.api.models import db, Usuario
from src.api.app import app
from dotenv import load_dotenv
import sys
import os
from pathlib import Path

# Agregar el directorio raíz al path
BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))

# Cargar variables de entorno
load_dotenv()


def listar_usuarios():
    """Lista todos los usuarios en la base de datos"""
    with app.app_context():
        try:
            usuarios = Usuario.query.all()

            if not usuarios:
                print("\n❌ No hay usuarios registrados en la base de datos.\n")
                return

            print("\n" + "="*80)
            print(f"📋 USUARIOS REGISTRADOS ({len(usuarios)} total)")
            print("="*80 + "\n")

            for i, usuario in enumerate(usuarios, 1):
                print(f"👤 Usuario #{i}")
                print(f"   ID: {usuario.id}")
                print(f"   Nombre: {usuario.nombre} {usuario.apellido}")
                print(f"   Email: {usuario.email}")
                print(f"   Teléfono: {usuario.telefono}")
                print(f"   Fecha Nacimiento: {usuario.fecha_nacimiento}")
                print(
                    f"   Fecha Registro: {usuario.fecha_registro.strftime('%Y-%m-%d %H:%M:%S')}")
                print(f"   Activo: {'✅ Sí' if usuario.activo else '❌ No'}")
                print("-" * 80)

            print(f"\n✅ Total de usuarios: {len(usuarios)}\n")

        except Exception as e:
            print(f"\n❌ Error al listar usuarios: {str(e)}\n")
            import traceback
            traceback.print_exc()


if __name__ == '__main__':
    listar_usuarios()
 