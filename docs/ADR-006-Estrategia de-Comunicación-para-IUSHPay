# ADR-006 — Estrategia de Comunicación para IUSHPay
 
| Campo | Detalle |
|---|---|
| **Identificador** | ADR-006 |
| **Título** | Estrategia de comunicación para IUSHPay |
| **Estado** | Aprobado |
| **Versión** | 1.0 |
| **Fecha** | Abril 2026 |
| **Autores** | Equipo de Arquitectura — IUSHPay |
| **Depende de** | ADR-003 — Monolito Modular, ADR-004 — Backend |
 
---
 
## Contexto
 
IUSHPay involucra tres tipos de comunicación que deben ser definidos de forma explícita:
 
- La comunicación entre el **cliente móvil y el backend** (frontend con API)
- La comunicación **interna entre módulos** dentro del monolito
- La comunicación entre el **backend y servicios externos** como la pasarela PSE
Sin una decisión explícita sobre el protocolo, el tipo de interacción (síncrona o asíncrona) y el contrato de intercambio de datos, el equipo tendría que improvisar estas decisiones durante el desarrollo, generando inconsistencias, documentación fragmentada y dificultades de integración.
 
Esta decisión es especialmente relevante porque IUSHPay maneja **tres flujos críticos con requisitos de tiempo muy distintos**:
 
| Flujo | Requisito de tiempo |
|---|---|
| Validación de QR en portería | < 1 segundo |
| Confirmación de pagos PSE (webhook) | Varios minutos |
| Consulta del historial de transacciones | Latencia moderada tolerable |
 
---
 
## Decisión A — Tipo de comunicación: Síncrona y Asíncrona
 
Se adopta una **estrategia mixta** que combina comunicación síncrona para interacciones de tiempo real y asíncrona para eventos que no requieren respuesta inmediata.
 
| Interacción | Tipo | Justificación |
|---|---|---|
| Cliente móvil ↔ API backend | Síncrona (HTTP/REST) | El usuario espera respuesta inmediata. Latencia < 1-3 s según el escenario. |
| Webhook de confirmación PSE | Asíncrona (HTTP entrante) | PSE notifica al backend cuando el pago es aprobado; el cliente no queda bloqueado. |
| Comunicación entre módulos internos | Síncrona (llamada directa en proceso) | Al ser un monolito, los módulos se comunican por llamadas a métodos. Sin latencia de red. |
| Notificaciones al usuario | Asíncrona (cola interna) | El envío de alertas no debe bloquear el flujo principal de pago o acceso. |
| Reintentos ante falla de sincronización | Asíncrona (reintento automático) | Al restaurarse la red, el sistema reintenta la sincronización automáticamente. |
 
---
 
## Decisión B — Tecnología de comunicación: REST con OpenAPI
 
Se adopta **REST sobre HTTP/HTTPS** como protocolo entre el cliente móvil y el backend. El contrato de la API se documenta mediante una especificación **OpenAPI (Swagger)**, que actúa como fuente de verdad para los equipos de frontend y backend.
 
### Tecnologías evaluadas
 
| Tecnología | Ventaja principal | Razón del descarte | Adecuación |
|---|---|---|---|
| **REST + OpenAPI** | Ampliamente conocido, tooling maduro, nativo en ASP.NET Core. | N/A — tecnología seleccionada. | ✅ Alta (seleccionado) |
| GraphQL | El cliente solicita exactamente los campos que necesita. | Complejidad de resolver logic innecesaria para el tamaño del proyecto. | ⚠️ Media — descartado |
| gRPC | Alto rendimiento binario; contratos fuertes con `.proto`. | Sin soporte nativo maduro en React Native. El beneficio no justifica la complejidad. | ❌ Baja — descartado |
| SOAP / WSDL | Contratos estrictos en sistemas legacy. | Sobrecarga XML; incompatible con el ecosistema React Native + ASP.NET Core moderno. | ❌ Muy baja — descartado |
 
---
 
## Decisión C — Contrato de comunicación: OpenAPI
 
El contrato se define mediante una especificación **OpenAPI 3.0** generada automáticamente por ASP.NET Core a través de **Swashbuckle**. Esta especificación es la fuente de verdad para todos los endpoints del sistema.
 
Cada endpoint define:
- Ruta y verbo HTTP
- Parámetros de entrada (path, query, body)
- Esquema del cuerpo de solicitud y respuesta
- Códigos de estado posibles y su significado
- Requisitos de autenticación (JWT Bearer)
### Tipos de contrato por capa
 
