/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProjectType } from './ProjectType';
/**
 * Схема для создания проекта
 */
export type ProjectCreateRequest = {
    /**
     * Название проекта
     */
    name: string;
    /**
     * Описание проекта
     */
    description?: (string | null);
    /**
     * Тип проекта
     */
    project_type: ProjectType;
    /**
     * Дополнительные настройки
     */
    settings?: (Record<string, any> | null);
};

