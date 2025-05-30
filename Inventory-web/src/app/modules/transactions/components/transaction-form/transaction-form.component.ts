import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Transaction } from '../../transaction.model';
import { TransactionService } from '../../services/transaction.service';
import Swal from 'sweetalert2';
import { Product } from '../../../products/product.model';
import { ProductService } from '../../../products/services/product.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-transaction-form',
  standalone: false,
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.scss'
})
export class TransactionFormComponent {
  transaccion: Transaction = {} as Transaction;
  isEditMode = false;
  transactionForm!: FormGroup;
  transaccionId?: number;
  products: Product[] = [];
  totalPrice: number = 0;
  constructor(private route: ActivatedRoute, private transactionService: TransactionService, private fb: FormBuilder, private productService: ProductService, private datePipe: DatePipe,private router: Router) { }

  ngOnInit(): void {
    this.loadProducts();

    this.buildForm();
    this.transactionForm.get('quantity')?.valueChanges.subscribe(() => {
      this.updateTotal();
    });
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.transaccionId = +idParam;
      this.loadTransaccion(this.transaccionId);
    }
  }
  private buildForm(): void {
    this.transactionForm = this.fb.group({
      date: ['', Validators.required],
      transactionType: ['', Validators.required],
      productId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [{ value: 0, disabled: true }, [Validators.required, Validators.min(0)]],
      totalPrice: [{ value: 0, disabled: true }],
      details: ['']
    });
  }
  loadProducts(): void {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
    });
  }
  private loadTransaccion(id: number): void {
    this.transactionService.getTransactionById(id).subscribe({
      next: (transaccion) => {
        const fechaISO = transaccion.date ? this.datePipe.transform(transaccion.date, 'yyyy-MM-dd') : '';
        this.transactionForm.patchValue({
          ...transaccion,
          date: fechaISO,
           productId: transaccion.product?.productID || transaccion.productID,
        });
      },
      error: (err) => console.error('Error loading transaction', err)
    });
  }

  onSubmit(): void {
    if (this.transactionForm.invalid) {
      this.transactionForm.markAllAsTouched();
      return;
    }

    const product: Transaction = {
      ...this.transactionForm.getRawValue()
    };

    if (this.isEditMode) {
      this.transactionService.updateTransaction(this.transaccionId!, product).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Transaction updated!',
            text: 'The changes were saved successfully.'
          });
          this.router.navigate(['/transactions']);
        },
        error: (err) => {
          console.error('Error updating transaccion', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: JSON.stringify(err.error)
          });
            }
      });
    } else {
      this.transactionService.createTransaction(product).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Transaction created!',
            text: 'The Transaction has been recorded successfully.'
          });
          this.router.navigate(['/transactions']);
        },
        error: (err) => {
          console.error('Error creating transaccion', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: JSON.stringify(err.error)
          });
        }
      });
    }
  }
  onProductChange(): void {
    const productId = this.transactionForm.get('productId')?.value;
    const selectedProduct = this.products.find(p => p.productID === +productId);
    if (selectedProduct) {
      this.transactionForm.patchValue({
        unitPrice: selectedProduct.price
      });
      this.updateTotal();
    }
  }

  updateTotal(): void {
    const qty = this.transactionForm.get('quantity')?.value || 0;
    const price = this.transactionForm.get('unitPrice')?.value || 0;
    this.totalPrice = qty * price;
  }


}
