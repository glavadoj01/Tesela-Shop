import { Product } from '@/products/interfaces/product-response';
import { ProductImagePipe } from '@/products/pipes/product-image.pipe';
import { CurrencyPipe, NgClass } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'product-table',
  imports: [ProductImagePipe, RouterLink, CurrencyPipe, NgClass],
  templateUrl: './product-table.component.html',
})
export class ProductTableComponent {

  products = input.required<Product[]>()


}
