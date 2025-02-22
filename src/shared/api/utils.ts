import { queryClient } from "./react-query";

/**
 * Обновляет элемент в массиве данных в `queryClient` по его `id`.
 * @param queryKey - Ключ данных в `queryClient`.
 * @param id - Идентификатор элемента, который нужно обновить.
 * @param updatedData - Данные, которыми нужно обновить элемент.
 */
function updateById<T extends { id: number | string }>(
    queryKey: readonly unknown[],
    id: T['id'],
    updatedData: Partial<T>
): void {
    queryClient.setQueryData<T[] | undefined>(queryKey, (oldData) => {
        if (!oldData) return undefined;

        return oldData.map((item) =>
            item.id === id ? { ...item, ...updatedData } : item
        );
    });
}


type CamelCaseObjectKeys<T extends object> = {
    [key in keyof T as CamelCase<key & string>]: T[key];
};

type CamelCase<S extends string> = S extends `${infer P}_${infer Rest}`
  ? `${Lowercase<P>}${Capitalize<CamelCase<Rest>>}`
  : Lowercase<S>;

type SnakeCase<S extends string> = S extends `${infer P}${infer Rest}`
  ? P extends Uppercase<P>
    ? `_${Lowercase<P>}${SnakeCase<Rest>}`
    : `${Lowercase<P>}${SnakeCase<Rest>}`
  : S;

/**
 * Преобразует ключи объекта из snake_case в camelCase рекурсивно.
 * @param obj - Объект, у которого нужно преобразовать ключи.
 * @returns Новый объект с преобразованными ключами в camelCase.
 */
export const toCamelCase = <T extends object>(obj: T): CamelCaseObjectKeys<T> => {
    const entries = Object.entries(obj);
    const mappedEntries = entries.map(([k, v]) => {
        const camelKey = k.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        const value = v && typeof v === 'object' && !Array.isArray(v) ? toCamelCase(v) : v;
        return [camelKey, value];
    });

    return Object.fromEntries(mappedEntries) as CamelCaseObjectKeys<T>;
};

/**
 * Преобразует ключи объекта из camelCase в snake_case рекурсивно.
 * @param obj - Объект, у которого нужно преобразовать ключи.
 * @returns Новый объект с преобразованными ключами в snake_case.
 */
export const toSnakeCase = <T extends object>(obj: T): { [key in keyof T as SnakeCase<key & string>]: T[key] } => {
    const entries = Object.entries(obj);
    const mappedEntries = entries.map(([k, v]) => {
        const snakeKey = k.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        const value = v && typeof v === 'object' && !Array.isArray(v) ? toSnakeCase(v) : v;
        return [snakeKey, value];
    });

    return Object.fromEntries(mappedEntries) as { [key in keyof T as SnakeCase<key & string>]: T[key] };
};


export const apiUtils = {
    updateById,
    toCamelCase,
    toSnakeCase
}
