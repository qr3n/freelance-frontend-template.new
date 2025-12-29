'use client';

import { Table, TableStatus } from '../model/types';
import { MdTableBar, MdPeople } from 'react-icons/md';

interface TableCardProps {
  table: Table;
  onClick?: () => void;
}

export const TableCard = ({ table, onClick }: TableCardProps) => {
  const getStatusColor = (status: TableStatus) => {
    switch (status) {
      case TableStatus.AVAILABLE:
        return 'bg-forest-100';
      case TableStatus.BOOKED:
        return 'bg-amber-100';
      case TableStatus.OCCUPIED:
        return 'bg-rose-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getStatusIconColor = (status: TableStatus) => {
    switch (status) {
      case TableStatus.AVAILABLE:
        return 'text-emerald-700';
      case TableStatus.BOOKED:
        return 'text-amber-700';
      case TableStatus.OCCUPIED:
        return 'text-rose-700';
      default:
        return 'text-gray-700';
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

  return (
    <article
      onClick={onClick}
      className={`relative rounded-3xl overflow-hidden bg-white  transition-all duration-300 group ${
        table.is_active
          ? ' cursor-pointer'
          : 'opacity-60'
      }`}
    >
      {/* Верхняя часть - визуальный акцент */}
      <div className={`relative h-48 rounded-3xl ${getStatusColor(table.status)} transition-all duration-300 group-hover:brightness-95 flex items-center justify-center`}>
        <div className={`w-24 h-24 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
          <MdTableBar size={48} className={`${getStatusIconColor(table.status)} transition-colors duration-300`} />
        </div>
        
        {!table.is_active && (
          <div className="absolute top-3 right-3 px-3 py-1 bg-gray-900/70 backdrop-blur-sm text-white text-xs font-medium rounded-full">
            Неактивен
          </div>
        )}
      </div>

      {/* Нижняя часть - информация */}
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-900 mb-1">
          Стол #{table.table_number}
        </h3>
        
        <p className="text-sm text-gray-500 mb-3">
          Этаж {table.floor}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600">
            <MdPeople size={20} />
            <span className="text-sm font-medium">
              {table.capacity} {table.capacity === 1 ? 'чел.' : 'чел.'}
            </span>
          </div>

          <span className={`px-3 h-[28px] flex items-center text-xs font-medium rounded-xl ${
            table.status === TableStatus.AVAILABLE 
              ? 'bg-emerald-100 text-emerald-700'
              : table.status === TableStatus.BOOKED
              ? 'bg-amber-100 text-amber-700'
              : 'bg-rose-100 text-rose-700'
          }`}>
            {getStatusLabel(table.status)}
          </span>
        </div>
      </div>
    </article>
  );
};
