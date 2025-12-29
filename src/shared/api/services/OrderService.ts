/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CalculateCostRequest } from '../models/CalculateCostRequest';
import type { CreateOrderRequest } from '../models/CreateOrderRequest';
import type { UpdateOrderRequest } from '../models/UpdateOrderRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OrderService {
    /**
     * Get Orders
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getOrdersApiOrdersGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/orders',
        });
    }
    /**
     * Update Order
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static updateOrderApiOrdersPut(
        requestBody: UpdateOrderRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/orders',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create Order
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createOrderApiOrdersPost(
        requestBody: CreateOrderRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/orders',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Calculate Cost
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static calculateCostApiOrdersCostPost(
        requestBody: CalculateCostRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/orders/cost',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
