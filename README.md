# Vitalis · Asistente de triaje médico con IA

Aplicación web donde una persona describe sus síntomas en lenguaje natural y recibe un
**reporte orientativo estructurado**: posibles causas, nivel de urgencia,
recomendaciones generales, señales de alarma y preguntas para llevar a la consulta.

> **No es un diagnóstico médico.** La app muestra un disclaimer obligatorio en el hero
> y dentro de cada reporte generado.

## Qué hace

- Formulario de síntomas con selector de severidad, duración, edad y antecedentes.
- Alerta de emergencia inmediata: detecta señales de alarma en el navegador mientras
  la persona escribe, sin esperar la respuesta de la IA.
- Reporte estructurado con urgencia, posibles causas ordenadas por probabilidad,
  recomendaciones, señales de alarma y preguntas para el médico.
- Copiar, descargar o imprimir el reporte para llevarlo a la consulta.
- Historial local con buscador, hasta veinte consultas.
- Límite de ocho consultas por minuto y por IP en el endpoint.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- OpenAI Chat Completions con `response_format: json_schema` (salida estructurada)
- Zod para validar entrada del formulario y salida del modelo
- LocalStorage para el historial de consultas

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # opcional: agregá tu OPENAI_API_KEY
npm run dev
```

Abrí http://localhost:3000.

Otros comandos:

```bash
npm test    # tests con el runner nativo de Node
npm run lint
npm run build
```

Sin `OPENAI_API_KEY` la app corre en **modo demo**: el endpoint devuelve un reporte de
ejemplo para poder navegar toda la interfaz sin consumir API.

## Variables de entorno

| Variable         | Requerida | Descripción                                  |
| ---------------- | --------- | -------------------------------------------- |
| `OPENAI_API_KEY` | No\*      | Sin ella la app responde en modo demo         |
| `OPENAI_MODEL`   | No        | Modelo a usar. Por defecto `gpt-4o-mini`      |

\* Requerida para obtener análisis reales de IA.

## Estructura

```
src/
├── app/
│   ├── api/diagnose/route.ts   # endpoint: valida, llama a la IA, maneja errores
│   ├── layout.tsx
│   ├── page.tsx                # orquesta formulario, reporte, historial
│   └── globals.css             # tema Tailwind v4
├── components/                 # Header, SymptomForm, SeveritySelector, ReportView…
├── hooks/useConsultations.ts   # historial en LocalStorage
└── lib/
    ├── ai.ts                   # cliente OpenAI + errores tipados
    ├── prompt.ts               # system prompt con reglas de seguridad
    ├── red-flags.ts            # detección local de señales de alarma
    ├── rate-limit.ts           # límite por IP
    ├── report-text.ts          # serialización para copiar/descargar
    ├── schema.ts               # esquemas Zod
    ├── mock-report.ts          # reporte de modo demo
    └── types.ts

tests/                          # node --test, sin dependencias externas
```

## Manejo de errores

El endpoint devuelve códigos diferenciados y el cliente los muestra con opción de
reintentar:

- `400` cuerpo no es JSON válido
- `422` datos del formulario inválidos (mensajes por campo)
- `429` límite de consultas alcanzado (con `Retry-After`) o servicio de IA saturado
- `502` respuesta vacía o con formato inesperado del modelo
- `504` timeout de 30 s o fallo de red hacia OpenAI

## Privacidad

Las consultas no se guardan en ningún servidor: el historial vive en el LocalStorage
del navegador. Los síntomas se envían a OpenAI solo para generar el reporte.

## Estado actual

Interfaz completa y flujo end-to-end funcionando en modo demo, con tests y build
verdes. Pendiente: probar con clave real de OpenAI y ajustar el prompt según los
resultados.
