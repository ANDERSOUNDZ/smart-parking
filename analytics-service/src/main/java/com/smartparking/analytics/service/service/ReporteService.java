package com.smartparking.analytics.service.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import com.smartparking.analytics.service.model.Captura;
import com.smartparking.analytics.service.model.Reportes.Comparacion;
import com.smartparking.analytics.service.model.Reportes.HoraPico;
import com.smartparking.analytics.service.model.Reportes.Mes;
import com.smartparking.analytics.service.model.Reportes.Prediccion;
import com.smartparking.analytics.service.model.Reportes.ReservaDTO;
import com.smartparking.analytics.service.model.Reportes.ReservasPorHora;
import com.smartparking.analytics.service.model.Reportes.Resumen;
import com.smartparking.analytics.service.model.Reportes.ResumenReservas;
import com.smartparking.analytics.service.repository.CapturaRepository;

@Service
public class ReporteService {

    private static final int DIAS_PREDICCION = 28;

    private final CapturaRepository repository;
    private final RestTemplate restTemplate;

    public ReporteService(CapturaRepository repository, RestTemplate restTemplate) {
        this.repository = repository;
        this.restTemplate = restTemplate;
    }

    public List<Captura> historial(LocalDate desde, LocalDate hasta) {
        LocalDate inicio = desde != null ? desde : LocalDate.of(2000, 1, 1);
        LocalDate fin = hasta != null ? hasta : LocalDate.now();
        if (inicio.isAfter(fin)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "'desde' es posterior a 'hasta'");
        }
        return repository.findByFechaHoraBetweenOrderByFechaHora(
                inicio.atStartOfDay(), fin.atTime(LocalTime.MAX));
    }

    public Resumen resumen(LocalDate desde, LocalDate hasta) {
        List<Captura> capturas = historial(desde, hasta);
        if (capturas.isEmpty()) {
            return new Resumen(0, 0, 0, 0, null);
        }
        var datos = capturas.stream().mapToDouble(Captura::getPorcentaje).summaryStatistics();
        return new Resumen(capturas.size(),
                redondear(datos.getAverage()), datos.getMax(), datos.getMin(),
                ranking(capturas).get(0).hora());
    }

    public List<HoraPico> horasPico(LocalDate desde, LocalDate hasta) {
        return ranking(historial(desde, hasta));
    }

    public Comparacion comparacion(YearMonth mes) {
        Mes anterior = promedioDelMes(mes.minusMonths(1));
        Mes seleccionado = promedioDelMes(mes);
        Double variacion = anterior.registros() == 0 || seleccionado.registros() == 0
                ? null
                : redondear(seleccionado.promedio() - anterior.promedio());
        return new Comparacion(anterior, seleccionado, variacion);
    }

    public List<Prediccion> prediccion(int horas) {
        if (horas < 1 || horas > 48) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "'horas' debe estar entre 1 y 48");
        }
        List<Captura> capturas = historial(
                LocalDate.now().minusDays(DIAS_PREDICCION), LocalDate.now());
        Map<Integer, List<Captura>> porHora = agruparPorHora(capturas);
        int total = capturas.isEmpty() ? 0 : capturas.get(capturas.size() - 1).getTotal();

        LocalDateTime siguiente = LocalDateTime.now().truncatedTo(ChronoUnit.HOURS).plusHours(1);
        List<Prediccion> resultado = new ArrayList<>();
        for (int i = 0; i < horas; i++) {
            LocalDateTime momento = siguiente.plusHours(i);
            List<Captura> muestras = porHora.getOrDefault(momento.getHour(), List.of());
            Double ocupacion = muestras.isEmpty() ? null : redondear(promedio(muestras));
            Integer disponibles = ocupacion == null
                    ? null
                    : total - (int) Math.round(total * ocupacion / 100);
            resultado.add(new Prediccion(momento, ocupacion, disponibles, muestras.size()));
        }
        return resultado;
    }

    public ResumenReservas reservas(LocalDate desde, LocalDate hasta) {
        ReservaDTO[] respuesta = restTemplate.getForObject(
                "http://reservas-service/reservas", ReservaDTO[].class);
        List<ReservaDTO> reservas = Arrays.stream(respuesta == null ? new ReservaDTO[0] : respuesta)
                .filter(r -> desde == null || !r.fechaReserva().toLocalDate().isBefore(desde))
                .filter(r -> hasta == null || !r.fechaReserva().toLocalDate().isAfter(hasta))
                .toList();
        long confirmadas = reservas.stream().filter(r -> "CONFIRMADA".equals(r.estado())).count();
        long canceladas = reservas.stream().filter(r -> "CANCELADA".equals(r.estado())).count();
        List<ReservasPorHora> porHora = reservas.stream()
                .collect(Collectors.groupingBy(r -> r.fechaReserva().getHour(), TreeMap::new,
                        Collectors.counting()))
                .entrySet().stream()
                .map(e -> new ReservasPorHora(e.getKey(), e.getValue()))
                .toList();
        double tasa = reservas.isEmpty() ? 0 : redondear(canceladas * 100.0 / reservas.size());
        return new ResumenReservas(reservas.size(), confirmadas, canceladas, tasa, porHora);
    }

    private Mes promedioDelMes(YearMonth mes) {
        List<Captura> capturas = historial(mes.atDay(1), mes.atEndOfMonth());
        return new Mes(mes.toString(), redondear(promedio(capturas)), capturas.size());
    }

    private List<HoraPico> ranking(List<Captura> capturas) {
        return agruparPorHora(capturas).entrySet().stream()
                .map(e -> new HoraPico(e.getKey(), redondear(promedio(e.getValue())), e.getValue().size()))
                .sorted(Comparator.comparingDouble(HoraPico::promedio).reversed())
                .toList();
    }

    private Map<Integer, List<Captura>> agruparPorHora(List<Captura> capturas) {
        return capturas.stream().collect(Collectors.groupingBy(c -> c.getFechaHora().getHour()));
    }

    private double promedio(List<Captura> capturas) {
        return capturas.stream().mapToDouble(Captura::getPorcentaje).average().orElse(0);
    }

    private double redondear(double valor) {
        return Math.round(valor * 100) / 100.0;
    }
}
