# Conectar Power BI con analytics-service

Power BI no lee la base H2 directamente: pide los datos a la API.

## Requisitos
- Power BI Desktop (gratuito, Windows).
- Levantados: eureka-server, espacios-service, reservas-service y analytics-service.

## Pasos
1. Inicio > Obtener datos > Web.
2. URL: `http://localhost:8084/analytics/historial`  (acceso Anónimo).
3. En Power Query: A la tabla > expandir la columna (todos los campos).
4. Cambiar tipos: `fechaHora` = Fecha/hora; `total`, `ocupados`, `disponibles` = Número entero;
   `porcentaje` = Número decimal.
5. Renombrar la consulta a `Ocupacion` y pulsar Cerrar y aplicar.

Columnas útiles (Modelado > Nueva columna):

    Fecha = DATEVALUE(Ocupacion[fechaHora])
    Hora = HOUR(Ocupacion[fechaHora])
    Mes = FORMAT(Ocupacion[fechaHora], "yyyy-MM")

## Medidas (Modelado > Nueva medida)

    Ocupacion promedio = AVERAGE(Ocupacion[porcentaje])
    Ocupacion maxima = MAX(Ocupacion[porcentaje])
    Ocupacion minima = MIN(Ocupacion[porcentaje])
    Registros = COUNTROWS(Ocupacion)

## Gráficas sugeridas
| Gráfica | Eje | Valor |
|---|---|---|
| Líneas: evolución | Fecha | Ocupacion promedio |
| Barras: horas pico | Hora | Ocupacion promedio |
| Columnas: comparación mensual | Mes | Ocupacion promedio |
| Tarjetas | — | las 4 medidas |

## Reservas
Obtener datos > Web: `http://localhost:8083/reservas`. Con `fechaReserva` y `estado` se
puede contar reservas por día, por hora y la proporción de canceladas.

## Actualizar y entregar
Con los servicios encendidos, pulsar **Actualizar**. Guardar el archivo `.pbix`: conserva los
datos de la última carga y puede abrirse sin los servicios.
