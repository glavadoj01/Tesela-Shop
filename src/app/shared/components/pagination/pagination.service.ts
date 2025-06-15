import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {

  private activatedRoute = inject(ActivatedRoute);
  
  currentPage = toSignal(
    this.activatedRoute.queryParamMap.pipe(
      map( params => params.get('page') ? +params.get('page')! : 1),
      map( page => (isNaN(page) ? 1 : page)  )
    ), {
      // Como el queryParam es opcional, le damos un valor por defecto
      // Es relevante para la 1ª carga de la página
      initialValue: 1
    }
  )

}
