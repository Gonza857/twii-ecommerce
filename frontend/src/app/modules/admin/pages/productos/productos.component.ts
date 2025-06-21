import { Component, OnInit } from '@angular/core';
import { Producto, ProductoDTO, ProductoService } from '../../../../services/producto/producto.service';
import { TableModule } from 'primeng/table';
import { CurrencyPipe} from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-productos',
  imports: [TableModule, CurrencyPipe, DialogModule, ButtonModule, FormsModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})
export class ProductosComponent {
    productos: Producto[] = [];

    displayDialog = false;
    esModoEdicion = false;

    productoActual: Producto | ProductoDTO = this.crearProductoVacio();

    //imagenSeleccionada: File | null = null;


    constructor(private productoService: ProductoService){}

    ngOnInit(): void {
    this.productoService.obtenerProductos().subscribe({
      next: (data: Producto[]) => {
        this.productos = data;
      },
      error: (err) => {},
      complete: () => {},
    });
  }

    obtenerProductos(): void {
    this.productoService.obtenerProductos().subscribe({
      next: (data) => this.productos = data,
      error: (err) => console.error('Error al cargar productos:', err)
    });
  }

  /*onImagenSeleccionada(event: Event): void {
  const fileInput = event.target as HTMLInputElement;
  if (fileInput.files && fileInput.files.length > 0) {
    this.imagenSeleccionada = fileInput.files[0];
  }
}*/

  crearProductoVacio(): ProductoDTO {
    return {
      nombre: '',
      descripcion: '',
      clasificacion: '',
      precio: 0,
      imagen: '',
    };
  }

  abrirAgregar(): void {
    this.esModoEdicion = false;
    this.productoActual = this.crearProductoVacio();
    this.displayDialog = true;
  }

  abrirEditar(producto: Producto): void {
    this.esModoEdicion = true;
    this.productoActual = { ...producto }; // copia segura
    this.displayDialog = true;
  }

  guardarProducto(): void {
    if (this.esModoEdicion) {
      const productoEditado = this.productoActual as Producto;
      this.productoService.actualizarProducto(productoEditado).subscribe(() => {
        this.obtenerProductos();
        this.displayDialog = false;
      });
    } else {
      const { id, ...productoParaCrear } = this.productoActual as Producto;
      this.productoService.crearProducto(productoParaCrear).subscribe(() => {
        this.obtenerProductos();
        this.displayDialog = false;
      });
    }
  }

  eliminarProducto(id: number): void {
    if (confirm('¿Eliminar este producto?')) {
      this.productoService.eliminarProducto(id).subscribe(() => this.obtenerProductos());
    }
  }
}
