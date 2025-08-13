import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'tasks',
    loadComponent: () => import('../pages/tasks/tasks.component').then(m => m.TasksComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];