import {Component, effect, inject, OnInit} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {ActivatedRoute, Router} from '@angular/router';
import {PasswordModule} from 'primeng/password';
import {CardModule} from 'primeng/card';
import {FloatLabelModule} from 'primeng/floatlabel';
import {Message} from 'primeng/message';
import {MessageService} from 'primeng/api';
import {UsuarioService} from '../../../../services/usuario/usuario.service';
import UsuarioMapper from '../../../../services/usuario/mapping/usuario.mapper';

@Component({
  selector: 'app-cambiar-contrasena',
  imports: [
    InputTextModule,
    ButtonModule,
    ReactiveFormsModule,
    FormsModule,
    CardModule,
    InputTextModule,
    FloatLabelModule,
    PasswordModule,
    ButtonModule,
    Message,
  ],
  templateUrl: './cambiar-contrasena.component.html',
  standalone: true,
  styleUrl: './cambiar-contrasena.component.scss',
})
export class CambiarContrasenaComponent implements OnInit {
  private readonly servicioUsuario: UsuarioService = inject(UsuarioService);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  private readonly toast: MessageService = inject(MessageService);
  private fb: FormBuilder = inject(FormBuilder);
  protected form!: FormGroup;
  protected token!: string;
  protected enviando: boolean = false;
  protected mensajeError!: string;
  protected exito: boolean = false;

  constructor() {
    effect(() => {
      const resultado = this.servicioUsuario.respuestaServidor();
      if (!resultado) return;

      if (resultado.exito) {
        this.toast.add({
          severity: 'success',
          summary: 'Éxito',
          detail: resultado.mensaje,
        });
        setTimeout(() => {
          this.router.navigate(['/cuenta/login']);
        }, 5500);
      } else {
        this.mensajeError = this.servicioUsuario.respuestaServidor()?.mensaje ?? "Error desconocido"
        this.enviando = false;
      }

    });
  }

  ngOnInit(): void {
    this.token = this.activatedRoute.snapshot.paramMap.get('token') ?? "";
    this.form = this.fb.group({
      contrasena: ['xdxdxd1', [Validators.required, Validators.minLength(6)]],
      cContrasena: ['xdxdxd1', [Validators.required, Validators.minLength(6)]],
    });
  }

  protected enviar = () => {
    this.mensajeError = '';
    const esFormularioValido = this.validarFormulario();

    if (!esFormularioValido) {
      this.form.markAllAsTouched();
      this.enviando = false;
      return;
    }

    const c: string = this.form.get('contrasena')?.value;
    const data = {contrasena: c, token: this.token,};

    const usuarioRecuperarRest = UsuarioMapper.mapUsuarioRecuperarToRest(data)

    this.servicioUsuario.cambiarContrasena(usuarioRecuperarRest)

  };

  private validarFormulario = () => {
    if (
      this.form.get('cContrasena')?.value !== this.form.get('contrasena')?.value
    ) {
      this.form.get('cContrasena')?.setErrors({mismatch: true});
      this.form.get('contrasena')?.setErrors({mismatch: true});
      return false;
    }

    return this.form.valid;
  };


}
