import { Injectable, inject, signal } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { MessageService } from "primeng/api"
import { PedidoService } from "./pedido.service" 

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
    clasificacion: number
    precio: number | string
    imagen: string | null
  }
}

@Injectable({
  providedIn: "root",
})
export class CarritoService {
  private readonly http = inject(HttpClient)
  private readonly toast = inject(MessageService)
  private readonly pedidoService = inject(PedidoService) 
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
    this.http.post(`${this.apiUrl}/${usuarioId}/agregar`, { productoId, cantidad }).subscribe({
      next: () => {
        this.obtenerCarrito(usuarioId)
        this.toast.add({ severity: "success", summary: "Éxito", detail: "Producto agregado al carrito" })
      },
      error: (err) => {
        console.error("[Carrito] Error al agregar producto", err)
        this.toast.add({ severity: "error", summary: "Error", detail: "No se pudo agregar el producto al carrito" })
      },
    })
  }

  quitarProducto(usuarioId: number, productoId: number): void {
    this.http
      .delete(`${this.apiUrl}/${usuarioId}/eliminar`, {
        body: { productoId },
      })
      .subscribe({
        next: () => {
          this.obtenerCarrito(usuarioId)
          this.toast.add({ severity: "success", summary: "Éxito", detail: "Producto eliminado del carrito" })
        },
        error: (err) => {
          console.error("[Carrito] Error al eliminar producto", err)
          this.toast.add({ severity: "error", summary: "Error", detail: "No se pudo eliminar el producto del carrito" })
        },
      })
  }

  cambiarCantidad(usuarioId: number, productoId: number, cantidad: number): void {
    this.http.post(`${this.apiUrl}/${usuarioId}/agregar`, { productoId, cantidad }).subscribe({
      next: () => {
        this.obtenerCarrito(usuarioId)
        this.drawerVisible.set(true)
        this.toast.add({ severity: "success", summary: "Éxito", detail: "Cantidad actualizada" })
      },
      error: (err) => {
        console.error("[Carrito] Error al cambiar cantidad", err)
        this.toast.add({ severity: "error", summary: "Error", detail: "No se pudo actualizar la cantidad" })
      },
    })
  }

  vaciar(usuarioId: number): void {
    this.http.delete(`${this.apiUrl}/${usuarioId}/vaciar`).subscribe({
      next: () => {
        this.obtenerCarrito(usuarioId)
        this.toast.add({ severity: "success", summary: "Éxito", detail: "Carrito vaciado" })
      },
      error: (err) => {
        console.error("[Carrito] Error al vaciar carrito", err)
        this.toast.add({ severity: "error", summary: "Error", detail: "No se pudo vaciar el carrito" })
      },
    })
  }

  
  finalizarCompra(usuarioId: number): void {
    if (this.carrito().length === 0) {
      this.toast.add({ severity: "warn", summary: "Advertencia", detail: "El carrito está vacío." })
      return
    }

    this.pedidoService.crearPedido(usuarioId, this.carrito()).subscribe({
      next: () => {
        this.toast.add({ severity: "success", summary: "Éxito", detail: "Compra finalizada. Tiene un nuevo pedido." })
        this.vaciar(usuarioId) 
        this.cerrarDrawer()
      },
      error: (err) => {
        console.error("[Carrito] Error al finalizar compra:", err)
        this.toast.add({ severity: "error", summary: "Error", detail: "No se pudo finalizar la compra." })
      },
    })
  }
}
