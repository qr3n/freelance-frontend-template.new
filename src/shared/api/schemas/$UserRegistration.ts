/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $UserRegistration = {
    description: `Модель для регистрации пользователя`,
    properties: {
        email: {
            type: 'string',
            isRequired: true,
            format: 'email',
        },
        password: {
            type: 'string',
            description: `Пароль должен содержать минимум 8 символов`,
            isRequired: true,
            maxLength: 128,
            minLength: 8,
        },
        first_name: {
            type: 'any-of',
            description: `Имя пользователя`,
            contains: [{
                type: 'string',
                maxLength: 100,
            }, {
                type: 'null',
            }],
        },
        last_name: {
            type: 'any-of',
            description: `Фамилия пользователя`,
            contains: [{
                type: 'string',
                maxLength: 100,
            }, {
                type: 'null',
            }],
        },
    },
} as const;
