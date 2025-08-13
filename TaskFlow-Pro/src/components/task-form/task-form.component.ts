import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '../../models/task.interface';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" (click)="onBackdropClick($event)">
      <div class="relative top-20 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">
              {{ task() ? 'Edit Task' : 'Create New Task' }}
            </h3>
            <button (click)="close.emit()" class="text-gray-400 hover:text-gray-600 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <form [formGroup]="taskForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                formControlName="title"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter task title..."
              >
              <div *ngIf="taskForm.get('title')?.touched && taskForm.get('title')?.errors" class="mt-1 text-sm text-red-600">
                Title is required
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                formControlName="description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter task description..."
              ></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  formControlName="priority"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  formControlName="category"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Work, Personal"
                >
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="datetime-local"
                formControlName="dueDate"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
            </div>

            <div *ngIf="task()" class="flex items-center">
              <input
                type="checkbox"
                formControlName="completed"
                id="completed"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              >
              <label for="completed" class="ml-2 block text-sm text-gray-900">
                Mark as completed
              </label>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                (click)="close.emit()"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                [disabled]="taskForm.invalid"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {{ task() ? 'Update' : 'Create' }} Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class TaskFormComponent {
  task = input<Task | null>(null);
  close = output<void>();
  save = output<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>();

  private fb = inject(FormBuilder);

  taskForm = this.fb.group({
    title: ['', [Validators.required]],
    description: [''],
    priority: ['medium'],
    category: [''],
    dueDate: [''],
    completed: [false]
  });

  constructor() {
    // Watch for task changes to populate form
    this.taskForm.patchValue(this.getInitialFormValues());
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      const taskData = {
        title: formValue.title!,
        description: formValue.description || '',
        priority: formValue.priority as 'low' | 'medium' | 'high',
        category: formValue.category || '',
        dueDate: formValue.dueDate ? new Date(formValue.dueDate) : new Date(),
        completed: formValue.completed || false
      };
      
      this.save.emit(taskData);
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }

  private getInitialFormValues() {
    const currentTask = this.task();
    if (currentTask) {
      return {
        title: currentTask.title,
        description: currentTask.description,
        priority: currentTask.priority,
        category: currentTask.category,
        dueDate: this.formatDateForInput(currentTask.dueDate),
        completed: currentTask.completed
      };
    }
    
    return {
      title: '',
      description: '',
      priority: 'medium',
      category: '',
      dueDate: this.formatDateForInput(new Date()),
      completed: false
    };
  }

  private formatDateForInput(date: Date): string {
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
      .toISOString()
      .slice(0, 16);
  }
}