import { Component } from '@angular/core';
import { TodoComponent } from './todo/todo.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TaskDetailDialogComponent } from './task-detail-dialog/task-detail-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TodoComponent,MatDialogModule,TaskDetailDialogComponent],
  templateUrl: './app.component.html',
  styleUrls:['./app.component.css']
})

export class AppComponent {
  title = 'todo-app';
}
