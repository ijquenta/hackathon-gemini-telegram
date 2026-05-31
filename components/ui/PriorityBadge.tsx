import type { Ticket } from "@/lib/tickets"

const config: Record<Ticket["prioridad"], { label: string; bg: string; text: string }> = {
  alta: { label: "Alta", bg: "#FEE2E2", text: "#B91C1C" },
  media: { label: "Media", bg: "#FEF3C7", text: "#92400E" },
  baja: { label: "Baja", bg: "#D1FAE5", text: "#065F46" },
}

export function PriorityBadge({ prioridad }: { prioridad: Ticket["prioridad"] }) {
  const c = config[prioridad]
  return (
    <span
      className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full"
      style={{ background: c.bg, color: c.text }}
    >
      {c.label}
    </span>
  )
}
