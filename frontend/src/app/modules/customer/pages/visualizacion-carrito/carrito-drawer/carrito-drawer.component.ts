import { Component, inject, type OnInit } from "@angular/core"
import { CarritoService } from "../../../../../services/carrito.service"
import { CarritoItemComponent } from "../carrito-item/carrito-item.component"
import { RouterModule, Router } from "@angular/router"
import { CommonModule } from "@angular/common"
import { ButtonModule } from "primeng/button"
import { UsuarioService } from "../../../../../services/usuario/usuario.service"
import { MessageService } from "primeng/api"

@Component({
  selector: "app-carrito-drawer",
  imports: [CommonModule, CarritoItemComponent, RouterModule, ButtonModule],
  templateUrl: "./carrito-drawer.component.html",
  standalone: true,
  styleUrl: "./carrito-drawer.component.scss",
})
export class CarritoDrawerComponent implements OnInit {
  private readonly usuarioService = inject(UsuarioService)
  private readonly messageService = inject(MessageService)
  private readonly router = inject(Router)
  public readonly carritoService = inject(CarritoService)

  protected total$ = this.carritoService.total
  protected carrito$ = this.carritoService.carrito

  public usuarioId?: number
  public usuarioLogueado = false
  public procesandoCompra = false

  ngOnInit(): void {
    this.usuarioService.obtenerUsuarioActual().subscribe({
      next: (usuario) => {
        console.log("[DEBUG] Usuario recibido:", usuario)
        const usuarioId = usuario?.id
        if (usuarioId) {
          this.usuarioId = usuarioId
          this.usuarioLogueado = true
          this.carritoService.obtenerCarrito(usuarioId)
        }
      },
      error: (err) => {
        console.error("[ERROR] al obtener usuario:", err)
        this.usuarioLogueado = false
      },
    })
  }

  vaciarCarrito(): void {
    if (this.usuarioId && confirm("¿Seguro que querés vaciar el carrito?")) {
      this.carritoService.vaciar(this.usuarioId)
    }
  }

  async finalizarCompra(): Promise<void> {
    if (!this.usuarioId) {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Debes iniciar sesión para finalizar la compra",
      })
      return
    }

    if (this.carrito$().length === 0) {
      this.messageService.add({
        severity: "warn",
        summary: "Carrito vacío",
        detail: "No hay productos en el carrito",
      })
      return
    }

    this.procesandoCompra = true

    try {
      const pedidoId = await this.carritoService.finalizarCompra(this.usuarioId)

      this.messageService.add({
        severity: "success",
        summary: "Compra exitosa",
        detail: `Pedido #${pedidoId} creado correctamente`,
      })

      // Redirigir a la página de pedidos después de un breve delay
      setTimeout(() => {
        this.router.navigate(["/pedidos"])
      }, 2000)
    } catch (error: any) {
      console.error("[ERROR] Error al finalizar compra:", error)
      this.messageService.add({
        severity: "error",
        summary: "Error en la compra",
        detail: error.message || "Ocurrió un error al procesar la compra",
      })
    } finally {
      this.procesandoCompra = false
    }
  }
}

