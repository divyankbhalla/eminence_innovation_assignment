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
    selector: 'app-assign-lead-dialog',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButtonModule,
    ],
    templateUrl: './assign-lead-dialog.html',
    styleUrl: './assign-lead-dialog.scss',
})
export class AssignLeadDialog {
    private fb = inject(FormBuilder);
    dialogRef = inject(MatDialogRef<AssignLeadDialog>);

    form = this.fb.group({
        teamLead: [
            '',
            Validators.required,
        ],
    });

    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: {
            user: User;
            teamLeads: User[];
        }
    ) {
        this.form.patchValue({
        teamLead: data.user.teamLead?._id ?? '',
        });
    }

    save() {
        if (this.form.invalid) {
            return;
        }
        this.dialogRef.close(
            this.form.value.teamLead
        );
    }

    cancel() {
        this.dialogRef.close();
    }

}