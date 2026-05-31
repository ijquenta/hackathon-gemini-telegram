"use client"

// ─── Importaciones ────────────────────────────────────────────────────────────
import { useState } from "react"
import {
  Search,
  BookOpen,
  QrCode,
  ShieldAlert,
  ArrowLeftRight,
  Settings2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Save,
  CheckCircle2,
  Loader2,
  Edit,
} from "lucide-react"
import { toast } from "sonner"

import { Badge }  from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input }  from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface Paso {
  numero: number
  descripcion: string
}

interface Playbook {
  id: number
  titulo: string
  categoria: string
  descripcion: string
  icono: React.ReactNode
  pasos: Paso[]
}

interface PasoGenerado {
  numero: number
  titulo: string
  detalle: string
}

// ─── Datos mock — 5 playbooks reales del banco ────────────────────────────────
const PLAYBOOKS_MOCK: Playbook[] = [
  {
    id: 1,
    titulo: "Resolución de Doble Débito por QR",
    categoria: "QR",
    descripcion: "Gestión de cobros duplicados originados por pagos mediante QR.",
    icono: <QrCode className="size-5 text-purple-400" />,
    pasos: [
      { numero: 1, descripcion: "Verificar el historial de transacciones del cliente en el sistema core." },
      { numero: 2, descripcion: "Identificar las dos transacciones duplicadas y registrar sus IDs únicos." },
      { numero: 3, descripcion: "Elevar solicitud de reversión al equipo de operaciones con los IDs adjuntos." },
    ],
  },
  {
    id: 2,
    titulo: "Restablecimiento de Contraseña Bloqueada",
    categoria: "Autenticación",
    descripcion: "Protocolo para desbloquear cuentas tras intentos fallidos de acceso.",
    icono: <ShieldAlert className="size-5 text-orange-400" />,
    pasos: [
      { numero: 1, descripcion: "Validar identidad del cliente mediante preguntas de seguridad o documento." },
      { numero: 2, descripcion: "Acceder al módulo de gestión de usuarios y localizar la cuenta bloqueada." },
      { numero: 3, descripcion: "Restablecer el estado del bloqueo y generar contraseña temporal de un solo uso." },
      { numero: 4, descripcion: "Comunicar la contraseña temporal al cliente por canal seguro (SMS/email registrado)." },
    ],
  },
  {
    id: 3,
    titulo: "Error de Autenticación en AppSol",
    categoria: "AppSol",
    descripcion: "Resolución de fallos de inicio de sesión en la aplicación móvil.",
    icono: <BookOpen className="size-5 text-blue-400" />,
    pasos: [
      { numero: 1, descripcion: "Confirmar versión de la app instalada por el cliente y solicitar actualización si es obsoleta." },
      { numero: 2, descripcion: "Verificar que las credenciales del cliente estén activas en el sistema de autenticación." },
      { numero: 3, descripcion: "Si el error persiste, forzar cierre de sesión remota y solicitar nuevo ingreso." },
    ],
  },
  {
    id: 4,
    titulo: "Transferencia Enviada No Recibida",
    categoria: "Transferencias",
    descripcion: "Seguimiento de transferencias que no acreditaron en cuenta destino.",
    icono: <ArrowLeftRight className="size-5 text-emerald-400" />,
    pasos: [
      { numero: 1, descripcion: "Confirmar con el cliente el número de referencia de la transferencia." },
      { numero: 2, descripcion: "Consultar el estado de la transacción en el sistema de mensajería interbancaria." },
      { numero: 3, descripcion: "Verificar que el CBU/número de cuenta destino ingresado sea correcto." },
      { numero: 4, descripcion: "Si la transacción figura como aprobada, contactar al banco receptor con la referencia." },
      { numero: 5, descripcion: "Documentar el caso y escalar a Operaciones si no se resuelve en 24 h." },
    ],
  },
  {
    id: 5,
    titulo: "Límite Diario de Transacciones Excedido",
    categoria: "Configuración",
    descripcion: "Ampliación temporal o permanente del límite operativo del cliente.",
    icono: <Settings2 className="size-5 text-yellow-400" />,
    pasos: [
      { numero: 1, descripcion: "Verificar el perfil de riesgo del cliente y el límite actual asignado." },
      { numero: 2, descripcion: "Registrar la solicitud de ampliación con justificación y elevar al área de Compliance." },
    ],
  },
]

