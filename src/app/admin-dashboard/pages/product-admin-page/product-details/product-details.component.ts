import { ProductCarouselComponent } from '@/products/components/product-carousel/product-carousel.component';
import { Product, Size } from '@/products/interfaces/product-response';
import { ProductsService } from '@/products/services/products.service';
import { FormErrorLabelComponent } from '@/shared/components/form-error-label/form-error-label.component';
import { FormUtils } from '@/utils/form-utils';
import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'product-details',
  imports: [ProductCarouselComponent, ReactiveFormsModule, FormErrorLabelComponent],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit {
  product = input.required<Product>()

  productsService = inject(ProductsService)
  fb = inject(FormBuilder)
  router = inject(Router)

  sizes: Size[] = Object.values(Size)
  imageFileList: FileList | undefined = undefined;

  wasSaved = signal(false)
  tempImgages = signal<string[]>([])
  imagesToCarousel = computed(() => {
    return [...this.product().images, ...this.tempImgages()]
  })

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

  async onSubmit() {
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

    if (this.product().id === 'new') {
      const product = await firstValueFrom(
        this.productsService.createProduct(productLike, this.imageFileList)
      )
      this.router.navigate(['/admin/products', product.id])
    }
    else {
      await firstValueFrom(
        this.productsService.updateProduct(this.product().id, productLike, this.imageFileList)
      )
    }

    this.wasSaved.set(true);
    setTimeout(() => this.wasSaved.set(false), 5000);
  }

  onFilesChanged(event: Event) {
    const fileList = (event.target as HTMLInputElement).files;
    if (!fileList || fileList.length === 0) return;

    const imagesUrls = Array.from(fileList).map(file => {
      return URL.createObjectURL(file);
    })

    this.tempImgages.set(imagesUrls);

    this.imageFileList = fileList;
  }
}
