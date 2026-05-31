"use client"

import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { BellIcon } from "lucide-react"
import Image from "next/image"
import { SolAvatar } from "@/components/ui/SolAvatar"
import { useStore } from "@/lib/store"

export function SiteHeader() {
  const router = useRouter()
  const tickets = useStore((s) => s.tickets)
  const badgeCount = tickets.filter(
    (t) => t.estado === "abierto" || t.estado === "escalado"
  ).length

  return (
    <header className="flex h-14 shrink-0 items-center border-b border-white/[0.08] bg-[#0D0E16] px-4 lg:px-6 gap-4">
      {/* Logo */}
      <button
        onClick={() => router.push("/dashboard")}
        className="flex items-center gap-2.5 shrink-0 group"
      >
        <Image
          src="/bancosol-logo.svg"
          alt="BancoSol"
          width={36}
          height={36}
          className="size-9 drop-shadow-md"
          priority
        />
        <span className="font-bold text-sm text-white group-hover:text-orange-300 transition-colors">BancoSol</span>
      </button>

      <div className="h-5 w-px bg-white/10 mx-1" />

      {/* Título */}
      <h1 className="text-sm font-medium text-white/60 flex-1">
        Mesa de Ayuda — Clasificación de Tickets
      </h1>

      {/* Notificaciones */}
      <button className="relative size-8 flex items-center justify-center rounded-lg hover:bg-white/[0.08] transition-colors text-white/50 hover:text-white/80">
        <BellIcon className="size-4" />
        {badgeCount > 0 && (
          <span className="absolute top-1 right-1 size-2 bg-red-500 rounded-full" />
        )}
      </button>

      {/* Botón Sol AI */}
      <button
        onClick={() => router.push("/chat?tipo=11")}
        className="relative flex items-center gap-2 text-white text-sm font-semibold px-3.5 py-2 rounded-xl transition-all shrink-0 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-500 hover:to-violet-600 shadow-lg shadow-violet-900/40"
      >
        <SolAvatar size={18} />
        Sol AI
        <AnimatePresence>
          {badgeCount > 0 && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="absolute -top-1.5 -right-1.5 size-5 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center shadow"
            >
              {badgeCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Avatar de usuario */}
      <div className="flex items-center gap-2.5 pl-3 border-l border-white/10">
        <div className="size-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
          MG
        </div>
        <div className="hidden md:flex flex-col leading-tight">
          <span className="text-white text-xs font-semibold">María González</span>
          <span className="text-white/40 text-[10px] uppercase tracking-wide">Cliente</span>
        </div>
      </div>
    </header>
  )
}


