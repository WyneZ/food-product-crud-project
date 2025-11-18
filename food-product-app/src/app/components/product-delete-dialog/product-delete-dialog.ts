import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-product-delete-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './product-delete-dialog.html',
  styleUrls: ['./product-delete-dialog.scss']
})
export class ProductDeleteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ProductDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product
  ) {}
}