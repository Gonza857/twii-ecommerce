import {Component} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import { ToolbarModule} from 'primeng/toolbar';
import {ButtonModule} from 'primeng/button';
import {Ripple} from 'primeng/ripple';
import {MessageService} from 'primeng/api';
import {ToastModule} from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToolbarModule, ButtonModule, Ripple, RouterLink, ToastModule],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss',
  providers: [MessageService]
})
export class AppComponent {

}
