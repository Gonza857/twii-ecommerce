import {Component, inject, OnInit} from '@angular/core';
import {UsuarioService} from '../../services/usuario.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  standalone: true,
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private readonly servicioUsuario: UsuarioService = inject(UsuarioService);
  title = 'frontend';
  protected resultadoApiUsuario!: string;

  private testearApiUsuario(): void {
    setTimeout(()=>{
      this.servicioUsuario.testearAPI().subscribe({
          next: (data) => this.resultadoApiUsuario = data,
          error: (error) => console.log(error),
          complete: () => console.log("completado")
        }
      )
    }, 2500)
  }

  ngOnInit(): void {
    this.testearApiUsuario();
  }
}
