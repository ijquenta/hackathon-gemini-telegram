"use client"

import { useRef } from "react"
import { useRouter } from "next/navigation"
import { PaperclipIcon, AlertTriangleIcon, CheckCircle2Icon, RotateCcwIcon } from "lucide-react"
import { SolAvatar } from "@/components/ui/SolAvatar"
import type { Ticket } from "@/lib/tickets"
import { useStore } from "@/lib/store"

interface TicketAccionesProps {
  ticket: Ticket
}

export function TicketAcciones({ ticket }: TicketAccionesProps) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const { marcarUrgente, confirmarResolucion, reabrirCaso } = useStore()

  const esActivo = ticket.estado === "abierto" || ticket.estado === "en_revision"

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">Acciones</p>

      {/* Continuar con Sol AI */}
      <button
        onClick={() => router.push(`/chat?tipo=${ticket.idIncidencia}`)}
        className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-[0.98]"
        style={{ background: "linear-gradient(135deg, #6D28D9, #7C3AED)" }}
      >
        Continuar con Sol AI →
      </button>

      {/* Adjuntar evidencia */}
      <button
        onClick={() => fileRef.current?.click()}
        className="w-full py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-neutral-600 hover:border-violet-300 dark:hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors flex items-center justify-center gap-2"
      >
        <PaperclipIcon className="size-4" />
        Adjuntar evidencia
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file && file.size > 5 * 1024 * 1024) {
            alert("El archivo no puede superar los 5 MB.")
            e.target.value = ""
          }
        }}
      />

      {/* Marcar como urgente — solo si está activo */}
      {esActivo && (
        <button
          onClick={() => marcarUrgente(ticket.id)}
          className="w-full py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2"
        >
          <AlertTriangleIcon className="size-4" />
          Marcar como urgente
        </button>
      )}

      {/* Acciones de resolución */}
      {ticket.estado === "resuelto" && (
        <>
          <button
            onClick={() => confirmarResolucion(ticket.id)}
            className="w-full py-2.5 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle2Icon className="size-4" />
            Confirmar resolución
          </button>
          <button
            onClick={() => reabrirCaso(ticket.id)}
            className="w-full py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-neutral-600 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcwIcon className="size-4" />
            Reabrir caso
          </button>
        </>
      )}

      {/* Divider */}
      <div className="border-t border-gray-100 dark:border-neutral-700 pt-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
          Resumen Sol AI
        </p>
        <div className="flex gap-2.5 bg-gray-50 dark:bg-neutral-700/50 rounded-xl p-3">
          <div className="shrink-0 mt-0.5">
            <SolAvatar size={28} />
          </div>
          <p className="text-[12px] text-gray-600 dark:text-gray-300 leading-relaxed">{ticket.resumenSolAI}</p>
        </div>
      </div>
    </div>
  )
}
