import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { TaskDetailDialogComponent } from '../task-detail-dialog/task-detail-dialog.component';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [FormsModule, CommonModule, TaskDetailDialogComponent],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})

export class TodoComponent {
  newTask: string = '';  // Variable to hold the new task name
  newTaskCreatedDate: Date = new Date();  // Variable to hold the created date of the new task
  newTaskDueDate: Date | null = null;  // Variable to hold the due date of the new task
  newTaskDescription: string = '';  // Variable to hold the description of the new task
  tasks: { name: string; completed: boolean; dueDate: Date; createdDate: Date; TaskDescription: string; }[] = [];  // Array to hold all tasks
  filteredTasks: { name: string; completed: boolean; dueDate: Date; createdDate: Date; TaskDescription: string; }[] = [];  // Array to hold filtered tasks based on the selected filter
  totalTasks: number = 0;  // Total number of tasks
  activeTasks: number = 0;  // Number of active (incomplete) tasks
  completedTasks: number = 0;  // Number of completed tasks

  constructor(public dialog: MatDialog) {
    this.filteredTasks = this.tasks;  // Initialize filteredTasks with all tasks
  }

  ngOnInit() {
    this.loadTasksFromLocalStorage();  // Load tasks from local storage when the component initializes
    this.updateTaskCounts();  // Update task counts
    this.filterTasks();  // Apply the default filter
  }

  addTask() {
    // Add a new task if the task name is not empty
    if (this.newTask.trim() !== '') {
      const createdDate = this.newTaskCreatedDate;  // Use the current date as the created date
      const dueDate = this.newTaskDueDate || new Date();  // Use the provided due date or default to the current date
      this.tasks.push({ name: this.newTask, completed: false, dueDate: dueDate, createdDate: createdDate, TaskDescription: this.newTaskDescription });
      this.saveTasksToLocalStorage();  // Save tasks to local storage
      this.newTask = '';  // Reset the new task name
      this.newTaskDueDate = null;  // Reset the new task due date
      this.newTaskDescription = '';  // Reset the new task description
      this.updateTaskCounts();  // Update task counts
      this.filterTasks();  // Apply the current filter
    }
  }

  removeTask(task: { name: string; completed: boolean; dueDate: Date; createdDate: Date; TaskDescription: string; }) {
    // Remove a task from the list
    const index = this.tasks.indexOf(task);
    if (index !== -1) {
      this.tasks.splice(index, 1);  // Remove the task from the array
      this.saveTasksToLocalStorage();  // Save the updated tasks to local storage
      this.updateTaskCounts();  // Update task counts
      this.filterTasks();  // Apply the current filter
    }
  }

  toggleTaskCompletion(task: { name: string; completed: boolean; dueDate: Date; createdDate: Date; TaskDescription: string; }) {
    // Toggle the completion status of a task
    task.completed = !task.completed;
    this.saveTasksToLocalStorage();  // Save the updated tasks to local storage
    this.updateTaskCounts();  // Update task counts
    this.filterTasks();  // Apply the current filter
  }

  saveTasksToLocalStorage() {
    // Save the tasks array to local storage
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  loadTasksFromLocalStorage() {
    // Load the tasks array from local storage
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
    // Filter tasks based on the filter type
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

  updateTaskCounts() {
    // Update the total, active, and completed task counts
    this.totalTasks = this.tasks.length;
    this.activeTasks = this.tasks.filter(task => !task.completed).length;
    this.completedTasks = this.tasks.filter(task => task.completed).length;
  }
  
  isTaskOverdue(task: { name: string; completed: boolean; dueDate: Date; createdDate: Date; TaskDescription: string; }): boolean {
    // Check if a task is overdue
      if (task.dueDate) {
        return new Date(task.dueDate) < new Date();
      }
      return false;
    }

  isTaskNearingDueDate(task: { name: string; completed: boolean; dueDate: Date; createdDate: Date; TaskDescription: string; }): boolean {
    // Check if a task is nearing its due date (within 1 day)
    if (task.dueDate) {
      const currentDate = new Date();
      const dueDate = new Date(task.dueDate);
      const timeDifference = dueDate.getTime() - currentDate.getTime();
      const daysDifference = timeDifference / (1000 * 3600 * 24);
      return daysDifference <= 1 && daysDifference >= 0;
    }
    return false;
  }

  openTaskDetailDialog(task: any): void {
    // Open the task detail dialog
    this.dialog.open(TaskDetailDialogComponent, {
      width: '400px',
      data: { task }
    });
  }
}