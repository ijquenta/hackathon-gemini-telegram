"""
routers/playbooks.py — Endpoints para gestión de playbooks de Banco Sol.
Permite listar, obtener, crear, actualizar playbooks y guardar sugerencias de IA.
"""

from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import execute_query

router = APIRouter()


# ── Modelos Pydantic ──────────────────────────────────────────────────────────

class PasoPlaybook(BaseModel):
    step_number: int   # Número de paso (1, 2, 3...)
    step_text: str     # Descripción del paso


class PlaybookCreate(BaseModel):
    incidencia_name: str            # Nombre de la incidencia
    tipo: str                       # transacción, fraude, acceso, fallo técnico, consulta
    priority_id: int                # FK a ria_priorities
    impacto: str                    # Descripción del impacto
    application_ids: list[int]      # IDs de aplicaciones relacionadas
    pasos: list[PasoPlaybook]       # Pasos de validación
    datos_requeridos: list[str]     # Datos que el agente debe recopilar
    evidencias_requeridas: list[str] # Evidencias necesarias
    condiciones_escalado: list[str]  # Cuándo escalar el caso


class PlaybookSugerencia(PlaybookCreate):
    sugerido_por_ia: bool = True    # Indica que fue generado por IA


class PlaybookUpdate(BaseModel):
    incidencia_name: str  # Nuevo nombre de la incidencia
    impacto: str          # Nuevo impacto


# ── GET /api/playbooks — Lista todos los playbooks con pasos y datos ──────────

@router.get("/")
def listar_playbooks():
    """
    Retorna todos los playbooks con sus pasos de validación,
    datos requeridos, evidencias requeridas y prioridad.
    Los pasos se agrupan por playbook_id en Python.
    """
    # Obtener playbooks con su prioridad
    playbooks_raw = execute_query("""
        SELECT
            p.id,
            p.incidencia_name,
            p.tipo,
            p.impacto,
            rp.priority_name AS prioridad,
            rp.color         AS color_prioridad
        FROM playbooks p
        LEFT JOIN ria_priorities rp ON p.priority_id = rp.id
        ORDER BY rp.priority_order ASC, p.id ASC
    """)

    if not playbooks_raw:
        return []

    ids = [str(p["id"]) for p in playbooks_raw]
    placeholders = ", ".join(["%s"] * len(ids))
    ids_tuple = tuple(int(i) for i in ids)

    # Obtener pasos de todos los playbooks en una sola query
    pasos_raw = execute_query(f"""
        SELECT playbook_id, step_number, step_text
        FROM playbook_validation_steps
        WHERE playbook_id IN ({placeholders})
        ORDER BY playbook_id, step_number
    """, ids_tuple)

    # Obtener datos requeridos
    datos_raw = execute_query(f"""
        SELECT playbook_id, data_name
        FROM playbook_required_data
        WHERE playbook_id IN ({placeholders})
    """, ids_tuple)

    # Obtener evidencias requeridas
    evidencias_raw = execute_query(f"""
        SELECT playbook_id, evidence_name
        FROM playbook_required_evidence
        WHERE playbook_id IN ({placeholders})
    """, ids_tuple)

    # Indexar por playbook_id para acceso O(1)
    pasos_map: dict[int, list] = {}
    for paso in (pasos_raw or []):
        pasos_map.setdefault(paso["playbook_id"], []).append({
            "step_number": paso["step_number"],
            "step_text": paso["step_text"],
        })

    datos_map: dict[int, list] = {}
    for dato in (datos_raw or []):
        datos_map.setdefault(dato["playbook_id"], []).append(dato["data_name"])

    evidencias_map: dict[int, list] = {}
    for ev in (evidencias_raw or []):
        evidencias_map.setdefault(ev["playbook_id"], []).append(ev["evidence_name"])

    # Construir respuesta final
    resultado = []
    for p in playbooks_raw:
        pid = p["id"]
        resultado.append({
            "id": pid,
            "incidencia_name": p["incidencia_name"],
            "tipo": p["tipo"],
            "prioridad": p["prioridad"],
            "color_prioridad": p["color_prioridad"],
            "impacto": p["impacto"],
            "pasos": pasos_map.get(pid, []),
            "datos_requeridos": datos_map.get(pid, []),
            "evidencias_requeridas": evidencias_map.get(pid, []),
        })

    return resultado


# ── GET /api/playbooks/{id} — Detalle completo de un playbook ────────────────

