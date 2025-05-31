import {Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {UsuarioService} from './services/usuario.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
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
