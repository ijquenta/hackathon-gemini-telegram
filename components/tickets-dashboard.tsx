"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// 1. Array de datos mock (simulando la base de datos)
const TICKETS_MOCK = [
  {
    id: "TKT-001",
    cliente: "María González",
    problema_resumido: "Tarjeta bloqueada tras 3 intentos en cajero.",
    prioridad: "Alta",
    sentimiento: "Enojado",
    estado: "Pendiente",
  },
  {
    id: "TKT-002",
    cliente: "Carlos Pérez",
    problema_resumido: "Duda sobre tasa de interés de préstamo personal.",
    prioridad: "Baja",
    sentimiento: "Calmo",
    estado: "Resuelto",
  },
  {
    id: "TKT-003",
    cliente: "Lucía Fernández",
    problema_resumido: "Transferencia no reflejada en cuenta destino.",
    prioridad: "Alta",
    sentimiento: "Enojado",
    estado: "Pendiente",
  },
  {
    id: "TKT-004",
    cliente: "Roberto Gómez",
    problema_resumido: "Solicitud de nueva chequera.",
    prioridad: "Baja",
    sentimiento: "Calmo",
    estado: "Pendiente",
  },
  {
    id: "TKT-005",
    cliente: "Ana Martínez",
    problema_resumido: "Cargo no reconocido en tarjeta de crédito por $500.",
    prioridad: "Alta",
    sentimiento: "Enojado",
    estado: "Pendiente",
  },
  {
    id: "TKT-006",
    cliente: "Javier López",
    problema_resumido: "Actualización de domicilio en la cuenta.",
    prioridad: "Baja",
    sentimiento: "Calmo",
    estado: "Resuelto",
  },
];

export function TicketsDashboard() {
  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      {/* Encabezado de sección */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
          Tickets Recientes
        </h2>
        <span className="text-xs text-muted-foreground">{TICKETS_MOCK.length} tickets</span>
      </div>
      <Separator />

      {/* Grid responsivo de tickets */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TICKETS_MOCK.map((ticket) => {
          const isHighPriority = ticket.prioridad === "Alta";

          const cardStyle = isHighPriority
            ? "border-red-500/60 bg-red-950/20"
            : "border-green-500/60 bg-green-950/20";

          return (
            <Card key={ticket.id} className={`transition-colors ${cardStyle}`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <div className="flex flex-col gap-0.5">
                  <CardTitle className="text-xs font-semibold text-muted-foreground">
                    {ticket.id}
                  </CardTitle>
                  <span className="text-sm font-medium text-foreground">
                    {ticket.cliente}
                  </span>
                </div>
                <Badge
                  variant={isHighPriority ? "destructive" : "outline"}
                  className={
                    !isHighPriority
                      ? "border-green-500/60 text-green-400 text-xs"
                      : "text-xs"
                  }
                >
                  {ticket.prioridad}
                </Badge>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                  {ticket.problema_resumido}
                </p>
                <div className="flex items-center gap-1.5">
                  <Badge variant="secondary" className="text-xs px-1.5 py-0">
                    {ticket.sentimiento}
                  </Badge>
                  <Badge variant="outline" className="text-xs px-1.5 py-0">
                    {ticket.estado}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

