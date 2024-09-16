import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dialog-register',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './dialog-register.component.html',
  styleUrl: './dialog-register.component.css'
})
export class DialogRegisterComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogRegisterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router
  ) {}

  onRegisterClient(): void {
    this.dialogRef.close();
    this.router.navigate(['/registerClient']);
  }

  onRegisterNutritionist(): void {
    this.dialogRef.close();
    this.router.navigate(['/registerNutri']);
  }
}