/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type CreateOrderRequest = {
    shipment_type: string;
    marketplace?: (string | null);
    packing_type?: (string | null);
    what_to_deliver?: (Array<string> | null);
    package_length: number;
    package_width: number;
    package_height: number;
    places_count: number;
    weight: number;
    pickup_addresses: Array<string>;
    delivery_addresses: Array<string>;
    comment?: (string | null);
    sender_phone: string;
    recipient_phone: string;
    pickup_date: string;
    delivery_date: string;
    pickup_time_from: string;
    pickup_time_to: string;
    delivery_time_from: string;
    delivery_time_to: string;
};

