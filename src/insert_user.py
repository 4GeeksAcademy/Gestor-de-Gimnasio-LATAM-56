# src/insert_user.py
from setup_db import Usuario, session

# 🔹 Crear un nuevo usuario
nuevo_usuario = Usuario(
    nombre="Juan Carlos",
    apellido="Avalos",
    email="jc@example.com"
)

session.add(nuevo_usuario)
session.commit()

print("Usuario insertado correctamente.")
