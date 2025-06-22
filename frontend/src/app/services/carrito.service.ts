import { Injectable, inject, signal } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { PedidoService } from "./pedido/pedido.service"
import { Router } from "@angular/router"

interface CarritoResponse {
  productos: ItemCarrito[]
  total: number
}

export interface ItemCarrito {
  id: number
  cantidad: number
  carritoid: number
  productoid: number
  producto: {
    id: number
    nombre: string
    descripcion: string
    clasificacion: string
    precio: number | string
    imagen: string | null
  }
}

@Injectable({
  providedIn: "root",
})
export class CarritoService {
  private readonly http = inject(HttpClient)
  private readonly pedidoService = inject(PedidoService)
  private readonly router = inject(Router)
  private apiUrl = "http://localhost:3000/api/carrito"

  private carritoSignal = signal<ItemCarrito[]>([])
  public readonly carrito = this.carritoSignal.asReadonly()
  private totalSignal = signal<number>(0)
  public readonly total = this.totalSignal.asReadonly()
  drawerVisible = signal(false)

  abrirDrawer(): void {
    this.drawerVisible.set(true)
  }

  cerrarDrawer() {
    this.drawerVisible.set(false)
  }

  obtenerCarrito(usuarioId: number): void {
    this.http.get<CarritoResponse>(`${this.apiUrl}/${usuarioId}`).subscribe({
      next: (data) => {
        this.carritoSignal.set(data.productos)
        this.totalSignal.set(data.total)
      },
      error: (err) => console.error("[Carrito] Error al obtener:", err),
    })
  }

  agregarProducto(usuarioId: number, productoId: number, cantidad = 1): void {
    this.http
      .post(`${this.apiUrl}/${usuarioId}/agregar`, { productoId, cantidad })
      .subscribe(() => this.obtenerCarrito(usuarioId))
  }

  quitarProducto(usuarioId: number, productoId: number): void {
    this.http
      .delete(`${this.apiUrl}/${usuarioId}/eliminar`, {
        body: { productoId },
      })
      .subscribe({
        next: () => this.obtenerCarrito(usuarioId),
        error: (err) => console.error("[Carrito] Error al eliminar producto", err),
      })
  }

  cambiarCantidad(usuarioId: number, productoId: number, cantidad: number): void {
    this.http.post(`${this.apiUrl}/${usuarioId}/agregar`, { productoId, cantidad }).subscribe(() => {
      this.obtenerCarrito(usuarioId)
      this.drawerVisible.set(true)
    })
  }

  vaciar(usuarioId: number): void {
    this.http.delete(`${this.apiUrl}/${usuarioId}/vaciar`).subscribe(() => this.obtenerCarrito(usuarioId))
  }

  finalizarCompra(usuarioId: number): Promise<number> {
    return new Promise((resolve, reject) => {
      const productosCarrito = this.carritoSignal()

      if (productosCarrito.length === 0) {
        reject(new Error("El carrito está vacío"))
        return
      }

      // Convertir productos del carrito al formato requerido para el pedido
      const productosParaPedido = productosCarrito.map((item) => ({
        productoid: item.productoid,
        cantidad: item.cantidad,
        precio_unitario: Number(item.producto.precio),
      }))

      const pedidoRequest = {
        usuarioId: usuarioId,
        productos: productosParaPedido,
      }

      console.log("[DEBUG] Creando pedido:", pedidoRequest)

      this.pedidoService.crearPedido(pedidoRequest).subscribe({
        next: (response) => {
          console.log("[DEBUG] Pedido creado exitosamente:", response)
          // Vaciar el carrito después de crear el pedido
          this.vaciar(usuarioId)
          // Cerrar el drawer
          this.cerrarDrawer()
          resolve(response.id)
        },
        error: (error) => {
          console.error("[ERROR] Error al crear pedido:", error)
          reject(error)
        },
      })
    })
  }
}
