import { Routes } from "@angular/router";
import { StoreFrontLayoutComponent } from "@storefront/layouts/store-front-layout/store-front-layout.component";
import { HomePageComponent } from "@storefront/pages/home-page/home-page.component";
import { GenderPageComponent } from "@storefront/pages/gender-page/gender-page.component";
import { ProductPageComponent } from "@storefront/pages/product-page/product-page.component";
import { NotFoundPageComponent } from "@storefront/pages/not-found-page/not-found-page.component";


export const storeFrontRoutes: Routes = [
  {
    path: '',
    component: StoreFrontLayoutComponent,
    children: [
      {
        path: '',
        component: HomePageComponent
      },
      {
        path: 'gender/:gender',
        component: GenderPageComponent
      },
      {
        path: 'product/:idSlug',
        component: ProductPageComponent
      },
      {
        path: '**',
        component: NotFoundPageComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: '',
  }
]

export default storeFrontRoutes;
