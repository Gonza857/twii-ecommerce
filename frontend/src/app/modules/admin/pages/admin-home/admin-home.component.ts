import {Component, computed, inject, OnInit} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {BadgeModule} from 'primeng/badge';
import {UsuarioService} from '../../../../services/usuario/usuario.service';
import {ProductoService} from '../../../../services/producto/producto.service';
import {Card, CardModule} from 'primeng/card';
import {EstadisticaComponent} from './components/estadistica/estadistica.component';
import {NgClass} from '@angular/common';
import Decimal from "decimal.js"

@Component({
  selector: 'app-admin-home',
  imports: [
    CardModule,
    EstadisticaComponent,
    NgClass,
    RouterLink
  ],
  templateUrl: './admin-home.component.html',
  standalone: true,
  styleUrl: './admin-home.component.scss',
})
export class AdminHomeComponent implements OnInit {
  protected readonly usuarioService = inject(UsuarioService);
  protected readonly productoService = inject(ProductoService);

  protected estadisticas = computed(() => {
    const estadisticasUsuarioSignal = this.usuarioService.estadisticas();
    const estadisticasProductoSignal = this.productoService.signalEstadisticas();

    if (!estadisticasUsuarioSignal || !estadisticasProductoSignal) return [];

    if (estadisticasUsuarioSignal && estadisticasProductoSignal) {
      return [
        {
          titulo: 'Usuarios totales',
          valor: estadisticasUsuarioSignal?.usuariosTotales,
          claseColor: 'text-primario',
          badge: "text-primario"
        },
        {
          titulo: 'Usuarios validados',
          valor: estadisticasUsuarioSignal?.usuariosValidados,
          claseColor: 'text-exito',
          badge: "text-primario"
        },
        {
          titulo: 'Usuarios sin validar',
          valor: estadisticasUsuarioSignal?.usuariosSinValidar,
          claseColor: 'text-error',
          badge: "text-error"
        },
        {
          titulo: 'Productos totales',
          valor: estadisticasProductoSignal?.productosTotales,
          claseColor: 'text-primario',
          badge: "text-primario"
        }
      ];
    }
    return []
  })

  ngOnInit(): void {
    this.usuarioService.obtenerEstadisticas()
    this.productoService.obtenerEstadisticas()

  }


}
