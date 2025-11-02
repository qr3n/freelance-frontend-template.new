/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProjectStatus } from './ProjectStatus';
/**
 * Схема для обновления проекта
 */
export type ProjectUpdateRequest = {
    name?: (string | null);
    description?: (string | null);
    settings?: (Record<string, any> | null);
    status?: (ProjectStatus | null);
};

