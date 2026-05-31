"""
main.py — Punto de entrada de la API FastAPI para Banco Sol.
Configura CORS, registra los routers y expone el endpoint raíz.
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from routers import playbooks, tickets

load_dotenv()

# ── Instancia principal de la aplicación ─────────────────────────────────────
app = FastAPI(
    title="Banco Sol - API de Incidencias",
    description="API REST para gestión de RIAs (Requerimientos de Incidencia y Atención) y playbooks de Banco Sol Bolivia.",
    version="1.0.0",
)

# ── CORS — permite peticiones desde el frontend y localhost en desarrollo ─────
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url, "http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(playbooks.router, prefix="/api/playbooks", tags=["Playbooks"])
app.include_router(tickets.router,   prefix="/api/tickets",   tags=["Tickets / RIAs"])


# ── Endpoint raíz — health check ─────────────────────────────────────────────
@app.get("/", tags=["Health"])
def root():
    """Verifica que la API esté en línea."""
    return {"status": "ok", "servicio": "Banco Sol API"}


# ── Punto de entrada directo con uvicorn ─────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
