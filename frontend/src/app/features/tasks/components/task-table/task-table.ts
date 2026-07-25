import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
  ],
  templateUrl: './task-table.html',
  styleUrl: './task-table.scss',
})
export class TaskTable implements OnChanges, AfterViewInit {
  @Input() tasks: Task[] = [];

  @Output() edit = new EventEmitter<Task>();

  @Output() delete = new EventEmitter<Task>();

  displayedColumns = [
    'title',
    'assignedTo',
    'priority',
    'status',
    'dueDate',
    'actions',
  ];

  dataSource = new MatTableDataSource<Task>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tasks']) {
      this.dataSource.data = this.tasks;
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onEdit(task: Task) {
    this.edit.emit(task);
  }

  onDelete(task: Task) {
    this.delete.emit(task);
  }
}