// ─── Colores de badge por categoría ──────────────────────────────────────────
const BADGE_COLORS: Record<string, string> = {
  QR: "bg-purple-900/60 text-purple-300 border-purple-700/50",
  Autenticación: "bg-orange-900/60 text-orange-300 border-orange-700/50",
  AppSol: "bg-blue-900/60 text-blue-300 border-blue-700/50",
  Transferencias: "bg-emerald-900/60 text-emerald-300 border-emerald-700/50",
  Configuración: "bg-yellow-900/60 text-yellow-300 border-yellow-700/50",
}

// ─── Tipos extra para el Sheet lateral ──────────────────────────────────────
interface PasoDetallado {
  numero: number
  titulo: string
  descripcion: string
}

interface PlaybookDetalleSheet {
  descripcionLarga: string
  tiempoEstimado: string
  areaResponsable: string
  ultimaActualizacion: string
  pasosDetallados: PasoDetallado[]
}

// ─── Datos extra para el Sheet (sin tocar el mock principal) ──────────────────
const PLAYBOOK_SHEET_DATA: Record<number, PlaybookDetalleSheet> = {
  1: {
    descripcionLarga:
      "Un doble débito por QR ocurre cuando el procesador de pagos confirma la transacción dos veces por un timeout en la respuesta del banco. El cliente observa el mismo monto descontado en dos operaciones consecutivas.",
    tiempoEstimado: "10-15 min",
    areaResponsable: "Operaciones",
    ultimaActualizacion: "12/04/2026",
    pasosDetallados: [
      { numero: 1, titulo: "Verificar historial", descripcion: "Consultar el historial de transacciones del cliente en el sistema core para identificar los débitos duplicados." },
      { numero: 2, titulo: "Identificar duplicados", descripcion: "Registrar los IDs únicos de las dos transacciones repetidas y confirmar montos y timestamps." },
      { numero: 3, titulo: "Solicitar reversión", descripcion: "Elevar solicitud formal de reversión al equipo de Operaciones adjuntando los IDs de transacción." },
    ],
  },
  2: {
    descripcionLarga:
      "El sistema bloquea automáticamente la cuenta tras 3 intentos de contraseña incorrectos para proteger al cliente. El agente debe validar la identidad del titular antes de proceder al restablecimiento.",
    tiempoEstimado: "5-10 min",
    areaResponsable: "Soporte N1",
    ultimaActualizacion: "03/05/2026",
    pasosDetallados: [
      { numero: 1, titulo: "Validar identidad", descripcion: "Confirmar la identidad del cliente mediante preguntas de seguridad o presentación de documento." },
      { numero: 2, titulo: "Localizar cuenta", descripcion: "Acceder al módulo de gestión de usuarios y buscar la cuenta bloqueada por CI o número de cuenta." },
      { numero: 3, titulo: "Generar contraseña temporal", descripcion: "Restablecer el bloqueo y generar una contraseña temporal de un solo uso con validez de 24 h." },
      { numero: 4, titulo: "Notificar al cliente", descripcion: "Enviar la contraseña temporal al cliente por SMS o email registrado en el sistema." },
    ],
  },
  3: {
    descripcionLarga:
      "Los errores de autenticación en AppSol suelen deberse a versiones desactualizadas de la aplicación o a sesiones activas en múltiples dispositivos que causan conflictos en el token de sesión.",
    tiempoEstimado: "5-8 min",
    areaResponsable: "Soporte N2",
    ultimaActualizacion: "20/04/2026",
    pasosDetallados: [
      { numero: 1, titulo: "Verificar versión", descripcion: "Confirmar la versión de AppSol instalada y solicitar actualización si es inferior a la versión mínima requerida." },
      { numero: 2, titulo: "Comprobar credenciales", descripcion: "Verificar que las credenciales del cliente estén activas y no bloqueadas en el sistema de autenticación." },
      { numero: 3, titulo: "Forzar cierre de sesión", descripcion: "Ejecutar cierre de sesión remota desde el panel de administración y pedir al cliente que ingrese nuevamente." },
    ],
  },
  4: {
    descripcionLarga:
      "Las transferencias pueden quedar pendientes por rechazos del banco receptor, datos incorrectos de la cuenta destino o demoras en el sistema interbancario. El tiempo de acreditación puede ser de hasta 24 h hábiles.",
    tiempoEstimado: "15-20 min",
    areaResponsable: "Operaciones",
    ultimaActualizacion: "28/04/2026",
    pasosDetallados: [
      { numero: 1, titulo: "Obtener referencia", descripcion: "Solicitar al cliente el número de referencia o comprobante de la transferencia realizada." },
      { numero: 2, titulo: "Consultar estado", descripcion: "Verificar el estado de la transacción en el sistema de mensajería interbancaria usando la referencia." },
      { numero: 3, titulo: "Verificar cuenta destino", descripcion: "Confirmar que el CBU o número de cuenta destino ingresado por el cliente sea correcto." },
      { numero: 4, titulo: "Contactar banco receptor", descripcion: "Si la transacción figura como aprobada en el sistema, contactar al banco receptor con la referencia adjunta." },
      { numero: 5, titulo: "Escalar a Operaciones", descripcion: "Documentar el caso y escalar formalmente a Operaciones si no se resuelve en las próximas 24 h hábiles." },
    ],
  },
  5: {
    descripcionLarga:
      "Cada cliente tiene un límite diario de transacciones determinado por su perfil de riesgo asignado. La solicitud de ampliación requiere aprobación del área de Compliance dentro de las 24 h hábiles.",
    tiempoEstimado: "3-5 min",
    areaResponsable: "Compliance",
    ultimaActualizacion: "10/05/2026",
    pasosDetallados: [
      { numero: 1, titulo: "Revisar perfil de riesgo", descripcion: "Consultar el perfil de riesgo del cliente y el límite diario actual asignado en el sistema." },
      { numero: 2, titulo: "Registrar solicitud", descripcion: "Ingresar la solicitud de ampliación con justificación del cliente y elevar al área de Compliance para aprobación." },
    ],
  },
}

