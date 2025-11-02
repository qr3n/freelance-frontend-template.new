/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ProjectUpdateRequest = {
    description: `Схема для обновления проекта`,
    properties: {
        name: {
            type: 'any-of',
            contains: [{
                type: 'string',
                maxLength: 100,
                minLength: 1,
            }, {
                type: 'null',
            }],
        },
        description: {
            type: 'any-of',
            contains: [{
                type: 'string',
                maxLength: 1000,
            }, {
                type: 'null',
            }],
        },
        settings: {
            type: 'any-of',
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
        status: {
            type: 'any-of',
            contains: [{
                type: 'ProjectStatus',
            }, {
                type: 'null',
            }],
        },
    },
} as const;
