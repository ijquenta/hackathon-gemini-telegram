"use client"

import { useRouter } from "next/navigation"
import { TicketCard } from "./TicketCard"
import { useStore } from "@/lib/store"

export function MisTickets() {
  const router = useRouter()
  const tickets = useStore((s) => s.tickets)

  return (
    <section className="rounded-2xl bg-[#111827] border border-white/[0.06] p-6">
      {/* Encabezado */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-violet-400 mb-1">
            Seguimiento de casos
          </p>
          <h2 className="text-xl font-bold text-white">Mis tickets</h2>
        </div>
        <div className="flex items-center gap-3 mt-1">
          <p className="text-xs text-white/40 text-right max-w-36 hidden sm:block">
            Casos abiertos y resueltos.
          </p>
          <button
            onClick={() => router.push("/dashboard/tickets")}
            className="text-[12px] font-medium text-violet-400 border border-violet-500/30 hover:bg-violet-500/10 px-3 py-1.5 rounded-lg transition-colors shrink-0 bg-violet-500/5"
          >
            Ver todos
          </button>
        </div>
      </div>

      {/* Lista */}
      {tickets.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.02] py-10 flex flex-col items-center gap-2 text-center">
          <p className="text-white/30 text-sm">No tienes tickets activos</p>
          <p className="text-white/20 text-xs">Los casos que generes con Sol AI aparecerán aquí</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </section>
  )
}
