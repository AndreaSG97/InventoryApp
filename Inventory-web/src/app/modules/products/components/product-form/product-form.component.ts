import { Component } from '@angular/core';
import { Product } from '../../product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { environment } from '../../../../../enviroments/environments';

@Component({
  selector: 'app-product-form',
  standalone: false,
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss'
})
export class ProductFormComponent {
  product: Product = {} as Product;
  isEditMode = false;
  productForm!: FormGroup;
  productId?: number;
  selectedFile: File | null = null;
  imagePreview: string | null = null;


  constructor(private route: ActivatedRoute, private productService: ProductService, private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.buildForm();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.productId = +idParam;
      this.loadProduct(this.productId);
    }
  }

  private buildForm(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      category: [''],
      image: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      inStock: [0, [Validators.required, Validators.min(0)]]
    });
  }

  private loadProduct(id: number): void {
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.productForm.patchValue(product);
        this.imagePreview = product.image ? `${environment.apiUrlProducts}/${product.image}` : null;

      },
      error: (err) => console.error('Error loading product', err)
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    formData.append('name', this.productForm.get('name')?.value);
    formData.append('description', this.productForm.get('description')?.value);
    formData.append('category', this.productForm.get('category')?.value);
    formData.append('price', this.productForm.get('price')?.value);
    formData.append('inStock', this.productForm.get('inStock')?.value);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    const request$ = this.isEditMode
      ? this.productService.updateProductWithImage(this.productId!, formData)
      : this.productService.createProductWithImage(formData);

    request$.subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: this.isEditMode ? 'Product updated!' : 'Product created!',
          text: this.isEditMode
            ? 'The changes were saved successfully.'
            : 'The product has been registered successfully.',
        });
        this.router.navigate(['/products']);
      },
      error: (err) => {
        console.error('Error saving product', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while saving the product.',
        });
      },
    });
  }
  onFileSelected(event: any) {
   const file = event.target.files[0];
  if (file) {
    this.productForm.patchValue({ image: file });
     this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}

}
