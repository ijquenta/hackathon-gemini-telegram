import { AccesosRapidos } from "@/components/dashboard/AccesosRapidos"
import { MisTickets } from "@/components/dashboard/MisTickets"

export default function Page() {
  return (
    <div className="px-4 lg:px-6 py-6 flex flex-col gap-4 min-h-full bg-[#090B15]">
      <AccesosRapidos />
      <MisTickets />
    </div>
  )
}


