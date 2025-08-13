import { Injectable, signal, computed } from '@angular/core';
import { Task, TaskFilter } from '../models/task.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksSignal = signal<Task[]>([]);
  private filterSignal = signal<TaskFilter>({
    search: '',
    status: 'all',
    priority: 'all',
    category: ''
  });

  // Computed signals for reactive data
  tasks = this.tasksSignal.asReadonly();
  filter = this.filterSignal.asReadonly();

  filteredTasks = computed(() => {
    const tasks = this.tasksSignal();
    const filter = this.filterSignal();

    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(filter.search.toLowerCase()) ||
                           task.description.toLowerCase().includes(filter.search.toLowerCase());
      
      const matchesStatus = filter.status === 'all' || 
                           (filter.status === 'completed' && task.completed) ||
                           (filter.status === 'pending' && !task.completed);
      
      const matchesPriority = filter.priority === 'all' || task.priority === filter.priority;
      
      const matchesCategory = !filter.category || task.category === filter.category;

      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    }).sort((a, b) => {
      // Sort by priority and due date
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[a.priority];
      const bPriority = priorityOrder[b.priority];
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  });

  stats = computed(() => {
    const tasks = this.tasksSignal();
    return {
      total: tasks.length,
      completed: tasks.filter(t => t.completed).length,
      pending: tasks.filter(t => !t.completed).length,
      highPriority: tasks.filter(t => t.priority === 'high' && !t.completed).length
    };
  });

  categories = computed(() => {
    const tasks = this.tasksSignal();
    return [...new Set(tasks.map(task => task.category))].filter(Boolean);
  });

  constructor() {
    this.loadTasks();
    this.seedInitialData();
  }

  addTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): void {
    const newTask: Task = {
      ...taskData,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.tasksSignal.update(tasks => [...tasks, newTask]);
    this.saveTasks();
  }

  updateTask(id: string, updates: Partial<Task>): void {
    this.tasksSignal.update(tasks =>
      tasks.map(task =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date() }
          : task
      )
    );
    this.saveTasks();
  }

  deleteTask(id: string): void {
    this.tasksSignal.update(tasks => tasks.filter(task => task.id !== id));
    this.saveTasks();
  }

  toggleTask(id: string): void {
    this.updateTask(id, { completed: !this.tasksSignal().find(t => t.id === id)?.completed });
  }

  updateFilter(filter: Partial<TaskFilter>): void {
    this.filterSignal.update(current => ({ ...current, ...filter }));
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private saveTasks(): void {
    localStorage.setItem('tasks', JSON.stringify(this.tasksSignal()));
  }

  private loadTasks(): void {
    const saved = localStorage.getItem('tasks');
    if (saved) {
      try {
        const tasks = JSON.parse(saved).map((task: any) => ({
          ...task,
          dueDate: new Date(task.dueDate),
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt)
        }));
        this.tasksSignal.set(tasks);
      } catch (error) {
        console.error('Error loading tasks:', error);
      }
    }
  }

  private seedInitialData(): void {
    if (this.tasksSignal().length === 0) {
      const sampleTasks: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>[] = [
        {
          title: 'Complete Angular Interview Project',
          description: 'Finish the task manager application with all features',
          completed: false,
          priority: 'high',
          category: 'Work',
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
        },
        {
          title: 'Review TypeScript Best Practices',
          description: 'Study advanced TypeScript patterns and Angular coding standards',
          completed: true,
          priority: 'medium',
          category: 'Learning',
          dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000)
        },
        {
          title: 'Prepare for Technical Questions',
          description: 'Review Angular concepts, RxJS, and modern web development',
          completed: false,
          priority: 'high',
          category: 'Interview',
          dueDate: new Date(Date.now() + 12 * 60 * 60 * 1000)
        },
        {
          title: 'Update Portfolio',
          description: 'Add recent projects and improve presentation',
          completed: false,
          priority: 'medium',
          category: 'Personal',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        }
      ];

      sampleTasks.forEach(task => this.addTask(task));
    }
  }
}