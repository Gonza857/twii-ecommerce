import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Producto, ProductoService} from '../../../../services/producto.service';

@Component({
  standalone: true,
  selector: 'app-lista-productos',
  imports: [CommonModule, FormsModule],
  templateUrl: './visualizacion-productos.component.html',
  styleUrls: ['./visualizacion-productos.component.scss']
})
export class ListaProductosComponent implements OnInit {
  productos: Producto[] = [];
  clasificacionSeleccionada: string = '';
  precioMin: number | null = null;
  precioMax: number | null = null;
  errorPrecio: string = '';

  constructor(private productoService: ProductoService) { }

  ngOnInit(): void {
    const filtrosGuardados = localStorage.getItem('filtrosProductos');

    if (filtrosGuardados) {
      const filtros = JSON.parse(filtrosGuardados);

      this.clasificacionSeleccionada = filtros.clasificacion || '';
      this.precioMin = filtros.precioMin ?? null;
      this.precioMax = filtros.precioMax ?? null;

      this.productoService.obtenerFiltrados(filtros).subscribe((data:any) => {
        this.productos = data;
      });
    } else {
      this.productoService.obtenerProductos().subscribe((data:any) => {
        this.productos = data;
      });
    }
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

    this.productoService.obtenerFiltrados(filtros).subscribe((data: any) => {
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
}
