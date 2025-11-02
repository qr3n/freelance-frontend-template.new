/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $PasswordChange = {
    description: `Модель для смены пароля`,
    properties: {
        current_password: {
            type: 'string',
            description: `Текущий пароль`,
            isRequired: true,
        },
        new_password: {
            type: 'string',
            description: `Новый пароль`,
            isRequired: true,
            maxLength: 128,
            minLength: 8,
        },
    },
} as const;
