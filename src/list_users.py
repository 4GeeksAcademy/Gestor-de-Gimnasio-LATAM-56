# src/list_users.py
from setup_db import Usuario, session

usuarios = session.query(Usuario).all()

if not usuarios:
    print("No hay usuarios en la base de datos.")
else:
    for u in usuarios:
        print(
            f"ID: {u.id} | Nombre: {u.nombre} | Apellido: {u.apellido} | Email: {u.email}")
