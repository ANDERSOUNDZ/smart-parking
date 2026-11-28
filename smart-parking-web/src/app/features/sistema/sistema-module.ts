import { NgModule } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule, Routes } from '@angular/router';
import { SistemaLayout } from './sistema-layout';

const routes: Routes = [
  {
    path: '',
    component: SistemaLayout,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'panel' },
      { path: 'panel', loadChildren: () => import('../panel/panel-module').then((m) => m.PanelModule) },
      { path: 'espacios', loadChildren: () => import('../espacios/espacios-module').then((m) => m.EspaciosModule) },
      { path: '**', redirectTo: 'panel' },
    ],
  },
];

@NgModule({
  declarations: [SistemaLayout],
  imports: [RouterModule.forChild(routes), MatSidenavModule, MatListModule],
})
export class SistemaModule {}
