"""
routers/tickets.py — Endpoints para gestión de RIAs (tickets de incidencia) de Banco Sol.
Permite listar, crear tickets, cambiar estado y consultar logs de trazabilidad.
"""

from datetime import datetime
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from database import execute_query

router = APIRouter()


# ── Modelos Pydantic ──────────────────────────────────────────────────────────

class TicketCreate(BaseModel):
    cliente_nombre: str          # Nombre completo del cliente
    cliente_ci: str              # Cédula de identidad del cliente
    cliente_phone: Optional[str] = None  # Teléfono (opcional)
    canal: str                   # WHATSAPP, FACEBOOK_MESSENGER, CALL_CENTER, WEB_APP, CORREO_INTERNACIONAL
    tipo: str                    # INCIDENCIA_TECNICA, RECLAMO_OFICIAL_ASFI, etc.
    prioridad: str               # CRITICA_SLA, ALTA, MEDIA, BAJA
    descripcion: str             # Descripción del problema reportado


class EstadoUpdate(BaseModel):
    estado: str      # Nuevo estado: Pendiente, En Proceso, Resuelto
    updated_by: str  # ID del staff que realiza el cambio (ej: staff-01)


# ── GET /api/tickets — Lista todas las RIAs ───────────────────────────────────

@router.get("/")
def listar_tickets():
    """
    Retorna todas las RIAs con datos del cliente, prioridad, canal y estado.
    Hace JOIN entre rias, clients, ria_statuses, ria_priorities y ria_channels.
    """
    tickets = execute_query("""
        SELECT
            r.id,
            c.name             AS cliente,
            c.ci,
            rc.channel_name    AS canal,
            rp.priority_name   AS prioridad,
            rp.color           AS color_prioridad,
            rs.status_name     AS estado,
            r.description      AS descripcion,
            r.created_at       AS creado_en,
            r.assigned_to      AS asignado_a,
            r.resolved_at,
            r.is_auto_resolved
        FROM rias r
        JOIN clients c         ON r.client_id   = c.id
        JOIN ria_channels rc   ON r.channel_id  = rc.id
        JOIN ria_priorities rp ON r.priority_id = rp.id
        JOIN ria_statuses rs   ON r.status_id   = rs.id
        ORDER BY rp.priority_order ASC, r.created_at DESC
    """) or []

    # Normalizar fechas a ISO 8601 para el frontend
    resultado = []
    for t in tickets:
        resultado.append({
            "id": t["id"],
            "cliente": t["cliente"],
            "ci": t["ci"],
            "canal": t["canal"],
            "prioridad": t["prioridad"],
            "color_prioridad": t["color_prioridad"],
            "estado": t["estado"],
            "descripcion": t["descripcion"],
            "creado_en": t["creado_en"].isoformat() if t["creado_en"] else None,
            "asignado_a": t["asignado_a"],
            "resuelto_en": t["resolved_at"].isoformat() if t["resolved_at"] else None,
            "auto_resuelto": bool(t["is_auto_resolved"]),
        })

    return resultado


# ── POST /api/tickets — Crea una nueva RIA ───────────────────────────────────

