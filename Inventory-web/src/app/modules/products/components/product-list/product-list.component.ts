import { Component, OnInit } from '@angular/core';
import { Product } from '../../product.model';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  public productlist: Product[] = [];
  public pageSize = 5;
  public skip = 0;

  constructor(private productService: ProductService, private router: Router) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.productlist = data;
      },
      error: (err) => console.error('Error al cargar productos', err)
    });
  }
  public pageChange(event: any): void {
    this.skip = event.skip;
  }
  onEdit(item: Product): void {   
    this.router.navigate(['/products/edit', item.productID]);
  }

  onDelete(item: Product): void {
    Swal.fire({
      title: "You're sure?",
      text: `Do you want to delete the product "${item.name}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(item.productID).subscribe({
          next: () => {

            this.productlist = this.productlist.filter(p => p.productID !== item.productID);

            Swal.fire(
              'Eliminado',
              'The product has been successfully removed.',
              'success'
            );
            this.router.navigate(['/products']);
          },
          error: () => {
            Swal.fire(
              'Error',
              'An error occurred while deleting the product.',
              'error'
            );
          }
        });
      }
    });
  }

  onAdd(): void {
    this.router.navigate(['/products/create']);
  }

}
