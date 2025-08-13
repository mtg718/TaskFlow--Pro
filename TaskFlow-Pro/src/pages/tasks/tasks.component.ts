import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskListComponent } from '../../components/task-list/task-list.component';
import { TaskFiltersComponent } from '../../components/task-filters/task-filters.component';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, TaskListComponent, TaskFiltersComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <!-- Page Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">All Tasks</h1>
          <p class="mt-2 text-sm text-gray-600">
            Comprehensive view of all your tasks
          </p>
        </div>

        <!-- Filters -->
        <app-task-filters />

        <!-- Task List -->
        <app-task-list />
      </div>
    </div>
  `
})
export class TasksComponent {}