| Tipo de contrato | Tecnología | Uso en IUSHPay |
|---|---|---|
| API REST cliente-servidor | OpenAPI 3.0 (Swagger) | Contrato principal entre frontend móvil y backend. Generado con Swashbuckle. |
| Webhooks entrantes de PSE | JSON Schema + validación de firma | PSE envía eventos a `/webhooks/pse`; se valida el schema y la firma digital. |
| Comunicación interna entre módulos | Interfaces C# (contratos en código) | Módulos se comunican mediante interfaces tipadas en la capa Application. |
| Notificaciones asíncronas | DTO interno | El servicio de notificaciones consume DTOs de la capa Shared. Sin contrato externo. |
 
---
 
## Alternativas Descartadas — Comunicación Asíncrona Avanzada
 
Se evaluó la incorporación de un **broker de mensajes** para gestionar la comunicación asíncrona entre módulos.
 
| Alternativa | Ventaja | Razón del descarte |
|---|---|---|
| RabbitMQ / Azure Service Bus | Desacoplamiento total; procesamiento en cola con reintentos automáticos. | Infraestructura innecesaria para un monolito modular donde los módulos ya comparten proceso. |
| Eventos de dominio con MediatR | Desacoplamiento interno sin broker externo; patrón Clean Architecture. | Aumenta la complejidad sin beneficio tangible en el contexto actual. Reservado para versiones futuras. |
| WebSockets para actualizaciones en tiempo real | El cliente recibe actualizaciones de saldo sin polling. | El TTL de 30 s de React Query es suficiente. WebSockets incrementan la complejidad del servidor y del cliente. |
 
---
 
## Buenas Prácticas Aplicadas
 
| Práctica | Aplicación en IUSHPay |
|---|---|
| Contrato como fuente de verdad | OpenAPI generado desde el código (code-first); el contrato siempre refleja el estado real de la API. |
| Idempotencia en webhooks | El endpoint de PSE verifica el ID único de la transacción antes de procesar, previniendo duplicados. |
| Códigos de estado HTTP semánticos | `200` éxito · `201` creación · `400` error de validación · `401` no autenticado · `404` no encontrado. |
| Validación del contrato entrante | Todo payload es validado contra su esquema antes de procesarse. Errores retornan `400` con detalle del campo inválido. |
| Versionado de la API | La API se expone bajo `/api/v1/`. Permite introducir `/api/v2/` sin romper clientes existentes. |
| Comunicación interna tipada | Los módulos nunca comparten tablas de BD directamente; toda comunicación usa interfaces y DTOs de la capa Shared. |
 
---
 
## Consecuencias
 
### Positivas
 
- El contrato OpenAPI permite que el equipo de frontend **genere clientes tipados automáticamente**, reduciendo errores de integración.
- La estrategia mixta síncrona/asíncrona permite **cumplir los requisitos de tiempo de respuesta** de cada escenario sin sobrediseñar la solución.
- REST tiene soporte nativo en **ASP.NET Core y React Native**, reduciendo la curva de aprendizaje.
- La idempotencia en webhooks garantiza que fallos de red de PSE **no generen recargas duplicadas**, cumpliendo el escenario de calidad N3.
### Limitaciones conocidas
 
- REST con polling (React Query TTL 30 s) puede implicar hasta **30 segundos de desfase** en el saldo. Si se requiere actualización instantánea, será necesario evaluar WebSockets en una versión futura.
- La comunicación interna mediante llamadas directas significa que **un fallo en un módulo puede afectar a los que lo consumen** — consecuencia inherente al monolito modular.
- La especificación OpenAPI **debe mantenerse actualizada** con cada cambio de contrato; si el equipo la omite, puede quedar desincronizada con la implementación real.
---
 
## Estado y Vigencia
 
| Estado | Revisado por | Vigencia |
|---|---|---|
| Aprobado | Equipo de Arquitectura | Hasta que el sistema requiera actualizaciones en tiempo real o migración de algún módulo a microservicio |
 
### Momentos de revisión sugeridos
 
- Al definir el contrato de API para el endpoint de **regeneración del código QR**
- Antes de la **integración formal con PSE** en entorno de producción
- Si algún módulo requiere **comunicación en tiempo real** con el cliente
 
