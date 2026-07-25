import {
  Component,
  Inject,
  inject,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

import {
  MatDatepickerModule,
} from '@angular/material/datepicker';

import {
  MatNativeDateModule,
} from '@angular/material/core';

import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './task-form.html',
  styleUrl: './task-form.scss',
})
export class TaskForm {
  private fb = inject(FormBuilder);

  dialogRef = inject(MatDialogRef<TaskForm>);

  form!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      task?: Task;
      users?: any[];
    }
  ) {
    this.form = this.fb.group({
      title: [
        this.data.task?.title ?? '',
        Validators.required,
      ],

      description: [
        this.data.task?.description ?? '',
      ],

      priority: [
        this.data.task?.priority ?? 'MEDIUM',
        Validators.required,
      ],

      status: [
        this.data.task?.status ?? 'PENDING',
        Validators.required,
      ],

      dueDate: [
        this.data.task?.dueDate
          ? new Date(this.data.task.dueDate)
          : null,
      ],

      assignedTo: [
        this.data.task?.assignedTo?._id ?? '',
      ],
    });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogRef.close(this.form.getRawValue());
  }

  cancel() {
    this.dialogRef.close();
  }
}