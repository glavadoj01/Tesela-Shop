import { ProductCarouselComponent } from '@/products/components/product-carousel/product-carousel.component';
import { Product, Size } from '@/products/interfaces/product-response';
import { ProductsService } from '@/products/services/products.service';
import { FormErrorLabelComponent } from '@/shared/components/form-error-label/form-error-label.component';
import { FormUtils } from '@/utils/form-utils';
import { Component, inject, input, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'product-details',
  imports: [ProductCarouselComponent, ReactiveFormsModule, FormErrorLabelComponent],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit {
  product = input.required<Product>()

  productsService = inject(ProductsService)
  fb = inject(FormBuilder)
  sizes: Size[] = Object.values(Size)

  productForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: [
      '',
      [Validators.required, Validators.pattern(FormUtils.slugPattern)]
    ],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [Object.values(Size)],
    images: [[]],
    tags: [''],
    gender: [
      'men',
      [Validators.required, Validators.pattern(/men|women|kid|unisex/)]
    ],
  })

  setFormValue( formLike: Partial<Product> ) {
    this.productForm.patchValue({
      ...formLike as any,
      tags: formLike.tags?.join(',')
    });
  }

  ngOnInit() {
    this.setFormValue(this.product())
  }

  onSizeChange(size: Size) {
    const currentSizes = this.productForm.value.sizes ?? [];

    if (currentSizes.includes(size)) {
      currentSizes.splice(currentSizes.indexOf(size), 1)
    }
    else {
      currentSizes.push(size)
    }

    this.productForm.patchValue({ sizes: currentSizes });
  }

  onSubmit() {
    const isValid = this.productForm.valid;
    this.productForm.markAllAsTouched();

    if (!isValid) return;
    const formValue = this.productForm.value;

    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags: formValue.tags?.toLocaleLowerCase()
        .split(',')
        .map(tag => tag.trim())
        ?? [],
    }

    this.productsService.updateProduct(this.product().id, productLike).subscribe();
  }
}
