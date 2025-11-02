/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Модель для входа пользователя
 */
export type UserLogin = {
    email: string;
    /**
     * Пароль пользователя
     */
    password: string;
    /**
     * Запомнить меня
     */
    remember_me?: boolean;
};

