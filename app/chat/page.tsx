"use client"

import * as React from "react"
import { useState, useEffect, useRef, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { scripts } from "@/lib/chatScripts"
import type { Script } from "@/lib/chatScripts"
import { useStore } from "@/lib/store"
import type { Ticket, TimelineEvent } from "@/lib/tickets"
import { SendIcon, BotIcon, ArrowLeftIcon, CheckCircle2Icon } from "lucide-react"
import { SolAvatar } from "@/components/ui/SolAvatar"
import Link from "next/link"

// ─── Types ───────────────────────────────────────────────────────────────────
interface Mensaje {
  rol: "agente" | "usuario"
  texto: string
  hora: string
}

function horaActual(): string {
  return new Date().toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" })
}

// ─── Typing Indicator ────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-3">
      <div className="size-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
        <BotIcon className="size-4 text-white" />
      </div>
      <div className="bg-neutral-800 rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex gap-1.5 items-center h-4">
          <span
            className="size-2 rounded-full bg-neutral-400 animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="size-2 rounded-full bg-neutral-400 animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="size-2 rounded-full bg-neutral-400 animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  )
}

// ─── Escalation Card ─────────────────────────────────────────────────────────
function EscalationCard({ onTicket }: { onTicket: () => void }) {
  return (
    <div
      style={{
        backgroundColor: "#7F1D1D",
        border: "1px solid #EF4444",
        borderRadius: 12,
        padding: 16,
        maxWidth: "85%",
      }}
      className="mb-3"
    >
      <p className="text-red-300 font-semibold text-sm mb-1">
        ⚠️ Conectando con un agente humano
      </p>
      <p className="text-red-100 text-sm mb-2">
        Entiendo tu urgencia. Transfiriendo tu caso a un especialista ahora mismo.
      </p>
      <p className="text-red-200 text-xs mb-3">
        Tiempo estimado de espera: 3 a 5 minutos
      </p>
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => window.open("https://wa.me/59170000000", "_blank", "noopener,noreferrer")}
          className="bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
        >
          Continuar por WhatsApp
        </button>
        <button
          onClick={onTicket}
          className="bg-red-700 hover:bg-red-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
        >
          Generar ticket
        </button>
      </div>
    </div>
  )
}

// ─── Stepper ─────────────────────────────────────────────────────────────────
const PASOS_LABELS = ["Inicio", "Recopilando info", "Resuelto"]

