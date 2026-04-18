# Plan de mejoras de producto — IncapacidadIA

**Fecha:** 2026-04-18  
**Orden:** mayor a menor impacto comercial  
**Stack:** FastAPI backend · React 19 + Vite + Tailwind CSS frontend

---

## MEJORA 1 — Landing Page Pública

**Impacto:** Alto — primera impresión ante EPS/ARL, hoy `/` muestra Login directamente.

### Archivos a crear/modificar
| Archivo | Acción |
|---------|--------|
| `src/pages/Landing.jsx` | CREAR — página completa de ventas |
| `src/App.jsx` | MODIFICAR — ruta `/` cuando `!user` → `<Landing>` en vez de `<Login>` |

### Diseño técnico
- Ruta pública `/` → `<Landing />` si no hay sesión; si hay sesión → `<Navigate to="/dashboard" />`
- Login sigue en `/login`
- Secciones en Landing:
  1. **Hero**: logo, tagline "IncapacidadIA — Motor de decisión clínica para EPS, ARL y empleadores", CTA primario "Solicitar demo" (→ mailto o formulario) + secundario "Iniciar sesión"
  2. **Problema/Solución**: 3 cards con íconos (tiempo perdido → automatización, errores → IA causal, papel → digital)
  3. **Features**: grid 6 items (Evaluación causal, Alertas proactivas, RAG Legal, Multi-tenant, Historial inmutable, Export Excel/PDF)
  4. **Planes**: 3 tiers en cards (Básico/Profesional/Enterprise) con precios placeholder y lista de features
  5. **CTA final**: banner brand con botón "Contactar" → mailto:rafamaza56@gmail.com
  6. **Footer**: link a /politica-tratamiento, copyright
- Sin dependencias externas — solo Tailwind + Lucide icons ya instalados
- Responsive: stack en móvil, grid en desktop

### Criterio de aceptación
- `GET /` sin sesión → muestra Landing (no Login)
- `GET /login` sigue funcionando
- `GET /` con sesión → redirige a `/dashboard`
- Botón "Iniciar sesión" navega a `/login`
- Página renderiza sin errores en mobile (320px) y desktop (1440px)

---

## MEJORA 2 — Evaluación en Lote

**Impacto:** Alto — ARL con cientos de casos necesitan procesar en bulk, no uno a uno.

### Archivos a crear/modificar
| Archivo | Acción |
|---------|--------|
| `routes/lote.py` | CREAR — endpoint POST /api/v1/evaluar/lote |
| `main.py` | MODIFICAR — include_router lote_router |
| `src/pages/EvaluarLote.jsx` | CREAR — UI upload CSV + resultados |
| `src/App.jsx` | MODIFICAR — ruta `/evaluar/lote`, import, TITLE_MAP |
| `src/Components/Sidebar.jsx` | MODIFICAR — nav item "Evaluación en lote" bajo Evaluar |

### Diseño técnico — Backend
```
POST /api/v1/evaluar/lote
  Content-Type: multipart/form-data
  Body: file (CSV)
  Auth: Bearer token, permiso "evaluar"

CSV columns requeridas:
  id_caso, edad, dias_incapacidad_acumulados, porcentaje_pcl,
  tipo_enfermedad, en_tratamiento_activo, pronostico_medico,
  comorbilidades, requiere_reubicacion_laboral

CSV columns opcionales:
  notas_adicionales, codigo_cie10, oficio

Proceso:
  1. Parsear CSV con pandas (max 500 filas, rechazar si excede)
  2. Para cada fila: construir CasoPaciente, llamar evaluar_caso_completo()
  3. guardar_en_db() para cada caso evaluado
  4. Construir DataFrame resultado con columnas:
     id_caso, nivel_riesgo, score_riesgo, recomendacion, factores (join con ;)
  5. Retornar Excel (openpyxl) con 2 sheets:
     - "Resultados": todos los casos con colores por nivel_riesgo
     - "Errores": filas que fallaron con motivo
  Response: StreamingResponse con Content-Type application/xlsx
```

### Diseño técnico — Frontend
- Página `/evaluar/lote` con permiso `evaluar`
- **Zona 1 — Upload**: drag & drop + click, acepta solo `.csv`, muestra nombre + tamaño, botón eliminar
- **Zona 2 — Template**: botón "Descargar plantilla CSV" → genera CSV vacío con headers correctos
- **Zona 3 — Proceso**: botón "Evaluar lote" → POST multipart → spinner con mensaje "Procesando N casos..."
- **Zona 4 — Resultado**: tabla preview (primeras 10 filas) + badge resumen (N evaluados, N errores) + botón "Descargar Excel completo"
- Máximo 500 casos — validación en frontend antes de enviar

### Criterio de aceptación
- CSV con 5 casos válidos → responde Excel con sheet "Resultados" con 5 filas
- CSV con fila inválida (edad fuera de rango) → aparece en sheet "Errores", no rompe el batch
- CSV con 501 filas → error 400 "Máximo 500 casos por lote"
- Botón "Descargar plantilla" genera CSV con headers correctos y 1 fila de ejemplo

---

## MEJORA 3 — Mobile Mejorado

**Impacto:** Medio-Alto — médicos y supervisores revisan desde celular.

