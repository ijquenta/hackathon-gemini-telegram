import { create } from "zustand"
import { Ticket, ticketsSimulados } from "./tickets"

interface StoreState {
  tickets: Ticket[]
  ticketExpandido: string | null
  agregarTicket: (t: Ticket) => void
  setTicketExpandido: (id: string | null) => void
  marcarUrgente: (id: string) => void
  confirmarResolucion: (id: string) => void
  reabrirCaso: (id: string) => void
}

export const useStore = create<StoreState>((set) => ({
  tickets: ticketsSimulados,
  ticketExpandido: null,

  agregarTicket: (t) =>
    set((state) => ({ tickets: [t, ...state.tickets] })),

  setTicketExpandido: (id) =>
    set((state) => ({ ticketExpandido: state.ticketExpandido === id ? null : id })),

  marcarUrgente: (id) =>
    set((state) => ({
      tickets: state.tickets.map((t) =>
        t.id === id ? { ...t, prioridad: "alta" as const } : t
      ),
    })),

  confirmarResolucion: (id) =>
    set((state) => ({
      tickets: state.tickets.map((t) =>
        t.id === id
          ? {
              ...t,
              estado: "resuelto" as const,
              ultimaActualizacion: new Date().toLocaleString("es-BO"),
              timeline: t.timeline.map((ev) =>
                ev.tipo === "resuelto" && !ev.completado
                  ? { ...ev, completado: true, hora: new Date().toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" }) }
                  : ev
              ),
            }
          : t
      ),
    })),

  reabrirCaso: (id) =>
    set((state) => ({
      tickets: state.tickets.map((t) =>
        t.id === id
          ? { ...t, estado: "abierto" as const, ultimaActualizacion: new Date().toLocaleString("es-BO") }
          : t
      ),
    })),
}))
