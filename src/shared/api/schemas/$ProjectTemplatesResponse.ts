/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ProjectTemplatesResponse = {
    description: `Список доступных шаблонов проектов`,
    properties: {
        templates: {
            type: 'array',
            contains: {
                type: 'ProjectTemplateInfo',
            },
            isRequired: true,
        },
    },
} as const;
