import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { User } from '../../../../core/models/user.model';
import { UserService } from '../../services/user.service';
import { UserTable } from '../../components/user-table/user-table';
import { RoleDialog } from '../../components/role-dialog/role-dialog';
import { AssignLeadDialog } from '../../components/assign-lead-dialog/assign-lead-dialog';

@Component({
    selector: 'app-user-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,

        MatCardModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatDialogModule,

        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,

        UserTable,
    ],
    templateUrl: './user-list.html',
    styleUrl: './user-list.scss',
})
export class UserList implements OnInit {

    private userService = inject(UserService);
    private snackBar = inject(MatSnackBar);
    private dialog = inject(MatDialog);

    users: User[] = [];
    filteredUsers: User[] = [];

    loading = false;

    search = '';

    selectedRole = '';

    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers() {

        this.loading = true;

        this.userService.getUsers().subscribe({
            next: (response) => {
                this.users = response.data;
                this.filteredUsers = [...this.users];
                this.loading = false;
            },

            error: (err) => {
                console.error(err);
                this.loading = false;
                this.snackBar.open(
                    'Unable to load users.',
                    'Close',
                    {
                        duration: 3000,
                    }
                );
            },

        });

    }

    onAssignLead(user: User) {
        this.userService.getUsers().subscribe({
            next: (response) => {
                const teamLeads = response.data.filter(
                    u => u.role === 'TEAM_LEAD'
                );
                const dialogRef = this.dialog.open(
                    AssignLeadDialog,
                    {
                        width: '450px',
                        data: {
                            user,
                            teamLeads,
                        },
                    }
                );
                dialogRef.afterClosed().subscribe(result => {
                    if (!result) {
                        return;
                    }
                    this.userService.assignTeamLead(
                        user._id,
                        result
                    ).subscribe({
                        next: () => {
                            this.snackBar.open(
                                'Team Lead assigned successfully.',
                                'Close',
                                {
                                    duration: 3000,
                                }
                            );
                            this.loadUsers();
                        },
                        error: (err) => {
                            console.error(err);
                            this.snackBar.open(
                                'Unable to assign Team Lead.',
                                'Close',
                                {
                                    duration: 3000,
                                }
                            );
                        },
                    });
                });
            },
        });

    }

    applyFilters() {
        this.filteredUsers = this.users.filter(user => {
            const matchesSearch =
                user.username
                .toLowerCase()
                .includes(this.search.toLowerCase()) ||

                user.email
                .toLowerCase()
                .includes(this.search.toLowerCase());

            const matchesRole =
                !this.selectedRole ||
                user.role === this.selectedRole;

            return (
                matchesSearch &&
                matchesRole
            );
        });

    }

    onCreateUser() {
        this.snackBar.open(
            'Create User - Coming Soon',
            'Close',
            {
                duration: 3000,
            }
        );
    }

    onEditUser(user: User) {
        const dialogRef = this.dialog.open(RoleDialog, {
            width: '450px',
            data: {
                user,
            },
        });

        dialogRef.afterClosed().subscribe(role => {
            if (!role) {
                return;
            }
            this.userService.updateRole(
                user._id,
                role
            ).subscribe({
                next: () => {
                    this.snackBar.open(
                        'Role updated successfully.',
                        'Close',
                        {
                            duration: 3000,
                        }
                    );
                    this.loadUsers();
                },

                error: (err) => {
                    console.error(err);
                    this.snackBar.open(
                        'Unable to update role.',
                        'Close',
                        {
                            duration: 3000,
                        }
                    );
                },
            });
        });
    }

    onDeleteUser(user: User) {
        console.log(user);
        this.snackBar.open(
            'Delete User - Coming Soon',
            'Close',
            {
                duration: 3000,
            }
        );
    }

}