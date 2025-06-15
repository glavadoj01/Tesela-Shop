import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, Observable, of, tap } from 'rxjs';
import { environment } from '@environments/environment';
import { Product, ProductsResponse } from '@products/interfaces/product-response';

const BASE_URL = environment.baseUrl

interface OptionsProd {
  limit?: number;
  offset?: number;
  gender?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private http = inject(HttpClient)
  private productsCache = new Map<string,ProductsResponse>()
  private productCache = new Map<string,Product>()


  getProducts(opts: OptionsProd): Observable<ProductsResponse> {
    // Destructure options with default values
    const { limit = 12, offset = 0, gender = '' } = opts;

    const key = `${limit}-${offset}-${gender}`
    if (this.productsCache.has(key)) {
      return of(this.productsCache.get(key)!)
    }

    return this.http
    .get<ProductsResponse>(`${BASE_URL}/products`, {
      params: {
        limit,
        offset,
        gender
      }
    }).pipe(
      tap( resp => this.productsCache.set(key, resp) )
    )
  }

  getProductByIdSlug(idSlug: string): Observable<Product> {

    if (this.productCache.has(idSlug)) {
      return of(this.productCache.get(idSlug)!)
    }

    return this.http
    .get<Product>(`${BASE_URL}/products/${idSlug}`)
    .pipe(
      delay(2000), // Simulate a delay of 2 seconds
      tap( resp => this.productCache.set(idSlug, resp) ),
    )
  }
}
