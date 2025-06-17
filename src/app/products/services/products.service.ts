import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { environment } from '@environments/environment';
import { Gender, Product, ProductsResponse } from '@products/interfaces/product-response';
import { User } from '@/auth/interfaces/user.interface';

const BASE_URL = environment.baseUrl

interface OptionsProd {
  limit?: number;
  offset?: number;
  gender?: string;
}

const emptyProduct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Kid,
  tags: [],
  images: [],
  user: {} as User
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
      tap( resp => this.productCache.set(idSlug, resp) ),
    )
  }

  getProductById(id: string): Observable<Product> {

    if (id === 'new') return of(emptyProduct);
    if (this.productCache.has(id)) return of(this.productCache.get(id)!)

    return this.http
    .get<Product>(`${BASE_URL}/products/${id}`)
    .pipe(
      tap( resp => this.productCache.set(id, resp) ),
    )
  }

  updateProduct(
    id: string,
    productLike: Partial<Product>
  ): Observable<Product> {
    return this.http.patch<Product>(`${BASE_URL}/products/${id}`, productLike).pipe(
      tap( product => this.updateProductCache(product) )
    )
  }

  createProduct(newProduct: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${BASE_URL}/products`, newProduct)
      .pipe(tap( product => this.updateProductCache(product) ));
  }

  updateProductCache(product: Product) {
    const id = product.id;

    this.productCache.set(id, product);

    this.productsCache.forEach( productsResponse => {
      productsResponse.products = productsResponse.products.map(
        currentProduct => currentProduct.id === id ? product : currentProduct
      )
    })
  }

}
