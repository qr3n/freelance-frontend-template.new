/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PasswordChange } from '../models/PasswordChange';
import type { SessionInfo } from '../models/SessionInfo';
import type { SessionResponse } from '../models/SessionResponse';
import type { UserLogin } from '../models/UserLogin';
import type { UserProfile } from '../models/UserProfile';
import type { UserRegistration } from '../models/UserRegistration';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AuthorizationService {
    /**
     * Register
     * Регистрация нового пользователя
     * @returns SessionResponse Successful Response
     * @throws ApiError
     */
    public static register({
                               requestBody,
                           }: {
        requestBody: UserRegistration,
    }): CancelablePromise<SessionResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/register',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Login
     * Вход пользователя
     * @returns SessionResponse Successful Response
     * @throws ApiError
     */
    public static login({
                            requestBody,
                        }: {
        requestBody: UserLogin,
    }): CancelablePromise<SessionResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Logout
     * Выход пользователя
     * @returns string Successful Response
     * @throws ApiError
     */
    public static logout({
                             revokeAll = false,
                         }: {
        revokeAll?: boolean,
    }): CancelablePromise<Record<string, string>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/logout',
            query: {
                'revoke_all': revokeAll,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Current User Profile
     * Получение профиля текущего пользователя
     * Теперь автоматически использует cookies из серверного контекста
     * @returns UserProfile Successful Response
     */
    public static getCurrentUserProfile(): CancelablePromise<UserProfile> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/me',
            // cookies будут добавлены автоматически в getHeaders()
        });
    }

    /**
     * Change Password
     * Смена пароля
     * @returns string Successful Response
     * @throws ApiError
     */
    public static changePassword({
                                     requestBody,
                                 }: {
        requestBody: PasswordChange,
    }): CancelablePromise<Record<string, string>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/change-password',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get User Sessions
     * Получение списка активных сессий пользователя
     * @returns SessionInfo Successful Response
     */
    public static getSessions(): CancelablePromise<Array<SessionInfo>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/sessions',
        });
    }

    /**
     * Revoke Session
     * Отзыв конкретной сессии
     * @returns string Successful Response
     * @throws ApiError
     */
    public static revokeSession({
                                    sessionId,
                                }: {
        sessionId: string,
    }): CancelablePromise<Record<string, string>> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/auth/sessions/{session_id}',
            path: {
                'session_id': sessionId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Revoke All Sessions
     * Отзыв всех сессий пользователя
     * @returns string Successful Response
     * @throws ApiError
     */
    public static revokeAllSessions({
                                        exceptCurrent = true,
                                    }: {
        exceptCurrent?: boolean,
    }): CancelablePromise<Record<string, string>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/sessions/revoke-all',
            query: {
                'except_current': exceptCurrent,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Google Auth
     * Инициация авторизации через Google
     * @returns string Successful Response
     * @throws ApiError
     */
    public static googleAuth(): CancelablePromise<Record<string, string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/google',
        });
    }

    /**
     * Google Callback
     * Обработка callback от Google
     * @returns SessionResponse Successful Response
     * @throws ApiError
     */
    public static googleCallback({
                                     code,
                                     state,
                                     error,
                                 }: {
        code: string,
        state?: (string | null),
        error?: (string | null),
    }): CancelablePromise<SessionResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/google/callback',
            query: {
                'code': code,
                'state': state,
                'error': error,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Github Auth
     * Инициация авторизации через GitHub
     * @returns string Successful Response
     * @throws ApiError
     */
    public static githubAuth(): CancelablePromise<Record<string, string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/github',
        });
    }

    /**
     * Github Callback
     * Обработка callback от GitHub
     * @returns SessionResponse Successful Response
     * @throws ApiError
     */
    public static githubCallback({
                                     code,
                                     state,
                                     error,
                                 }: {
        code: string,
        state?: (string | null),
        error?: (string | null),
    }): CancelablePromise<SessionResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/auth/github/callback',
            query: {
                'code': code,
                'state': state,
                'error': error,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}