import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {map, Observable} from 'rxjs';
import {Producto} from './interfaces/producto.interface';
import {ProductoRest} from './interfaces/producto.interface.rest';
import ProductoMapper from './mapping/producto.mapper';

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
}
