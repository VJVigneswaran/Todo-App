import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css'
})
export class TodoComponent {
  newTask: string = '';
  tasks: { name: string, completed: boolean }[] = [];
  filteredTasks: { name: string, completed: boolean }[] = [];
  editModeIndex: number | null = null;
  totalTasks: number = 0;
  activeTasks:number = 0;
  completedTasks:number = 0;
  
  constructor() {
    // Initialize filteredTasks with all tasks initially
    this.filteredTasks = this.tasks;
  }

  ngOnInit() {
    this.loadTasksFromLocalStorage();
    this.updateTaskCounts();
    this.filterTasks();
  }

  addTask() {
    if (this.newTask.trim() !== '') {
      this.tasks.push({ name: this.newTask, completed: false });
      this.saveTasksToLocalStorage();
      this.newTask = '';
      this.updateTaskCounts();
      this.filterTasks();
    }  
  }

  removeTask(task: { name: string, completed: boolean }) {
    const index = this.tasks.indexOf(task);
    if (index !== -1) {
      this.tasks.splice(index, 1);
      this.saveTasksToLocalStorage();
      this.updateTaskCounts();
      this.filterTasks();
    } 
  }

  toggleTaskCompletion(task: { name: string, completed: boolean }) {
    task.completed = !task.completed;
    this.saveTasksToLocalStorage();
    this.updateTaskCounts();
    this.filterTasks();
  }
  saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  loadTasksFromLocalStorage() {
    if (typeof localStorage !== 'undefined') {
      const storedTasks = localStorage.getItem('tasks');
      if (storedTasks) {
        this.tasks = JSON.parse(storedTasks);
        this.tasks.forEach(task => {
          task.completed = !!task.completed;
        });
      }
    } else {
      console.error('localStorage is not available. Tasks cannot be loaded from localStorage.');
    }
  }

  filterTasks(filterType?: string) {
    switch (filterType) {
      case 'active':
        this.filteredTasks = this.tasks.filter(task => !task.completed);
        break;
      case 'completed':
        this.filteredTasks = this.tasks.filter(task => task.completed);
        break;
      default:
        this.filteredTasks = this.tasks;
        break;
    }
  }

  startEditingTask(index: number) {
    this.editModeIndex = index;
  }

  finishEditingTask(task: { name: string, completed: boolean }) {
    if (this.editModeIndex !== null) {
      this.editModeIndex = null;
      this.saveTasksToLocalStorage();
    }
  }
  updateTaskCounts() {
    this.totalTasks = this.tasks.length;
    this.activeTasks = this.tasks.filter(task => !task.completed).length;
    this.completedTasks = this.tasks.filter(task => task.completed).length;
  }
}


  