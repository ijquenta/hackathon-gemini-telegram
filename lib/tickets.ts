export interface TimelineEvent {
  id: string
  tipo: "creado" | "verificado" | "en_revision" | "informacion_solicitada" | "escalado" | "resuelto"
  descripcion: string
  hora: string
  completado: boolean
}

export interface Ticket {
  id: string
  codigoTicket: string
  idIncidencia: number
  nombreIncidencia: string
  estado: "abierto" | "en_revision" | "resuelto" | "escalado"
  prioridad: "alta" | "media" | "baja"
  plataforma: "Appsol" | "Altoke"
  canalReporte: string
  fechaApertura: string
  ultimaActualizacion: string
  timeline: TimelineEvent[]
  resumenSolAI: string
}

export const ticketsSimulados: Ticket[] = [
  {
    id: "t1",
    codigoTicket: "#BS-2024-0041",
    idIncidencia: 1,
    nombreIncidencia: "Pago QR no completado",
    estado: "en_revision",
    prioridad: "alta",
    plataforma: "Appsol",
    canalReporte: "App móvil",
    fechaApertura: "28/05/2024 · 14:32",
    ultimaActualizacion: "28/05/2024 · 15:10",
    resumenSolAI:
      "El cliente reportó un pago QR fallido por Bs 145.50 en Supermercado Ketal. Se detectó débito sin confirmación. Caso derivado a conciliación.",
    timeline: [
      { id: "e1", tipo: "creado", descripcion: "Ticket creado desde Sol AI", hora: "14:32", completado: true },
      { id: "e2", tipo: "verificado", descripcion: "Identidad del cliente verificada", hora: "14:33", completado: true },
      { id: "e3", tipo: "en_revision", descripcion: "En revisión por equipo de conciliación", hora: "14:45", completado: true },
      { id: "e4", tipo: "informacion_solicitada", descripcion: "Comprobante de pago solicitado al cliente", hora: "15:10", completado: true },
      { id: "e5", tipo: "resuelto", descripcion: "Resolución del caso", hora: "Pendiente", completado: false },
    ],
  },
  {
    id: "t2",
    codigoTicket: "#BS-2024-0038",
    idIncidencia: 5,
    nombreIncidencia: "Transacción no reconocida",
    estado: "escalado",
    prioridad: "alta",
    plataforma: "Appsol",
    canalReporte: "App móvil",
    fechaApertura: "27/05/2024 · 09:15",
    ultimaActualizacion: "27/05/2024 · 09:22",
    resumenSolAI:
      "Cliente reportó cargo no reconocido por Bs 380.00 en comercio online. Tarjeta bloqueada preventivamente. Escalado a equipo de fraude con prioridad máxima.",
    timeline: [
      { id: "e1", tipo: "creado", descripcion: "Ticket creado desde Sol AI", hora: "09:15", completado: true },
      { id: "e2", tipo: "verificado", descripcion: "Identidad verificada con validación reforzada", hora: "09:16", completado: true },
      { id: "e3", tipo: "escalado", descripcion: "Escalado a equipo de seguridad y fraude", hora: "09:18", completado: true },
      { id: "e4", tipo: "en_revision", descripcion: "Investigación activa por especialista", hora: "09:22", completado: true },
      { id: "e5", tipo: "resuelto", descripcion: "Resolución del caso", hora: "Pendiente", completado: false },
    ],
  },
  {
    id: "t3",
    codigoTicket: "#BS-2024-0031",
    idIncidencia: 4,
    nombreIncidencia: "Transferencia demorada",
    estado: "resuelto",
    prioridad: "media",
    plataforma: "Appsol",
    canalReporte: "App móvil",
    fechaApertura: "25/05/2024 · 11:00",
    ultimaActualizacion: "25/05/2024 · 16:45",
    resumenSolAI:
      "Transferencia de Bs 1200.00 a cuenta BNB fue acreditada con demora de 4 horas por mantenimiento interbancario. Caso cerrado sin afectación financiera.",
    timeline: [
      { id: "e1", tipo: "creado", descripcion: "Ticket creado desde Sol AI", hora: "11:00", completado: true },
      { id: "e2", tipo: "verificado", descripcion: "Identidad verificada", hora: "11:01", completado: true },
      { id: "e3", tipo: "en_revision", descripcion: "Revisión por equipo de operaciones", hora: "11:30", completado: true },
      { id: "e4", tipo: "resuelto", descripcion: "Transferencia acreditada. Caso cerrado.", hora: "16:45", completado: true },
    ],
  },
]
