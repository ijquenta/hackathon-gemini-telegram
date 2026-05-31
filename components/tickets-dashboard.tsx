"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Gestión de Tickets
        </h1>
      </div>

      {/* 2. Grid Responsivo (reemplazando la tabla tradicional) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TICKETS_MOCK.map((ticket) => {
          // Lógica de estilos condicionales estrictos basados en la prioridad
          const isHighPriority = ticket.prioridad === "Alta";
          
          const cardStyle = isHighPriority
            ? "border-red-500 bg-red-950/30 dark:border-red-500 dark:bg-red-950/30"
            : "border-green-500 bg-green-950/30 dark:border-green-500 dark:bg-green-950/30";

          return (
            <Card key={ticket.id} className={`transition-colors ${cardStyle}`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {ticket.id} - {ticket.cliente}
                </CardTitle>
                <Badge
                  variant={isHighPriority ? "destructive" : "default"}
                  className={
                    !isHighPriority
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : ""
                  }
                >
                  {ticket.prioridad}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[40px]">
                  {ticket.problema_resumido}
                </p>
                
                {/* 3. Badges para Sentimiento y Estado */}
                <div className="flex items-center gap-2 mt-4">
                  <Badge variant="outline" className="bg-background/50 backdrop-blur-sm">
                    {ticket.sentimiento}
                  </Badge>
                  <Badge variant="secondary" className="bg-background/50 backdrop-blur-sm">
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
