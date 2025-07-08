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
import { MessageService, ConfirmationService, ConfirmEventType } from "primeng/api" 
import { ConfirmDialogModule } from "primeng/confirmdialog" 

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
    ConfirmDialogModule,
  ],
  templateUrl: "./mis-pedidos.component.html",
  styleUrl: "./mis-pedidos.component.scss",
})
export class MisPedidosComponent implements OnInit {
  protected readonly pedidoService = inject(PedidoService)
  private readonly usuarioService = inject(UsuarioService)
  private readonly toast = inject(MessageService)
  private readonly confirmationService = inject(ConfirmationService) 

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

  
  cancelarPedido(pedido: Pedido): void {
    if (pedido.estado !== "pendiente") {
      this.toast.add({
        severity: "warn",
        summary: "Advertencia",
        detail: 'Solo se pueden cancelar pedidos en estado "pendiente".',
      })
      return
    }

    this.confirmationService.confirm({
      message: `¿Estás seguro de que quieres cancelar el pedido #${pedido.id}? Esta acción no se puede deshacer.`,
      header: "Confirmar Cancelación",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sí, Cancelar",
      rejectLabel: "No",
      acceptButtonStyleClass: "p-button-danger p-button-sm",
      rejectButtonStyleClass: "p-button-text p-button-sm",
      accept: () => {
        this.pedidoService.cancelarPedido(pedido.id).subscribe({
          next: () => {
            this.toast.add({
              severity: "success",
              summary: "Éxito",
              detail: `Pedido #${pedido.id} cancelado exitosamente.`,
            })
            const userId = this.usuarioService.usuario()?.id
            if (userId) {
              this.pedidoService.obtenerPedidosPorUsuario(userId) 
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
      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.toast.add({ severity: "info", summary: "Cancelado", detail: "Has cancelado la operación." })
            break
          case ConfirmEventType.CANCEL:
            this.toast.add({ severity: "info", summary: "Cancelado", detail: "Has cancelado la operación." })
            break
        }
      },
    })
  }

  
  repetirPedido(pedido: Pedido): void {
    const userId = this.usuarioService.usuario()?.id
    if (!userId) {
      this.toast.add({ severity: "error", summary: "Error", detail: "Debes iniciar sesión para repetir un pedido." })
      return
    }

    this.confirmationService.confirm({
      message: `¿Estás seguro de que quieres repetir el pedido #${pedido.id}? Se creará un nuevo pedido con los mismos productos.`,
      header: "Confirmar Repetición de Pedido",
      icon: "pi pi-info-circle",
      acceptLabel: "Sí, Repetir",
      rejectLabel: "No",
      acceptButtonStyleClass: "p-button-info p-button-sm",
      rejectButtonStyleClass: "p-button-text p-button-sm",
      accept: () => {
        this.pedidoService.repetirPedido(pedido.id).subscribe({
          next: () => {
            this.toast.add({
              severity: "success",
              summary: "Éxito",
              detail: `Pedido #${pedido.id} repetido exitosamente. Se ha creado un nuevo pedido.`,
            })
            this.pedidoService.obtenerPedidosPorUsuario(userId)
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
      },
      reject: (type: ConfirmEventType) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.toast.add({ severity: "info", summary: "Cancelado", detail: "Has cancelado la operación." })
            break
          case ConfirmEventType.CANCEL:
            this.toast.add({ severity: "info", summary: "Cancelado", detail: "Has cancelado la operación." })
            break
        }
      },
    })
  }
}
