/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserResponse } from './UserResponse';
/**
 * Модель ответа сессии
 */
export type SessionResponse = {
    user: UserResponse;
    /**
     * CSRF токен для защиты
     */
    csrf_token: string;
    message: string;
    expires_at?: (string | null);
};

