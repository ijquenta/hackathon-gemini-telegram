export interface Turno {
  rol: "agente"
  texto: string
  esperaRespuesta: boolean
  campoQueRecopila?: string
  esResolucion?: boolean
  esEscalado?: boolean
}

export interface Script {
  idIncidencia: number
  turnos: Turno[]
}

export const scripts: Script[] = [

  // ─── ID 1: Pago QR no completado ───────────────────────────────────────
  { idIncidencia: 1, turnos: [
    { rol: "agente", texto: "Entiendo que tu pago QR no se completó. Voy a revisar el estado de la operación contigo. ¿Puedes decirme el monto que intentaste pagar?", esperaRespuesta: true, campoQueRecopila: "Monto" },
    { rol: "agente", texto: "Gracias. ¿En qué comercio fue el intento de pago?", esperaRespuesta: true, campoQueRecopila: "Comercio" },
    { rol: "agente", texto: "Perfecto. ¿Recuerdas la fecha y hora aproximada?", esperaRespuesta: true, campoQueRecopila: "Fecha y hora" },
    { rol: "agente", texto: "Revisando el sistema... Veo que la operación quedó en estado pendiente. ¿Tu cuenta fue debitada o el saldo permanece igual?", esperaRespuesta: true, campoQueRecopila: "Estado del débito" },
    { rol: "agente", texto: "Entendido. Si hubo un débito sin confirmación, esto genera una reversa automática en un plazo de hasta 24 horas hábiles. Te recomiendo revisar tus movimientos mañana. Si el monto no fue devuelto, vuelve aquí y escalaremos el caso con un especialista. ¿Hay algo más en lo que pueda ayudarte?", esperaRespuesta: false, esResolucion: true },
  ]},

  // ─── ID 2: Doble débito en pago QR ─────────────────────────────────────
  { idIncidencia: 2, turnos: [
    { rol: "agente", texto: "Lamento mucho lo ocurrido. Un doble débito es algo que atendemos con urgencia. ¿Puedes confirmarme el monto que fue cobrado dos veces?", esperaRespuesta: true, campoQueRecopila: "Monto" },
    { rol: "agente", texto: "¿En qué comercio ocurrió y en qué fecha?", esperaRespuesta: true, campoQueRecopila: "Comercio y fecha" },
    { rol: "agente", texto: "¿Tienes a mano el comprobante o una captura de pantalla que muestre los dos cobros?", esperaRespuesta: true, campoQueRecopila: "Comprobante" },
    { rol: "agente", texto: "Perfecto. Con esa información estoy registrando tu caso ahora mismo para revisión de conciliación. El equipo verificará si existe una reversa automática en proceso. En caso de que no exista, un especialista se pondrá en contacto contigo en un plazo de 48 horas hábiles. ¿Confirmas que el número de contacto registrado en tu cuenta es el correcto?", esperaRespuesta: true, campoQueRecopila: "Confirmación de contacto" },
    { rol: "agente", texto: "Caso registrado exitosamente. Recibirás una notificación cuando haya una actualización. Lamento los inconvenientes causados.", esperaRespuesta: false, esResolucion: true },
  ]},

  // ─── ID 3: Recepción QR no reflejada ───────────────────────────────────
  { idIncidencia: 3, turnos: [
    { rol: "agente", texto: "Estás esperando un pago que aún no aparece en tu cuenta. Dame el monto que debías recibir.", esperaRespuesta: true, campoQueRecopila: "Monto esperado" },
    { rol: "agente", texto: "¿A qué hora aproximadamente realizó el pago la otra persona?", esperaRespuesta: true, campoQueRecopila: "Hora" },
    { rol: "agente", texto: "¿El pagador tiene un comprobante de que el pago fue exitoso desde su lado?", esperaRespuesta: true, campoQueRecopila: "Comprobante del pagador" },
    { rol: "agente", texto: "Los pagos QR pueden demorar hasta 15 minutos en reflejarse en períodos de alta demanda. Si ya pasó ese tiempo y el pagador tiene comprobante exitoso, el caso será escalado a conciliación. ¿Deseas que genere el ticket ahora?", esperaRespuesta: true, campoQueRecopila: "Decisión de escalado" },
    { rol: "agente", texto: "Ticket generado. El equipo de conciliación revisará la operación y te notificará en un plazo de 24 horas. Gracias por tu paciencia.", esperaRespuesta: false, esResolucion: true },
  ]},

  // ─── ID 4: Transferencia demorada ──────────────────────────────────────
  { idIncidencia: 4, turnos: [
    { rol: "agente", texto: "Voy a verificar el estado de tu transferencia. ¿Puedes darme el número de operación?", esperaRespuesta: true, campoQueRecopila: "Número de operación" },
    { rol: "agente", texto: "¿Cuál fue el monto y a qué cuenta fue enviado?", esperaRespuesta: true, campoQueRecopila: "Monto y cuenta destino" },
    { rol: "agente", texto: "¿La transferencia fue a otro banco o dentro de BancoSol?", esperaRespuesta: true, campoQueRecopila: "Tipo de transferencia" },
    { rol: "agente", texto: "Las transferencias internas se acreditan en minutos. Las interbancarias pueden tardar hasta 24 horas hábiles. ¿Tu cuenta ya fue debitada pero el destinatario no recibió el dinero?", esperaRespuesta: true, campoQueRecopila: "Estado del débito" },
    { rol: "agente", texto: "Entendido. Si el cargo ya se realizó y superó el tiempo esperado, escalo el caso a operaciones ahora. Se generará un ticket de seguimiento. ¿Confirmas?", esperaRespuesta: true, campoQueRecopila: "Confirmación de escalado" },
    { rol: "agente", texto: "Caso escalado correctamente. Recibirás respuesta en las próximas 24 horas hábiles. Tu número de ticket es #BS-2024-TRF.", esperaRespuesta: false, esResolucion: true },
  ]},

  // ─── ID 5: Fraude / transacción no reconocida ──────────────────────────
  { idIncidencia: 5, turnos: [
    { rol: "agente", texto: "Esto es prioritario y lo atiendo de inmediato. ¿En qué fecha aparece el movimiento que no reconoces?", esperaRespuesta: true, campoQueRecopila: "Fecha" },
    { rol: "agente", texto: "¿Cuál es el monto y qué comercio o destino aparece en el movimiento?", esperaRespuesta: true, campoQueRecopila: "Monto y comercio" },
    { rol: "agente", texto: "¿Tu tarjeta o dispositivo estuvo en posesión de otra persona recientemente?", esperaRespuesta: true, campoQueRecopila: "Contexto de seguridad" },
    { rol: "agente", texto: "Por tu seguridad, voy a iniciar el bloqueo preventivo de tu medio de pago ahora mismo mientras se investiga. ¿Confirmas el bloqueo?", esperaRespuesta: true, campoQueRecopila: "Confirmación de bloqueo" },
    { rol: "agente", texto: "Bloqueo aplicado. Tu caso ha sido escalado al equipo de seguridad y fraude con prioridad alta. Un especialista se comunicará contigo en las próximas 2 horas hábiles. Por favor no compartas tu clave con nadie.", esperaRespuesta: false, esEscalado: true, esResolucion: true },
  ]},

  // ─── ID 6: Cuenta o acceso bloqueado ───────────────────────────────────
  { idIncidencia: 6, turnos: [
    { rol: "agente", texto: "Lamento que no puedas acceder. ¿El bloqueo ocurrió después de varios intentos fallidos o apareció de repente?", esperaRespuesta: true, campoQueRecopila: "Tipo de bloqueo" },
    { rol: "agente", texto: "¿Qué mensaje exacto te muestra la aplicación?", esperaRespuesta: true, campoQueRecopila: "Mensaje de error" },
    { rol: "agente", texto: "¿Estás intentando ingresar desde el mismo dispositivo que siempre usas?", esperaRespuesta: true, campoQueRecopila: "Dispositivo" },
    { rol: "agente", texto: "Si el bloqueo es por intentos fallidos, puedes desbloquearlo usando la opción '¿Olvidaste tu contraseña?' en la pantalla de login. Esto enviará un código a tu correo o número registrado. ¿Tienes acceso a ese correo o número?", esperaRespuesta: true, campoQueRecopila: "Acceso a contacto registrado" },
    { rol: "agente", texto: "Perfecto. Intenta el proceso de recuperación ahora. Si el sistema no te permite completarlo, regresa aquí y escalaremos el caso directamente con soporte digital.", esperaRespuesta: false, esResolucion: true },
  ]},

  // ─── ID 7: Error de login / credenciales ───────────────────────────────
  { idIncidencia: 7, turnos: [
    { rol: "agente", texto: "Vamos a resolverlo juntos. ¿El error ocurre al ingresar tu contraseña, al recibir el código OTP, o al usar la biometría?", esperaRespuesta: true, campoQueRecopila: "Método fallido" },
    { rol: "agente", texto: "¿Cuál es el mensaje de error exacto que aparece en pantalla?", esperaRespuesta: true, campoQueRecopila: "Mensaje de error" },
    { rol: "agente", texto: "¿Recibiste el código OTP por SMS o correo en algún momento?", esperaRespuesta: true, campoQueRecopila: "Estado del OTP" },
    { rol: "agente", texto: "Te guío paso a paso: (1) Cierra la app completamente. (2) Ábrela nuevamente. (3) Usa la opción 'Recuperar acceso' en la pantalla de login. ¿Puedes intentarlo ahora?", esperaRespuesta: true, campoQueRecopila: "Resultado del intento" },
    { rol: "agente", texto: "Si el proceso de recuperación tampoco funciona, escalo tu caso a soporte digital ahora. Un agente te asistirá en menos de 1 hora hábil.", esperaRespuesta: false, esResolucion: true },
  ]},

  // ─── ID 8: App caída / error general ───────────────────────────────────
  { idIncidencia: 8, turnos: [
    { rol: "agente", texto: "Entiendo que la app no está funcionando. ¿Qué versión tienes instalada? Puedes verlo en Configuración > Acerca de la app.", esperaRespuesta: true, campoQueRecopila: "Versión" },
    { rol: "agente", texto: "¿En qué dispositivo ocurre? Marca y sistema operativo (Android o iOS).", esperaRespuesta: true, campoQueRecopila: "Dispositivo y SO" },
    { rol: "agente", texto: "¿La app no abre en absoluto, se cierra sola, o muestra una pantalla de error específica?", esperaRespuesta: true, campoQueRecopila: "Tipo de fallo" },
    { rol: "agente", texto: "Primero intenta esto: (1) Cierra la app completamente. (2) Reinicia tu dispositivo. (3) Si tienes una versión antigua, actualiza la app desde la tienda. ¿Alguno de esos pasos resolvió el problema?", esperaRespuesta: true, campoQueRecopila: "Resultado" },
    { rol: "agente", texto: "Si el problema persiste, puede ser un incidente técnico en nuestros servidores. Estoy registrando tu reporte para que el equipo técnico lo revise. Te notificaremos cuando esté resuelto.", esperaRespuesta: false, esResolucion: true },
  ]},

  // ─── ID 9: Saldo o movimientos no actualizados ─────────────────────────
  { idIncidencia: 9, turnos: [
    { rol: "agente", texto: "Voy a verificar si hay un desfase de sincronización. ¿Qué dato no coincide: el saldo, los movimientos recientes, o un producto específico?", esperaRespuesta: true, campoQueRecopila: "Dato afectado" },
    { rol: "agente", texto: "¿Desde qué hora aproximadamente notas que la información no se actualizó?", esperaRespuesta: true, campoQueRecopila: "Hora de desfase" },
    { rol: "agente", texto: "¿Intentaste actualizar manualmente con el botón 'Actualizar' de la app?", esperaRespuesta: true, campoQueRecopila: "Intento de actualización" },
    { rol: "agente", texto: "Los desfases de sincronización suelen resolverse solos en 15 a 30 minutos. Si el saldo que ves en la app no coincide con una operación real reciente, eso sí requiere revisión. ¿Existe una operación específica que debería verse reflejada?", esperaRespuesta: true, campoQueRecopila: "Operación específica" },
    { rol: "agente", texto: "Registrado. Si el desfase persiste más de 1 hora, escalo el caso a nuestro equipo de integraciones. Por ahora te recomiendo revisar nuevamente en 30 minutos.", esperaRespuesta: false, esResolucion: true },
  ]},

  // ─── ID 10: Estado de reclamo o ticket ─────────────────────────────────
  { idIncidencia: 10, turnos: [
    { rol: "agente", texto: "Con gusto te doy el estado de tu caso. ¿Puedes darme el número de ticket o reclamo que recibiste?", esperaRespuesta: true, campoQueRecopila: "Número de ticket" },
    { rol: "agente", texto: "¿Por qué canal registraste el caso: app, call center, o sucursal?", esperaRespuesta: true, campoQueRecopila: "Canal de registro" },
    { rol: "agente", texto: "Consultando el sistema... Tu caso figura en estado 'En revisión' desde la fecha de apertura. El tiempo estimado de resolución es de 3 a 5 días hábiles. ¿Tienes alguna urgencia específica que quieras que note en el caso?", esperaRespuesta: true, campoQueRecopila: "Urgencia adicional" },
    { rol: "agente", texto: "Nota agregada a tu caso. Te llegará una notificación cuando haya una actualización. ¿Necesitas algo más?", esperaRespuesta: false, esResolucion: true },
  ]},

  // ─── ID 11: Consulta general ───────────────────────────────────────────
  { idIncidencia: 11, turnos: [
    { rol: "agente", texto: "Estoy aquí para ayudarte. ¿Sobre qué producto o funcionalidad tienes dudas hoy?", esperaRespuesta: true, campoQueRecopila: "Tema" },
    { rol: "agente", texto: "Entendido. ¿Puedes describir un poco más lo que necesitas saber o lo que intentas hacer?", esperaRespuesta: true, campoQueRecopila: "Detalle de la duda" },
    { rol: "agente", texto: "Basándome en tu consulta, te explico: esta funcionalidad está disponible en la sección correspondiente de la app. Si necesitas pasos detallados, puedo guiarte uno a uno. ¿Quieres que lo hagamos juntos?", esperaRespuesta: true, campoQueRecopila: "Confirmación de guía" },
    { rol: "agente", texto: "Perfecto. Si en algún momento la duda escapa de lo que puedo resolver aquí, la derivo al área correspondiente con toda la información que ya me diste.", esperaRespuesta: false, esResolucion: true },
  ]},

  // ─── ID 12: Incidencia masiva ──────────────────────────────────────────
  { idIncidencia: 12, turnos: [
    { rol: "agente", texto: "Estoy revisando si hay alertas activas en este momento. ¿Qué servicio no está funcionando?", esperaRespuesta: true, campoQueRecopila: "Servicio afectado" },
    { rol: "agente", texto: "¿Desde qué hora aproximadamente notas el problema?", esperaRespuesta: true, campoQueRecopila: "Hora de inicio" },
    { rol: "agente", texto: "¿Lo has notado solo en la app o también en la web o cajeros?", esperaRespuesta: true, campoQueRecopila: "Canales afectados" },
    { rol: "agente", texto: "Estamos registrando múltiples reportes similares en este momento. El equipo técnico ya fue notificado y está trabajando en la solución. Actualizaremos el estado en la app. Lamentamos los inconvenientes.", esperaRespuesta: false, esEscalado: true, esResolucion: true },
  ]},

  // ─── ID 13: Tarjeta no visible ─────────────────────────────────────────
  { idIncidencia: 13, turnos: [
    { rol: "agente", texto: "Voy a verificar el estado de tu tarjeta. ¿Es una tarjeta de débito o crédito?", esperaRespuesta: true, campoQueRecopila: "Tipo de tarjeta" },
    { rol: "agente", texto: "¿Desde cuándo dejó de aparecer en la app?", esperaRespuesta: true, campoQueRecopila: "Desde cuándo" },
    { rol: "agente", texto: "¿La tarjeta física la tienes en tu poder y está en buen estado?", esperaRespuesta: true, campoQueRecopila: "Estado físico" },
    { rol: "agente", texto: "Consultando el sistema... La tarjeta figura como activa en nuestra base de datos. El problema es de visualización en la app. Esto puede resolverse cerrando sesión y volviendo a ingresar. ¿Puedes intentarlo?", esperaRespuesta: true, campoQueRecopila: "Resultado" },
    { rol: "agente", texto: "Si sigue sin aparecer tras volver a ingresar, escalo el caso a soporte técnico con todos los datos que me diste. Te notificaremos en máximo 4 horas hábiles.", esperaRespuesta: false, esResolucion: true },
  ]},

  // ─── ID 14: Tarjeta bloqueada / no usable ──────────────────────────────
  { idIncidencia: 14, turnos: [
    { rol: "agente", texto: "Entiendo la situación. ¿El rechazo ocurrió en un comercio físico, en línea o en un cajero automático?", esperaRespuesta: true, campoQueRecopila: "Canal del rechazo" },
    { rol: "agente", texto: "¿Qué mensaje te mostró el terminal o la pantalla al rechazar la tarjeta?", esperaRespuesta: true, campoQueRecopila: "Mensaje de rechazo" },
    { rol: "agente", texto: "¿Realizaste algún cambio reciente en tu cuenta o tarjeta, como actualización de datos o cambio de clave?", esperaRespuesta: true, campoQueRecopila: "Cambios recientes" },
    { rol: "agente", texto: "Revisando el estado de tu tarjeta... Figura como activa sin bloqueo registrado. El rechazo puede deberse a un límite de transacciones o a una validación de seguridad automática. ¿Intentaste usarla en más de un comercio?", esperaRespuesta: true, campoQueRecopila: "Intentos adicionales" },
    { rol: "agente", texto: "Voy a escalar esto a soporte de tarjetas para revisión manual. Mientras tanto, si tienes urgencia, puedes intentar el pago por QR como método alternativo.", esperaRespuesta: false, esResolucion: true },
  ]},

  // ─── ID 15: Consumo no reconocido con tarjeta ──────────────────────────
  { idIncidencia: 15, turnos: [
    { rol: "agente", texto: "Este caso es urgente. ¿En qué fecha aparece el cargo que no reconoces?", esperaRespuesta: true, campoQueRecopila: "Fecha" },
    { rol: "agente", texto: "¿Cuál es el monto y qué comercio o descripción aparece en el movimiento?", esperaRespuesta: true, campoQueRecopila: "Monto y comercio" },
    { rol: "agente", texto: "¿El cargo fue en línea, en un comercio físico o en un cajero?", esperaRespuesta: true, campoQueRecopila: "Canal" },
    { rol: "agente", texto: "¿Tu tarjeta estuvo en tu posesión en todo momento o hubo algún período en que no la tuviste?", esperaRespuesta: true, campoQueRecopila: "Custodia de la tarjeta" },
    { rol: "agente", texto: "Por tu seguridad, aplico el bloqueo preventivo de la tarjeta ahora mismo. Tu caso es escalado al equipo de fraude con prioridad máxima. Un especialista se comunicará contigo en las próximas 2 horas hábiles.", esperaRespuesta: false, esEscalado: true, esResolucion: true },
  ]},
]
