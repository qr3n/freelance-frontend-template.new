/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Модель для регистрации пользователя
 */
export type UserRegistration = {
    email: string;
    /**
     * Пароль должен содержать минимум 8 символов
     */
    password: string;
    /**
     * Имя пользователя
     */
    first_name?: (string | null);
    /**
     * Фамилия пользователя
     */
    last_name?: (string | null);
};

