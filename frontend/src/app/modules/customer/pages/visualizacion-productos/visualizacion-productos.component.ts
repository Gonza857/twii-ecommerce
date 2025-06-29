import { Component, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimeTemplate } from "primeng/api";
import { CardModule } from "primeng/card";
import { SkeletonModule } from "primeng/skeleton";
import { ProductoService } from '../../../../services/producto/producto.service';
import { Producto } from "../../../../services/producto/interfaces/producto.interface";
import { RouterLink } from "@angular/router";
import { UsuarioService } from '../../../../services/usuario/usuario.service';
import { SelectModule } from 'primeng/select';
import { ButtonDirective } from 'primeng/button';
import {CarritoService, ItemCarrito} from '../../../../services/carrito/carrito.service';

@Component({
  standalone: true,
  selector: 'app-lista-productos',
  imports: [CommonModule, FormsModule, PrimeTemplate, CardModule, SkeletonModule, RouterLink, SelectModule, ButtonDirective],
  templateUrl: './visualizacion-productos.component.html',
  styleUrls: ['./visualizacion-productos.component.scss'],
})
export class ListaProductosComponent implements OnInit {
  productos: Producto[] = [];
  clasificacionSeleccionada: string = '';
  precioMin: number | null = null;
  precioMax: number | null = null;
  busquedaNombre: string = '';
  errorPrecio: string = '';
  usuarioId?: number;
  usuarioLogueado: boolean = false;
  carrito!: Signal<ItemCarrito[]>;
  opcionesCantidad = Array.from({ length: 10 }, (_, i) => ({
    label: `${i + 1}`,
    value: i + 1
  }));

  constructor(private productoService: ProductoService,
    private carritoService: CarritoService,
    private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.usuarioService.obtenerUsuarioActual();
    this.usuarioLogueado = this.usuarioService.usuario() != null
    this.usuarioId = this.usuarioService.usuario()?.id

    const filtrosGuardados = localStorage.getItem('filtrosProductos');

    if (filtrosGuardados) {
      const filtros = JSON.parse(filtrosGuardados);

      this.clasificacionSeleccionada = filtros.clasificacion || '';
      this.precioMin = filtros.precioMin ?? null;
      this.precioMax = filtros.precioMax ?? null;
      this.busquedaNombre = filtros.nombre ?? '';
      setTimeout(() => {
        this.productoService.obtenerFiltrados(filtros).subscribe((data: Producto[]) => {
          this.productos = data;
        });
      }, 1000)

    } else {
      setTimeout(() => {
        this.productoService.obtenerProductos()
      }, 1000)
    }

    this.carrito = this.carritoService.carrito;

  }

  buscarPorNombre() {

    this.actualizarProductos();
  }

  filtrarPorClasificacion(clasificacion: string): void {
    this.clasificacionSeleccionada = clasificacion;
    this.actualizarProductos();
  }

  aplicarFiltroPrecio(): void {
    this.errorPrecio = '';

    const min = this.precioMin;
    const max = this.precioMax;


    if (min == null && max == null) {
      this.errorPrecio = 'Debes ingresar al menos un precio.';
      return;
    }


    if ((min != null && min < 0) || (max != null && max < 0)) {
      this.errorPrecio = 'Los precios no pueden ser negativos.';
      return;
    }


    if (min != null && max != null && min > max) {
      this.errorPrecio = 'El precio mínimo no puede ser mayor que el máximo.';
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

    if (this.busquedaNombre && this.busquedaNombre.trim() !== '') {
      filtros.nombre = this.busquedaNombre.trim();
    }

    localStorage.setItem('filtrosProductos', JSON.stringify(filtros));
    this.productoService.obtenerFiltrados(filtros).subscribe((data: any) => {
      this.productos = data;
    });
  }

  limpiarFiltro(): void {
    this.clasificacionSeleccionada = '';
    this.precioMin = null;
    this.precioMax = null;
    this.busquedaNombre = '';

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
