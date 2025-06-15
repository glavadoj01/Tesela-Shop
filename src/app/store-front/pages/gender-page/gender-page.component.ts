import { ProductCardComponent } from '@/products/components/product-card/product-card.component';
import { ProductsService } from '@/products/services/products.service';
import { Component, inject } from '@angular/core';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-gender-page',
  imports: [ProductCardComponent],
  templateUrl: './gender-page.component.html',
})
export class GenderPageComponent {
  route = inject(ActivatedRoute)
  productService = inject(ProductsService);

  gender = toSignal(this.route.params.pipe(
    map( ({ gender }) => gender )
  ))

  productsResource = rxResource({
    request: () => ({ gender: this.gender() }),
    loader: ({ request }) => {
      return this.productService.getProducts({
        gender: request.gender
      }).pipe(
        map( response => response.products)
      )
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
