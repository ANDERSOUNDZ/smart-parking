import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared-module';
import { ListaEspacios } from './lista-espacios';
import { NuevoEspacioDialog } from './nuevo-espacio-dialog';

@NgModule({
  declarations: [ListaEspacios, NuevoEspacioDialog],
  imports: [SharedModule, RouterModule.forChild([{ path: '', component: ListaEspacios }])],
})
export class EspaciosModule {}
