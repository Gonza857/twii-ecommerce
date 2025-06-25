import {Component, EventEmitter, Input, Output, signal} from '@angular/core';
import {Producto} from '../../../../../../services/producto/interfaces/producto.interface';
import {Dialog} from 'primeng/dialog';

@Component({
  selector: 'app-modal-ver',
  imports: [
    Dialog
  ],
  templateUrl: './modal-ver.component.html',
  standalone: true,
  styleUrl: './modal-ver.component.scss'
})
export class ModalVerComponent {
  @Input() productoActual = signal<Producto | null>(null);
  @Input() displayDialog = signal(false);

  @Output() manejarModalFormulario = new EventEmitter<boolean>();

  manejarModal(estado: boolean) {
    this.manejarModalFormulario.emit(estado);
  }
}
