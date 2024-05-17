import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-task-detail-dialog', 
  standalone: true,
  imports: [DatePipe],
  templateUrl: './task-detail-dialog.component.html',
  styleUrls: ['./task-detail-dialog.component.css']
})
export class TaskDetailDialogComponent {
  // Inject the data passed to the dialog using MAT_DIALOG_DATA
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}
