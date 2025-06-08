import {Component, inject, OnInit} from '@angular/core';
import {UsuarioService} from '../../../services/usuario.service';
import {RouterLink, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-admin-home',
  imports: [
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './admin-home.component.html',
  standalone: true,
  styleUrl: './admin-home.component.scss'
})
export class AdminHomeComponent implements OnInit{

  private readonly servicioUsuario: UsuarioService = inject(UsuarioService)
  protected usuarios!: any[];

  ngOnInit(): void {
    this.servicioUsuario.obtenerUsuarios().subscribe({
      next: (data: any) => {
        this.usuarios = data;
      },
      error: err => {},
      complete: () => {},
    })
  }
}
