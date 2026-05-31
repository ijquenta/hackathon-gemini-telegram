import { SiteHeader } from "@/components/site-header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#090B15]">
      <SiteHeader />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  )
}
