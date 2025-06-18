<<<<<<< HEAD
import {Component, inject, OnInit} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import { BadgeModule} from 'primeng/badge';
import {UsuarioService} from '../../../../services/usuario.service';
=======
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Badge, BadgeModule } from 'primeng/badge';
import { UsuarioService } from '../../../../services/usuario.service';
>>>>>>> 53cfc9e56ef3721878bb0f73ccdf13e171cacee9

@Component({
  selector: 'app-admin-home',
  imports: [RouterOutlet, RouterLink, TableModule, ButtonModule, BadgeModule],
  templateUrl: './admin-home.component.html',
  standalone: true,
  styleUrl: './admin-home.component.scss',
})
export class AdminHomeComponent implements OnInit {
  private readonly servicioUsuario: UsuarioService = inject(UsuarioService);
  protected usuarios!: any[];

  ngOnInit(): void {
    this.servicioUsuario.obtenerUsuarios().subscribe({
      next: (data: any) => {
        this.usuarios = data;
      },
      error: (err) => {},
      complete: () => {},
    });
  }
}
