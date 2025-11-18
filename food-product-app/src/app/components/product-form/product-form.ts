import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product, PRODUCT_TYPES } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule
  ],
  templateUrl: './product-form.html',
  styleUrls: ['./product-form.scss']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  productTypes = PRODUCT_TYPES;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private dialogRef: MatDialogRef<ProductFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product | null
  ) {
    this.isEdit = !!data;
    
    // Initialize the form with proper date handling
    this.productForm = this.fb.group({
      product_id: [data?.product_id || '', [Validators.required]],
      product_type: [data?.product_type || '', [Validators.required]],
      manufactured_date: [this.parseDate(data?.manufactured_date), [Validators.required]],
      expired_date: [this.parseDate(data?.expired_date), [Validators.required]],
      net_weight: [data?.net_weight || '', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit() {
    console.log('Form initialized with data:', this.data);
    console.log('Form values:', this.productForm.value);
  }

  // Parse date string to Date object without timezone issues
  private parseDate(dateString: string | undefined): Date | null {
    if (!dateString) return null;
    
    // Split the date string and create a date in local timezone
    const date = new Date(dateString);
    
    // If the date is invalid, return null
    if (isNaN(date.getTime())) return null;
    
    return date;
  }

  // Format date to YYYY-MM-DD format without timezone issues
  private formatDateForBackend(date: Date): string {
    if (!date) return '';
    
    // Use local date components to avoid timezone conversion
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    return `${year}-${month}-${day}T00:00:00.000Z`;
  }

  onSubmit() {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;
      console.log('Form submitted with values:', formValue);
      
      // Prepare the product data with proper date formatting
      const productData: Product = {
        id: this.data?.id || 0,
        product_id: formValue.product_id,
        product_type: formValue.product_type,
        manufactured_date: formValue.manufactured_date ? 
          this.formatDateForBackend(formValue.manufactured_date) : '',
        expired_date: formValue.expired_date ? 
          this.formatDateForBackend(formValue.expired_date) : '',
        net_weight: Number(formValue.net_weight)
      };

      console.log('Sending to API:', productData);

      if (this.isEdit && this.data?.id) {
        this.productService.update(this.data.id, productData).subscribe({
          next: (response) => {
            console.log('Update successful:', response);
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Update failed:', error);
            alert('Error updating product. Check console for details.');
          }
        });
      } else {
        this.productService.create(productData).subscribe({
          next: (response) => {
            console.log('Create successful:', response);
            this.dialogRef.close(true);
          },
          error: (error) => {
            console.error('Create failed:', error);
            alert('Error creating product. Check console for details.');
          }
        });
      }
    } else {
      console.log('Form is invalid');
      // Mark all fields as touched to show validation errors
      Object.keys(this.productForm.controls).forEach(key => {
        this.productForm.get(key)?.markAsTouched();
      });
    }
  }
}