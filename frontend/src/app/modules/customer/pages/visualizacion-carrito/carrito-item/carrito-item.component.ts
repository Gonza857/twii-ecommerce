import { Component, Input } from '@angular/core';
import { CarritoService, ItemCarrito } from '../../../../../services/carrito.service';

@Component({
  selector: 'app-carrito-item',
  imports: [],
  templateUrl: './carrito-item.component.html',
  styleUrl: './carrito-item.component.scss'
})
export class CarritoItemComponent {
  @Input() item!: ItemCarrito;
  @Input() usuarioId!: number;

  constructor(private carritoService: CarritoService) {}

  sumar() {
    this.carritoService.cambiarCantidad(this.usuarioId, this.item.productoId, this.item.cantidad + 1);
  }

  restar() {
    if (this.item.cantidad > 1) {
      this.carritoService.cambiarCantidad(this.usuarioId, this.item.productoId, this.item.cantidad - 1);
    } else {
      this.carritoService.quitarProducto(this.usuarioId, this.item.productoId);
    }
  }

  quitar() {
    this.carritoService.quitarProducto(this.usuarioId, this.item.productoId);
  }
}
