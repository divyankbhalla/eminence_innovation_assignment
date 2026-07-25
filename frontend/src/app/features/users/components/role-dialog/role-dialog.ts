import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { User } from '../../../../core/models/user.model';

@Component({
    selector: 'app-role-dialog',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,

        MatDialogModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButtonModule,
    ],
    templateUrl: './role-dialog.html',
})
export class RoleDialog {

    private fb = inject(FormBuilder);
    dialogRef = inject(MatDialogRef<RoleDialog>);

    form = this.fb.group({
        role: [
        '',
        Validators.required,
        ],
    });

    roles = [
        'MANAGER',
        'TEAM_LEAD',
        'EMPLOYEE',
    ];

    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: {
        user: User;
        }
    ) {
        this.form.patchValue({
        role: data.user.role,
        });
    }

    save() {
        if (this.form.invalid) {
        return;
        }

        this.dialogRef.close(
        this.form.value.role
        );
    }

    cancel() {
        this.dialogRef.close();
    }
}