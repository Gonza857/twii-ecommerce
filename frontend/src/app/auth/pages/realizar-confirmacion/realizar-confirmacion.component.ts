import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UsuarioService} from '../../../services/usuario.service';

@Component({
  selector: 'app-realizar-confirmacion',
  imports: [],
  templateUrl: './realizar-confirmacion.component.html',
  standalone: true,
  styleUrl: './realizar-confirmacion.component.scss'
})
export class RealizarConfirmacionComponent implements OnInit{
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly usuarioService: UsuarioService = inject(UsuarioService)
  private readonly router: Router = inject(Router)
  private token!: string | null;

  ngOnInit(): void {
    this.token = this.activatedRoute.snapshot.paramMap.get("token")
    if (this.token == null) return;
    this.usuarioService.confirmarCuenta(this.token).subscribe({
      next: (data) => {
        console.log("todo ok", data)
        this.router.navigate(["/cuenta/confirmada"])
      },
      error: (e) => {
        console.log(e)
        if (e.status === 400 || e.status === 401) {

        }
      },
      complete: () => {

      }
    })
  }

}
