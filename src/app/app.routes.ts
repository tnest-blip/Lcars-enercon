import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/batch-lists/batch-lists').then(m => m.BatchListsComponent) },
  { path: 'jobs/:id', loadComponent: () => import('./pages/jobs/jobs').then(m => m.JobsComponent) },
  { path: '**', redirectTo: '' },
];
