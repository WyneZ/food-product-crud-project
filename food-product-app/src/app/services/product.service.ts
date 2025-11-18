import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { map, tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    console.log('Fetching from:', this.apiUrl);
    
    return this.http.get<any>(this.apiUrl).pipe(
      tap(response => {
        console.log('Raw API Response:', response);
      }),
      map(response => {
        // Handle both direct array and wrapped response
        if (Array.isArray(response)) {
          return response;
        } else if (response && Array.isArray(response.products)) {
          return response.products;
        } else {
          console.error('Unexpected API response format:', response);
          return [];
        }
      }),
      catchError(error => {
        console.error('Error fetching products:', error);
        return [];
      })
    );
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/id/${id}`);
  }

  getByProductId(productId: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/product-id/${productId}`);
  }

  create(product: Product): Observable<Product> {
    console.log('Creating product:', product);
    return this.http.post<Product>(this.apiUrl, product).pipe(
      tap(response => console.log('Create response:', response))
    );
  }

  update(id: number, product: Partial<Product>): Observable<Product> {
    console.log('Updating product:', id, product);
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product).pipe(
      tap(response => console.log('Update response:', response))
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getExpired(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/expired`);
  }

  getExpiringSoon(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/expiring-soon`);
  }

  // Helper: check if productId already exists
  checkDuplicate(productId: string, excludeId?: number): Observable<boolean> {
    return new Observable(observer => {
      this.getAll().subscribe({
        next: (products) => {
          const safeProducts = Array.isArray(products) ? products : [];
          const exists = safeProducts.some(p =>
            p.product_id === productId && (!excludeId || p.id !== excludeId)
          );
          observer.next(exists);
          observer.complete();
        },
        error: () => {
          observer.next(false);
          observer.complete();
        }
      });
    });
  }

  // Handle API errors
  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    throw error;
  }
}