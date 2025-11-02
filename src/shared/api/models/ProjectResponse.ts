/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProjectStatus } from './ProjectStatus';
import type { ProjectType } from './ProjectType';
/**
 * Схема ответа с информацией о проекте
 */
export type ProjectResponse = {
    id: string;
    name: string;
    description: (string | null);
    project_type: ProjectType;
    status: ProjectStatus;
    settings: Record<string, any>;
    owner_id: string;
    created_at: string;
    updated_at: string;
    last_accessed_at: (string | null);
    task_id: string;
};

