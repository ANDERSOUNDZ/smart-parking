import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared-module';
import { Panel } from './panel';

@NgModule({
  declarations: [Panel],
  imports: [SharedModule, RouterModule.forChild([{ path: '', component: Panel }])],
})
export class PanelModule {}