function StepperBar({ paso }: { paso: number }) {
  return (
    <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-800 bg-neutral-900/50">
      {PASOS_LABELS.map((label, i) => (
        <React.Fragment key={i}>
          <div className="flex items-center gap-1.5 shrink-0">
            <div
              className={`size-5 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                i < paso
                  ? "bg-blue-500 text-white"
                  : i === paso
                  ? "bg-blue-600 text-white ring-2 ring-blue-400 ring-offset-1 ring-offset-neutral-950"
                  : "bg-neutral-700 text-neutral-400"
              }`}
            >
              {i < paso ? "✓" : i + 1}
            </div>
            <span
              className={`text-xs font-medium transition-colors duration-300 hidden sm:block ${
                i <= paso ? "text-white" : "text-neutral-500"
              }`}
            >
              {label}
            </span>
          </div>
          {i < PASOS_LABELS.length - 1 && (
            <div
              className={`flex-1 h-px transition-all duration-500 ${
                i < paso ? "bg-blue-500" : "bg-neutral-700"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

// ─── Chat Content (needs useSearchParams → wrapped in Suspense) ───────────────
function ChatContent() {
  const searchParams = useSearchParams()
  const tipo = parseInt(searchParams.get("tipo") ?? "11", 10)

  const [mensajes, setMensajes] = useState<Mensaje[]>([])
  const [turnoActual, setTurnoActual] = useState(0)
  const [scriptActivo, setScriptActivo] = useState<Script | null>(null)
  const [escalado, setEscalado] = useState(false)
  const [paso, setPaso] = useState(0)
  const [estaEscribiendo, setEstaEscribiendo] = useState(false)
  const [inputText, setInputText] = useState("")
  const [inputBloqueado, setInputBloqueado] = useState(false)
  const [mostrarEscalado, setMostrarEscalado] = useState(false)
  const [ticketGenerado, setTicketGenerado] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const { agregarTicket } = useStore()

  // Ref para turnoActual (evita closures rancios en setTimeouts)
  const turnoRef = useRef(0)
  const scriptRef = useRef<Script | null>(null)
  const escaladoRef = useRef(false)

  const agregarMensaje = (msg: Mensaje) => {
    setMensajes(prev => [...prev, msg])
  }

  const escalar = () => {
    escaladoRef.current = true
    setEscalado(true)
    setMostrarEscalado(true)
    setInputBloqueado(true)
  }

  // Montar: cargar script y mostrar primer turno
  useEffect(() => {
    const tipoValido = isNaN(tipo) ? 11 : tipo
    const script = scripts.find(s => s.idIncidencia === tipoValido) ?? null
    scriptRef.current = script
    setScriptActivo(script)

    if (script) {
      setPaso(1)
      setEstaEscribiendo(true)
      const timer = setTimeout(() => {
        setEstaEscribiendo(false)
        agregarMensaje({
          rol: "agente",
          texto: script.turnos[0].texto,
          hora: horaActual(),
        })
        turnoRef.current = 1
        setTurnoActual(1)
      }, 600)
      return () => clearTimeout(timer)
    } else {
      agregarMensaje({
        rol: "agente",
        texto: "Hola, soy Sol AI ☀️. ¿En qué puedo ayudarte hoy con tu cuenta BancoSol?",
        hora: horaActual(),
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Auto-scroll al último mensaje
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [mensajes, estaEscribiendo, mostrarEscalado])

  const manejarEnvio = () => {
    const textoUsuario = inputText.trim()
    if (!textoUsuario || inputBloqueado || estaEscribiendo) return

    setInputText("")

    // 1. Agregar mensaje del usuario
    agregarMensaje({ rol: "usuario", texto: textoUsuario, hora: horaActual() })

    // 2. Detectar palabras clave de escalado urgente
    const palabrasEscalado = [
      "urgente", "fraude", "robo", "me robaron", "estafaron",
      "desesperado", "auxilio", "ayuda urgente", "no puedo más",
    ]
    const requiereEscalado = palabrasEscalado.some(p =>
      textoUsuario.toLowerCase().includes(p)
    )
    if (requiereEscalado && !escaladoRef.current) {
      setEstaEscribiendo(true)
      setTimeout(() => {
        setEstaEscribiendo(false)
        escalar()
      }, 800)
      return
    }

    // 3. Avanzar al siguiente turno del script
    const turnoIndex = turnoRef.current
    const script = scriptRef.current

    if (script && turnoIndex < script.turnos.length) {
      setEstaEscribiendo(true)
      setTimeout(() => {
        setEstaEscribiendo(false)
        const siguienteTurno = script.turnos[turnoIndex]
        agregarMensaje({
          rol: "agente",
          texto: siguienteTurno.texto,
          hora: horaActual(),
        })
        turnoRef.current = turnoIndex + 1
        setTurnoActual(prev => prev + 1)

        if (siguienteTurno.esResolucion) {
          setPaso(2)
          setInputBloqueado(true)
          generarTicket(scriptRef.current, false)
        }
        if (siguienteTurno.esEscalado) {
          escalar()
          generarTicket(scriptRef.current, true)
        }
      }, 800)
    } else if (script && turnoIndex >= script.turnos.length) {
      // Script terminado: mensaje de cierre genérico
      setEstaEscribiendo(true)
      setTimeout(() => {
        setEstaEscribiendo(false)
        agregarMensaje({
          rol: "agente",
          texto: "¿Hay algo más en lo que pueda ayudarte? Estoy aquí para lo que necesites.",
          hora: horaActual(),
        })
      }, 800)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      manejarEnvio()
    }
  }

  const generarTicket = (script?: Script | null, esEscalado = false) => {
    const num = Math.floor(Math.random() * 9000 + 1000)
    const codigo = `#BS-2024-${num}`
    const hora = horaActual()

    const tipoIncidencia = scripts.find(s => s.idIncidencia === (script?.idIncidencia ?? 11))
    const ultimoTexto = script?.turnos[script.turnos.length - 1]?.texto ?? "Caso gestionado por Sol AI."

    const timeline: TimelineEvent[] = [
      { id: "e1", tipo: "creado", descripcion: "Ticket creado desde Sol AI", hora, completado: true },
      { id: "e2", tipo: "verificado", descripcion: "Identidad verificada", hora, completado: true },
      { id: "e3", tipo: "en_revision", descripcion: "Caso enviado a revisión", hora, completado: true },
      { id: "e4", tipo: "resuelto", descripcion: "Resolución pendiente", hora: "Pendiente", completado: false },
    ]

    const nuevoTicket: Ticket = {
      id: crypto.randomUUID(),
      codigoTicket: codigo,
      idIncidencia: script?.idIncidencia ?? 11,
      nombreIncidencia: `Incidencia tipo ${script?.idIncidencia ?? 11}`,
      estado: esEscalado ? "escalado" : "en_revision",
      prioridad: esEscalado ? "alta" : "media",
      plataforma: "Appsol",
      canalReporte: "App móvil · Sol AI",
      fechaApertura: new Date().toLocaleString("es-BO"),
      ultimaActualizacion: new Date().toLocaleString("es-BO"),
      resumenSolAI: ultimoTexto,
      timeline,
    }

    agregarTicket(nuevoTicket)
    setTicketGenerado(codigo)

    agregarMensaje({
      rol: "agente",
      texto: `✅ Ticket ${codigo} generado. Puedes seguir su estado en Mis tickets.`,
      hora: horaActual(),
    })
  }

  return (
    <div className="flex flex-col h-screen bg-neutral-950 text-white">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-800 bg-neutral-900 shrink-0">
        <Link
          href="/dashboard"
          className="text-neutral-400 hover:text-white transition-colors mr-1"
          aria-label="Volver al dashboard"
        >
          <ArrowLeftIcon className="size-4" />
        </Link>
        <div className="size-9 rounded-full bg-blue-600 flex items-center justify-center shrink-0 overflow-hidden">
          <SolAvatar size={36} />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm leading-none">Sol AI ☀️</p>
          <p className="text-xs text-neutral-400 mt-0.5">Agente virtual · BancoSol</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-neutral-400">En línea</span>
        </div>
      </div>

      {/* ── Stepper ────────────────────────────────────────────────────── */}
      <StepperBar paso={paso} />

      {/* ── Messages ───────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {mensajes.map((msg, i) => (
          <div
            key={i}
            className={`flex mb-3 ${
              msg.rol === "usuario" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.rol === "agente" && (
              <div className="size-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mr-2 self-end mb-1 overflow-hidden">
                <SolAvatar size={32} />
              </div>
            )}
            <div
              className={`max-w-[78%] px-4 py-2.5 text-sm leading-relaxed ${
                msg.rol === "usuario"
                  ? "bg-blue-600 text-white rounded-2xl rounded-br-sm"
                  : "bg-neutral-800 text-neutral-100 rounded-2xl rounded-bl-sm"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.texto}</p>
              <p
                className={`text-xs mt-1 ${
                  msg.rol === "usuario"
                    ? "text-blue-200 text-right"
                    : "text-neutral-500"
                }`}
              >
                {msg.hora}
              </p>
            </div>
          </div>
        ))}

        {estaEscribiendo && <TypingIndicator />}

        {mostrarEscalado && (
          <div className="flex justify-start mb-2 ml-10">
            <EscalationCard onTicket={() => generarTicket(scriptRef.current, true)} />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input ──────────────────────────────────────────────────────── */}
      <div className="px-4 py-3 border-t border-neutral-800 bg-neutral-900 shrink-0">
        {inputBloqueado && escalado ? (
          <div className="text-center text-red-400 text-sm py-2 flex items-center justify-center gap-2">
            <span>⚠️</span>
            <span>Transferido a agente humano · conversación cerrada</span>
          </div>
        ) : inputBloqueado ? (
          <div className="flex flex-col items-center gap-2 py-2">
            <div className="text-center text-green-400 text-sm flex items-center justify-center gap-2">
              <CheckCircle2Icon className="size-4" />
              <span>Caso resuelto · conversación finalizada</span>
            </div>
            {ticketGenerado && (
              <Link
                href="/dashboard"
                className="text-xs text-violet-400 hover:text-violet-300 underline underline-offset-2"
              >
                Ver ticket {ticketGenerado} en Mis tickets →
              </Link>
            )}
          </div>
        ) : (
          <div className="flex items-end gap-2">
            <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu mensaje… (Enter para enviar)"
              rows={1}
              className="flex-1 resize-none bg-neutral-800 text-white placeholder-neutral-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-10.5 max-h-32"
            />
            <button
              onClick={manejarEnvio}
              disabled={!inputText.trim() || estaEscribiendo}
              className="size-10.5 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-700 disabled:text-neutral-500 text-white rounded-xl flex items-center justify-center transition-colors shrink-0"
              aria-label="Enviar mensaje"
            >
              <SendIcon className="size-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen bg-neutral-950 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-neutral-400">
            <div className="size-10 rounded-full bg-blue-600 flex items-center justify-center">
              <BotIcon className="size-5 text-white" />
            </div>
            <p className="text-sm">Iniciando Sol AI…</p>
          </div>
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  )
}
