import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'rechner',
    pathMatch: 'full',
  },
  {
    path: 'rechner',
    loadComponent: () =>
      import('./features/calculator/calculator.component').then(m => m.CalculatorComponent),
  },
];
