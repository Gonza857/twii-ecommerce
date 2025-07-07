import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductoService } from '../../../../services/producto/producto.service';
import { TableModule } from 'primeng/table';
import { CurrencyPipe, SlicePipe } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  Producto,
} from '../../../../services/producto/interfaces/producto.interface';
import { ModalFormularioComponent } from './componentes/modal-formulario/modal-formulario.component';
import { ModalVerComponent } from './componentes/modal-ver/modal-ver.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-productos',
  imports: [TableModule, CurrencyPipe, DialogModule, ButtonModule, FormsModule, ReactiveFormsModule, SlicePipe, ModalFormularioComponent, ModalVerComponent, ConfirmDialogModule],
  templateUrl: './productos.component.html',
  standalone: true,
  styleUrl: './productos.component.scss',
  providers: [ConfirmationService]
})
export class ProductosComponent implements OnInit {
  protected readonly productoService: ProductoService = inject(ProductoService);
  protected readonly confirmationService: ConfirmationService = inject(ConfirmationService);
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
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar este producto?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      rejectButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.productoService.eliminarProducto(id);
      }
    })
}

}