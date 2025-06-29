import { Component, inject, type OnInit, signal } from "@angular/core"
import { UsuarioService } from "../../../../services/usuario/usuario.service"
import { CommonModule, CurrencyPipe, DatePipe } from "@angular/common"
import { TableModule } from "primeng/table"
import { TagModule } from "primeng/tag"
import { PanelModule } from "primeng/panel"
import { ButtonModule } from "primeng/button"
import { ProgressSpinnerModule } from "primeng/progressspinner"
import {PedidoService} from '../../../../services/pedido/pedido.service';
import {Pedido} from '../../../../services/pedido/interfaces/pedido.interface';
import Decimal from 'decimal.js';

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

  ngOnInit(): void {
    const userId = this.usuarioService.usuario()?.id
    if (userId) {
      this.pedidoService.obtenerPedidosPorUsuario(userId)
    } else {
      this.pedidoService.usuarioSinSesion();
    }
  }

  // @ts-ignore
  protected getSubtototal(cantidad: number, precioUnitario: Decimal): number {
    if (!precioUnitario) return 0
    return precioUnitario.toNumber() * cantidad;
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
}
