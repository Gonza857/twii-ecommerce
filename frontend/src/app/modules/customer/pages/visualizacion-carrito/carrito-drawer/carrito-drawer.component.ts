import {Component, effect, inject, OnInit} from '@angular/core';
import { CarritoService } from '../../../../../services/carrito.service';
import { CarritoItemComponent } from '../carrito-item/carrito-item.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import {UsuarioService} from '../../../../../services/usuario/usuario.service';

@Component({
  selector: 'app-carrito-drawer',
  imports: [CommonModule, CarritoItemComponent, RouterModule, ButtonModule],
  templateUrl: './carrito-drawer.component.html',
  standalone: true,
  styleUrl: './carrito-drawer.component.scss'
})
export class CarritoDrawerComponent implements OnInit {
  private readonly usuarioService = inject(UsuarioService);
  public readonly carritoService = inject(CarritoService);

  protected total$ = this.carritoService.total;
  protected carrito$ = this.carritoService.carrito;

  public usuarioId?: number;
  public usuarioLogueado = false;

  constructor() {
    effect(() => {
      this.usuarioLogueado = this.usuarioService.usuario() != null;


      if (this.usuarioLogueado) {
        this.usuarioId = this.usuarioService.usuario()?.id;
        this.carritoService.obtenerCarrito(this.usuarioId ?? 0);
      }
    })
  }

  ngOnInit(): void {
    this.usuarioService.obtenerUsuarioActual();
  }

  vaciarCarrito(): void {
    if (this.usuarioId && confirm('¿Seguro que querés vaciar el carrito?')) {
      this.carritoService.vaciar(this.usuarioId);
    }
  }


}


