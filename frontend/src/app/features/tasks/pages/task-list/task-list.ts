import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { TaskService } from '../../services/task.service';
import { UserService } from '../../../users/services/user.service';

import { Task } from '../../models/task.model';
import { User } from '../../../../core/models/user.model';

import { TaskTable } from '../../components/task-table/task-table';
import { TaskForm } from '../../components/task-form/task-form';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { SocketService } from '../../../../core/services/socket.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TaskTable,
  ],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss',
})
export class TaskList implements OnInit, OnDestroy {

  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private taskService = inject(TaskService);
  private userService = inject(UserService);
  private socket = inject(SocketService);

  loading = false;

  tasks: Task[] = [];
  filteredTasks: Task[] = [];

  users: User[] = [];

  search = '';
  selectedStatus = '';
  selectedPriority = '';
  selectedUser = '';

  ngOnInit() {
    this.loadUsers();
    this.loadTasks();
    this.registerSocketListeners();
  }

  ngOnDestroy(): void {
    this.socket.off('task:created');
    this.socket.off('task:updated');
    this.socket.off('task:deleted');
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (response) => {
        this.users = response.data;
      },
    });
  }

  loadTasks() {

    this.loading = true;

    this.taskService.getTasks().subscribe({

      next: (response) => {

        this.tasks = response.data;

        this.applyFilters();

        this.loading = false;

      },

      error: (err) => {

        console.error(err);

        this.loading = false;

      },

    });

  }

  private registerSocketListeners() {
    this.socket.on('task:created', () => {
      console.log('Task Created');
      this.loadTasks();
    });

    this.socket.on('task:updated', () => {
      console.log('Task Updated');
      this.loadTasks();
    });

    this.socket.on('task:deleted', () => {
      console.log('Task Deleted');
      this.loadTasks();
    });
  }

  applyFilters() {

    const search = this.search.toLowerCase();

    this.filteredTasks = this.tasks.filter(task => {

      const matchesSearch =
        task.title.toLowerCase().includes(search) ||
        (task.description ?? '').toLowerCase().includes(search);

      const matchesStatus =
        !this.selectedStatus ||
        task.status === this.selectedStatus;

      const matchesPriority =
        !this.selectedPriority ||
        task.priority === this.selectedPriority;

      const matchesUser =
        !this.selectedUser ||
        task.assignedTo._id === this.selectedUser;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesUser
      );

    });

  }

  private prepareTaskPayload(data: Partial<Task>) {

    const payload: Partial<Task> = { ...data };

    Object.keys(payload).forEach((key) => {

      const typedKey = key as keyof Task;

      if (
        payload[typedKey] === '' ||
        payload[typedKey] === null ||
        payload[typedKey] === undefined
      ) {

        delete payload[typedKey];

      }

    });

    return payload;

  }

  onCreateTask() {

    const dialogRef = this.dialog.open(TaskForm, {
      width: '600px',
      disableClose: true,
      data: {
        users: this.users,
      },
    });

    dialogRef.afterClosed().subscribe(result => {

      if (!result) return;

      this.taskService
        .createTask(this.prepareTaskPayload(result))
        .subscribe({

          next: () => {

            this.snackBar.open(
              'Task created successfully.',
              'Close',
              {
                duration: 3000,
              }
            );

            this.loadTasks();

          },

        });

    });

  }

  onEditTask(task: Task) {

    const dialogRef = this.dialog.open(TaskForm, {

      width: '600px',

      disableClose: true,

      data: {

        task,

        users: this.users,

      },

    });

    dialogRef.afterClosed().subscribe(result => {

      if (!result) return;

      this.taskService
        .updateTask(task._id, this.prepareTaskPayload(result))
        .subscribe({

          next: () => {

            this.snackBar.open(
              'Task updated successfully.',
              'Close',
              {
                duration: 3000,
              }
            );

            this.loadTasks();

          },

          error: () => {

            this.snackBar.open(
              'Something went wrong.',
              'Close',
              {
                duration: 3000,
              }
            );

          },

        });

    });

  }

  onDeleteTask(task: Task) {

    const dialogRef = this.dialog.open(ConfirmDialog, {

      width: '400px',

      data: {

        title: 'Delete Task',

        message: `Are you sure you want to delete "${task.title}"?`,

      },

    });

    dialogRef.afterClosed().subscribe(confirmed => {

      if (!confirmed) return;

      this.taskService.deleteTask(task._id).subscribe({

        next: () => {

          this.snackBar.open(
            'Task deleted successfully.',
            'Close',
            {
              duration: 3000,
            }
          );

          this.loadTasks();

        },

      });

    });

  }

}