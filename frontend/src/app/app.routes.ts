import { Routes } from '@angular/router';

import { Login } from './features/auth/pages/login/login';
import { Home } from './features/dashboard/pages/home/home';
import { MainLayout } from './layout/pages/main-layout/main-layout';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
    {
        path: 'login',
        component: Login,
    },

    {
        path: '',
        component: MainLayout,
        canActivate: [authGuard],
        children: [
            {
                path: 'dashboard',
                component: Home,
            },
            {
                path: 'tasks',
                loadComponent: () =>
                import('./features/tasks/pages/task-list/task-list').then(
                    (c) => c.TaskList
                ),
            },
            {
                path: 'users',
                loadComponent: () =>
                    import('./features/users/pages/user-list/user-list')
                        .then(c => c.UserList),
                canActivate: [
                    authGuard,
                    roleGuard(['MANAGER']),
                ],
            },

            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full',
            },
        ],
    },

    {
        path: '**',
        redirectTo: '',
    },
];