import { Home, TrendingUp, Users, MessageSquare } from "lucide-react"

const navItems = [
  { label: "Dashboard", icon: <Home className="size-5" /> },
  { label: "Movimientos", icon: <TrendingUp className="size-5" /> },
  { label: "Clientes", icon: <Users className="size-5" /> },
  { label: "Mensajes", icon: <MessageSquare className="size-5" /> },
]

interface FintechSidebarProps {
  activeItem?: string
}

export function FintechSidebar({ activeItem = "Dashboard" }: FintechSidebarProps) {
  return (
    <aside className="w-full max-w-[320px] rounded-[28px] border border-border bg-card p-6 shadow-[0_24px_80px_-50px_rgba(15,23,42,0.18)]">
      <div className="rounded-3xl bg-gradient-to-r from-[color:var(--primary-soft)] to-[color:var(--secondary-soft)] p-5 shadow-sm shadow-slate-200/50">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-primary to-[color:var(--secondary-soft)] text-white shadow-md shadow-primary/20">
            <span className="text-base font-semibold">U</span>
          </div>
          <div>
            <p className="text-sm text-primary/70">¡Hola, Usuario!</p>
            <p className="text-lg font-semibold text-foreground">Bienvenido de nuevo</p>
          </div>
        </div>
      </div>

      <nav className="mt-8 space-y-2">
        {navItems.map((item) => {
          const isActive = item.label === activeItem
          return (
            <button
              key={item.label}
              type="button"
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
                isActive
                  ? "bg-gradient-to-r from-[color:var(--primary-soft)] via-[color:var(--secondary-soft)] to-[color:var(--orange-soft)] text-primary shadow-[0_16px_50px_-30px_rgba(111,44,255,0.28)]"
                  : "text-foreground hover:bg-[color:var(--secondary-soft)]/70 hover:text-foreground"
              }`}
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[color:var(--primary-soft)] to-[color:var(--orange-soft)] text-primary shadow-sm shadow-[rgba(111,44,255,0.12)]">
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
