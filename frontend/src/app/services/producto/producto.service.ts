import {HttpClient} from '@angular/common/http';
import {inject, Injectable, signal} from '@angular/core';
import {map, Observable} from 'rxjs';
import {Producto, ProductoFormulario} from './interfaces/producto.interface';
import {ProductoRest} from './interfaces/producto.interface.rest';
import ProductoMapper from './mapping/producto.mapper';


export interface ProductoDTO {
  nombre: string;
  descripcion: string;
  clasificacion: string;
  precio: number;
  imagen?: string;
}

type ResultadoRequest = {
  mensaje?: string,
  codigo?: number,
  exito?: boolean,
  redireccion?: boolean,
  data?: any,
}

@Injectable({
  providedIn: 'root'
})

export class ProductoService {
  private apiUrl: string = "http://localhost:3000/api/producto";
  private readonly http: HttpClient = inject(HttpClient);
  private productos = signal<Producto[]>([]);
  public readonly signalProductos = this.productos.asReadonly()

  constructor() {
    this.obtenerProductos()
  }

  public obtenerProductos(): void {
    this.http.get<ProductoRest[]>(`${this.apiUrl}`)
      .pipe(
        map((res: ProductoRest[]) => ProductoMapper.mapProductoArrayRestToProductoArray(res))
      )
      .subscribe({
        next: (productos: Producto[]) => {
          this.productos.set(productos);
        },
        error: (e: any) => {
          console.log("ERROR OBTENER PRODUCTOS", e)
        }
      });
  }

  public obtenerPorId(id: string): Observable<Producto> {
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
    nombre?: string;
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
    if(filtros.nombre){
      params.push(`nombre=${encodeURIComponent(filtros.nombre)}`);
    }

    const query = params.length ? `?${params.join('&')}` : '';
    return this.http.get<Producto[]>(`${this.apiUrl}${query}`);
  }

  public crearProducto(producto: ProductoFormulario): Observable<ProductoDTO> {
    const productoFormData = this.crearFormDataProducto(producto);
    return this.http.post<ProductoDTO>(this.apiUrl, productoFormData)
  }

  private crearFormDataProducto = (producto: ProductoFormulario): FormData => {
    const formData = new FormData();

    Object.entries(producto).forEach(([key, value]) => {
      formData.append(key, value);
    });

    return formData;
  }

  public actualizarProducto(producto: ProductoFormulario, id: number): Observable<{ mensaje: string }> {
    const productoFormData = this.crearFormDataProducto(producto);
    return this.http.put<{ mensaje: string }>(`${this.apiUrl}/${id}`, productoFormData)
  }

  eliminarProducto(id: number): void {
    this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.obtenerProductos();
      },
      error: (e: any) => {

      }
    });
  }
}
