import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ProductFormComponent } from '../product-form/product-form';
import { ProductDeleteDialogComponent } from '../product-delete-dialog/product-delete-dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.scss']
})
export class ProductListComponent implements OnInit {
  dataSource = new MatTableDataSource<Product>([]);
  loading = true;
  
  // Pagination properties
  pageSize = 5;
  pageSizeOptions = [5, 10, 20];
  currentPage = 0;
  paginatedData: Product[] = [];

  constructor(
    private productService: ProductService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getAll().subscribe({
      next: (response: any) => {
        console.log('Data received:', response);
        
        let products: Product[] = [];
        
        if (Array.isArray(response)) {
          products = response;
        } else if (response && response.products && Array.isArray(response.products)) {
          products = response.products;
        } else if (response && Array.isArray(response)) {
          products = response;
        }
        
        console.log('Processed products:', products);
        this.dataSource.data = products;
        this.updatePaginatedData();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedData();
  }

  updatePaginatedData() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.dataSource.data.slice(startIndex, endIndex);
    
    console.log('Paginated data:', {
      currentPage: this.currentPage,
      pageSize: this.pageSize,
      startIndex,
      endIndex,
      totalItems: this.dataSource.data.length,
      paginatedItems: this.paginatedData.length
    });
  }

  openForm(product?: Product) {
    const dialogRef = this.dialog.open(ProductFormComponent, {
      width: '500px',
      data: product || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts();
      }
    });
  }

  deleteProduct(product: Product) {
    const dialogRef = this.dialog.open(ProductDeleteDialogComponent, {
      width: '400px',
      data: product
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed && product.id) {
        this.productService.delete(product.id).subscribe(() => {
          this.loadProducts();
        });
      }
    });
  }
}