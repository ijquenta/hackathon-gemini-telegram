"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { TicketIcon, BookOpenIcon, CommandIcon, BotIcon } from "lucide-react"

const data = {
  user: {
    name: "Agente IA",
    email: "bot@banco.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Clasificación",
      url: "/dashboard/tickets",
      icon: <TicketIcon />,
    },
    {
      title: "Playbooks",
      url: "/dashboard/playbooks",
      icon: <BookOpenIcon />,
    },
    {
      title: "Sol AI",
      url: "/chat",
      icon: <BotIcon />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<a href="#" />}
            >
              <CommandIcon className="size-5!" />
              <span className="text-base font-semibold">Banco Tickets</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}

