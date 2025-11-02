/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $UserProfile = {
    description: `Расширенная модель профиля пользователя`,
    properties: {
        id: {
            type: 'string',
            isRequired: true,
            format: 'uuid',
        },
        email: {
            type: 'string',
            isRequired: true,
            format: 'email',
        },
        first_name: {
            type: 'any-of',
            contains: [{
                type: 'string',
            }, {
                type: 'null',
            }],
        },
        last_name: {
            type: 'any-of',
            contains: [{
                type: 'string',
            }, {
                type: 'null',
            }],
        },
        is_active: {
            type: 'boolean',
            isRequired: true,
        },
        is_verified: {
            type: 'boolean',
            isRequired: true,
        },
        avatar_url: {
            type: 'any-of',
            description: `URL аватара`,
            contains: [{
                type: 'string',
            }, {
                type: 'null',
            }],
        },
        provider: {
            type: 'string',
            description: `Провайдер аутентификации`,
        },
        created_at: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
        last_login: {
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
