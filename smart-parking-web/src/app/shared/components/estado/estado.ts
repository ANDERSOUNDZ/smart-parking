import { Component, input } from '@angular/core';

@Component({
  selector: 'app-estado',
  standalone: false,
  templateUrl: './estado.html',
})
export class Estado {
  readonly ocupado = input.required<boolean>();
}
