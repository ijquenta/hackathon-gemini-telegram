import { ArrowUpRight } from "lucide-react"

interface BalanceCardProps {
  accountNumber?: string
  label?: string
  amount?: string
  status?: string
  highlight?: string
}

export function BalanceCard({
  accountNumber = "**** 1247",
  label = "Cuenta principal",
  amount = "Bs 12,000.00",
  status = "Activo",
  highlight = "+Bs 1,200.00 este mes",
}: BalanceCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-[0_24px_80px_-50px_rgba(111,44,255,0.12)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)]" />
      <div className="relative p-6">
        <div className="flex flex-col gap-4 rounded-3xl border border-[color:var(--primary-soft)] bg-[color:var(--secondary-soft)]/80 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{label}</p>
            <p className="mt-2 text-sm font-semibold text-foreground">{accountNumber}</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            {status}
          </span>
        </div>

        <div className="mt-6">
          <p className="text-3xl font-semibold leading-tight text-foreground">{amount}</p>
          <p className="mt-2 text-sm text-muted-foreground">Saldo disponible hoy</p>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4 rounded-3xl border border-[color:var(--orange-soft)] bg-gradient-to-r from-[color:var(--primary-soft)] to-[color:var(--orange-soft)]/80 px-4 py-4">
          <div>
            <p className="text-sm font-semibold text-foreground">Rendimiento</p>
            <p className="mt-1 text-sm text-muted-foreground">{highlight}</p>
          </div>
          <ArrowUpRight className="size-5 text-primary" />
        </div>
      </div>
    </div>
  )
}
