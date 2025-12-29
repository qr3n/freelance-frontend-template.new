/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DriverLoginRequest } from '../models/DriverLoginRequest';
import type { IncreaseOrderProgressRequest } from '../models/IncreaseOrderProgressRequest';
import type { StartOrderProgressRequest } from '../models/StartOrderProgressRequest';
import type { TakeOrderRequest } from '../models/TakeOrderRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DriverService {
    /**
     * Driver Login
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static driverLoginApiDriverAuthLoginPost(
        requestBody: DriverLoginRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/driver/auth/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Driver Login
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static driverLoginApiDriverAuthSignupPost(
        requestBody: DriverLoginRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/driver/auth/signup',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get All Drivers Orders
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getAllDriversOrdersApiDriverOrdersGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/driver/orders',
        });
    }
    /**
     * Get Driver Order
     * @param orderId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getDriverOrderApiDriverOrdersOrderIdGet(
        orderId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/driver/orders/{order_id}',
            path: {
                'order_id': orderId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Take Order
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static takeOrderApiDriverOrdersTakePost(
        requestBody: TakeOrderRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/driver/orders/take',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Start Order Work
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static startOrderWorkApiDriverOrdersProgressStartPost(
        requestBody: StartOrderProgressRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/driver/orders/progress/start',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Next Step Order
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static nextStepOrderApiDriverOrdersProgressNextPost(
        requestBody: IncreaseOrderProgressRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/driver/orders/progress/next',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
