/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $SessionResponse = {
    description: `Модель ответа сессии`,
    properties: {
        user: {
            type: 'UserResponse',
            isRequired: true,
        },
        csrf_token: {
            type: 'string',
            description: `CSRF токен для защиты`,
            isRequired: true,
        },
        message: {
            type: 'string',
            isRequired: true,
        },
        expires_at: {
            type: 'any-of',
            contains: [{
                type: 'string',
                format: 'date-time',
            }, {
                type: 'null',
            }],
        },
    },
} as const;
