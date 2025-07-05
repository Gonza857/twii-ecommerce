import {Component, effect, inject, OnDestroy, OnInit} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {CardModule} from 'primeng/card';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {Router, RouterLink} from '@angular/router';
import {Message, MessageModule} from 'primeng/message';
import {UsuarioService} from '../../../../services/usuario/usuario.service';
import {UsuarioRegister} from '../../../../services/usuario/interfaces/usuario.interface';
import {StyleClass} from 'primeng/styleclass';


@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ReactiveFormsModule,
    Message,
    MessageModule,
    RouterLink,
    StyleClass,
  ],
  templateUrl: './register.component.html',
  standalone: true,
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit, OnDestroy {
  private servicioUsuario: UsuarioService = inject(UsuarioService);
  private router: Router = inject(Router);
  private fb: FormBuilder = inject(FormBuilder);
  protected form!: FormGroup;
  protected enviando: boolean = false;
  protected mensajeError!: string;
  protected exito: boolean = false;

  constructor() {
    effect(() => {
      this.enviando = false;
      const resultado = this.servicioUsuario.respuestaServidor();
      if (!resultado) return;

      this.exito = resultado.exito ?? false
      if (resultado.exito) {
        setTimeout(() => {
          this.router.navigate(['/cuenta/login']);
        }, 2500)
      } else {
        this.mensajeError = resultado.mensaje ?? ""
      }
    });
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['test@registrado.com', [Validators.required, Validators.email]],
      contrasena: ['tester', [Validators.required, Validators.minLength(6)]],
      cContrasena: ['tester', [Validators.required, Validators.minLength(6)]],
      nombre: ['Gonzalo', [Validators.required]],
      apellido: ['Ramos', [Validators.required]],
      direccion: ['Casa 123', [Validators.required]],
    });
  }

  private validarContrasenas = (): boolean => {
    if (this.form.get('cContrasena')?.value !== this.form.get('contrasena')?.value) {
      this.form.get('cContrasena')?.setErrors({mismatch: true});
      this.form.get('contrasena')?.setErrors({mismatch: true});
      return false;
    }
    return true;
  }

  private convertirCampos = (): UsuarioRegister => {
    return {
      apellido: this.form.get("apellido")?.value,
      nombre: this.form.get("nombre")?.value,
      email: this.form.get("email")?.value,
      contrasena: this.form.get("contrasena")?.value,
      cContrasena: this.form.get("cContrasena")?.value,
      direccion: this.form.get("direccion")?.value,
    }
  }

  register(): void {
    this.mensajeError = '';
    this.enviando = true;

    if (!this.validarContrasenas()) {
      this.enviando = false;
      return;
    }

    const usuarioRegister: UsuarioRegister = this.convertirCampos();

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.enviando = false;
      return;
    }

    this.servicioUsuario.registrarse(usuarioRegister)
  }

  ngOnDestroy(): void {
    this.servicioUsuario.limpiarRespuesta()
  }


}
