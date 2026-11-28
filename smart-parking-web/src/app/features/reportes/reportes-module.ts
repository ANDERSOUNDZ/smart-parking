import { NgModule } from '@angular/core';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RouterModule } from '@angular/router';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { SharedModule } from '../../shared/shared-module';
import { ComparacionMensual } from './comparacion-mensual/comparacion-mensual';
import { Grafica } from './grafica/grafica';
import { PrediccionOcupacion } from './prediccion-ocupacion/prediccion-ocupacion';
import { Reportes } from './reportes/reportes';

@NgModule({
  declarations: [Reportes, Grafica, ComparacionMensual, PrediccionOcupacion],
  imports: [
    SharedModule,
    MatDatepickerModule,
    BaseChartDirective,
    RouterModule.forChild([{ path: '', component: Reportes }]),
  ],
  providers: [
    provideCharts(withDefaultRegisterables()),
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'es-EC' },
  ],
})
export class ReportesModule {}
