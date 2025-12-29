import { fetchBots } from '@/features/dish/create/model/api_ssr';
import { Business } from '@/entities/dish/model/types';

export const dynamic = 'force-dynamic'

const BusinessCard = ({ business }: { business: Business }) => {
  return (
    <div className="cursor-pointer bg-forest-50/50 hover:bg-forest-50 w-[400px] border-gray-200 rounded-3xl p-6 transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{business.name}</h3>
        <span
          className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
            business.is_active
              ? 'bg-emerald-500 text-emerald-950'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {business.is_active ? 'Активен' : 'Приостановлен'}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-4 max-w-[200px]">{business.description}</p>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className="text-sm font-medium text-gray-700">{business.business_type}</span>
        <span className="text-xs text-gray-500">
          Изменен {new Date(business.updated_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};


export default async function DashboardPage() {
   const bots = await fetchBots();

  return (
    <div className='w-full flex-col flex items-center justify-center'>
      <h1 className='text-4xl font-semibold mt-24 mb-8'>Мои бизнесы</h1>
      <div className=' grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3'>
        {bots.map((bot) => <BusinessCard key={bot.id} business={bot}/>)}
      </div>
    </div>
  )
}