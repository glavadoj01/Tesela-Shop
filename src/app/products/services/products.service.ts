import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
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


  getProducts(opts: OptionsProd): Observable<ProductsResponse> {
    // Destructure options with default values
    const { limit = 9, offset = 0, gender = '' } = opts;

    return this.http
    .get<ProductsResponse>(`${BASE_URL}/products`, {
      params: {
        limit,
        offset,
        gender
      }
    })
  }

  getProductByIdSlug(idSlug: string): Observable<Product> {
    return this.http
      .get<Product>(`${BASE_URL}/products/${idSlug}`)
  }
}
