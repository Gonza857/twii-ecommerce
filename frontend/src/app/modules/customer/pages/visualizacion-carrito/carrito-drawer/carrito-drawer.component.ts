import { Component, inject, OnInit } from '@angular/core';
import { UsuarioService } from '../../../../../services/usuario.service';
import { CarritoService } from '../../../../../services/carrito.service';
import { CarritoItemComponent } from '../carrito-item/carrito-item.component';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carrito-drawer',
  imports: [CommonModule, CarritoItemComponent, RouterModule],
  templateUrl: './carrito-drawer.component.html',
  styleUrl: './carrito-drawer.component.scss'
})
export class CarritoDrawerComponent implements OnInit {
  private readonly usuarioService = inject(UsuarioService);
  private readonly carritoService = inject(CarritoService);
  private readonly router = inject(Router);

  protected total$ = this.carritoService.total;
  protected carrito$ = this.carritoService.carrito;

  public usuarioId!: number;


  ngOnInit(): void {
    this.usuarioService.obtenerUsuarioActual().subscribe({
      next: (res) => {
        const usuarioId = res?.data?.id;
        if (usuarioId) {
          this.carritoService.obtenerCarrito(usuarioId);
        } else {
          this.router.navigate(['/login']);
        }
      },
      error: () => this.router.navigate(['/login'])
    });
  }
}
