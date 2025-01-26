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

export const apiUtils = {
    updateById
}
