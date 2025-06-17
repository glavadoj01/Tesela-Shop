import { Pipe, type PipeTransform } from '@angular/core';
import { environment } from '@environments/environment';


const IMG_DEFAULT = 'assets/images/no-image.jpg';
const BASE_URL = environment.baseUrl;

@Pipe({
  name: 'productImagePipe',
})
export class ProductImagePipe implements PipeTransform {

  transform(value: null | string | string[]): string {
    if (!value || value.length === 0 || value === null) {
      return IMG_DEFAULT;
    }

    if (typeof value === 'string') {
      return `${BASE_URL}/files/product/${value}`;
    }

    const imagen = value[0]

    return `${BASE_URL}/files/product/${ imagen }`
  }
}
