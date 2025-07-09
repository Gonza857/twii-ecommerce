import { Component, effect, inject, type OnInit } from "@angular/core"
import { CarritoItemComponent } from "../carrito-item/carrito-item.component"
import { RouterModule } from "@angular/router"
import { CommonModule } from "@angular/common"
import { ButtonModule } from "primeng/button"
import { UsuarioService } from "../../../../../services/usuario/usuario.service"
import {CarritoService} from '../../../../../services/carrito/carrito.service';
import { ConfirmationService } from "primeng/api"
import { ConfirmDialogModule } from "primeng/confirmdialog"

@Component({
  selector: "app-carrito-drawer",
  imports: [CommonModule, CarritoItemComponent, RouterModule, ButtonModule, ConfirmDialogModule],
  templateUrl: "./carrito-drawer.component.html",
  standalone: true,
  styleUrl: "./carrito-drawer.component.scss",
})
export class CarritoDrawerComponent implements OnInit {
  private readonly usuarioService = inject(UsuarioService)
  public readonly carritoService = inject(CarritoService)
  private readonly confirmationService = inject(ConfirmationService)

  protected total$ = this.carritoService.total
  protected carrito$ = this.carritoService.carrito

  public usuarioId?: number
  public usuarioLogueado = false

  constructor() {
    effect(() => {
    const usuario = this.usuarioService.usuario();
    this.usuarioLogueado = usuario != null;

      if (usuario?.id) {
        this.usuarioId = usuario.id;
        this.carritoService.obtenerCarrito(usuario.id);
      }
    })
  }

  ngOnInit(): void {
    this.usuarioService.obtenerUsuarioActual().subscribe()
  }

  vaciarCarrito(): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que quieres vaciar el carrito?`,
      header: "Confirmar Cancelación",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sí, vaciar",
      rejectLabel: "No",
      acceptButtonStyleClass: "p-button-danger p-button-sm",
      rejectButtonStyleClass: "p-button-text p-button-sm",
        accept: () => {
          if (this.usuarioId !== undefined) {
            this.carritoService.vaciar(this.usuarioId);
          }
        }
    })
  }

  finalizarCompra(): void {
    if (this.usuarioId) {
      this.carritoService.finalizarCompra(this.usuarioId)
    }
  }
}
