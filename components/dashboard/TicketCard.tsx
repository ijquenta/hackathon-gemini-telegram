"use client"

import { ChevronDownIcon } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { PriorityBadge } from "@/components/ui/PriorityBadge"
import { TicketTimeline } from "./TicketTimeline"
import { TicketAcciones } from "./TicketAcciones"
import type { Ticket } from "@/lib/tickets"
import { useStore } from "@/lib/store"

const ESTADO_DOT: Record<Ticket["estado"], string> = {
  abierto: "#DC2626",
  en_revision: "#D97706",
  resuelto: "#059669",
  escalado: "#7C3AED",
}

const PLATAFORMA_CONFIG: Record<string, { bg: string; text: string }> = {
  Appsol: { bg: "#EDE9FE", text: "#6D28D9" },
  Altoke: { bg: "#DBEAFE", text: "#1D4ED8" },
}

export function TicketCard({ ticket }: { ticket: Ticket }) {
  const { ticketExpandido, setTicketExpandido } = useStore()
  const expandido = ticketExpandido === ticket.id
  const plat = PLATAFORMA_CONFIG[ticket.plataforma] ?? { bg: "#F3F4F6", text: "#374151" }

  return (
    <div className="rounded-xl border border-white/[0.07] bg-[#1A1D2E] overflow-hidden">
      {/* Cabecera colapsada */}
      <button
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-white/[0.04] transition-colors"
        onClick={() => setTicketExpandido(ticket.id)}
      >
        {/* Indicador de color */}
        <span
          className="size-2 rounded-full shrink-0"
          style={{ background: ESTADO_DOT[ticket.estado] }}
        />

        {/* Código */}
        <span className="font-mono text-[12px] text-white/30 shrink-0">{ticket.codigoTicket}</span>

        {/* Nombre */}
        <span className="text-sm font-medium text-white flex-1 min-w-0 truncate">
          {ticket.nombreIncidencia}
        </span>

        {/* Badge estado */}
        <StatusBadge estado={ticket.estado} />

        {/* Fecha */}
        <span className="text-[12px] text-white/30 shrink-0 hidden sm:block">{ticket.fechaApertura}</span>

        {/* Chevron */}
        <ChevronDownIcon
          className="size-4 text-white/30 shrink-0 transition-transform duration-200"
          style={{ transform: expandido ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {/* Panel expandido */}
      <AnimatePresence initial={false}>
        {expandido && (
          <motion.div
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div className="border-t border-white/[0.06] px-4 py-5 grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Columna izquierda — Datos del caso */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-3">
                  Información del caso
                </p>
                <dl className="flex flex-col gap-2.5">
                  <Row label="Canal de reporte" value={ticket.canalReporte} />
                  <div className="flex justify-between items-center gap-2">
                    <dt className="text-[12px] text-white/40 shrink-0">Plataforma</dt>
                    <span
                      className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: plat.bg, color: plat.text }}
                    >
                      {ticket.plataforma}
                    </span>
                  </div>
                  <Row label="Fecha de apertura" value={ticket.fechaApertura} />
                  <Row label="Última actualización" value={ticket.ultimaActualizacion} />
                  <div className="flex justify-between items-center gap-2">
                    <dt className="text-[12px] text-white/40 shrink-0">Prioridad</dt>
                    <PriorityBadge prioridad={ticket.prioridad} />
                  </div>
                </dl>
              </div>

              {/* Columna central — Timeline */}
              <div>
                <TicketTimeline timeline={ticket.timeline} />
              </div>

              {/* Columna derecha — Acciones */}
              <div>
                <TicketAcciones ticket={ticket} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-2">
      <dt className="text-[12px] text-white/40 shrink-0">{label}</dt>
      <dd className="text-[12px] text-white font-medium text-right">{value}</dd>
    </div>
  )
}
