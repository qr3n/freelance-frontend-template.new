'use client';

import { TableCard, Table } from '@/entities/table';
import { useTables } from '@/features/table/model/hooks';
import { EditTableModal } from '@/features/table/edit';
import { useState } from 'react';

interface TablesListProps {
  businessId: string;
  initialTables?: Table[];
}

export const TablesList = ({ businessId, initialTables }: TablesListProps) => {
  const { data: tables, isLoading } = useTables(businessId, initialTables);
  const [editingTable, setEditingTable] = useState<Table | null>(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-[180px] rounded-3xl bg-gray-200 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!tables || tables.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            Нет столиков
          </h3>
          <p className="text-gray-600 mb-6">
            Начните с добавления первого столика
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {tables.map((table) => (
          <TableCard
            key={table.id}
            table={table}
            onClick={() => setEditingTable(table)}
          />
        ))}
      </div>

      {editingTable && (
        <EditTableModal
          businessId={businessId}
          table={editingTable}
          open={!!editingTable}
          onOpenChange={(open) => !open && setEditingTable(null)}
        />
      )}
    </>
  );
};
