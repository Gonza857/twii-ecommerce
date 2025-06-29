import { Component } from '@angular/core';
import {AdminFooterComponent} from './components/admin-footer/admin-footer.component';
import {AdminNavbarComponent} from './components/admin-navbar/admin-navbar.component';
import {RouterModule} from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  imports: [AdminFooterComponent, AdminNavbarComponent, RouterModule],
  templateUrl: './admin-layout.component.html',
  standalone: true,
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {

}
