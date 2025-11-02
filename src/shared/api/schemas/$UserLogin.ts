/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $UserLogin = {
    description: `Модель для входа пользователя`,
    properties: {
        email: {
            type: 'string',
            isRequired: true,
            format: 'email',
        },
        password: {
            type: 'string',
            description: `Пароль пользователя`,
            isRequired: true,
        },
        remember_me: {
            type: 'boolean',
            description: `Запомнить меня`,
        },
    },
} as const;
