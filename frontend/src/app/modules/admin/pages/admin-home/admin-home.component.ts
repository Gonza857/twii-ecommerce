import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import {UsuarioService} from '../../../../services/usuario/usuario.service';

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
