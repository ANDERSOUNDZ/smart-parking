import { NgModule } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared-module';
import { Espacios } from './espacios/espacios';
import { Panel } from './panel/panel';
import { Sistema } from './sistema/sistema';

const routes: Routes = [
  {
    path: '',
    component: Sistema,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'panel' },
      { path: 'panel', component: Panel },
      { path: 'espacios', component: Espacios },
      { path: '**', redirectTo: 'panel' },
    ],
  },
];

@NgModule({
  declarations: [Sistema, Panel, Espacios],
  imports: [SharedModule, MatSidenavModule, MatListModule, RouterModule.forChild(routes)],
})
export class SistemaModule {}
