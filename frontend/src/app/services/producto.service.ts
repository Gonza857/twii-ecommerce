import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  clasificacion: string;
  precio: number;
}

@Injectable({
  providedIn: 'root'
})

export class ProductoService {
  private apiUrl: string = "http://localhost:3000/api/producto";
  private readonly http: HttpClient = inject(HttpClient);

  public obtenerProductos(): Observable<Producto[]> {
      return this.http.get<Producto[]>(`${this.apiUrl}`);
    }
}
