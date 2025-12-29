/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DisableNotificationsForUserRequest } from '../models/DisableNotificationsForUserRequest';
import type { EnableNotificationsForUserRequest } from '../models/EnableNotificationsForUserRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class NotificationsService {
    /**
     * Enable Notification
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static enableNotificationApiNotificationsUserEnablePost(
        requestBody: EnableNotificationsForUserRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/notifications/user/enable',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Disable Notification
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static disableNotificationApiNotificationsUserDisablePost(
        requestBody: DisableNotificationsForUserRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/notifications/user/disable',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Test
     * @returns any Successful Response
     * @throws ApiError
     */
    public static testApiNotificationsTestPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/notifications/test',
        });
    }
}