### Archivos a modificar
| Archivo | Problema | Fix |
|---------|----------|-----|
| `src/pages/Analytics.jsx` | Charts sin altura mínima en mobile, grids 4-col colapsan mal | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`, charts con `min-h-[200px]` |
| `src/pages/Historial.jsx` | Tabla sin `overflow-x-auto`, columnas no priorizadas | Wrap en `overflow-x-auto`, ocultar columnas secundarias en mobile con `hidden sm:table-cell` |
| `src/pages/Reportes.jsx` | Cards side-by-side en mobile | `grid-cols-1 md:grid-cols-2` |
| `src/pages/Comparar.jsx` | Formularios side-by-side → overflow | `flex-col md:flex-row` |
| `src/pages/EvaluarPaciente.jsx` | Wizard desborda en 320px | Padding reducido en mobile, slider labels visibles |
| `src/Components/Header.jsx` | Search dropdown muy ancho en mobile | `w-full sm:w-96` con `left-0` en mobile |

### Criterio de aceptación
- Todas las páginas renderizables en viewport 375px sin scroll horizontal
- Tablas en Historial son scrollables horizontalmente en mobile
- Charts en Analytics muestran con altura mínima de 200px
- Probar en Chrome DevTools → iPhone SE (375px)

---

## MEJORA 4 — Dark Mode

**Impacto:** Medio — uso nocturno, percepción de calidad del producto.

### Archivos a crear/modificar
| Archivo | Acción |
|---------|--------|
| `tailwind.config.js` | MODIFICAR — añadir `darkMode: 'class'` |
| `src/hooks/useTheme.js` | CREAR — hook toggle dark/light, persiste en localStorage |
| `src/Components/Header.jsx` | MODIFICAR — botón Sun/Moon toggle |
| `src/Components/Layout.jsx` | MODIFICAR — aplica clase `dark` en `<html>` |
| `src/index.css` | MODIFICAR — variables CSS para dark (bg, text, border) |
| Páginas principales | MODIFICAR — añadir `dark:` classes a cards, tables, inputs |

### Diseño técnico
```js
// useTheme.js
export function useTheme() {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])
  return { dark, toggle: () => setDark(d => !d) }
}
```

Paleta dark:
- Fondo página: `bg-gray-950` 
- Cards: `bg-gray-900 border-gray-800`
- Texto principal: `text-gray-100`
- Texto secundario: `text-gray-400`
- Sidebar: ya es dark (`#0f172a`) — sin cambios
- Brand colors: se mantienen (azul funciona en dark)

Estrategia: añadir `dark:` classes a los componentes reutilizables primero (Card, Input, DataTable, StatCard) — las páginas heredan automáticamente.

### Criterio de aceptación
- Toggle en Header cambia tema instantáneamente sin reload
- Tema persiste al navegar entre páginas y tras recargar
- Dashboard, Historial, Evaluar, Alertas legibles en dark mode
- No hay texto blanco sobre fondo blanco ni negro sobre negro

---

## MEJORA 5 — Onboarding Tour

**Impacto:** Medio — reduce time-to-value para nuevos usuarios de un tenant.

### Archivos a crear/modificar
| Archivo | Acción |
|---------|--------|
| `src/Components/OnboardingTour.jsx` | CREAR — overlay + tooltip posicionado + dots |
| `src/Components/Layout.jsx` | MODIFICAR — renderiza `<OnboardingTour>` si primer login |
| `src/pages/Dashboard.jsx` | MODIFICAR — añade `data-tour="..."` ids a elementos clave |

### Diseño técnico
- Sin librerías externas — overlay semitransparente `fixed inset-0 bg-black/40 z-40`
- Tooltip `fixed z-50` posicionado con `getBoundingClientRect()` del elemento target
- 5 pasos:
  1. **Sidebar** — "Navega entre secciones desde aquí"
  2. **Botón Evaluar** — "Evalúa un caso nuevo en 3 pasos"
  3. **Campana alertas** — "Recibe alertas proactivas de hitos legales"
  4. **Historial** — "Consulta el registro inmutable de evaluaciones"
  5. **Dashboard stats** — "Monitorea KPIs de tu organización"
- `localStorage.getItem('tour_done')` — no muestra si ya completó
- Botones: "Anterior" / "Siguiente" / "Saltar tour" / "Finalizar" en último paso
- Dots de progreso (5 puntos)

### Criterio de aceptación
- Primer login (sin `tour_done` en localStorage) → tour arranca automáticamente
- "Saltar tour" lo cierra y no vuelve a aparecer
- Cada paso resalta visualmente el elemento correcto
- Tour funciona en mobile (tooltip reposicionado si elemento está en bottom nav)

---

## Dependencias entre mejoras

```
Landing  ──────────────────────────────────── independiente
Lote     ── backend (routes/lote.py) → frontend (EvaluarLote.jsx)
Mobile   ──────────────────────────────────── independiente (CSS only)
Dark     ── tailwind.config primero → hook → Header → componentes → páginas
Tour     ── depende de que Layout y Dashboard estén estables (después de Mobile)
```

**Orden de implementación recomendado:** Landing → Lote → Mobile → Dark → Tour

---

## Checkpoints

| Después de | Verificar |
|-----------|-----------|
| Landing | `npm run dev` → `/` sin sesión muestra landing, `/login` funciona |
| Lote backend | `POST /api/v1/evaluar/lote` con CSV de 3 filas → Excel descargable |
| Lote frontend | Upload → preview → descarga en UI |
| Mobile | Chrome DevTools 375px → sin scroll horizontal en las 6 páginas |
| Dark | Toggle cambia tema, recarga mantiene preferencia |
| Tour | Nuevo localStorage (borrar `tour_done`) → tour aparece en Dashboard |
