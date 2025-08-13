import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Search -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <input
              type="text"
              [(ngModel)]="searchTerm"
              (input)="updateSearch()"
              placeholder="Search tasks..."
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
          </div>
        </div>

        <!-- Status Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            [(ngModel)]="statusFilter"
            (change)="updateStatus()"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <!-- Priority Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Priority</label>
          <select
            [(ngModel)]="priorityFilter"
            (change)="updatePriority()"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <!-- Category Filter -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            [(ngModel)]="categoryFilter"
            (change)="updateCategory()"
            class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            <option *ngFor="let category of categories()" [value]="category">
              {{ category }}
            </option>
          </select>
        </div>
      </div>

      <!-- Active Filters -->
      <div *ngIf="hasActiveFilters()" class="mt-4 pt-4 border-t border-gray-200">
        <div class="flex flex-wrap gap-2">
          <span class="text-sm font-medium text-gray-700 mr-2">Active filters:</span>
          
          <span *ngIf="searchTerm" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Search: "{{ searchTerm }}"
            <button (click)="clearSearch()" class="ml-1 text-blue-600 hover:text-blue-800">
              <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
            </button>
          </span>

          <span *ngIf="statusFilter !== 'all'" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Status: {{ statusFilter }}
            <button (click)="clearStatus()" class="ml-1 text-green-600 hover:text-green-800">
              <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
            </button>
          </span>

          <span *ngIf="priorityFilter !== 'all'" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Priority: {{ priorityFilter }}
            <button (click)="clearPriority()" class="ml-1 text-yellow-600 hover:text-yellow-800">
              <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
            </button>
          </span>

          <span *ngIf="categoryFilter" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            Category: {{ categoryFilter }}
            <button (click)="clearCategory()" class="ml-1 text-purple-600 hover:text-purple-800">
              <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
            </button>
          </span>

          <button (click)="clearAllFilters()" class="text-sm text-gray-500 hover:text-gray-700 underline">
            Clear all
          </button>
        </div>
      </div>
    </div>
  `
})
export class TaskFiltersComponent {
  private taskService = inject(TaskService);
  
  categories = this.taskService.categories;
  
  searchTerm = '';
  statusFilter: 'all' | 'completed' | 'pending' = 'all';
  priorityFilter: 'all' | 'low' | 'medium' | 'high' = 'all';
  categoryFilter = '';

  updateSearch(): void {
    this.taskService.updateFilter({ search: this.searchTerm });
  }

  updateStatus(): void {
    this.taskService.updateFilter({ status: this.statusFilter });
  }

  updatePriority(): void {
    this.taskService.updateFilter({ priority: this.priorityFilter });
  }

  updateCategory(): void {
    this.taskService.updateFilter({ category: this.categoryFilter });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.updateSearch();
  }

  clearStatus(): void {
    this.statusFilter = 'all';
    this.updateStatus();
  }

  clearPriority(): void {
    this.priorityFilter = 'all';
    this.updatePriority();
  }

  clearCategory(): void {
    this.categoryFilter = '';
    this.updateCategory();
  }

  clearAllFilters(): void {
    this.searchTerm = '';
    this.statusFilter = 'all';
    this.priorityFilter = 'all';
    this.categoryFilter = '';
    
    this.taskService.updateFilter({
      search: '',
      status: 'all',
      priority: 'all',
      category: ''
    });
  }

  hasActiveFilters(): boolean {
    return this.searchTerm !== '' || 
           this.statusFilter !== 'all' || 
           this.priorityFilter !== 'all' || 
           this.categoryFilter !== '';
  }
}