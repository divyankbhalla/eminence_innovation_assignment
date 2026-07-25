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

import { User } from '../../../../core/models/user.model';

@Component({
    selector: 'app-user-table',
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
    templateUrl: './user-table.html',
    styleUrl: './user-table.scss',
})
export class UserTable implements OnChanges, AfterViewInit {

    @Input() users: User[] = [];

    @Output() edit = new EventEmitter<User>();

    @Output() assignLead = new EventEmitter<User>();

    @Output() delete = new EventEmitter<User>();

    displayedColumns = [
        'username',
        'email',
        'role',
        'teamLead',
        'status',
        'actions',
    ];

    dataSource = new MatTableDataSource<User>();

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    @ViewChild(MatSort)
    sort!: MatSort;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['users']) {
        this.dataSource.data = this.users;
        }
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    onEdit(user: User) {
        this.edit.emit(user);
    }

    onAssignLead(user: User) {
        this.assignLead.emit(user);
    }

    onDelete(user: User) {
        this.delete.emit(user);
    }
}