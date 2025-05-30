import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TransactionService } from '../../services/transaction.service';
import { Transaction } from '../../transaction.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-transaction-list',
  standalone: false,
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.scss'
})
export class TransactionListComponent {
  public transactionlist: Transaction[] = [];
  public pageSize = 5;
  public skip = 0;

  constructor(private transactionService: TransactionService, private router: Router, private datePipe :DatePipe) { }

  ngOnInit(): void {
    this.transactionService.getTransactions().subscribe({
      next: (data) => {
        this.transactionlist = data.map(x => ({
          ...x,
          date: new Date(x.date)
        }));
      },
      error: (err) => console.error('Error loading transactions', err)
    });
  }
  public pageChange(event: any): void {
    this.skip = event.skip;
  }
  onEdit(item: Transaction): void {
   
    this.router.navigate(['/transactions/edit', item.transactionID]);
  }

  onDelete(item: Transaction): void {
    Swal.fire({
      title: "You're sure?",
      text: `Do you want to delete the transaction "${item.details}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.transactionService.deleteTransaction(item.transactionID).subscribe({
          next: () => {

            this.transactionlist = this.transactionlist.filter(p => p.transactionID !== item.transactionID);

            Swal.fire(
              'Eliminado',
              'The transaction has been successfully deleted.',
              'success'
            );
          },
          error: () => {
            Swal.fire(
              'Error',
              'An error occurred while deleting the transaction.',
              'error'
            );
          }
        });
      }
    });
  }

  onAdd(): void {
    this.router.navigate(['/transactions/create']);
  }
}
