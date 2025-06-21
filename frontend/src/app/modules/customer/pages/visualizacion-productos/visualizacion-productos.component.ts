import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Producto,
  ProductoService,
} from '../../../../services/producto.service';
import { UsuarioService } from '../../../../services/usuario.service';
import { CarritoService, ItemCarrito } from '../../../../services/carrito.service';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';

@Component({
  standalone: true,
  selector: 'app-lista-productos',
  imports: [CommonModule, FormsModule, ButtonModule, SelectModule],
  templateUrl: './visualizacion-productos.component.html',
  styleUrls: ['./visualizacion-productos.component.scss'],
})
export class ListaProductosComponent implements OnInit {
  productos: Producto[] = [];
  clasificacionSeleccionada: string = '';
  precioMin: number | null = null;
  precioMax: number | null = null;
  errorPrecio: string = '';
  usuarioId?: number;
  usuarioLogueado = false;
  carrito!: Signal<ItemCarrito[]>;
  opcionesCantidad = Array.from({ length: 10 }, (_, i) => ({
    label: `${i + 1}`,
    value: i + 1
  }));

  constructor(private productoService: ProductoService,
              private carritoService: CarritoService,
              private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.usuarioService.obtenerUsuarioActual().subscribe({
      next: (usuario) => {
        this.usuarioId = usuario?.id;
        this.usuarioLogueado = !!usuario?.id;
      },
      error: () => {
        this.usuarioLogueado = false;
      }
    });

    const filtrosGuardados = localStorage.getItem('filtrosProductos');

    if (filtrosGuardados) {
      const filtros = JSON.parse(filtrosGuardados);

      this.clasificacionSeleccionada = filtros.clasificacion || '';
      this.precioMin = filtros.precioMin ?? null;
      this.precioMax = filtros.precioMax ?? null;

      this.productoService.obtenerFiltrados(filtros).subscribe((data) => {
        this.productos = data;
      });
    } else {
      this.productoService.obtenerProductos().subscribe((data) => {
        this.productos = data;
      });
    }

    this.carrito = this.carritoService.carrito;

  }

  filtrarPorClasificacion(clasificacion: string): void {
    this.clasificacionSeleccionada = clasificacion;
    this.actualizarProductos();
  }

  aplicarFiltroPrecio(): void {
    this.errorPrecio = '';

    if (this.precioMin == null || this.precioMax == null) {
      this.errorPrecio = 'Debes ingresar ambos precios.';
      return;
    }

    if (this.precioMin > this.precioMax) {
      this.errorPrecio = 'El precio mínimo no puede ser mayor que el máximo.';
      return;
    }

    if (this.precioMin < 0 || this.precioMax < 0) {
      this.errorPrecio = 'Los precios no pueden ser negativos.';
      return;
    }

    this.actualizarProductos();
  }

  actualizarProductos(): void {
    const filtros: any = {};

    if (this.clasificacionSeleccionada) {
      filtros.clasificacion = this.clasificacionSeleccionada;
    }

    if (this.precioMin !== null) {
      filtros.precioMin = this.precioMin;
    }

    if (this.precioMax !== null) {
      filtros.precioMax = this.precioMax;
    }

    localStorage.setItem('filtrosProductos', JSON.stringify(filtros));

    this.productoService.obtenerFiltrados(filtros).subscribe((data) => {
      this.productos = data;
    });
  }

  limpiarFiltro(): void {
    this.clasificacionSeleccionada = '';
    this.precioMin = null;
    this.precioMax = null;

    localStorage.removeItem('filtrosProductos');

    this.actualizarProductos();
  }

  agregarAlCarrito(producto: Producto): void {
    if (!this.usuarioLogueado || !this.usuarioId) return;

    this.carritoService.agregarProducto(this.usuarioId, producto.id, 1);
    this.carritoService.abrirDrawer();
  }

  getItemCarrito(productoId: number): ItemCarrito | undefined {
    return this.carrito().find(item => item.productoid === productoId);
  }

  cambiarCantidad(item: ItemCarrito) {
    this.carritoService.cambiarCantidad(this.usuarioId!, item.productoid, item.cantidad);
  }

  eliminarProducto(item: ItemCarrito): void {
    if (!this.usuarioId) return;
    this.carritoService.quitarProducto(this.usuarioId, item.productoid);
  }


}
