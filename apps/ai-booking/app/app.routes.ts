import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'search-loading',
    loadComponent: () =>
      import('./pages/search-loading/search-loading.component').then(
        (m) => m.SearchLoadingComponent
      ),
  },
  {
    path: 'search-results',
    loadComponent: () =>
      import('./pages/search-results/search-results.component').then(
        (m) => m.SearchResultsComponent
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
