import {Component, inject, OnInit} from '@angular/core';
import {ProductoService} from '../../../../services/producto/producto.service';
import {Card, CardModule} from 'primeng/card';
import {NgForOf, NgStyle} from '@angular/common';
import {Carousel, CarouselModule} from 'primeng/carousel';
import {Tag, TagModule} from 'primeng/tag';
import {RouterLink} from '@angular/router';
import {ProductoComponent} from '../visualizacion-productos/producto/producto.component';
import {UsuarioService} from '../../../../services/usuario/usuario.service';

@Component({
  selector: 'app-customer-home',
  imports: [
    CardModule,
    CarouselModule,
    TagModule,
    RouterLink,
    ProductoComponent,
    NgStyle
  ],
  templateUrl: './customer-home.component.html',
  standalone: true,
  styleUrl: './customer-home.component.scss'
})
export class CustomerHomeComponent implements OnInit {
  protected readonly servicioProducto: ProductoService = inject(ProductoService);
  protected readonly servicioUsuario: UsuarioService = inject(UsuarioService);
  protected clasificaciones: any | null = null
  usuarioId?: number;
  usuarioLogueado: boolean = false;

  ngOnInit(): void {
    this.servicioProducto.obtenerClasificaciones().subscribe({
      next: (data) => {
        this.clasificaciones = data;
      }
    })


    this.usuarioLogueado = this.servicioUsuario.usuario() != null;
    this.usuarioId = this.servicioUsuario.usuario()?.id;

    this.servicioProducto.obtenerProductos()
  }
}
