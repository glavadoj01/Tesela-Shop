import { ProductCardComponent } from '@/products/components/product-card/product-card.component';
import { ProductsService } from '@/products/services/products.service';
import { PaginationService } from '@/shared/components/pagination/pagination.service';

import { Component, inject } from '@angular/core';
import { PaginationComponent } from "@shared/components/pagination/pagination.component";
import { rxResource } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent, PaginationComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {
  productService = inject(ProductsService);
  paginationService = inject(PaginationService)

  productsResource = rxResource({
    request: () => ({ page: this.paginationService.currentPage() }),
    loader: ({ request }) => {
      return this.productService.getProducts({
        offset: (request.page - 1) * 12
      })
    }
  })
}
