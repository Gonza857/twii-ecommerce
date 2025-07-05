import { Component, inject, type OnInit } from "@angular/core"
import { UsuarioService } from "../../../../services/usuario/usuario.service"
import { CommonModule, CurrencyPipe, DatePipe } from "@angular/common"
import { TableModule } from "primeng/table"
import { TagModule } from "primeng/tag"
import { PanelModule } from "primeng/panel"
import { ButtonModule } from "primeng/button"
import { ProgressSpinnerModule } from "primeng/progressspinner"
import { PedidoService } from "../../../../services/pedido/pedido.service"
import type { Pedido } from "../../../../services/pedido/interfaces/pedido.interface"
import type Decimal from "decimal.js"
import { MessageService } from "primeng/api" // Import MessageService

@Component({
  selector: "app-mis-pedidos",
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    CurrencyPipe,
    DatePipe,
    PanelModule,
    ButtonModule,
    ProgressSpinnerModule,
  ],
  templateUrl: "./mis-pedidos.component.html",
  styleUrl: "./mis-pedidos.component.scss",
})
export class MisPedidosComponent implements OnInit {
  protected readonly pedidoService = inject(PedidoService)
  private readonly usuarioService = inject(UsuarioService)
  private readonly toast = inject(MessageService) // Inject MessageService

  ngOnInit(): void {
    const userId = this.usuarioService.usuario()?.id
    if (userId) {
      this.pedidoService.obtenerPedidosPorUsuario(userId)
    } else {
      this.pedidoService.usuarioSinSesion()
    }
  }

  // @ts-ignore
  protected getSubtototal(cantidad: number, precioUnitario: Decimal): number {
    if (!precioUnitario) return 0
    return precioUnitario.toNumber() * cantidad
  }

  getSeverity(status: string): string {
    switch (status.toLowerCase()) {
      case "completado":
        return "success"
      case "pendiente":
        return "warning"
      case "cancelado":
        return "danger"
      default:
        return "info"
    }
  }

  // New method to cancel a pending order
  cancelarPedido(pedido: Pedido): void {
    if (pedido.estado !== "pendiente") {
      this.toast.add({
        severity: "warn",
        summary: "Advertencia",
        detail: 'Solo se pueden cancelar pedidos en estado "pendiente".',
      })
      return
    }

    if (confirm(`¿Estás seguro de que quieres cancelar el pedido #${pedido.id}? Esta acción no se puede deshacer.`)) {
      this.pedidoService.cancelarPedido(pedido.id).subscribe({
        next: () => {
          this.toast.add({
            severity: "success",
            summary: "Éxito",
            detail: `Pedido #${pedido.id} cancelado exitosamente.`,
          })
          const userId = this.usuarioService.usuario()?.id
          if (userId) {
            this.pedidoService.obtenerPedidosPorUsuario(userId) // Reload orders
          }
        },
        error: (err) => {
          console.error("Error al cancelar pedido:", err)
          this.toast.add({
            severity: "error",
            summary: "Error",
            detail: err.error?.error || "No se pudo cancelar el pedido.",
          })
        },
      })
    }
  }

  // New method to repeat an order
  repetirPedido(pedido: Pedido): void {
    const userId = this.usuarioService.usuario()?.id
    if (!userId) {
      this.toast.add({ severity: "error", summary: "Error", detail: "Debes iniciar sesión para repetir un pedido." })
      return
    }

    if (
      confirm(
        `¿Estás seguro de que quieres repetir el pedido #${pedido.id}? Se creará un nuevo pedido con los mismos productos.`,
      )
    ) {
      this.pedidoService.repetirPedido(pedido.id).subscribe({
        next: () => {
          this.toast.add({
            severity: "success",
            summary: "Éxito",
            detail: `Pedido #${pedido.id} repetido exitosamente. Se ha creado un nuevo pedido.`,
          })
          this.pedidoService.obtenerPedidosPorUsuario(userId) // Reload orders
        },
        error: (err) => {
          console.error("Error al repetir pedido:", err)
          this.toast.add({
            severity: "error",
            summary: "Error",
            detail: err.error?.error || "No se pudo repetir el pedido.",
          })
        },
      })
    }
  }
}
