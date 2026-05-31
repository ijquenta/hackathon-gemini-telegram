import { CreditCard, ShieldCheck, Wallet } from "lucide-react"
import { ActionQuickCard } from "@/components/fintech/action-quick-card"
import { BalanceCard } from "@/components/fintech/balance-card"
import { FintechSidebar } from "@/components/fintech/fintech-sidebar"

export function FintechShowcase() {
  return (
    <div className="grid gap-8 xl:grid-cols-[320px_minmax(0,1fr)]">
      <FintechSidebar />
      <div className="space-y-6">
        <BalanceCard />
        <div className="grid gap-4 sm:grid-cols-2">
          <ActionQuickCard
            title="Enviar pago"
            description="Transferir fondos rápidamente a un contacto o cuenta nueva."
            icon={<CreditCard className="size-5" />}
          />
          <ActionQuickCard
            title="Ver ingresos"
            description="Revisa tus ingresos y estados financieros en tiempo real."
            icon={<Wallet className="size-5" />}
          />
          <ActionQuickCard
            title="Seguridad"
            description="Configura alertas y revisa accesos recientes."
            icon={<ShieldCheck className="size-5" />}
          />
        </div>
      </div>
    </div>
  )
}
