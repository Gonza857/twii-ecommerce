import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-admin-navbar',
  imports: [
    RouterLink
  ],
  templateUrl: './admin-navbar.component.html',
  standalone: true,
  styleUrl: './admin-navbar.component.scss'
})
export class AdminNavbarComponent {

}
