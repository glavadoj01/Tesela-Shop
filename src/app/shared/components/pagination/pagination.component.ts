import { Component, computed, input, linkedSignal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagination',
  imports: [RouterLink],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {

  pages = input(0)
  currentPage = input<number>(1)
  // Para que se refresque con el click
  activatedPage = linkedSignal(this.currentPage)

  getPagesList = computed( () =>
    Array.from( { length: this.pages() }, (_, i) => i + 1)
  );
}
