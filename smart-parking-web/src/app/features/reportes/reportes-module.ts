import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared-module';
import { Reportes } from './reportes';

@NgModule({
  declarations: [Reportes],
  imports: [SharedModule, RouterModule.forChild([{ path: '', component: Reportes }])],
})
export class ReportesModule {}
