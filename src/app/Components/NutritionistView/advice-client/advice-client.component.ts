import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogComponent } from '../../Authentication/dialog/dialog.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from "@angular/material/sort";
import { MatIconModule } from "@angular/material/icon";
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from "@angular/material/datepicker";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { ClientService, Client } from '../../../Services/Client/client.service';
import { NutritionistService, Nutritionist } from '../../../Services/Nutritionist/nutritionist.service';
import { AuthenticationService } from '../../../Services/Authentication/authentication.service';

interface ClientWithSelection extends Client {
  isSelected: boolean;
}

@Component({
  selector: 'app-advice-client',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    DialogComponent,
    MatSelectModule,
    MatCheckboxModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatPaginatorModule,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatMomentDateModule
  ],
  templateUrl: './advice-client.component.html',
  styleUrl: './advice-client.component.css'
})
export class AdviceClientComponent implements AfterViewInit, OnInit {
  dataSource = new MatTableDataSource<ClientWithSelection>();
  displayedColumns: string[] = ['select', 'email'];
  clients: ClientWithSelection[] = [];
  filterValues = { email: '' };
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  id: number | undefined;
  nutritionist: Nutritionist | undefined;

  constructor(
    private clientService: ClientService,
    private nutritionistService: NutritionistService,
    private authService: AuthenticationService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.dataSource.filterPredicate = this.createFilter();
  }

  ngOnInit(): void {
    // Obtener el id del usuario actual
    this.id = this.authService.currentUserValue?.id;
  
    // Cargar el nutricionista
    if (this.id !== undefined && this.id !== null) {
      this.nutritionistService.getNutritionistById(this.id).subscribe(
        (nutritionist) => {
          this.nutritionist = nutritionist;
          console.log('Dentro del subscribe - Nutricionista:', this.nutritionist); // Línea 81
  
          if (this.nutritionist) {
            // Cargar los clientes dentro del subscribe para asegurarse de que nutritionist está definido
            this.clientService.clients$.subscribe(clients => {
              this.clients = clients.map(client => ({
                ...client,
                isSelected: false
              }));
  
              // Preseleccionar los clientes que ya está asesorando
              if (this.nutritionist!.advicer) {
                for (const nutritionistAdvicer of this.nutritionist!.advicer) {
                  const clientInList = this.clients.find(client => client.email === nutritionistAdvicer.client.email);
                  if (clientInList) {
                    clientInList.isSelected = true;
                  }
                }
              }
  
              this.dataSource.data = this.clients;
            });
            this.clientService.loadClients();
          } else {
            // Manejar el caso donde el nutricionista no se encuentra
            this.openDialog('Error', 'El nutricionista no fue encontrado.');
            this.router.navigate(['/sidenavNutri/startInfoNutri']);
          }
        },
        (error) => {
          console.error('Error al obtener el nutricionista:', error);
          // Manejar el error, posiblemente redirigir o mostrar un mensaje al usuario
          this.openDialog('Error', 'Ocurrió un error al obtener el nutricionista.');
        }
      );
    } else {
      console.error('ID de nutricionista no proporcionado.');
      this.openDialog('Error', 'ID de nutricionista no proporcionado.');
      this.router.navigate(['/sidenavNutri/startInfoNutri']);
    }
  
    // Quitar el console.log fuera del subscribe
    // console.log(this.nutritionist); // Línea 94 - ELIMINADO
  }  

  createFilter(): (data: any, filter: string) => boolean {
    return (data: ClientWithSelection, filter: string): boolean => {
      const searchString = JSON.parse(filter);
      return data.email.toLowerCase().includes(searchString.email.toLowerCase());
    };
  }

  applyFilter(field: keyof typeof this.filterValues, event: Event) {
    this.filterValues[field] = (event.target as HTMLInputElement).value;
    this.dataSource.filter = JSON.stringify(this.filterValues);
  }

  applyFilterEmail(event: Event) {
    this.applyFilter('email', event);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  onSelectionChange(event: Event, client: ClientWithSelection): void {
    client.isSelected = !client.isSelected;
    if (this.nutritionist) {
      if (client.isSelected) {
        // Agregar cliente a advicer
        if (!this.nutritionist.advicer) {
          this.nutritionist.advicer = [];
        }
        const alreadyAdvising = this.nutritionist.advicer.find(a => a.client.email === client.email);
        if (!alreadyAdvising) {
          this.nutritionist.advicer.push({ client });
        }
        this.openDialog('Cliente Asignado', `Has empezado a asesorar al cliente ${client.email}.`);
      } else {
        // Remover cliente de advicer
        if (this.nutritionist.advicer) {
          const index = this.nutritionist.advicer.findIndex(a => a.client.email === client.email);
          if (index !== -1) {
            this.nutritionist.advicer.splice(index, 1);
          }
        }
        this.openDialog('Cliente Removido', `Has dejado de asesorar al cliente ${client.email}.`);
      }
      // Actualizar los datos del nutricionista
      this.nutritionistService.updateNutritionist(this.nutritionist);
    }
  }

  openDialog(title: string, message: string): void {
    this.dialog.open(DialogComponent, {
      width: '300px',
      data: { title, message }
    });
  }
}