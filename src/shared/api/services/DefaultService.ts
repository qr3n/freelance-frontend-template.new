/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UpdateOrderActiveRequest } from '../models/UpdateOrderActiveRequest';
import type { UpdateOrderStatusRequest } from '../models/UpdateOrderStatusRequest';
import type { UpdateTariffRequest } from '../models/UpdateTariffRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
    /**
     * Get All Orders
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getAllOrdersApiAdminOrdersGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/orders',
        });
    }
    /**
     * Close Order
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static closeOrderApiAdminOrdersClosePost(
        requestBody: UpdateOrderActiveRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/orders/close',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Open Order
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static openOrderApiAdminOrdersOpenPost(
        requestBody: UpdateOrderActiveRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/orders/open',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Status
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static updateStatusApiAdminOrdersStatusPut(
        requestBody: UpdateOrderStatusRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/admin/orders/status',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Tariff
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getTariffApiAdminTariffGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/tariff',
        });
    }
    /**
     * Update Tariff
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static updateTariffApiAdminTariffPut(
        requestBody: UpdateTariffRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/admin/tariff',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
