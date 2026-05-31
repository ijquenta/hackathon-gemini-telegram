"""
database.py — Módulo de acceso a la base de datos MySQL para Banco Sol API.
Provee get_connection() y execute_query() como funciones reutilizables.
"""

import os
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv

load_dotenv()


def get_connection() -> mysql.connector.MySQLConnection:
    """
    Crea y retorna una conexión MySQL usando las variables de entorno.
    Lanza una excepción si no puede conectar.
    """
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=int(os.getenv("DB_PORT", 3306)),
        database=os.getenv("DB_NAME", "db_banco_sol"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", ""),
        charset="utf8mb4",
        collation="utf8mb4_unicode_ci",
        autocommit=False,
    )


def execute_query(query: str, params: tuple = None):
    """
    Ejecuta un query SQL contra la base de datos.

    - SELECT  → retorna list[dict] con los resultados
    - INSERT/UPDATE/DELETE → hace commit y retorna el lastrowid (int)

    Siempre cierra la conexión en un bloque finally.
    Captura excepciones, las loggea y las relanza.
    """
    connection = None
    cursor = None
    try:
        connection = get_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute(query, params or ())

        # Determinar tipo de operación por la primera palabra del query
        operacion = query.strip().upper().split()[0]

        if operacion == "SELECT":
            resultados = cursor.fetchall()
            return resultados
        else:
            connection.commit()
            return cursor.lastrowid

    except Error as e:
        print(f"[DB ERROR] Query: {query[:120]}... | Params: {params} | Error: {e}")
        if connection:
            connection.rollback()
        raise e

    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()
