import { SlicePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ProductImagePipe } from '@/products/pipes/product-image.pipe';
import { Product } from '@/products/interfaces/product-response';
import { environment } from '@environments/environment';


const BASE_URL = environment.baseUrl;

@Component({
  selector: 'product-card',
  imports: [RouterLink, SlicePipe, ProductImagePipe],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {

  product = input.required<Product>();

  imageUrl = computed<string>(() => {
    return `${BASE_URL}/files/product/${
      this.product().images[0]
    }`;
  });
}
