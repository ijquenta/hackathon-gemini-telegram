"use client"

import * as React from "react"
import { Badge } from "@/components/reui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LayoutGrid, Table as TableIcon, CircleIcon, CircleDot, CircleCheckIcon, MessageSquareIcon } from "lucide-react"
import Link from "next/link"
import {
  Frame,
  FrameHeader,
  FramePanel,
  FrameTitle as FrameTitleReui,
} from "@/components/reui/frame"
import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnContent,
  KanbanItem,
  KanbanItemHandle,
  KanbanOverlay,
} from "@/components/reui/kanban"

type ColumnKey = "Pendiente" | "En Proceso" | "Resuelto"

interface Ticket {
  id: string
  titulo: string
  nombre: string
  resumen_ia: string
  prioridad: "Alta" | "Media" | "Baja"
  estado: "Pendiente" | "En Proceso" | "Resuelto"
  sentimiento: "Enojado" | "Muy Enojado" | "Preocupado" | "Ansioso" | "Calmo"
  tiempo_asfi: string | null
  chatTipo: number
}

const kanbanColumns: Record<ColumnKey, Ticket[]> = {
  Pendiente: [
    {
      id: "TK-8902",
      titulo: "Falla de Débito QR",
      nombre: "María González",
      resumen_ia:
        "Cliente intentó pagar 200 Bs, error 500. Core descontó saldo pero transacción falló. Requiere reversión manual urgente.",
      prioridad: "Alta",
      estado: "Pendiente",
      sentimiento: "Enojado",
      tiempo_asfi: "00:15:22",
      chatTipo: 1,
    },
    {
      id: "TK-8890",
      titulo: "Bloqueo de App",
      nombre: "Carlos Rodríguez",
      resumen_ia:
        "Usuario bloqueó credenciales tras 3 intentos fallidos. Solicita reseteo rápido para poder verificar un depósito recibido.",
      prioridad: "Media",
      estado: "Pendiente",
      sentimiento: "Preocupado",
      tiempo_asfi: "04:30:00",
      chatTipo: 6,
    },
  ],
  "En Proceso": [
    {
      id: "TK-8905",
      titulo: "Transferencia No Reflejada",
      nombre: "Roberto Mamani",
      resumen_ia:
        "Transferencia interbancaria (ACH) de 1500 Bs enviada al BNB no aparece en cuenta destino. Dinero debitado hace 24 hrs. Requiere trazabilidad.",
      prioridad: "Alta",
      estado: "En Proceso",
      sentimiento: "Muy Enojado",
      tiempo_asfi: "01:10:00",
      chatTipo: 4,
    },
    {
      id: "TK-8901",
      titulo: "Crash en Pago de Servicios",
      nombre: "Lucía Quispe",
      resumen_ia:
        "Al intentar pagar factura de luz (DELAPAZ), la app se cierra inesperadamente. Cliente necesita pagar hoy para evitar corte de servicio.",
      prioridad: "Media",
      estado: "En Proceso",
      sentimiento: "Ansioso",
      tiempo_asfi: "02:45:00",
      chatTipo: 8,
    },
  ],
  Resuelto: [
    {
      id: "TK-8895",
      titulo: "Consulta de Límite",
      nombre: "Ana Martínez",
      resumen_ia:
        "Límites diarios actualizados vía portal web de autogestión. Confirmación enviada por SMS. No requiere acción humana.",
      prioridad: "Baja",
      estado: "Resuelto",
      sentimiento: "Calmo",
      tiempo_asfi: null,
      chatTipo: 11,
    },
    {
      id: "TK-8899",
      titulo: "Gestión de Cuenta",
      nombre: "Luis Fernández",
      resumen_ia:
        "Dirección postal modificada exitosamente en sistema Core tras validación biométrica en el bot de WhatsApp.",
      prioridad: "Baja",
      estado: "Resuelto",
      sentimiento: "Calmo",
      tiempo_asfi: null,
      chatTipo: 11,
    },
  ],
}

const columnKeys: ColumnKey[] = ["Pendiente", "En Proceso", "Resuelto"]

const boardLabels: Record<ColumnKey, { icon: React.ReactNode }> = {
  Pendiente: { icon: <CircleIcon className="size-4" /> },
  "En Proceso": { icon: <CircleDot className="size-4" /> },
  Resuelto: { icon: <CircleCheckIcon className="size-4" /> },
}

function priorityVariant(prioridad: Ticket["prioridad"]) {
  if (prioridad === "Alta") return "destructive"
  if (prioridad === "Media") return "warning"
  return "secondary"
}

