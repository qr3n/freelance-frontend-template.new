/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $SessionInfo = {
    description: `Информация о сессии пользователя`,
    properties: {
        id: {
            type: 'string',
            isRequired: true,
        },
        created_at: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
        last_accessed: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
        ip_address: {
            type: 'any-of',
            description: `IP адрес`,
            contains: [{
                type: 'string',
            }, {
                type: 'null',
            }],
        },
        user_agent: {
            type: 'any-of',
            description: `User Agent браузера`,
            contains: [{
                type: 'string',
            }, {
                type: 'null',
            }],
        },
        is_current: {
            type: 'boolean',
            description: `Текущая сессия`,
        },
        location: {
            type: 'any-of',
            description: `Примерное местоположение`,
            contains: [{
                type: 'string',
            }, {
                type: 'null',
            }],
        },
    },
} as const;
