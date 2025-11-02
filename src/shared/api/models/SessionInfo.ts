/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Информация о сессии пользователя
 */
export type SessionInfo = {
    id: string;
    created_at: string;
    last_accessed: string;
    /**
     * IP адрес
     */
    ip_address?: (string | null);
    /**
     * User Agent браузера
     */
    user_agent?: (string | null);
    /**
     * Текущая сессия
     */
    is_current?: boolean;
    /**
     * Примерное местоположение
     */
    location?: (string | null);
};

