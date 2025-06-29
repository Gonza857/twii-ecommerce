import { Component, effect, EventEmitter, inject, input, Input, OnInit, Output, signal } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { Producto, ProductoFormulario } from '../../../../../../services/producto/interfaces/producto.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import ProductoMapper from '../../../../../../services/producto/mapping/producto.mapper';
import { ProductoService, Clasificacion } from '../../../../../../services/producto/producto.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-formulario',
  imports: [
    Dialog,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './modal-formulario.component.html',
  standalone: true,
  styleUrl: './modal-formulario.component.scss'
})
export class ModalFormularioComponent {
  @Input() esModoEdicion = signal(false)
  @Input() displayDialog = signal(false);
  @Input() productoActual = signal<Producto | null>(null);

  private readonly fb: FormBuilder = inject(FormBuilder)
  protected readonly productoService: ProductoService = inject(ProductoService);
  protected form!: FormGroup;
  clasificaciones: Clasificacion[] = [];

  @Output() manejarModalFormulario = new EventEmitter<boolean>();

  ngOnInit() {
    this.productoService.obtenerClasificaciones().subscribe((data) => {
      this.clasificaciones = data;
    });
  }

  constructor() {
    effect(() => {
      if (this.esModoEdicion() && this.productoActual()) {
        const producto = this.productoActual()!;

        this.form.patchValue({
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio: producto.precio,
          imagen: null,
          cambioImagen: false,
          clasificacion: producto.clasificacion.id
        });
      } else {
        this.form = this.fb.group({
          nombre: ["", Validators.required],
          clasificacion: [0, Validators.required],
          precio: [0, Validators.required],
          descripcion: ["", Validators.required],
          imagen: [null, Validators.required],
          cambioImagen: [false]
        });
      }
    });

  }

  manejarModal(estado: boolean) {
    this.manejarModalFormulario.emit(estado);
  }

  enviarProducto() {
    const producto: ProductoFormulario = ProductoMapper.mapProductoFormularioToRest(this.form)
    if (this.esModoEdicion()) {
      this.productoService.actualizarProducto(producto, this.productoActual()!.id).subscribe({
        next: (res: { mensaje: string }) => {
          this.productoService.obtenerProductos()
        },
        error: (e: any) => {
          console.log("[ACTUALIZAR PRODUCTO] error", e)
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

    this.form.reset();
    this.manejarModal(false) // Closes the modal after submission
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    this.form.patchValue({ imagen: file });
    this.form.get('imagen')?.updateValueAndValidity();
  }

  quitarImagen() {
    this.form.get('imagen')?.setValue(null);
    this.form.get('cambioImagen')?.setValue(true);
    // @ts-ignore
    this.productoActual().imagen = null;
  }
}
