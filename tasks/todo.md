# TODO — Mejoras de producto IncapacidadIA

## M1 — Landing Page Pública
- [ ] Crear `src/pages/Landing.jsx` (hero + features + planes + CTA + footer)
- [ ] Modificar `src/App.jsx`: ruta `/` → `<Landing>` si `!user`, `/login` para el form
- [ ] Verificar: `/` sin sesión → Landing, `/login` funciona, `/` con sesión → `/dashboard`

## M2 — Evaluación en Lote
- [ ] Crear `routes/lote.py` con `POST /api/v1/evaluar/lote` (CSV → Excel)
- [ ] Registrar router en `main.py`
- [ ] Crear `src/pages/EvaluarLote.jsx` (drag-drop + template + preview + descarga)
- [ ] Añadir ruta `/evaluar/lote` en `App.jsx` + TITLE_MAP
- [ ] Añadir nav item en `Sidebar.jsx`
- [ ] Verificar: CSV 5 filas → Excel 2 sheets; fila inválida → sheet Errores; >500 → 400

## M3 — Mobile Mejorado
- [ ] `Analytics.jsx`: grids responsivos + charts con min-height
- [ ] `Historial.jsx`: `overflow-x-auto` + `hidden sm:table-cell` en columnas secundarias
- [ ] `Reportes.jsx`: `grid-cols-1 md:grid-cols-2`
- [ ] `Comparar.jsx`: `flex-col md:flex-row`
- [ ] `Header.jsx`: search dropdown `w-full sm:w-96` en mobile
- [ ] Verificar: Chrome DevTools 375px → sin scroll horizontal

## M4 — Dark Mode
- [ ] `tailwind.config.js`: añadir `darkMode: 'class'`
- [ ] Crear `src/hooks/useTheme.js`
- [ ] `Header.jsx`: botón Sun/Moon + import useTheme
- [ ] `Layout.jsx`: aplicar clase `dark` en `<html>` según hook
- [ ] Componentes reutilizables: `dark:` classes en Card, Input, StatCard, DataTable
- [ ] Páginas principales: Dashboard, Historial, Alertas, Evaluar
- [ ] Verificar: toggle instantáneo, persiste en reload, legible en dark

## M5 — Onboarding Tour
- [ ] Crear `src/Components/OnboardingTour.jsx` (overlay + tooltip + 5 pasos + dots)
- [ ] Añadir `data-tour` ids en Dashboard.jsx y Header.jsx
- [ ] `Layout.jsx`: renderizar `<OnboardingTour>` si `!localStorage.tour_done`
- [ ] Verificar: sin `tour_done` → tour aparece; "Saltar" → no vuelve
