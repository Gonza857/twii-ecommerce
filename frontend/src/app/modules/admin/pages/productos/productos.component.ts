import {Component, effect, inject, OnInit} from '@angular/core';
import {ProductoDTO, ProductoService} from '../../../../services/producto/producto.service';
import {TableModule} from 'primeng/table';
import {CurrencyPipe} from '@angular/common';
import {DialogModule} from 'primeng/dialog';
import {ButtonModule} from 'primeng/button';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {
  Producto,
  ProductoFormulario
} from '../../../../services/producto/interfaces/producto.interface';
import ProductoMapper from '../../../../services/producto/mapping/producto.mapper';

@Component({
  selector: 'app-productos',
  imports: [TableModule, CurrencyPipe, DialogModule, ButtonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './productos.component.html',
  standalone: true,
  styleUrl: './productos.component.scss'
})
export class ProductosComponent implements OnInit {
  protected readonly productoService: ProductoService = inject(ProductoService);
  productos: Producto[] = []

  displayDialog = false;
  esModoEdicion = false;

  protected productoActual!: Producto;

  private readonly fb: FormBuilder = inject(FormBuilder)
  protected form!: FormGroup;
  modo: 'crear' | 'editar' = 'crear';

  //imagenSeleccionada: File | null = null;


  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ["", Validators.required],
      clasificacion: ["", Validators.required],
      precio: [0, Validators.required],
      descripcion: ["", Validators.required],
      imagen: [null, Validators.required],
      cambioImagen: [false]
    });

    this.productoService.obtenerProductos()
  }

  /*onImagenSeleccionada(event: Event): void {
  const fileInput = event.target as HTMLInputElement;
  if (fileInput.files && fileInput.files.length > 0) {
    this.imagenSeleccionada = fileInput.files[0];
  }
  }*/

  abrirAgregar(): void {
    this.esModoEdicion = false;
    this.displayDialog = true;
  }

  abrirEditar(producto: Producto): void {
    this.esModoEdicion = true;
    this.productoActual = {...producto}; // copia segura

    this.form.patchValue({
      nombre: producto.nombre,
      clasificacion: producto.clasificacion,
      descripcion: producto.descripcion,
      precio: producto.precio,
      imagen: producto.imagen, // No cargás archivo anterior
      cambioImagen: false
    });

    this.displayDialog = true;

  }

  // guardarProducto(): void {
  //   if (this.esModoEdicion
  //   ) {
  //     const productoEditado = this.productoActual as Producto;
  //     this.productoService.actualizarProducto(productoEditado).subscribe(() => {
  //       // this.obtenerProductos();
  //       this.displayDialog = false;
  //     });
  //   } else {
  //
  //     const {id, ...productoParaCrear} = this.productoActual as Producto;
  //     productoParaCrear.precio = new Decimal(productoParaCrear.precio)
  //     this.productoService.crearProducto(productoParaCrear).subscribe(() => {
  //       // this.obtenerProductos();
  //       this.displayDialog = false;
  //     });
  //   }
  // }

// Capturamos el archivo y lo ponemos en el form control 'imagen'
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    this.form.patchValue({imagen: file});
    // Opcional: para que Angular reconozca el cambio
    this.form.get('imagen')?.updateValueAndValidity();
  }

  quitarImagen() {
    this.form.get('imagen')?.setValue(null);
    this.form.get('cambioImagen')?.setValue(true);
    this.productoActual.imagen = null;
  }

  enviarProducto() {
    const producto: ProductoFormulario = ProductoMapper.mapProductoFormularioToRest(this.form)
    if (this.esModoEdicion) {
      this.productoService.actualizarProducto(producto, this.productoActual.id).subscribe({
        next: (res: {mensaje: string}) => {
            this.productoService.obtenerProductos()
        },
        error: (e: any) => {

        }
      });
    } else {
      this.productoService.crearProducto(producto).subscribe({
        next: () => {
          this.productoService.obtenerProductos()
        },
        error: (e: any) => {
          console.log("[SUBIR PRODUCTO] error", e)
        }
      });
    }

    this.displayDialog = false;
  }

  eliminarProducto(id: number): void {
    if (confirm('¿Eliminar este producto?')
    ) {
      this.productoService.eliminarProducto(id);
    }
  }
}
