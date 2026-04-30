# Plan de Remediación — KausalIA

Prioridad: **Frontend primero**. Bugs bloqueantes antes de mejoras visuales.

---

## FASE A — Bugs críticos (implementar de inmediato)

### A1 · Refresh token rotatorio incompleto ✅
**Archivo:** `src/services/authRefresh.js` línea 54-56  
**Problema:** El backend rota el refresh_token en cada /auth/refresh pero el front solo guarda el nuevo access_token. El refresh_token se desincroniza y la sesión muere.  
**Fix:** Guardar `data.refresh_token` si viene en la respuesta.

### A2 · Navegación rota en portal — "Mis documentos" ✅
**Archivos:** `src/Components/PortalLayout.jsx` (línea 12), `src/pages/portal/PortalDashboard.jsx` (línea 119)  
**Problema:** Los links apuntan a `/portal/documentos` pero la única ruta definida es `/portal/documentos/:id_caso`. Resultado: 404 en navegación.  
**Fix:** Crear página `MisDocumentos.jsx` que liste todos los documentos del usuario + agregar ruta `/portal/documentos` en App.jsx.

### A3 · Privacidad de alertas en cliente_final (backend)
**Archivo:** `routes/cliente_final.py` línea 189-218  
**Problema:** `mis-alertas` filtra por `tenant_id + target_rol` pero no por los casos del usuario. Un trabajador ve alertas de otros trabajadores del mismo tenant.  
**Fix:** Obtener primero los `case_id` del usuario, luego filtrar `Alerta.case_id.in_(case_ids)`.

### A4 · Query mis-casos insegura en PostgreSQL
**Archivo:** `routes/cliente_final.py` línea 109  
**Problema:** `.distinct(CasoEvaluado.id_caso)` en PostgreSQL requiere que el campo de ORDER BY esté en SELECT, causa error en prod.  
**Fix:** Usar subquery con `max(version_number)` por `id_caso` y luego JOIN.

---

## FASE B — App interna: experiencia premium

### B1 · Transiciones de ruta
- Añadir `framer-motion` o CSS transitions en `<Suspense>` wrapper
- Page enter: slide-up + fade (200ms) consistente en todos los módulos
- Evitar flash blanco al navegar entre rutas

### B2 · Skeletons con estructura real
- Reemplazar spinner genérico por skeletons que imiten el layout exacto de cada pantalla
- Prioridad: Dashboard, Historial, CasoDetalle, Portal pages

### B3 · Motion por intención (feedback de acciones)
- Guardar / evaluar: spinner inline + éxito con checkmark animado
- Generar documento: progress con pasos (verificando elegibilidad → generando → listo)
- Aprobar / rechazar: micro-feedback inmediato sin full-page reload

### B4 · Unificación visual de superficies
- Auditar padding/gap/border-radius en cards de app interna vs portal
- Extraer componentes reutilizables: `<Card>`, `<Section>`, `<EmptyState>`, `<ErrorState>`
- Alinear espaciado con escala de 4/8/16/24/32px

### B5 · Estados vacíos y errores editoriales
- Cada pantalla tiene su ilustración/copy específico (no spinner genérico)
- Empty: copy motivacional + CTA concreto
- Error: mensaje humano + botón de reintentar + fallback

---

## FASE C — Landing: diseño WOW

### C1 · Separar Landing en componentes
- `LandingHero.jsx` — hero 2 columnas: mensaje + mock animado
- `LandingProof.jsx` — logos de clientes, métricas duras (tiempo, % reducción, ROI)
- `LandingTour.jsx` — product tour interactivo con tabs/pasos
- `LandingPortalPreview.jsx` — preview del portal de trabajador
- `LandingPricing.jsx` — planes
- `LandingCTA.jsx` — CTA final
- `Landing.jsx` se convierte en compositor de ~30 líneas

### C2 · Hero 2 columnas con mock animado
- Columna izq: headline agresivo, subtítulo, CTAs, trust badges
- Columna der: browser mockup con UI del producto, animación de "evaluando caso" en loop
- Fondo: gradiente radial con noise texture sutil

### C3 · Proof Stack sobre el fold
- Row de logos (placeholder + real cuando haya)
- 3 métricas duras con counters animados (ej: "87% reducción en tiempos de respuesta")
- 2-3 testimonios cortos con nombre, cargo, empresa

### C4 · Interactive Product Tour
- Tabs o steps: Evaluar → Ver riesgo → Generar documento → Alertas
- Mock UI navegable (estado local, sin backend)
- Animación de transición entre pasos

### C5 · Motion system consistente
- Scroll reveal: `IntersectionObserver` en cada sección (threshold 0.15, stagger 60ms entre items)
- Parallax suave en hero background (5-8px range, no más)
- Stagger en grids de cards/features
- Transiciones de hover uniformes (150ms ease-out)

### C6 · Tipografía de marca
- Añadir `Plus Jakarta Sans` o `Syne` para headings (display font)
- Mantener `Inter` para body
- Escala heading más agresiva: h1 text-5xl/6xl, h2 text-3xl/4xl
- Letter-spacing tight en headings (-0.02em)

### C7 · Before/After visual
- Mini timeline animado: "Antes" (proceso manual) vs "Ahora" (KausalIA)
- 3-4 pasos en cada lado con iconos y tiempos
- Animación de reveal por scroll

---

## FASE D — Gaps funcionales

### D1 · Flujo "Evaluar caso" en portal cliente_final
- El trabajador debería poder ingresar su propio caso (formulario simplificado)
- Backend: endpoint `/api/v1/cliente/evaluar` con permisos limitados
- Frontend: `EvaluarCasoPortal.jsx` con formulario de 5 campos esenciales
- Añadir a nav y rutas del portal

### D2 · Cleanup de lint
- Resolver todos los errores reales de `npm run lint`
- Priorizar: hooks rules violations, unused imports, missing keys
- Meta: 0 errores, warnings solo en casos justificados

---

## Estado actual

| Fase | Estado |
|------|--------|
| A1 — Refresh token | ✅ Implementado |
| A2 — Nav documentos | ✅ Implementado |
| A3 — Privacidad alertas | ✅ Implementado |
| A4 — Query PostgreSQL | ✅ Implementado |
| B1 — Transiciones de ruta portal | ✅ Implementado |
| B2 — Skeletons por pantalla portal | ✅ Implementado |
| B3 — LoadingButton en acciones | ✅ Implementado |
| B4 — Componentes compartidos Card/EmptyState | ✅ Implementado |
| B5 — ErrorState editorial | ✅ Implementado |
| C1 — Componentes landing (Hero/Proof/Tour) | ✅ Implementado |
| C2 — Hero 2 columnas con mock animado | ✅ Implementado |
| C3 — Proof stack métricas + testimonios | ✅ Implementado |
| C4 — Product tour interactivo 4 tabs | ✅ Implementado |
| C5 — useScrollReveal + scroll motion | ✅ Implementado |
| C6 — Plus Jakarta Sans display font | ✅ Implementado |
| C7 — Landing.jsx compositor | ✅ Implementado |
| D1–D2 | ⬜ Pendiente |

---

*Última actualización: 2026-04-30*
