import { User } from '../../../core/models/user.model';

export type TaskStatus =
    | 'PENDING'
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'CANCELLED';

export type TaskPriority =
    | 'LOW'
    | 'MEDIUM'
    | 'HIGH';

export interface Task {
    _id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: string;
    assignedTo: User;
    createdBy: User;
    createdAt: string;
    updatedAt: string;
}