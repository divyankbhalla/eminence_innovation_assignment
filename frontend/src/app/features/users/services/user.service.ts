import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { ApiResponse } from '../../../core/models/api-response.model';
import { User } from '../../../core/models/user.model';

@Injectable({
    providedIn: 'root',
})
export class UserService {

    private http = inject(HttpClient);

    getUsers(): Observable<ApiResponse<User[]>> {
        return this.http.get<ApiResponse<User[]>>(
        `${environment.apiUrl}/users`
        );
    }

    getUser(id: string): Observable<ApiResponse<User>> {
        return this.http.get<ApiResponse<User>>(
        `${environment.apiUrl}/users/${id}`
        );
    }

    createUser(data: Partial<User>) {
        return this.http.post<ApiResponse<User>>(
        `${environment.apiUrl}/users`,
        data
        );
    }

    updateUser(id: string, data: Partial<User>) {
        return this.http.put<ApiResponse<User>>(
        `${environment.apiUrl}/users/${id}`,
        data
        );
    }

    deleteUser(id: string) {
        return this.http.delete<ApiResponse<void>>(
        `${environment.apiUrl}/users/${id}`
        );
    }

    updateRole(id: string, role: string) {
        return this.http.patch<ApiResponse<User>>(
            `${environment.apiUrl}/users/${id}/role`,
            {
                role,
            }
        );
    }

    assignTeamLead(id: string, teamLead: string) {
        return this.http.patch<ApiResponse<User>>(
            `${environment.apiUrl}/users/${id}/team-lead`,
            {
                teamLead,
            }
        );
    }

}