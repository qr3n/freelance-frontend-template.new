/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProjectResponse } from './ProjectResponse';
/**
 * Схема ответа со списком проектов
 */
export type ProjectListResponse = {
    projects: Array<ProjectResponse>;
    total: number;
    page: number;
    size: number;
};

