'use client';

import { Table, TableStatus } from '../model/types';
import { MdTableBar, MdPeople, MdCheckCircle, MdCancel, MdAccessTime } from 'react-icons/md';

interface TableCardProps {
  table: Table;
  onClick?: () => void;
}

export const TableCard = ({ table, onClick }: TableCardProps) => {
  const getStatusColor = (status: TableStatus) => {
    switch (status) {
      case TableStatus.AVAILABLE:
        return 'bg-emerald-500 text-emerald-950';
      case TableStatus.BOOKED:
        return 'bg-amber-500 text-amber-950';
      case TableStatus.OCCUPIED:
        return 'bg-rose-500 text-rose-950';
      default:
        return 'bg-gray-500 text-gray-950';
    }
  };

  const getStatusLabel = (status: TableStatus) => {
    switch (status) {
      case TableStatus.AVAILABLE:
        return 'Свободен';
      case TableStatus.BOOKED:
        return 'Забронирован';
      case TableStatus.OCCUPIED:
        return 'Занят';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: TableStatus) => {
    switch (status) {
      case TableStatus.AVAILABLE:
        return <MdCheckCircle size={20} />;
      case TableStatus.BOOKED:
        return <MdAccessTime size={20} />;
      case TableStatus.OCCUPIED:
        return <MdCancel size={20} />;
      default:
        return null;
    }
  };

  return (
    <article
      onClick={onClick}
      className={`relative rounded-3xl p-6 bg-white border-2 transition-all duration-300 ${
        table.is_active
          ? 'border-forest-200 hover:border-forest-400 hover:shadow-lg cursor-pointer'
          : 'border-gray-200 opacity-60'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-forest-100 flex items-center justify-center">
            <MdTableBar size={24} className="text-forest-700" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Стол #{table.table_number}
            </h3>
            <p className="text-sm text-gray-500">Этаж {table.floor}</p>
          </div>
        </div>

        <span
          className={`px-3 py-1.5 text-xs font-semibold rounded-full flex items-center gap-1.5 ${getStatusColor(
            table.status
          )}`}
        >
          {getStatusIcon(table.status)}
          {getStatusLabel(table.status)}
        </span>
      </div>

      <div className="flex items-center gap-2 text-gray-600">
        <MdPeople size={20} />
        <span className="text-sm font-medium">
          Вместимость: {table.capacity} {table.capacity === 1 ? 'человек' : 'человека'}
        </span>
      </div>

      {!table.is_active && (
        <div className="mt-3 text-xs text-gray-500 italic">
          Столик неактивен
        </div>
      )}
    </article>
  );
};