@router.post("/", status_code=201)
def crear_ticket(data: TicketCreate):
    """
    Crea una RIA nueva siguiendo la lógica de inserción:
    1. Busca o crea el cliente por CI.
    2. Resuelve IDs de canal, tipo y prioridad.
    3. Genera ID secuencial formato RIA-{año}-{NNN}.
    4. Inserta la RIA con status Pendiente.
    5. Registra log inicial de creación.
    """
    # 1. Buscar cliente existente por CI
    clientes = execute_query(
        "SELECT id FROM clients WHERE ci = %s", (data.cliente_ci,)
    )
    if clientes:
        cliente_id = clientes[0]["id"]
    else:
        # Crear nuevo cliente
        cliente_id = execute_query("""
            INSERT INTO clients (name, ci, phone)
            VALUES (%s, %s, %s)
        """, (data.cliente_nombre, data.cliente_ci, data.cliente_phone))

    # 2. Resolver channel_id por nombre
    canales = execute_query(
        "SELECT id FROM ria_channels WHERE channel_name = %s", (data.canal,)
    )
    if not canales:
        raise HTTPException(status_code=400, detail=f"Canal '{data.canal}' no encontrado")
    channel_id = canales[0]["id"]

    # 3. Resolver type_id por nombre
    tipos = execute_query(
        "SELECT id FROM ria_types WHERE type_name = %s", (data.tipo,)
    )
    if not tipos:
        raise HTTPException(status_code=400, detail=f"Tipo '{data.tipo}' no encontrado")
    type_id = tipos[0]["id"]

    # 4. Resolver priority_id por nombre
    prioridades = execute_query(
        "SELECT id FROM ria_priorities WHERE priority_name = %s", (data.prioridad,)
    )
    if not prioridades:
        raise HTTPException(status_code=400, detail=f"Prioridad '{data.prioridad}' no encontrada")
    priority_id = prioridades[0]["id"]

    # 5. Generar ID secuencial: RIA-{año}-{NNN}
    anio = datetime.now().year
    conteo = execute_query("SELECT COUNT(*) AS total FROM rias")
    total = conteo[0]["total"] if conteo else 0
    numero = str(total + 1).zfill(3)
    ria_id = f"RIA-{anio}-{numero}"

    # Verificar que el ID no exista (por si acaso hay colisiones)
    existente = execute_query("SELECT id FROM rias WHERE id = %s", (ria_id,))
    if existente:
        ria_id = f"RIA-{anio}-{str(total + 100).zfill(3)}"

    # 6. Insertar la RIA con status_id = 1 (Pendiente)
    execute_query("""
        INSERT INTO rias (id, client_id, channel_id, type_id, priority_id, status_id, description)
        VALUES (%s, %s, %s, %s, %s, 1, %s)
    """, (ria_id, cliente_id, channel_id, type_id, priority_id, data.descripcion))

    # 7. Insertar log inicial de creación
    execute_query("""
        INSERT INTO ria_logs (ria_id, description)
        VALUES (%s, %s)
    """, (ria_id, "RIA creada automáticamente por el sistema de IA"))

    return {"id": ria_id, "mensaje": "Ticket creado correctamente"}


# ── PUT /api/tickets/{id}/estado — Actualiza estado de una RIA ───────────────

@router.put("/{ria_id}/estado")
def actualizar_estado(ria_id: str, data: EstadoUpdate):
    """
    Actualiza el estado de una RIA existente.
    Busca el status_id por nombre, actualiza la RIA y agrega log de trazabilidad.
    """
    # Verificar que la RIA existe
    ria = execute_query("SELECT id FROM rias WHERE id = %s", (ria_id,))
    if not ria:
        raise HTTPException(status_code=404, detail=f"RIA '{ria_id}' no encontrada")

    # Resolver status_id por nombre
    estados = execute_query(
        "SELECT id FROM ria_statuses WHERE status_name = %s", (data.estado,)
    )
    if not estados:
        raise HTTPException(status_code=400, detail=f"Estado '{data.estado}' no válido")
    status_id = estados[0]["id"]

    # Si el nuevo estado es Resuelto, registrar la fecha de resolución
    if data.estado == "Resuelto":
        execute_query("""
            UPDATE rias
            SET status_id = %s, resolved_at = NOW(), updated_at = NOW()
            WHERE id = %s
        """, (status_id, ria_id))
    else:
        execute_query("""
            UPDATE rias
            SET status_id = %s, updated_at = NOW()
            WHERE id = %s
        """, (status_id, ria_id))

    # Agregar log de trazabilidad con quién hizo el cambio
    log_msg = f"Estado actualizado a '{data.estado}' por {data.updated_by}"
    execute_query("""
        INSERT INTO ria_logs (ria_id, description, created_by)
        VALUES (%s, %s, %s)
    """, (ria_id, log_msg, data.updated_by))

    return {"id": ria_id, "estado": data.estado, "mensaje": "Estado actualizado correctamente"}


# ── GET /api/tickets/{id}/logs — Logs de trazabilidad de una RIA ─────────────

@router.get("/{ria_id}/logs")
def obtener_logs(ria_id: str):
    """
    Retorna todos los logs de trazabilidad de una RIA,
    ordenados del más reciente al más antiguo.
    """
    # Verificar que la RIA existe
    ria = execute_query("SELECT id FROM rias WHERE id = %s", (ria_id,))
    if not ria:
        raise HTTPException(status_code=404, detail=f"RIA '{ria_id}' no encontrada")

    logs = execute_query("""
        SELECT
            l.id,
            l.description,
            l.timestamp,
            l.created_by,
            s.name AS nombre_agente
        FROM ria_logs l
        LEFT JOIN staff s ON l.created_by = s.id
        WHERE l.ria_id = %s
        ORDER BY l.timestamp DESC
    """, (ria_id,)) or []

    return [
        {
            "id": log["id"],
            "descripcion": log["description"],
            "timestamp": log["timestamp"].isoformat() if log["timestamp"] else None,
            "creado_por": log["created_by"],
            "nombre_agente": log["nombre_agente"],
        }
        for log in logs
    ]
