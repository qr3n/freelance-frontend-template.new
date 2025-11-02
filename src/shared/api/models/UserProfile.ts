/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Расширенная модель профиля пользователя
 */
export type UserProfile = {
    id: string;
    email: string;
    first_name?: (string | null);
    last_name?: (string | null);
    is_active: boolean;
    is_verified: boolean;
    /**
     * URL аватара
     */
    avatar_url?: (string | null);
    /**
     * Провайдер аутентификации
     */
    provider?: string;
    created_at: string;
    last_login?: (string | null);
};

