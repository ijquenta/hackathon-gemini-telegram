"use client"

import { useRouter } from "next/navigation"
import { QrCodeIcon, ReceiptIcon, ArrowRightLeftIcon, LockKeyholeIcon } from "lucide-react"

const TARJETAS = [
  {
    codigo: "PB-001",
    titulo: "Pago QR fallido",
    descripcion: "Mi pago QR fue rechazado o no se completó",
    icono: QrCodeIcon,
    iconoBg: "bg-orange-500/15",
    iconoColor: "text-orange-400",
    linkColor: "text-orange-400",
    acento: "border-orange-500/20",
    idIncidencia: 1,
  },
  {
    codigo: "PB-002",
    titulo: "Doble débito",
    descripcion: "Me cobraron dos veces por la misma operación",
    icono: ReceiptIcon,
    iconoBg: "bg-rose-500/15",
    iconoColor: "text-rose-400",
    linkColor: "text-rose-400",
    acento: "border-rose-500/20",
    idIncidencia: 2,
  },
  {
    codigo: "PB-003",
    titulo: "Transferencia no reflejada",
    descripcion: "Hice una transferencia y no se refleja",
    icono: ArrowRightLeftIcon,
    iconoBg: "bg-blue-500/15",
    iconoColor: "text-blue-400",
    linkColor: "text-blue-400",
    acento: "border-blue-500/20",
    idIncidencia: 4,
  },
  {
    codigo: "PB-005",
    titulo: "Acceso bloqueado",
    descripcion: "Mi cuenta o acceso está bloqueado",
    icono: LockKeyholeIcon,
    iconoBg: "bg-emerald-500/15",
    iconoColor: "text-emerald-400",
    linkColor: "text-emerald-400",
    acento: "border-emerald-500/20",
    idIncidencia: 6,
  },
]

export function AccesosRapidos() {
  const router = useRouter()

  return (
    <section className="rounded-2xl bg-[#111827] border border-white/[0.06] p-6">
      {/* Encabezado */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-violet-400 mb-1">
            Incidencias frecuentes
          </p>
          <h2 className="text-xl font-bold text-white">Accesos rápidos</h2>
        </div>
        <p className="text-xs text-white/40 mt-1 text-right max-w-40">
          Inicia una consulta con un solo toque.
        </p>
      </div>

      {/* Grid 2x2 */}
      <div className="grid grid-cols-2 gap-3">
        {TARJETAS.map((t) => {
          const Icono = t.icono
          return (
            <div
              key={t.codigo}
              className={`bg-[#1A1D2E] border ${t.acento} rounded-xl p-4 flex flex-col cursor-pointer group transition-all hover:bg-[#1F2340] hover:border-white/10`}
              onClick={() => router.push(`/chat?tipo=${t.idIncidencia}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && router.push(`/chat?tipo=${t.idIncidencia}`)}
            >
              {/* Top row */}
              <div className="flex items-center justify-between mb-3">
                <div className={`size-9 rounded-xl flex items-center justify-center shrink-0 ${t.iconoBg}`}>
                  <Icono className={`size-5 ${t.iconoColor}`} strokeWidth={1.75} />
                </div>
                <span className="text-[11px] font-mono text-white/30">{t.codigo}</span>
              </div>

              {/* Título */}
              <p className="text-[14px] font-semibold text-white">{t.titulo}</p>

              {/* Descripción */}
              <p className="text-[12px] text-white/40 leading-snug mt-1 line-clamp-2 flex-1">
                {t.descripcion}
              </p>

              {/* Link */}
              <p className={`text-[12px] font-medium mt-3 group-hover:underline ${t.linkColor}`}>
                Iniciar consulta →
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
