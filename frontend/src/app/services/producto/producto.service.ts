import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {computed, inject, Injectable, signal} from '@angular/core';
import {catchError, delay, map, Observable, throwError} from 'rxjs';
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

// --- NUEVO: Interfaz para el estado completo del producto ---
export interface ProductoDetailState {
  producto: Producto | null;
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})

export class ProductoService {
  private apiUrl: string = "http://localhost:3000/api/producto";
  private readonly http: HttpClient = inject(HttpClient);

  private productos = signal<Producto[]>([]);
  public readonly signalProductos = this.productos.asReadonly()

  private productoDetalle = signal<Producto | null>(null);
  public readonly signalProductoDetalle = this.productoDetalle.asReadonly()

  // --- NUEVO: Signal principal que contiene el estado completo ---
  private _productoDetalle = signal<ProductoDetailState>({
    producto: null,
    loading: false,
    error: null
  });

  // --- Signals públicos y de solo lectura (computed para conveniencia) ---
  public readonly productoDetalleState = this._productoDetalle.asReadonly();
  public readonly producto = computed(() => this.productoDetalleState().producto);
  public readonly isLoading = computed(() => this.productoDetalleState().loading);
  public readonly error = computed(() => this.productoDetalleState().error);


  constructor() {
    this.obtenerProductos()
  }

  public limpiarProducto () {
    this._productoDetalle.set({
      producto: null,
      loading: false,
      error: null
    })
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

  public obtenerPorId(id: string): void{
    this.http.get<ProductoRest>(`${this.apiUrl}/${id}`)
      .pipe(
        map((res) => ProductoMapper.mapToProducto(res)),
        catchError((e: HttpErrorResponse) => {
          let errorMessage = 'Ocurrió un error desconocido al cargar el producto.';
          if (e.status === 404) {
            errorMessage = `Producto no encontrado.`;
          } else if (e.error && e.error.message) {
            errorMessage = e.error.message;
          } else if (e.message) {
            errorMessage = e.message;
          }
          this._productoDetalle.set({
            producto: null,
            loading: false,
            error: errorMessage
          });
          return throwError(() => new Error(errorMessage));
        })
      )
      .subscribe({
        next: (producto: Producto) => {
          this._productoDetalle.set({
            producto: producto,
            loading: false,
            error: null
          });
        },
        error: (e: any) => {
          console.log("error", e)
        }
      });
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
