/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChangeProfileInfoRequest } from '../models/ChangeProfileInfoRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProfileService {
    /**
     * Change Profile Info
     * @returns any Successful Response
     * @throws ApiError
     */
    public static changeProfileInfoApiProfileGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/profile',
        });
    }
    /**
     * Change Profile Info
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static changeProfileInfoApiProfilePut(
        requestBody: ChangeProfileInfoRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/profile',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
