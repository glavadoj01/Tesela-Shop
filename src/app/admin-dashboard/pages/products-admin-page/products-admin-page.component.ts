import { Component, inject, signal } from '@angular/core';
import { ProductsService } from '@/products/services/products.service';
import { PaginationService } from '@/shared/components/pagination/pagination.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductTableComponent } from '@/products/components/product-table/product-table.component';
import { RouterLink } from '@angular/router';
import { PaginationComponent } from '@/shared/components/pagination/pagination.component';

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductTableComponent, PaginationComponent, RouterLink],
  templateUrl: './products-admin-page.component.html',
})
export class ProductsAdminPageComponent {
  productService = inject(ProductsService);
  paginationService = inject(PaginationService);

  productPerPage = signal(10);

  productsResource = rxResource({
    request: () => ({
      page: this.paginationService.currentPage(),
      limit: this.productPerPage(),
    }),
    loader: ({ request }) => {
      return this.productService.getProducts({
        limit: request.limit,
        offset: (request.page - 1) * request.limit,
      });
    }
  })
}
