import { Injectable } from '@angular/core';
import { Product } from '../product.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../enviroments/environments';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  
  private apiUrl = environment.apiUrlProducts+'/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProductWithImage(data: FormData): Observable<any> {
  return this.http.post(this.apiUrl, data);
}

updateProductWithImage(id: number, data: FormData): Observable<any> {
  return this.http.put(`${this.apiUrl}/${id}`, data);
}

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
