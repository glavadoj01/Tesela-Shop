import { ProductCardComponent } from '@/products/components/product-card/product-card.component';
import { ProductsService } from '@/products/services/products.service';
import { PaginationComponent } from '@/shared/components/pagination/pagination.component';
import { PaginationService } from '@/shared/components/pagination/pagination.service';
import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-gender-page',
  imports: [ProductCardComponent, PaginationComponent],
  templateUrl: './gender-page.component.html',
})
export class GenderPageComponent {
  route = inject(ActivatedRoute)
  productService = inject(ProductsService);
  paginationService = inject(PaginationService)

  gender = toSignal(this.route.params.pipe(
    map( ({ gender }) => gender )
  ))

  productsResource = rxResource({
    request: () => ({ gender: this.gender(), page: this.paginationService.currentPage() }),
    loader: ({ request }) => {
      return this.productService.getProducts({
        gender: request.gender,
        offset: (request.page - 1) * 12
      })
    }
  })

  genderTrad = () => {
    switch(this.gender()) {
      case 'men':
        return 'Hombre';
      case 'women':
        return 'Mujer';
      case 'kids':
        return 'Niño';
      default:
        return 'Género no reconocido';
    }
  }

}
