import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dialog-generate-dish-product',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './dialog-generate-dish-product.component.html',
  styleUrl: './dialog-generate-dish-product.component.css'
})
export class DialogGenerateDishProductComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogGenerateDishProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router
  ) {}

  onRegisterProduct(): void {
    this.dialogRef.close();
    this.router.navigate(['/sidenavNutri/generateProduct']);
  }

  onRegisterDish(): void {
    this.dialogRef.close();
    this.router.navigate(['/sidenavNutri/generateDish']);
  }
}
