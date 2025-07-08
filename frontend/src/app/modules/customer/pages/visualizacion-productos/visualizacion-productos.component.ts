import { Clasificacion, ClasificacionService } from './../../../../services/clasificacion/clasificacion.service';
import { Component, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimeTemplate } from "primeng/api";
import { CardModule } from "primeng/card";
import { SkeletonModule } from "primeng/skeleton";
import { FiltrosProducto, ProductoService } from '../../../../services/producto/producto.service';
import { Producto } from "../../../../services/producto/interfaces/producto.interface";
import { RouterLink } from "@angular/router";
import { UsuarioService } from '../../../../services/usuario/usuario.service';
import { SelectModule } from 'primeng/select';
import { ButtonDirective } from 'primeng/button';
import {CarritoService} from '../../../../services/carrito/carrito.service';
import { CarritoProducto } from '../../../../services/carrito/interfaces/carrito.interface';
import { FiltroService } from '../../../../services/producto/filtro.service';
import {ProductoComponent} from './producto/producto.component';

@Component({
  standalone: true,
  selector: 'app-lista-productos',
  imports: [CommonModule, FormsModule, CardModule, SkeletonModule, RouterLink, SelectModule, ButtonDirective, ProductoComponent],
  templateUrl: './visualizacion-productos.component.html',
  styleUrls: ['./visualizacion-productos.component.scss'],
})
export class ListaProductosComponent implements OnInit {
  productos: Producto[] = [];
  clasificacionSeleccionada: number | null = null;
  clasificaciones : Clasificacion [] = [];
  precioMin: number | null = null;
  precioMax: number | null = null;
  busquedaNombre: string = '';
  errorPrecio: string = '';
  usuarioId?: number;
  usuarioLogueado: boolean = false;
  carrito!: Signal<CarritoProducto[]>;

  constructor(private productoService: ProductoService,
    private carritoService: CarritoService,
    private usuarioService: UsuarioService,
    private filtroService: FiltroService,
    private clasificacionService : ClasificacionService) { }

  ngOnInit(): void {
    this.usuarioService.obtenerUsuarioActual().subscribe(() => {
      this.usuarioLogueado = this.usuarioService.usuario() != null;
      this.usuarioId = this.usuarioService.usuario()?.id;
    });

    this.clasificacionService.obtenerClasificaciones().subscribe((data) => {
      this.clasificaciones = data;
    });

    this.filtroService.filtrosRemovidos$.subscribe(() => {
    this.limpiarFiltro();
  });

    const filtrosGuardados = localStorage.getItem('filtrosProductos');

    if (filtrosGuardados) {
      const filtros = JSON.parse(filtrosGuardados);

      this.clasificacionSeleccionada = filtros.clasificacion || null;
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

  filtrarPorClasificacion(idClasificacion: number | null): void {
    this.clasificacionSeleccionada = idClasificacion;
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
    const filtros: FiltrosProducto = {};

    if (this.clasificacionSeleccionada !== null && this.clasificacionSeleccionada !== undefined) {
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
    this.productoService.obtenerFiltrados(filtros).subscribe((data: Producto[]) => {
      this.productos = data;
    });
  }

  limpiarFiltro(): void {
    this.clasificacionSeleccionada = null;
    this.precioMin = null;
    this.precioMax = null;
    this.busquedaNombre = '';

    localStorage.removeItem('filtrosProductos');

    this.actualizarProductos();
  }

}
