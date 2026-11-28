import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'sistema' },
  {
    path: 'sistema',
    loadChildren: () => import('./features/sistema/sistema-module').then((m) => m.SistemaModule),
  },
  {
    path: 'reportes',
    loadChildren: () => import('./features/reportes/reportes-module').then((m) => m.ReportesModule),
  },
  { path: '**', redirectTo: 'sistema' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
