import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { ApiResponse } from '../../../core/models/api-response.model';
import { Task } from '../models/task.model';

@Injectable({
    providedIn: 'root',
})
export class TaskService {
    private http = inject(HttpClient);

    getTasks(): Observable<ApiResponse<Task[]>> {
        return this.http.get<ApiResponse<Task[]>>(
            `${environment.apiUrl}/tasks`
        );
    }

    getTask(id: string): Observable<ApiResponse<Task>> {
        return this.http.get<ApiResponse<Task>>(
            `${environment.apiUrl}/tasks/${id}`
        );
    }

    createTask(data: Partial<Task>) {
        return this.http.post<ApiResponse<Task>>(
            `${environment.apiUrl}/tasks`,
            data
        );
    }

    updateTask(id: string, data: Partial<Task>) {
        return this.http.patch<ApiResponse<Task>>(
            `${environment.apiUrl}/tasks/${id}`,
            data
        );
    }

    deleteTask(id: string) {
        return this.http.delete<ApiResponse<void>>(
            `${environment.apiUrl}/tasks/${id}`
        );
    }
}