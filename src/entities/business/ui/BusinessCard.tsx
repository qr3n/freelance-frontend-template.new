'use client';

import Link from 'next/link';
import { Modal } from '@/shared/ui/modal';
import type { Business } from '../model/types';

interface BusinessCardProps {
  business: Business;
  className?: string;
}

export const BusinessCard = ({ business, className = '' }: BusinessCardProps) => {
  return (
    <Modal
      title={business.name}
      description={business.description}
      trigger={
        <article
          className={`relative w-full sm:w-[320px] group cursor-pointer overflow-hidden ${className}`}
        >
          <div className="relative z-10">
            <div className="overflow-hidden rounded-[32px] bg-forest-50 aspect-square flex items-center justify-center transition-all duration-300 group-hover:scale-[1.02] ">
              <div className="text-center flex flex-col items-center justify-center p-8">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-sage-500 flex items-center justify-center text-white text-3xl font-bold">
                  {business.name.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-2xl font-bold text-emerald-950 mb-2">
                  {business.name}
                </h3>
                <p className="text-xs bg-forest-500 text-sage-100 font-semibold rounded-full w-max px-2">
                  {business.business_type === 'restaurant' ? 'Ресторан' : 'Неизвестен'}
                </p>
              </div>
            </div>

            <div className="mt-3">
              <div className="relative h-12 overflow-hidden mb-2">
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {business.description}
                </p>
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    business.is_active
                      ? 'bg-emerald-500 text-emerald-950'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {business.is_active ? 'Активен' : 'Неактивен'}
                </span>

                <Link href={`/dashboard/business/${business.id}`}>
                  <button
                    className="h-9 px-4 bg-emerald-950 rounded-2xl text-white text-sm font-semibold transition-all duration-300  active:scale-95"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Открыть
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </article>
      }
    >
      <div className="space-y-6">
        <div className="overflow-hidden rounded-[32px] bg-forest-100 aspect-square flex items-center justify-center">
          <div className="text-center p-12">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-6xl font-bold">
              {business.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-3xl font-bold text-emerald-950 mb-3">
              {business.name}
            </h2>
            <p className="text-lg text-emerald-700 font-medium">
              {business.business_type}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">Описание</h3>
          <p className="text-gray-600 leading-relaxed">{business.description}</p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Статус</p>
            <span
              className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                business.is_active
                  ? 'bg-emerald-500 text-emerald-950'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {business.is_active ? 'Активен' : 'Неактивен'}
            </span>
          </div>
          <div className="text-right space-y-1">
            <p className="text-sm text-gray-500">Обновлено</p>
            <p className="text-sm font-medium">
              {new Date(business.updated_at).toLocaleDateString('ru-RU')}
            </p>
          </div>
        </div>

        <Link href={`/dashboard/business/${business.id}`} className="block">
          <button className="w-full h-12 bg-emerald-950 rounded-2xl text-white font-semibold transition-all duration-300  active:scale-95">
            Перейти к бизнесу
          </button>
        </Link>
      </div>
    </Modal>
  );
};
