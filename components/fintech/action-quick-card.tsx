import { ChevronRight } from "lucide-react"

interface ActionQuickCardProps {
  title: string
  description: string
  icon: React.ReactNode
  onClick?: () => void
}

export function ActionQuickCard({ title, description, icon, onClick }: ActionQuickCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-border bg-card px-4 py-4 text-left transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgba(15,23,42,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
    >
      <div className="flex items-center gap-4">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[color:var(--primary-soft)] via-[color:var(--secondary-soft)] to-[color:var(--orange-soft)] text-primary shadow-sm shadow-[rgba(111,44,255,0.14)]">
          {icon}
        </div>
        <div>
          <p className="text-base font-semibold text-foreground">{title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <ChevronRight className="size-5 text-primary" />
    </button>
  )
}
