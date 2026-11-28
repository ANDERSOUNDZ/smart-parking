---
version: alpha
name: SmartParking Analytics
description: Panel de administración de un estacionamiento construido solo con Angular Material.
colors:
  primary: "#005cbb"
  on-primary: "#ffffff"
  tertiary: "#026e00"
  error: "#ba1a1a"
  surface: "#faf9fd"
  on-surface: "#1a1b1f"
  on-surface-variant: "#44474e"
  surface-container: "#efedf0"
  surface-container-highest: "#e3e2e6"
  secondary-container: "#dae2f9"
  on-secondary-container: "#3e4759"
  outline: "#74777f"
  outline-variant: "#c4c6d0"
typography:
  headline-small:
    fontFamily: Roboto
    fontSize: 1.5rem
    fontWeight: 400
    lineHeight: 2rem
  title-large:
    fontFamily: Roboto
    fontSize: 1.375rem
    fontWeight: 400
    lineHeight: 1.75rem
  body-medium:
    fontFamily: Roboto
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.25rem
  label-large:
    fontFamily: Roboto
    fontSize: 0.875rem
    fontWeight: 500
    lineHeight: 1.25rem
rounded:
  xs: 2px
  sm: 4px
  md: 4px
  lg: 4px
  full: 4px
spacing:
  xs: 8px
  sm: 12px
  md: 16px
  sidenav-width: 200px
  chart-height: 260px
components:
  toolbar:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.title-large}"
  page-title:
    textColor: "{colors.on-surface}"
    typography: "{typography.headline-small}"
  nav-item-active:
    backgroundColor: "{colors.secondary-container}"
    textColor: "{colors.on-secondary-container}"
    rounded: "{rounded.full}"
  card-outlined:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  card-subtitle:
    textColor: "{colors.on-surface-variant}"
    typography: "{typography.body-medium}"
  button-filled:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-large}"
    rounded: "{rounded.full}"
  button-text:
    textColor: "{colors.primary}"
    typography: "{typography.label-large}"
    rounded: "{rounded.full}"
  form-field:
    backgroundColor: "{colors.surface-container-highest}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.xs}"
  state-available:
    textColor: "{colors.tertiary}"
  state-occupied:
    textColor: "{colors.error}"
---

# SmartParking Analytics

## Overview

Aplicación web de escritorio, en español, para administrar un estacionamiento y consultar sus
métricas. La usa una persona administradora. Debe verse como una aplicación estándar de Angular
Material (Material 3, tema claro): sobria, ordenada y fácil de leer. La información manda sobre
la decoración.

## Colors

- `primary` se usa en acciones, pestaña activa, barra de progreso y series principales.
- `tertiary` indica "Disponible" y `error` indica "Ocupado". Se aplican solo al texto del estado
  y a las series de las gráficas, no como fondo de tarjetas.
- El fondo es `surface`. Las tarjetas no llevan relleno de color: se separan con borde.

## Typography

Solo Roboto, con la escala de Material. Título de página: `headline-small`. Título de tarjeta:
`title-large`. Texto general: `body-medium`. Botones: `label-large`.

## Layout

- Barra superior, debajo las pestañas "Sistema" y "Reportes" alineadas a la izquierda.
- "Sistema" tiene un menú lateral fijo de `sidenav-width` con "Panel" y "Espacios".
- "Reportes" usa todo el ancho, sin menú lateral.
- Cada página tiene margen y separación de `md`. Las acciones en línea se separan con `xs`.
- Las rejillas usan `mat-grid-list`. Las gráficas se ordenan en columnas de 420 px como mínimo.

## Elevation & Depth

Sin sombras decorativas. Tarjetas con apariencia `outlined` (borde `outline-variant`). Solo los
diálogos, menús, calendarios, avisos y globos de ayuda tienen la elevación propia de Material.

## Shapes

Todas las esquinas miden 4 px como máximo, incluidos botones, tarjetas, diálogos y el elemento
activo del menú. No usar formas de píldora ni círculos decorativos.

## Voice & Content Strategy

- Todo en español, con frases cortas.
- Estados: "Disponible", "Ocupado", "CONFIRMADA", "CANCELADA".
- Los espacios se nombran "E-1", "E-2", etcétera.
- Un valor sin datos se muestra como "—". Una sección sin información lo dice con texto.
- Las acciones que cambian datos piden confirmación.

## Components

Usar únicamente componentes estándar de Angular Material con su estructura original:
`mat-toolbar`, `mat-tab-nav-bar`, `mat-sidenav`, `mat-nav-list`, `mat-card`, `mat-grid-list`,
`mat-table`, `mat-paginator`, `mat-form-field` con apariencia `filled`, `mat-select`,
`mat-date-range-picker`, botones de texto, contorno y relleno, `mat-progress-bar`, `mat-dialog`,
`mat-snack-bar` y `mat-tooltip`. Las gráficas son de Chart.js dentro de un `mat-card`.

### Pantalla Panel

1. Título "Panel de administración".
2. Cuatro indicadores: Total de espacios, Disponibles, Ocupados y Reservas confirmadas.
3. Tarjeta "Consulta de disponibilidad": búsqueda por ID, filtro (Todos los espacios,
   Disponibles, Ocupados) y una tarjeta por espacio con su nombre, estado y un solo botón:
   "Reservar" si está disponible o "Liberar" si está ocupado.
4. Tarjeta "Ocupación actual" con barra de progreso y porcentaje.

### Pantalla Espacios

1. Título "Espacios" y botón "Nuevo espacio".
2. Tabla con columnas Espacio, Estado, Reserva activa y Acciones.
3. Acciones: "Reservar" o "Liberar", y "Eliminar" (desactivado si hay reserva activa, con globo
   de ayuda).
4. Paginador de 5, 10 y 25 filas.

### Pantalla Reportes

1. Título "Reportes".
2. Tarjeta de filtros: rango de fechas "Período", "Descargar CSV" e "Imprimir o guardar PDF".
3. Cinco indicadores: Registros analizados, Ocupación promedio, máxima, mínima y Hora de mayor
   ocupación.
4. Gráficas: Evolución de la ocupación (líneas), Espacios ocupados y disponibles (líneas),
   Comparación mensual (barras, con selector de mes) y Ranking de horas pico (barras
   horizontales, 5 horas).
5. Predicción de ocupación: horizonte de 6, 12 o 24 horas, gráfica, ocupación máxima estimada,
   disponibilidad mínima estimada y 3 horas de mayor demanda. Debe aclarar que es una estimación.
6. Reservas del período: total, confirmadas, canceladas, porcentaje de cancelación y reservas
   por hora.

Las gráficas deben verse bien con muy pocos puntos o sin datos.

### Datos disponibles

- Espacio: `id`, `ocupado`.
- Reserva: `id`, `idEspacio`, `fechaReserva`, `estado`.
- Foto de ocupación: `fechaHora`, `total`, `ocupados`, `disponibles`, `porcentaje`.

No existen usuarios, tarifas, ingresos, placas, vehículos, zonas ni pisos.

## Do's and Don'ts

- Usar solo componentes de Angular Material.
- Mostrar solo datos que el sistema entrega.
- Mantener las esquinas en 4 px como máximo.
- No usar íconos, logotipos, emojis, avatares ni ilustraciones. Solo se permiten las flechas y el
  calendario que traen los propios componentes.
- No usar degradados, fondos de color en tarjetas, sombras decorativas ni estilos de plantilla
  genérica.
- No agregar un botón "Actualizar": los datos se actualizan solos.
- No agregar textos como "Sistema conectado" o "Actualizado a las…".
- No inventar métricas, usuarios, precios ni funciones.
