import {Component, Input} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-estadistica',
  imports: [
    NgClass
  ],
  templateUrl: './estadistica.component.html',
  standalone: true,
  styleUrl: './estadistica.component.scss'
})
export class EstadisticaComponent {
  @Input() titulo!: string;
  @Input() valor!: number;
  @Input() badge!: string;
  @Input() claseColor!: string;
}
