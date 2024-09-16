import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
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
import { NutritionistService } from '../../../Services/Nutritionist/nutritionist.service';

@Component({
  selector: 'app-sidenav-nutritionist',
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
  templateUrl: './sidenav-nutritionist.component.html',
  styleUrl: './sidenav-nutritionist.component.css'
})
export class SidenavNutritionistComponent implements AfterViewInit {
  @ViewChild('drawer') drawer!: MatDrawer;
  currentSessionName: string = this.authService.currentUserValue ? this.authService.currentUserValue.username : '';
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private nutritionistService: NutritionistService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    // Forzar una actualización de la vista
    this.cdr.detectChanges();
  }

  // Función para manejar el cierre de sesión
  logout() {
    this.nutritionistService.logoutNutritionist();
    this.authService.logout();
  }
}