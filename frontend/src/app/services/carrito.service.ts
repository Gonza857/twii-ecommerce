import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface ItemCarrito {
  productoId: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private readonly http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/carrito';

  private carritoSignal = signal<ItemCarrito[]>([]);
  public readonly carrito = this.carritoSignal.asReadonly();

  public readonly total = computed(() =>
    this.carrito().reduce((acc, item) => acc + item.precio * item.cantidad, 0)
  );

  obtenerCarrito(usuarioId: number): void {
    this.http.get<ItemCarrito[]>(`${this.apiUrl}/${usuarioId}`).subscribe({
      next: (data) => this.carritoSignal.set(data),
      error: (err) => console.error('Error al cargar el carrito', err)
    });
  }

  agregarProducto(usuarioId: number, productoId: number, cantidad: number): void {
    this.http.post(`${this.apiUrl}/${usuarioId}/agregar`, { productoId, cantidad })
      .subscribe(() => this.obtenerCarrito(usuarioId));
  }

  quitarProducto(usuarioId: number, productoId: number): void {
    this.http.post(`${this.apiUrl}/${usuarioId}/eliminar`, { productoId })
      .subscribe(() => this.obtenerCarrito(usuarioId));
  }

  cambiarCantidad(usuarioId: number, productoId: number, cantidad: number): void {
    this.http.put(`${this.apiUrl}/${usuarioId}/cantidad`, { productoId, cantidad })
      .subscribe(() => this.obtenerCarrito(usuarioId));
  }

  vaciar(usuarioId: number): void {
    this.http.delete(`${this.apiUrl}/${usuarioId}/vaciar`)
      .subscribe(() => this.obtenerCarrito(usuarioId));
  }
}
