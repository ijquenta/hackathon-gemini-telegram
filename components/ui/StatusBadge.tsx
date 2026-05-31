import type { Ticket } from "@/lib/tickets"

const config: Record<Ticket["estado"], { label: string; bg: string; text: string }> = {
  abierto: { label: "Abierto", bg: "#FEE2E2", text: "#B91C1C" },
  en_revision: { label: "En revisión", bg: "#FEF3C7", text: "#92400E" },
  resuelto: { label: "Resuelto", bg: "#D1FAE5", text: "#065F46" },
  escalado: { label: "Escalado", bg: "#EDE9FE", text: "#6D28D9" },
}

export function StatusBadge({ estado }: { estado: Ticket["estado"] }) {
  const c = config[estado]
  return (
    <span
      className="inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap"
      style={{ background: c.bg, color: c.text }}
    >
      {c.label}
    </span>
  )
}
