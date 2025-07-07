import {Component, inject, OnInit, signal} from '@angular/core';
import {ProductoService} from '../../../../services/producto/producto.service';
import {TableModule} from 'primeng/table';
import {CurrencyPipe, SlicePipe} from '@angular/common';
import {DialogModule} from 'primeng/dialog';
import {ButtonModule} from 'primeng/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  Producto,
} from '../../../../services/producto/interfaces/producto.interface';
import {ModalFormularioComponent} from './componentes/modal-formulario/modal-formulario.component';
import {ModalVerComponent} from './componentes/modal-ver/modal-ver.component';

@Component({
  selector: 'app-productos',
  imports: [TableModule, CurrencyPipe, DialogModule, ButtonModule, FormsModule, ReactiveFormsModule, SlicePipe, ModalFormularioComponent, ModalVerComponent],
  templateUrl: './productos.component.html',
  standalone: true,
  styleUrl: './productos.component.scss'
})
export class ProductosComponent implements OnInit {
  protected readonly productoService: ProductoService = inject(ProductoService);
  productos: Producto[] = []
  displayDialog = signal(false);
  verModalDetalle = signal(false);
  esModoEdicion = signal(false);
  productoActual = signal<Producto | null>(null)

  ngOnInit(): void {
    this.productoService.obtenerProductos()
  }

  abrirAgregar(): void {
    this.esModoEdicion.set(false)
    this.displayDialog.set(true)
    this.productoActual.set(null)
  }

  abrirVer(producto: Producto): void {
    this.verModalDetalle.set(true)
    this.productoActual.set(producto)
  }

  manejarFormulario(estado: boolean) {
    this.displayDialog.set(estado)
  }

  manejarVer(estado: boolean) {
    this.verModalDetalle.set(estado)
  }

  abrirEditar(producto: Producto): void {
    this.esModoEdicion.set(true)
    this.displayDialog.set(true)
    this.productoActual.set(producto)
  }

  eliminarProducto(id: number): void {
    if (confirm('¿Eliminar este producto?')
    ) {
      this.productoService.eliminarProducto(id);
    }
  }
}
