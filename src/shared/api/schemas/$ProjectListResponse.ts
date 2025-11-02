/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ProjectListResponse = {
    description: `Схема ответа со списком проектов`,
    properties: {
        projects: {
            type: 'array',
            contains: {
                type: 'ProjectResponse',
            },
            isRequired: true,
        },
        total: {
            type: 'number',
            isRequired: true,
        },
        page: {
            type: 'number',
            isRequired: true,
        },
        size: {
            type: 'number',
            isRequired: true,
        },
    },
} as const;
