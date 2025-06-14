import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CardModule} from 'primeng/card';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {MessageModule} from 'primeng/message';
import {Router, RouterLink} from '@angular/router';
import {UsuarioService} from '../../../services/usuario.service';
import {Password, PasswordModule} from "primeng/password";

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
    styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
    private servicioUsuario: UsuarioService = inject(UsuarioService)
    private router: Router = inject(Router);
    private fb: FormBuilder = inject(FormBuilder);
    protected form!: FormGroup;
    protected enviando: boolean = false;
    protected exito: boolean = false;
    protected mensajeError!: string;

    ngOnInit(): void {
        this.form = this.fb.group({
            email: ['gonzaloalexramos@gmail.com', [Validators.required, Validators.email]],
            password: ['gonzalo', [Validators.required]],
        })
    }

    private loginExitoso() {
        this.exito = true;
        setTimeout(() => {
            this.router.navigate(['/']);
        }, 2500)
    }

    private loginError(e: any) {
        if (e.status === 400 || e.status === 401) {
            this.mensajeError = e.error.error
            this.exito = false;

        } else if (e.status === 403) {
            this.router.navigate(['/cuenta/confirmacion', e.error.data]);
        }
        this.enviando = false;
    }

    login() {
        this.enviando = true;
        this.mensajeError = "";
        const email = this.form.get('email')?.value;
        const contrasena = this.form.get('password')?.value;

        if (this.form.valid) {
            this.servicioUsuario.iniciarSesion({email, contrasena}).subscribe({
                next: () => {
                    this.loginExitoso()
                },
                error: (e) => {
                    this.loginError(e);
                },
                complete: () => this.enviando = false
            })
        } else {
            this.form.markAllAsTouched();
        }
        this.enviando = false;

        // Lógica de autenticación acá
    }


}
