import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
<<<<<<< HEAD
import { Observable } from 'rxjs';

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  clasificacion: string;
  precio: number;
  imagen?: string;
}

export interface ProductoDTO {
  nombre: string;
  descripcion: string;
  clasificacion: string;
  precio: number;
  imagen?: string;
}
=======
import {map, Observable} from 'rxjs';
import {Producto} from './interfaces/producto.interface';
import {ProductoRest} from './interfaces/producto.interface.rest';
import ProductoMapper from './mapping/producto.mapper';
>>>>>>> 7ada492a63010938b7e7ce56ceb027e13781b20d

@Injectable({
  providedIn: 'root'
})

export class ProductoService {
  private apiUrl: string = "http://localhost:3000/api/producto";
  private readonly http: HttpClient = inject(HttpClient);

  public obtenerProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}`);
  }

  public obtenerPorId (id: string): Observable<Producto> {
    return this.http.get<ProductoRest>(`${this.apiUrl}/${id}`)
      .pipe(
        map((res) => ProductoMapper.mapToProducto(res))
      );
  }

  public obtenerPorClasificacion(clasificacion: string): Observable<Producto[]> {
    const url = `${this.apiUrl}?clasificacion=${clasificacion}`;
    return this.http.get<Producto[]>(url);
  }

  obtenerPorPrecios(precioMin: number, precioMax: number
  ): Observable<Producto[]> {
    const url = `${this.apiUrl}?precioMin=${precioMin}&precioMax=${precioMax}`;
    return this.http.get<Producto[]>(url);
  }

  obtenerFiltrados(filtros: {
    clasificacion?: string;
    precioMin?: number;
    precioMax?: number;
  }): Observable<Producto[]> {
    const params: string[] = [];

    if (filtros.clasificacion) {
      params.push(`clasificacion=${encodeURIComponent(filtros.clasificacion)}`);
    }
    if (filtros.precioMin !== undefined) {
      params.push(`precioMin=${filtros.precioMin}`);
    }
    if (filtros.precioMax !== undefined) {
      params.push(`precioMax=${filtros.precioMax}`);
    }

    const query = params.length ? `?${params.join('&')}` : '';
    return this.http.get<Producto[]>(`${this.apiUrl}${query}`);
  }

  crearProducto(producto: ProductoDTO): Observable<ProductoDTO> {
    return this.http.post<ProductoDTO>(this.apiUrl, producto);
  }

  actualizarProducto(producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${producto.id}`, producto);
  }

  /*crearProductoConImagen(data: FormData): Observable<Producto> {
  return this.http.post<Producto>(this.apiUrl, data);
  }

  actualizarProductoConImagen(id: number, data: FormData): Observable<Producto> {
  return this.http.put<Producto>(`${this.apiUrl}/${id}`, data);
  }*/

  eliminarProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
