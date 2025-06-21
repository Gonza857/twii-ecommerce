import { Component, inject, OnInit } from '@angular/core';
import { UsuarioService } from '../../../../../services/usuario.service';
import { CarritoService } from '../../../../../services/carrito.service';
import { CarritoItemComponent } from '../carrito-item/carrito-item.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-carrito-drawer',
  imports: [CommonModule, CarritoItemComponent, RouterModule, ButtonModule],
  templateUrl: './carrito-drawer.component.html',
  styleUrl: './carrito-drawer.component.scss'
})
export class CarritoDrawerComponent implements OnInit {
  private readonly usuarioService = inject(UsuarioService);
  public readonly carritoService = inject(CarritoService);

  protected total$ = this.carritoService.total;
  protected carrito$ = this.carritoService.carrito;

  public usuarioId?: number;
  public usuarioLogueado = false;

  ngOnInit(): void {
    this.usuarioService.obtenerUsuarioActual().subscribe({
      next: (usuario) => {
        console.log('[DEBUG] Usuario recibido:', usuario);
        const usuarioId = usuario?.id;
        if (usuarioId) {
          this.usuarioId = usuarioId;
          this.usuarioLogueado = true;
          this.carritoService.obtenerCarrito(usuarioId);
        }
      },
      error: (err) => {
        console.error('[ERROR] al obtener usuario:', err);
        this.usuarioLogueado = false;
      }
    });
  }

  vaciarCarrito(): void {
    if (this.usuarioId && confirm('¿Seguro que querés vaciar el carrito?')) {
      this.carritoService.vaciar(this.usuarioId);
    }
  }


}


