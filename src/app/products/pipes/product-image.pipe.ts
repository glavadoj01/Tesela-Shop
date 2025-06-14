import { Pipe, type PipeTransform } from '@angular/core';
import { environment } from '@environments/environment';


const IMG_DEFAULT = 'public/assets/images/no-image.png';
const BASE_URL = environment.baseUrl;

@Pipe({
  name: 'productImagePipe',
})
export class ProductImagePipe implements PipeTransform {

  transform(value: string | string[]): string {
    if (!value || value.length === 0) {
      return IMG_DEFAULT;
    }

    return `${BASE_URL}/files/product/${ value[0] }`;
  }
}
