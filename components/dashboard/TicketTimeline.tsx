import type { TimelineEvent } from "@/lib/tickets"

const TIPO_CONFIG: Record<TimelineEvent["tipo"], { color: string; bg: string }> = {
  creado: { color: "#6B7280", bg: "#F3F4F6" },
  verificado: { color: "#059669", bg: "#ECFDF5" },
  en_revision: { color: "#D97706", bg: "#FEF3C7" },
  informacion_solicitada: { color: "#2563EB", bg: "#EFF6FF" },
  escalado: { color: "#7C3AED", bg: "#EDE9FE" },
  resuelto: { color: "#059669", bg: "#ECFDF5" },
}

export function TicketTimeline({ timeline }: { timeline: TimelineEvent[] }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
        Historial de gestión
      </p>
      <div className="flex flex-col">
        {timeline.map((ev, i) => {
          const cfg = TIPO_CONFIG[ev.tipo]
          const esUltimo = i === timeline.length - 1
          const esFuturo = !ev.completado

          return (
            <div key={ev.id} className="flex gap-3">
              {/* Línea + punto */}
              <div className="flex flex-col items-center">
                <div
                  className="rounded-full shrink-0 flex items-center justify-center"
                  style={{
                    width: esUltimo ? 10 : 8,
                    height: esUltimo ? 10 : 8,
                    marginTop: 3,
                    background: esFuturo ? "#E5E7EB" : cfg.color,
                    boxShadow: esUltimo && !esFuturo ? `0 0 0 3px ${cfg.bg}` : undefined,
                  }}
                />
                {i < timeline.length - 1 && (
                  <div
                    className="w-px flex-1 mt-1 mb-1"
                    style={{
                      minHeight: 18,
                      background: esFuturo ? "repeating-linear-gradient(to bottom, #D1D5DB 0px, #D1D5DB 4px, transparent 4px, transparent 8px)" : "#D1D5DB",
                    }}
                  />
                )}
              </div>

              {/* Contenido */}
              <div className={`pb-3 min-w-0 ${esFuturo ? "opacity-40" : ""}`}>
                <p className="text-[12px] font-medium text-gray-800 dark:text-gray-100 leading-snug">{ev.descripcion}</p>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5 font-mono">{ev.hora}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
