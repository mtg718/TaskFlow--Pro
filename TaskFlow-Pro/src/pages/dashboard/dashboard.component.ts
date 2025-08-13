import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsComponent } from '../../components/stats/stats.component';
import { TaskFiltersComponent } from '../../components/task-filters/task-filters.component';
import { TaskListComponent } from '../../components/task-list/task-list.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, StatsComponent, TaskFiltersComponent, TaskListComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <!-- Page Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p class="mt-2 text-sm text-gray-600">
            Manage your tasks efficiently and stay organized
          </p>
        </div>

        <!-- Stats -->
        <app-stats />

        <!-- Filters -->
        <app-task-filters />

        <!-- Task List -->
        <app-task-list />
      </div>
    </div>
  `
})
export class DashboardComponent {}