@router.get("/{playbook_id}")
def obtener_playbook(playbook_id: int):
    """
    Retorna un playbook específico con toda su información:
    pasos, datos requeridos, evidencias y condiciones de escalado.
    """
    playbooks_raw = execute_query("""
        SELECT
            p.id,
            p.incidencia_name,
            p.tipo,
            p.impacto,
            p.created_at,
            p.updated_at,
            rp.priority_name AS prioridad,
            rp.color         AS color_prioridad
        FROM playbooks p
        LEFT JOIN ria_priorities rp ON p.priority_id = rp.id
        WHERE p.id = %s
    """, (playbook_id,))

    if not playbooks_raw:
        raise HTTPException(status_code=404, detail=f"Playbook {playbook_id} no encontrado")

    p = playbooks_raw[0]

    # Pasos de validación
    pasos = execute_query("""
        SELECT step_number, step_text
        FROM playbook_validation_steps
        WHERE playbook_id = %s
        ORDER BY step_number
    """, (playbook_id,)) or []

    # Datos requeridos
    datos = execute_query("""
        SELECT data_name FROM playbook_required_data
        WHERE playbook_id = %s
    """, (playbook_id,)) or []

    # Evidencias requeridas
    evidencias = execute_query("""
        SELECT evidence_name FROM playbook_required_evidence
        WHERE playbook_id = %s
    """, (playbook_id,)) or []

    # Condiciones de escalado
    condiciones = execute_query("""
        SELECT condition_text FROM playbook_escalate_conditions
        WHERE playbook_id = %s
    """, (playbook_id,)) or []

    # Aplicaciones relacionadas
    aplicaciones = execute_query("""
        SELECT a.id, a.app_name, a.description
        FROM applications a
        JOIN playbook_applications pa ON a.id = pa.application_id
        WHERE pa.playbook_id = %s
    """, (playbook_id,)) or []

    return {
        "id": p["id"],
        "incidencia_name": p["incidencia_name"],
        "tipo": p["tipo"],
        "prioridad": p["prioridad"],
        "color_prioridad": p["color_prioridad"],
        "impacto": p["impacto"],
        "creado_en": p["created_at"].isoformat() if p["created_at"] else None,
        "actualizado_en": p["updated_at"].isoformat() if p["updated_at"] else None,
        "pasos": [{"step_number": s["step_number"], "step_text": s["step_text"]} for s in pasos],
        "datos_requeridos": [d["data_name"] for d in datos],
        "evidencias_requeridas": [e["evidence_name"] for e in evidencias],
        "condiciones_escalado": [c["condition_text"] for c in condiciones],
        "aplicaciones": aplicaciones,
    }


# ── Función interna reutilizable para insertar un playbook completo ───────────

def _insertar_playbook(data: PlaybookCreate) -> int:
    """
    Inserta un playbook completo en todas las tablas relacionadas.
    Retorna el ID generado del nuevo playbook.
    """
    # 1. Insertar playbook principal
    nuevo_id = execute_query("""
        INSERT INTO playbooks (incidencia_name, tipo, priority_id, impacto)
        VALUES (%s, %s, %s, %s)
    """, (data.incidencia_name, data.tipo, data.priority_id, data.impacto))

    # 2. Insertar pasos de validación
    for paso in data.pasos:
        execute_query("""
            INSERT INTO playbook_validation_steps (playbook_id, step_number, step_text)
            VALUES (%s, %s, %s)
        """, (nuevo_id, paso.step_number, paso.step_text))

    # 3. Insertar datos requeridos
    for dato in data.datos_requeridos:
        execute_query("""
            INSERT INTO playbook_required_data (playbook_id, data_name)
            VALUES (%s, %s)
        """, (nuevo_id, dato))

    # 4. Insertar evidencias requeridas
    for evidencia in data.evidencias_requeridas:
        execute_query("""
            INSERT INTO playbook_required_evidence (playbook_id, evidence_name)
            VALUES (%s, %s)
        """, (nuevo_id, evidencia))

    # 5. Insertar condiciones de escalado
    for condicion in data.condiciones_escalado:
        execute_query("""
            INSERT INTO playbook_escalate_conditions (playbook_id, condition_text)
            VALUES (%s, %s)
        """, (nuevo_id, condicion))

    # 6. Relacionar con aplicaciones
    for app_id in data.application_ids:
        execute_query("""
            INSERT IGNORE INTO playbook_applications (playbook_id, application_id)
            VALUES (%s, %s)
        """, (nuevo_id, app_id))

    return nuevo_id


# ── POST /api/playbooks — Crea un nuevo playbook completo ────────────────────

@router.post("/", status_code=201)
def crear_playbook(data: PlaybookCreate):
    """
    Crea un playbook completo insertando en todas las tablas relacionadas.
    Retorna el ID generado y un mensaje de confirmación.
    """
    try:
        nuevo_id = _insertar_playbook(data)
        return {"id": nuevo_id, "mensaje": "Playbook creado correctamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al crear playbook: {str(e)}")


# ── POST /api/playbooks/sugerencias — Guarda sugerencia generada por IA ───────

@router.post("/sugerencias", status_code=201)
def guardar_sugerencia(data: PlaybookSugerencia):
    """
    Recibe una sugerencia de playbook generada por la IA y la guarda
    en la base de datos igual que un playbook normal.
    El campo sugerido_por_ia=True es informativo para el frontend.
    """
    try:
        nuevo_id = _insertar_playbook(data)
        return {"id": nuevo_id, "mensaje": "Sugerencia guardada"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al guardar sugerencia: {str(e)}")


# ── PUT /api/playbooks/{id} — Actualiza título e impacto ─────────────────────

@router.put("/{playbook_id}")
def actualizar_playbook(playbook_id: int, data: PlaybookUpdate):
    """
    Actualiza el nombre de la incidencia y el impacto de un playbook existente.
    Retorna 404 si el playbook no existe.
    """
    # Verificar que el playbook existe
    existente = execute_query(
        "SELECT id FROM playbooks WHERE id = %s", (playbook_id,)
    )
    if not existente:
        raise HTTPException(status_code=404, detail=f"Playbook {playbook_id} no encontrado")

    execute_query("""
        UPDATE playbooks
        SET incidencia_name = %s, impacto = %s
        WHERE id = %s
    """, (data.incidencia_name, data.impacto, playbook_id))

    return {"id": playbook_id, "mensaje": "Playbook actualizado correctamente"}