function TaskCard({
  task,
  asHandle,
}: {
  task: Ticket
  asHandle?: boolean
}) {
  const content = (
    <Frame variant="ghost" spacing="sm" className="p-0">
      <FramePanel className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{task.id}</p>
            <p className="mt-1 text-base font-semibold leading-snug">{task.titulo}</p>
            <p className="text-sm text-muted-foreground">{task.nombre}</p>
          </div>
          <Badge variant={priorityVariant(task.prioridad)} size="sm" className="shrink-0">
            {task.prioridad}
          </Badge>
        </div>

        <div className="mt-3 rounded-2xl border border-border/50 bg-muted/80 p-3 text-sm text-muted-foreground">
          <p className="font-medium text-muted-foreground">Resumen IA</p>
          <p className="mt-2 leading-6">{task.resumen_ia}</p>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-full border border-border/50 bg-background px-2 py-1">{task.estado}</span>
          <span className="rounded-full border border-border/50 bg-background px-2 py-1">{task.sentimiento}</span>
          <span className="rounded-full border border-border/50 bg-background px-2 py-1">
            {task.tiempo_asfi ?? "Sin tiempo"}
          </span>
        </div>
        <div className="mt-3">
          <Link
            href={`/chat?tipo=${task.chatTipo}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            <MessageSquareIcon className="size-3.5" />
            Chatear con Sol AI
          </Link>
        </div>
      </FramePanel>
    </Frame>
  )

  return (
    <KanbanItem value={task.id}>
      {asHandle ? (
        <KanbanItemHandle className="transition-transform duration-200 ease-out will-change-transform data-[dragging=true]:-rotate-1 data-[dragging=true]:scale-105 data-[dragging=true]:skew-y-1">
          {content}
        </KanbanItemHandle>
      ) : (
        content
      )}
    </KanbanItem>
  )
}

function renderBoard(
  title: string,
  columns: Record<ColumnKey, Ticket[]>,
  keys: ColumnKey[],
  setColumns: React.Dispatch<React.SetStateAction<Record<ColumnKey, Ticket[]>>>
) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 rounded-xl border border-border/10 bg-muted/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">Arrastra las tarjetas entre columnas para reorganizar.</p>
        </div>
        <Badge variant="outline">{keys.reduce((sum, key) => sum + (columns[key]?.length ?? 0), 0)} tickets</Badge>
      </div>
      <Kanban value={columns} onValueChange={setColumns} getItemValue={(item) => item.id}>
        <KanbanBoard className="grid auto-rows-fr gap-4 xl:grid-cols-3">
          {keys.map((columnKey) => (
            <KanbanColumn key={columnKey} value={columnKey}>
              <Frame spacing="sm" className="h-full">
                <FrameHeader className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-2">
                    {boardLabels[columnKey].icon}
                    <FrameTitleReui>{columnKey}</FrameTitleReui>
                  </div>
                  <Badge variant="outline" size="sm">{columns[columnKey]?.length ?? 0}</Badge>
                </FrameHeader>
                <KanbanColumnContent value={columnKey} className="flex flex-col gap-3 p-3">
                  {columns[columnKey].map((task) => (
                    <TaskCard key={task.id} task={task} asHandle />
                  ))}
                </KanbanColumnContent>
              </Frame>
            </KanbanColumn>
          ))}
        </KanbanBoard>
        <KanbanOverlay className="rounded-xl border border-dashed border-border/30 bg-background/95 p-3 shadow-lg transition-transform duration-200 ease-out scale-105 -rotate-1 skew-y-1" />
      </Kanban>
    </div>
  )
}

export default function TicketsBoardClient() {
  const [columns, setColumns] = React.useState(kanbanColumns)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const allTickets = React.useMemo(
    () => columnKeys.flatMap((key) => columns[key]),
    [columns]
  )

  return (
    <div className="space-y-6 px-4 py-8 lg:px-6">
      <Card className="border border-border/20 bg-background/80">
        <Tabs defaultValue="board" className="space-y-6">
          <CardHeader className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-3">
              <CardTitle className="text-3xl font-semibold">Clasificación de Tickets</CardTitle>
              <CardDescription className="max-w-2xl text-sm text-muted-foreground">
                Usa los ejemplos con campos de IA, prioridad, estado y sentimiento dentro de tu tablero.
              </CardDescription>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <TabsList className="inline-flex rounded-xl bg-muted p-[3px]">
                <TabsTrigger value="tabla" className="gap-2">
                  <TableIcon className="size-4 text-muted-foreground" />
                  Tabla
                </TabsTrigger>
                <TabsTrigger value="board" className="gap-2">
                  <LayoutGrid className="size-4 text-muted-foreground" />
                  Board
                </TabsTrigger>
              </TabsList>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <TabsContent value="tabla">
              <Card className="border border-border/10 bg-background/85 p-0">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Título</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Prioridad</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Sentimiento</TableHead>
                        <TableHead>Tiempo ASFI</TableHead>
                        <TableHead>Sol AI</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allTickets.map((ticket) => (
                        <TableRow key={ticket.id}>
                          <TableCell>{ticket.id}</TableCell>
                          <TableCell>{ticket.titulo}</TableCell>
                          <TableCell>{ticket.nombre}</TableCell>
                          <TableCell>
                            <Badge variant={priorityVariant(ticket.prioridad)}>
                              {ticket.prioridad}
                            </Badge>
                          </TableCell>
                          <TableCell>{ticket.estado}</TableCell>
                          <TableCell>{ticket.sentimiento}</TableCell>
                          <TableCell>{ticket.tiempo_asfi ?? "-"}</TableCell>
                          <TableCell>
                            <Link
                              href={`/chat?tipo=${ticket.chatTipo}`}
                              className="inline-flex items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              <MessageSquareIcon className="size-3.5" />
                              Chatear
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="board">
              <div className="space-y-6">
                {mounted ? (
                  renderBoard("Tickets operativos", columns, columnKeys, setColumns)
                ) : (
                  <div className="min-h-[420px] rounded-3xl border border-border/10 bg-muted/10 p-8 text-muted-foreground">
                    <p className="text-base font-semibold">Cargando tablero interactivo…</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Espera mientras se inicializa la vista de arrastre.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  )
}
