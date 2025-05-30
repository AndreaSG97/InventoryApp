import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from '../transaction.model';
import { environment } from '../../../../enviroments/environments';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
private apiUrl = environment.apiUrlTransactions+'/transactions';

  constructor(private http: HttpClient) {}

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl);
  }

  getTransactionById(id: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/${id}`);
  }

  createTransaction(product: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrl, product);
  }

  updateTransaction(id: number, product: Transaction): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.apiUrl}/${id}`, product);
  }

  deleteTransaction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
