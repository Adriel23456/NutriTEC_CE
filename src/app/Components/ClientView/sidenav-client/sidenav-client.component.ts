import {Component, OnInit} from '@angular/core';
import {MatDrawer, MatDrawerContainer, MatSidenav} from "@angular/material/sidenav";
import {MatList, MatListItem, MatNavList} from "@angular/material/list";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatDrawerContent} from "@angular/material/sidenav";
import {MatButtonModule} from "@angular/material/button";
import { RouterLink, RouterOutlet} from "@angular/router";
import { MatIconModule } from '@angular/material/icon';
import {MatToolbar} from "@angular/material/toolbar";
import { Router } from '@angular/router';
import {FormsModule} from "@angular/forms";
import {AuthenticationService} from "../../../Services/Authentication/authentication.service";

@Component({
  selector: 'app-sidenav-client',
  standalone: true,
  imports: [
    MatIconModule,
    MatSidenav,
    MatButtonModule,
    MatDrawer,
    MatList,
    MatDrawerContainer,
    MatNavList,
    MatListItem,
    MatButton,
    MatDrawerContent,
    MatIcon,
    RouterLink,
    MatToolbar,
    RouterOutlet,
    FormsModule
  ],
  templateUrl: './sidenav-client.component.html',
  styleUrl: './sidenav-client.component.css'
})
export class SidenavClientComponent {
  currentSessionName: string = this.authService.currentUserValue ? this.authService.currentUserValue.name : '';
  constructor(private authService: AuthenticationService, private router: Router) {}

  // Función para manejar el cierre de sesión
  logout() {
    this.authService.logout();
  }
}
