import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { TaskFormComponent } from '../task-form/task-form.component';
import { Task } from '../../models/task.interface';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskFormComponent],
  template: `
    <div class="space-y-4">
      <!-- Add Task Button -->
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-900">
          Tasks ({{ filteredTasks().length }})
        </h2>
        <button
          (click)="showForm()"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Add Task
        </button>
      </div>

      <!-- Task Grid -->
      <div *ngIf="filteredTasks().length > 0; else noTasks" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let task of filteredTasks(); trackBy: trackByTaskId" 
             class="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-l-4"
             [class]="getPriorityBorderClass(task.priority)">
          
          <!-- Task Header -->
          <div class="p-6">
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center space-x-2">
                <button
                  (click)="toggleTask(task.id)"
                  class="flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200"
                  [class]="task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-green-500'"
                >
                  <svg *ngIf="task.completed" class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                </button>
                <h3 class="text-lg font-semibold text-gray-900 flex-1" 
                    [class.line-through]="task.completed" 
                    [class.text-gray-500]="task.completed">
                  {{ task.title }}
                </h3>
              </div>
              
              <!-- Priority Badge -->
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    [class]="getPriorityClass(task.priority)">
                {{ task.priority | titlecase }}
              </span>
            </div>

            <p *ngIf="task.description" class="text-gray-600 text-sm mb-4 line-clamp-2"
               [class.line-through]="task.completed">
              {{ task.description }}
            </p>

            <!-- Task Meta -->
            <div class="space-y-2 text-sm text-gray-500">
              <div *ngIf="task.category" class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path>
                </svg>
                {{ task.category }}
              </div>
              
              <div class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
                </svg>
                Due: {{ formatDate(task.dueDate) }}
              </div>
            </div>

            <!-- Task Actions -->
            <div class="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-200">
              <button
                (click)="editTask(task)"
                class="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200"
                title="Edit task"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
              
              <button
                (click)="deleteTask(task.id)"
                class="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                title="Delete task"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- No Tasks State -->
      <ng-template #noTasks>
        <div class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
          <p class="mt-1 text-sm text-gray-500">Get started by creating your first task.</p>
          <div class="mt-6">
            <button
              (click)="showForm()"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Add Task
            </button>
          </div>
        </div>
      </ng-template>

      <!-- Task Form Modal -->
      <app-task-form
        *ngIf="isFormVisible()"
        [task]="selectedTask()"
        (close)="hideForm()"
        (save)="onSaveTask($event)"
      />
    </div>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class TaskListComponent {
  private taskService = inject(TaskService);
  
  filteredTasks = this.taskService.filteredTasks;
  
  isFormVisible = signal(false);
  selectedTask = signal<Task | null>(null);

  trackByTaskId(index: number, task: Task): string {
    return task.id;
  }

  showForm(): void {
    this.selectedTask.set(null);
    this.isFormVisible.set(true);
  }

  hideForm(): void {
    this.isFormVisible.set(false);
    this.selectedTask.set(null);
  }

  editTask(task: Task): void {
    this.selectedTask.set(task);
    this.isFormVisible.set(true);
  }

  onSaveTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): void {
    const currentTask = this.selectedTask();
    
    if (currentTask) {
      this.taskService.updateTask(currentTask.id, taskData);
    } else {
      this.taskService.addTask(taskData);
    }
    
    this.hideForm();
  }

  toggleTask(id: string): void {
    this.taskService.toggleTask(id);
  }

  deleteTask(id: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id);
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  getPriorityClass(priority: string): string {
    const classes = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return classes[priority as keyof typeof classes] || classes.medium;
  }

  getPriorityBorderClass(priority: string): string {
    const classes = {
      high: 'border-red-500',
      medium: 'border-yellow-500',
      low: 'border-green-500'
    };
    return classes[priority as keyof typeof classes] || classes.medium;
  }
}