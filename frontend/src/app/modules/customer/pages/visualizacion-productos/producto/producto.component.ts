import {Component, inject, Input} from '@angular/core';
import {Producto} from '../../../../../services/producto/interfaces/producto.interface';
import {RouterLink} from '@angular/router';
import {Card, CardModule} from 'primeng/card';
import {CarritoService} from '../../../../../services/carrito/carrito.service';
import {CarritoProducto} from '../../../../../services/carrito/interfaces/carrito.interface';
import {Select, SelectModule} from 'primeng/select';
import {CurrencyPipe, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ButtonDirective, ButtonModule} from 'primeng/button';

@Component({
  selector: 'app-producto',
  imports: [
    RouterLink,
    CardModule,
    SelectModule,
    CurrencyPipe,
    FormsModule,
    ButtonModule,
    NgIf
  ],
  templateUrl: './producto.component.html',
  standalone: true,
  styleUrl: './producto.component.scss'
})
export class ProductoComponent {
  protected readonly carritoService: CarritoService = inject(CarritoService)
  @Input() public producto!: Producto;
  @Input() public usuarioId!: number;
  @Input() public usuarioLogueado!: boolean;

  opcionesCantidad = Array.from({ length: 10 }, (_, i) => ({
    label: `${i + 1}`,
    value: i + 1
  }));

  agregarAlCarrito(producto: Producto): void {
    if (!this.usuarioLogueado || !this.usuarioId) return;

    this.carritoService.agregarProducto(this.usuarioId, producto.id, 1);
    this.carritoService.abrirDrawer();
  }

  getItemCarrito(productoId: number): CarritoProducto | undefined {
    return this.carritoService.carrito().find(item => item.productoid === productoId);
  }

  cambiarCantidad(item: CarritoProducto) {
    this.carritoService.cambiarCantidad(this.usuarioId!, item.productoid, item.cantidad);
  }

  eliminarProducto(item: CarritoProducto): void {
    if (!this.usuarioId) return;
    this.carritoService.quitarProducto(this.usuarioId, item.productoid);
  }

}
