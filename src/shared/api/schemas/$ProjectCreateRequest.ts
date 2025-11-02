/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ProjectCreateRequest = {
    description: `Схема для создания проекта`,
    properties: {
        name: {
            type: 'string',
            description: `Название проекта`,
            isRequired: true,
            maxLength: 100,
            minLength: 1,
        },
        description: {
            type: 'any-of',
            description: `Описание проекта`,
            contains: [{
                type: 'string',
                maxLength: 1000,
            }, {
                type: 'null',
            }],
        },
        project_type: {
            type: 'ProjectType',
            description: `Тип проекта`,
            isRequired: true,
        },
        settings: {
            type: 'any-of',
            description: `Дополнительные настройки`,
            contains: [{
                type: 'dictionary',
                contains: {
                    properties: {
                    },
                },
            }, {
                type: 'null',
            }],
        },
    },
} as const;
