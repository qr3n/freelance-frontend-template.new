/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProjectCreateRequest } from '../models/ProjectCreateRequest';
import type { ProjectListResponse } from '../models/ProjectListResponse';
import type { ProjectResponse } from '../models/ProjectResponse';
import type { ProjectStatus } from '../models/ProjectStatus';
import type { ProjectTemplatesResponse } from '../models/ProjectTemplatesResponse';
import type { ProjectUpdateRequest } from '../models/ProjectUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProjectsService {
    /**
     * Get Project Templates
     * Получить список доступных шаблонов проектов
     * @returns ProjectTemplatesResponse Successful Response
     * @throws ApiError
     */
    public static getProjectTemplates(): CancelablePromise<ProjectTemplatesResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/projects/templates',
        });
    }
    /**
     * Create Project
     * Создать новый проект
     * @returns ProjectResponse Successful Response
     * @throws ApiError
     */
    public static createProject({
        requestBody,
    }: {
        requestBody: ProjectCreateRequest,
    }): CancelablePromise<ProjectResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/projects',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get User Projects
     * Получить список проектов пользователя
     * @returns ProjectListResponse Successful Response
     * @throws ApiError
     */
    public static getProjects({
        page = 1,
        size = 10,
        status,
    }: {
        /**
         * Номер страницы
         */
        page?: number,
        /**
         * Размер страницы
         */
        size?: number,
        /**
         * Фильтр по статусу
         */
        status?: (ProjectStatus | null),
    }): CancelablePromise<ProjectListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/projects',
            query: {
                'page': page,
                'size': size,
                'status': status,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Project
     * Получить проект по ID
     * @returns ProjectResponse Successful Response
     * @throws ApiError
     */
    public static getProject({
        projectId,
    }: {
        projectId: string,
    }): CancelablePromise<ProjectResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/projects/{project_id}',
            path: {
                'project_id': projectId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Project
     * Обновить проект
     * @returns ProjectResponse Successful Response
     * @throws ApiError
     */
    public static updateProject({
        projectId,
        requestBody,
    }: {
        projectId: string,
        requestBody: ProjectUpdateRequest,
    }): CancelablePromise<ProjectResponse> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/projects/{project_id}',
            path: {
                'project_id': projectId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Project
     * Удалить проект (мягкое удаление)
     * @returns void
     * @throws ApiError
     */
    public static deleteProject({
        projectId,
    }: {
        projectId: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/projects/{project_id}',
            path: {
                'project_id': projectId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Permanently Delete Project
     * Окончательно удалить проект
     * @returns void
     * @throws ApiError
     */
    public static deleteProjectPermanently({
        projectId,
    }: {
        projectId: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/projects/{project_id}/permanent',
            path: {
                'project_id': projectId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