// ─── Pasos mock generados por IA ─────────────────────────────────────────────
const PASOS_IA_MOCK: PasoGenerado[] = [
  {
    numero: 1,
    titulo: "Diagnóstico inicial",
    detalle: "Identificar el error en el log del sistema y clasificar su severidad.",
  },
  {
    numero: 2,
    titulo: "Acción correctiva",
    detalle: "Aplicar el procedimiento de resolución documentado para este tipo de incidencia.",
  },
  {
    numero: 3,
    titulo: "Verificación y cierre",
    detalle: "Confirmar con el cliente que el problema fue resuelto y cerrar el ticket.",
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// Componente: PlaybooksView
// ═══════════════════════════════════════════════════════════════════════════════
export default function PlaybooksView() {
  // ── Estado: buscador ────────────────────────────────────────────────────────
  const [busqueda, setBusqueda] = useState<string>("")

  // ── Estado: qué cards tienen los pasos expandidos ──────────────────────────
  const [expandidos, setExpandidos] = useState<Set<number>>(new Set())

  // ── Estado: playbook seleccionado para el Sheet lateral ─────────────────────
  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | null>(null)

  // ── Estado: sección "Crear con IA" ─────────────────────────────────────────
  const [tituloIA, setTituloIA]             = useState<string>("")
  const [procedimiento, setProcedimiento]   = useState<string>("")
  const [generando, setGenerando]           = useState<boolean>(false)
  const [vistaPrevia, setVistaPrevia]       = useState<boolean>(false)

  // ── Filtrado en tiempo real ─────────────────────────────────────────────────
  const playbooksFiltrados = PLAYBOOKS_MOCK.filter((p) =>
    p.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.categoria.toLowerCase().includes(busqueda.toLowerCase())
  )

  // ── Alternar expansión de pasos de una card ─────────────────────────────────
  function toggleExpandido(id: number) {
    setExpandidos((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  // ── Simular generación con IA (spinner 2 segundos) ──────────────────────────
  function handleGenerarConIA() {
    setGenerando(true)
    setVistaPrevia(false)
    setTimeout(() => {
      setGenerando(false)
      setVistaPrevia(true)
    }, 2000)
  }

  // ── Guardar en base de conocimiento ─────────────────────────────────────────
  function handleGuardar() {
    toast.success("Manual guardado correctamente", {
      description: tituloIA || "Nuevo playbook añadido a la base de conocimiento.",
    })
    setTituloIA("")
    setProcedimiento("")
    setVistaPrevia(false)
  }

  // ───────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-6">

      {/* ═══════════════════════════════════════════════════════════════════════
          NAVEGACIÓN PRINCIPAL — Tabs de nivel superior
      ════════════════════════════════════════════════════════════════════════ */}
      <Tabs defaultValue="manuales" className="w-full">
        <TabsList className="bg-card border border-border h-10 p-1">
          <TabsTrigger
            value="manuales"
            className="data-active:bg-purple-900/60 data-active:text-purple-200 data-active:border-purple-700/50 data-active:shadow-none"
          >
            <BookOpen className="size-3.5" />
            Manuales de Soporte
            <span className="ml-1.5 inline-flex size-4 items-center justify-center rounded-full bg-purple-900/60 text-purple-300 text-[10px] font-bold border border-purple-700/50 group-data-active:bg-purple-700/60">
              {PLAYBOOKS_MOCK.length}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="ia"
            className="data-active:bg-orange-900/40 data-active:text-orange-200 data-active:border-orange-700/50 data-active:shadow-none"
          >
            <Sparkles className="size-3.5" />
            Generar Playbook con IA
            <span className="ml-1.5 inline-flex items-center rounded-full bg-orange-900/50 px-1.5 py-px text-[10px] font-medium text-orange-300 border border-orange-700/50">
              Beta
            </span>
          </TabsTrigger>
        </TabsList>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECCIÓN 1 — Lista de manuales existentes
      ════════════════════════════════════════════════════════════════════════ */}
        <TabsContent value="manuales">
        <section className="flex flex-col gap-6">

        {/* Encabezado de sección */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-foreground">
              Manuales de Soporte
            </h2>
            <span className="inline-flex items-center rounded-full bg-purple-900/60 px-2.5 py-0.5 text-xs font-medium text-purple-300 border border-purple-700/50">
              {PLAYBOOKS_MOCK.length} manuales
            </span>
          </div>

          {/* SearchBar */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
            <Input
              type="search"
              placeholder="Buscar playbooks, códigos de error..."
              className="pl-9 h-9 bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:border-purple-600 focus-visible:ring-purple-600/20"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        {/* Grid de cards */}
        {playbooksFiltrados.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-10">
            No se encontraron manuales para "{busqueda}".
          </p>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {playbooksFiltrados.map((playbook) => {
              const abierto = expandidos.has(playbook.id)
              return (
                <div
                  key={playbook.id}
                  className="flex flex-col rounded-2xl border border-border bg-card shadow-xl shadow-purple-900/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-purple-700/20 overflow-hidden"
                >
                  {/* Cabecera de la card */}
                  <div className="flex items-start justify-between p-5 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted border border-border">
                        {playbook.icono}
                      </div>
                      <div className="flex flex-col gap-1">
                        <span
                          className={`inline-flex items-center self-start rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide border ${BADGE_COLORS[playbook.categoria] ?? "bg-zinc-800 text-zinc-400 border-zinc-700"}`}
                        >
                          {playbook.categoria}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Título y descripción */}
                  <div className="px-5 pb-2 flex flex-col gap-1">
                    <h3 className="text-sm font-semibold text-foreground leading-snug">
                      {playbook.titulo}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {playbook.descripcion}
                    </p>
                  </div>

                  {/* Botón expandir/colapsar */}
                  <div className="px-5 pb-4 pt-2 flex flex-col gap-3">
                    <button
                      onClick={() => toggleExpandido(playbook.id)}
                      className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors w-fit"
                    >
                      {abierto ? (
                        <>
                          <ChevronUp className="size-3.5" />
                          Ocultar pasos
                        </>
                      ) : (
                        <>
                          <ChevronDown className="size-3.5" />
                          Ver pasos ({playbook.pasos.length})
                        </>
                      )}
                    </button>

                    {/* Pasos colapsables — transición CSS pura */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        abierto ? "max-h-125 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <ol className="flex flex-col gap-2 pt-1">
                        {playbook.pasos.map((paso) => (
                          <li
                            key={paso.numero}
                            className="flex items-start gap-2.5 text-xs text-foreground/80"
                          >
                            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-purple-900/60 text-purple-300 font-bold text-[10px] border border-purple-800/50 mt-px">
                              {paso.numero}
                            </span>
                            <span className="leading-relaxed">{paso.descripcion}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Botón Ver detalle — abre el Sheet lateral */}
                    <button
                      onClick={() => setSelectedPlaybook(playbook)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors w-full mt-1 border-t border-border pt-3"
                    >
                      Ver detalle →
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        </section>
        </TabsContent>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECCIÓN 2 — Crear nuevo manual con IA
      ════════════════════════════════════════════════════════════════════════ */}
        <TabsContent value="ia">
        <section className="flex flex-col gap-6">

        {/* Encabezado de sección */}
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-xl bg-linear-to-br from-orange-600 to-orange-400">
            <Sparkles className="size-4 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">
            Generar Playbook con IA
          </h2>
          <span className="inline-flex items-center rounded-full bg-orange-900/50 px-2.5 py-0.5 text-xs font-medium text-orange-300 border border-orange-700/50">
            Beta
          </span>
        </div>

        {/* Formulario de generación */}
        <div className="rounded-2xl border border-border bg-card shadow-xl shadow-purple-900/10 p-6 flex flex-col gap-5">

          {/* Input: título del manual */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Título del nuevo manual
            </label>
            <Input
              type="text"
              placeholder="Ej: Pasos para desbloqueo de cuenta PyME..."
              className="h-10 bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:border-orange-500 focus-visible:ring-orange-500/20"
              value={tituloIA}
              onChange={(e) => setTituloIA(e.target.value)}
            />
          </div>

          {/* Textarea: procedimiento en bruto */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Procedimiento en bruto
            </label>
            <textarea
              rows={5}
              placeholder="Pega aquí la solución técnica que encontraste. Ej: El error 500 en el QR ocurre cuando el servicio de pagos está caído. La solución es reiniciar el proceso XYZ..."
              className="min-h-30 w-full resize-y rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus-visible:border-orange-500 focus-visible:ring-2 focus-visible:ring-orange-500/20"
              value={procedimiento}
              onChange={(e) => setProcedimiento(e.target.value)}
            />
          </div>

          {/* Botones de acción */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Botón principal naranja — Estructurar con IA */}
            <button
              onClick={handleGenerarConIA}
              disabled={generando || !procedimiento.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-orange-600 to-orange-400 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-900/30 transition-all duration-200 hover:from-orange-500 hover:to-orange-300 hover:shadow-orange-700/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generando ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Sparkles className="size-4" />
              )}
              {generando ? "Estructurando..." : "Estructurar con IA"}
            </button>

            {/* Botón secundario — Guardar (solo visible cuando hay vista previa) */}
            {vistaPrevia && (
              <button
                onClick={handleGuardar}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-muted px-4 py-2 text-sm font-medium text-foreground transition-all duration-200 hover:bg-muted/80 hover:border-border"
              >
                <Save className="size-4" />
                Guardar en Base de Conocimiento
              </button>
            )}
          </div>
        </div>

        {/* Vista previa del playbook generado */}
        {vistaPrevia && (
          <div className="rounded-2xl border border-purple-800/50 bg-card shadow-xl shadow-purple-900/20 p-6 flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-purple-400" />
              <h3 className="text-base font-semibold text-foreground">
                Vista Previa del Playbook Generado
              </h3>
            </div>

            {tituloIA && (
              <p className="text-sm font-medium text-purple-300">
                {tituloIA}
              </p>
            )}

            {/* Pasos generados por IA */}
            <ol className="flex flex-col gap-4">
              {PASOS_IA_MOCK.map((paso) => (
                <li key={paso.numero} className="flex items-start gap-4">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-purple-900/60 border border-purple-700/50 mt-0.5">
                    <CheckCircle2 className="size-3.5 text-purple-400" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold text-foreground">
                      Paso {paso.numero}: {paso.titulo}
                    </span>
                    <span className="text-xs text-muted-foreground leading-relaxed">
                      {paso.detalle}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
        </section>
        </TabsContent>
      </Tabs>

      {/* ═══════════════════════════════════════════════════════════════════════
          MODAL CENTRADO — Detalle completo del manual con Tabs
      ════════════════════════════════════════════════════════════════════════ */}
      <DialogPrimitive.Root
        open={selectedPlaybook !== null}
        onOpenChange={(open: boolean) => { if (!open) setSelectedPlaybook(null) }}
      >
        <DialogPrimitive.Portal>
          {/* Backdrop oscuro con blur */}
          <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity duration-200 data-starting-style:opacity-0 data-ending-style:opacity-0" />

          {/* Popup centrado */}
          <DialogPrimitive.Popup className="fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-2xl max-h-[88vh] -translate-x-1/2 -translate-y-1/2 flex flex-col rounded-2xl border border-border bg-card shadow-2xl shadow-purple-900/30 overflow-hidden transition-all duration-200 data-starting-style:opacity-0 data-starting-style:scale-95 data-ending-style:opacity-0 data-ending-style:scale-95">
            {selectedPlaybook && (() => {
              const detalle = PLAYBOOK_SHEET_DATA[selectedPlaybook.id]
              return (
                <>
                  {/* ── Header: icono + título + badge + botón X ── */}
                  <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4">
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted border border-border">
                        {selectedPlaybook.icono}
                      </div>
                      <div className="flex flex-col gap-2">
                        <DialogPrimitive.Title className="text-foreground text-base font-semibold leading-snug">
                          {selectedPlaybook.titulo}
                        </DialogPrimitive.Title>
                        <span
                          className={`inline-flex items-center self-start rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide border ${BADGE_COLORS[selectedPlaybook.categoria] ?? "bg-zinc-800 text-zinc-400 border-zinc-700"}`}
                        >
                          {selectedPlaybook.categoria}
                        </span>
                      </div>
                    </div>
                    {/* Botón X para cerrar */}
                    <DialogPrimitive.Close
                      onClick={() => setSelectedPlaybook(null)}
                      className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors text-lg leading-none"
                    >
                      ×
                    </DialogPrimitive.Close>
                  </div>

                  <Separator className="bg-zinc-800" />

                  {/* ── Tabs con dos secciones ── */}
                  <div className="flex-1 overflow-y-auto px-6 py-5">
                    <Tabs defaultValue="descripcion">
                      <TabsList className="mb-5 bg-muted border border-border">
                        <TabsTrigger value="descripcion">Descripción</TabsTrigger>
                        <TabsTrigger value="pasos">
                          Pasos de resolución
                          <span className="ml-1.5 inline-flex size-4 items-center justify-center rounded-full bg-purple-900/60 text-purple-300 text-[10px] font-bold border border-purple-700/50">
                            {detalle.pasosDetallados.length}
                          </span>
                        </TabsTrigger>
                      </TabsList>

                      {/* Tab 1 — Descripción del problema + info adicional */}
                      <TabsContent value="descripcion" className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Descripción del problema
                          </h4>
                          <p className="text-sm text-foreground/80 leading-relaxed">
                            {detalle.descripcionLarga}
                          </p>
                        </div>

                        <Separator className="bg-zinc-800" />

                        {/* Cards de información adicional */}
                        <div className="flex flex-col gap-3">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Información adicional
                          </h4>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="rounded-xl border border-border bg-muted/60 p-3 flex flex-col gap-1">
                              <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Tiempo estimado</span>
                              <span className="text-sm font-semibold text-foreground">{detalle.tiempoEstimado}</span>
                            </div>
                            <div className="rounded-xl border border-border bg-muted/60 p-3 flex flex-col gap-1">
                              <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Área responsable</span>
                              <span className="text-sm font-semibold text-foreground">{detalle.areaResponsable}</span>
                            </div>
                            <div className="rounded-xl border border-border bg-muted/60 p-3 flex flex-col gap-1">
                              <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Última actualización</span>
                              <span className="text-sm font-semibold text-foreground">{detalle.ultimaActualizacion}</span>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Tab 2 — Pasos de resolución numerados */}
                      <TabsContent value="pasos">
                        <ol className="flex flex-col gap-4">
                          {detalle.pasosDetallados.map((paso) => (
                            <li key={paso.numero} className="flex items-start gap-3">
                              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-purple-800 text-white text-sm font-bold mt-0.5">
                                {paso.numero}
                              </span>
                              <div className="flex flex-col gap-0.5">
                                <span className="text-sm font-semibold text-foreground">{paso.titulo}</span>
                                <span className="text-xs text-muted-foreground leading-relaxed">{paso.descripcion}</span>
                              </div>
                            </li>
                          ))}
                        </ol>
                      </TabsContent>
                    </Tabs>
                  </div>

                  {/* ── Footer: Cerrar + Editar Manual ── */}
                  <div className="flex items-center gap-3 px-6 py-4 border-t border-border">
                    <DialogPrimitive.Close
                      onClick={() => setSelectedPlaybook(null)}
                      className="inline-flex items-center gap-2 rounded-xl border border-border bg-transparent px-4 py-2 text-sm font-medium text-foreground/80 hover:bg-muted transition-colors"
                    >
                      Cerrar
                    </DialogPrimitive.Close>
                    <button
                      className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-orange-600 to-orange-400 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-900/30 transition-all duration-200 hover:from-orange-500 hover:to-orange-300"
                    >
                      <Edit className="size-4" />
                      Editar Manual
                    </button>
                  </div>
                </>
              )
            })()}
          </DialogPrimitive.Popup>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </div>
  )
}
