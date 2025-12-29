import { DashboardMenu } from '@/widgets/dashboard-menu';
import { CreateTableModal } from '@/features/table/create';
import { TablesList } from '@/widgets/tables-list';
import { fetchTables } from '@/features/table/model/api_ssr';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/shared/api';

export default async function Tables({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const queryClient = getQueryClient();

  const initialTables = await fetchTables(id);

  return (
    <div className='w-full min-h-screen bg-white'>
      <div className="h-[64px] bg-white 2xl:bg-transparent z-[50] px-4 sm:px-12 items-center fixed w-full top-0 left-0 flex justify-between">
        <div className='flex gap-1 sm:gap-3 items-center justify-center'>
          <svg xmlns="http://www.w3.org/2000/svg" className='w-[32px] h-[32px] sm:w-[48px] sm:h-[48px]' viewBox="0 0 424 369" fill="none">
            <g clipPath="url(#clip0_1_10)">
              <path d="M318.736 86.1644C331.136 107.964 327.636 142.764 351.136 167.264C374.636 191.764 425.136 206.164 423.536 219.564C421.936 232.964 368.236 245.464 338.136 258.464C307.936 271.464 301.336 284.964 290.436 303.464C279.636 322.064 264.636 345.764 242.436 358.364C220.136 370.864 190.636 372.364 167.436 360.864C144.136 349.464 127.136 325.264 91.9359 299.664C56.6359 274.164 3.13591 247.264 0.13591 218.764C-2.86409 190.164 44.5359 159.764 69.6359 116.664C94.7359 73.4644 97.4359 17.4644 123.736 3.66434C149.936 -10.1356 199.836 18.1644 238.836 36.7644C277.936 55.3644 306.336 64.3644 318.736 86.1644Z" fill="#4CDA6A"/>
              <path d="M130.187 82.9179C129.94 83.291 131.545 87.6754 134.802 95.7247C144.584 119.29 149.176 132.456 151.543 144.367C155.289 162.87 152.925 176.586 143.628 190.49C136.144 201.733 123.786 213.131 97.9911 232.857C87.7157 240.861 87.036 241.484 87.9353 243.043C88.8346 244.603 89.7641 244.413 98.2832 240.769C143.084 221.972 161.698 217.817 179.727 222.657C197.347 227.387 211.127 239.872 238.87 276.165C246.788 286.49 247.411 287.17 248.97 286.271C250.529 285.371 250.34 284.442 245.957 274.04C227.773 230.502 223.817 212.235 228.67 194.429C233.51 176.4 246.428 162.369 285.134 133.004C292.504 127.368 293.134 126.659 292.284 125.186C291.385 123.627 290.505 123.903 278.481 128.875C255.226 138.594 242.27 142.949 230.769 145.427C211.746 149.472 197.994 147.245 184.139 138.034C172.337 130.181 161.325 118.292 140.24 90.7415C135.627 84.7443 133.072 81.7156 132.575 81.6556C131.583 81.5355 130.716 82.0351 130.187 82.9179Z" fill="url(#paint0_linear_1_10)" stroke="#14532D"/>
            </g>
            <defs>
              <linearGradient id="paint0_linear_1_10" x1="29" y1="140.857" x2="32246.4" y2="8791.84" gradientUnits="userSpaceOnUse">
                <stop stopColor="#14532D"/>
                <stop offset="0.5" stopColor="#14532D"/>
                <stop offset="1" stopColor="#14532D"/>
              </linearGradient>
              <clipPath id="clip0_1_10">
                <rect width="424" height="369" fill="white"/>
              </clipPath>
            </defs>
          </svg>
          <h1 className='text-lg sm:text-2xl font-medium'>AIDronik</h1>
        </div>
        <div className="space-x-2 flex items-center justify-center">
          <CreateTableModal businessId={id} />
          <DashboardMenu />
        </div>
      </div>
      
      <div className='pt-[64px]'>
        <div className="relative flex flex-col items-center pb-24 px-4">
          <HydrationBoundary state={dehydrate(queryClient)}>
            <TablesList businessId={id} initialTables={initialTables} />
          </HydrationBoundary>
        </div>
      </div>
    </div>
  )
}
