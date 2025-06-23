import {Component, effect, inject, OnInit} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { Router, RouterLink } from '@angular/router';
import { PasswordModule } from 'primeng/password';
import {UsuarioService} from '../../../../services/usuario/usuario.service';
import UsuarioMapper from '../../../../services/usuario/mapping/usuario.mapper';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    ReactiveFormsModule,
    MessageModule,
    RouterLink,
    PasswordModule,
  ],
  templateUrl: './login.component.html',
  standalone: true,
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private servicioUsuario: UsuarioService = inject(UsuarioService);
  private router: Router = inject(Router);
  private fb: FormBuilder = inject(FormBuilder);
  protected form!: FormGroup;
  protected enviando: boolean = false;
  protected exito: boolean = false;
  protected mensajeError!: string | undefined;

  constructor() {
    effect(() => {
      const resultado = this.servicioUsuario.respuestaServidor();
      if (!resultado) return;

      this.enviando = false;
      this.exito =  resultado.exito ?? false
      if (resultado.exito) {
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2500);
      } else {
        if (resultado.redireccion) {
          this.router.navigate(['/cuenta/confirmacion', resultado.data]);
        } else {
          this.mensajeError = resultado.mensaje ?? 'Error desconocido.';
        }
      }

      queueMicrotask(() => this.servicioUsuario.limpiarRespuesta())
    });

  }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: [
        'gonzaloalexramos@gmail.com',
        [Validators.required, Validators.email],
      ],
      password: ['gonzalo', [Validators.required]],
    });
  }

  login() {
    this.enviando = true;
    this.mensajeError = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.enviando = false;
      return;
    }

    const usuario = {
      email: this.form.get('email')?.value,
      contrasena: this.form.get('password')?.value
    };
    const usuarioRest = UsuarioMapper.mapLoginToLoginRest(usuario);

    this.servicioUsuario.iniciarSesion(usuarioRest);
  }
}
