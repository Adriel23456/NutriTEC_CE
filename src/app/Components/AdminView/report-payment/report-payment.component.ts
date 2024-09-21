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
import { NutritionistService, Nutritionist } from '../../../Services/Nutritionist/nutritionist.service';
import { AuthenticationService, User } from '../../../Services/Authentication/authentication.service';

@Component({
  selector: 'app-report-payment',
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
  templateUrl: './report-payment.component.html',
  styleUrl: './report-payment.component.css'
})
export class ReportPaymentComponent implements AfterViewInit, OnInit {
  dataSource = new MatTableDataSource<User>();
  displayedColumns: string[] = ['email', 'fullname', 'reportPayment'];
  filterValues = { email: '', fullname: '' };
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private nutritionistService: NutritionistService,
    private authService: AuthenticationService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.dataSource.filterPredicate = this.createFilter();
  }

  ngOnInit(): void {
    this.authService.users$.subscribe(users => {
      // Filtrar solo los usuarios que son nutricionistas
      const nutritionistUsers = users.filter(user => user.e_Domain === 'nutriTECNutri.com');
      this.dataSource.data = nutritionistUsers;
    });
  }

  createFilter(): (data: any, filter: string) => boolean {
    return (data: User, filter: string): boolean => {
      const searchString = JSON.parse(filter);
      const emailMatches = !searchString.email || data.email.toLowerCase().includes(searchString.email.toLowerCase());
      const fullnameMatches = !searchString.fullname || data.fullname.toLowerCase().includes(searchString.fullname.toLowerCase());
      return emailMatches && fullnameMatches;
    };
  }
  

  applyFilter(field: keyof typeof this.filterValues, event: Event) {
    this.filterValues[field] = (event.target as HTMLInputElement).value;
    this.dataSource.filter = JSON.stringify(this.filterValues);
  }

  applyFilterEmail(event: Event) {
    this.applyFilter('email', event);
  }

  applyFilterName(event: Event) {
    this.applyFilter('fullname', event);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  reportPayment(row: User): void {
    this.router.navigate(['sidenavAdmin/reportPayment/confirmation', row.id]);
  }  

  openDialog(title: string, message: string): void {
    this.dialog.open(DialogComponent, {
      width: '300px',
      data: { title, message }
    });
  }
}
