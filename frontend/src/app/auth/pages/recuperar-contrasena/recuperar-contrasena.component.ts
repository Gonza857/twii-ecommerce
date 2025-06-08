import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {Router} from '@angular/router';
import {InputText} from 'primeng/inputtext';
import {NgClass} from '@angular/common';
import {UsuarioService} from '../../../services/usuario.service';

@Component({
  selector: 'app-recuperar-contrasena',
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputText,
    NgClass
  ],
  templateUrl: './recuperar-contrasena.component.html',
  standalone: true,
  styleUrl: './recuperar-contrasena.component.scss'
})
export class RecuperarContrasenaComponent implements OnInit {
  protected form!: FormGroup;
  private readonly fb: FormBuilder = inject(FormBuilder);
  private readonly servicioUsuario: UsuarioService = inject(UsuarioService)
  private readonly router: Router = inject(Router)
  protected enviando: boolean = false;
  protected exito: boolean = false;

  protected enviar = () => {
    this.enviando = true;
    const email: string = this.form.get("email")?.value;
    if (this.form.valid) {
      this.servicioUsuario.recuperar(email).subscribe({
        next: (result: any) => {
          this.exito = result.exito
          // this.router.navigate([`/cambiar-contrasena`, result])
        },
        error: error => {
          console.log(error)
        },
        complete: () => {
          this.enviando = false;
        }
      })
    }


  }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['test@test.com', [Validators.required, Validators.email]],
    })
  }
}
