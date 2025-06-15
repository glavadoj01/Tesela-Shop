import { Component, inject } from '@angular/core';

import { ProductCardComponent } from '@/products/components/product-card/product-card.component';
import { ProductsService } from '@/products/services/products.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Product } from '@/products/interfaces/product-response';

@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {

  productService = inject(ProductsService);

  productsResource = rxResource({
    request: () => ({  }),
    loader: ({  }) => {
      return this.productService.getProducts({}).pipe(
        map( response => response.products),
      )
    }
  })
}
