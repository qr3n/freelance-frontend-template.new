'use client';

import { TableCard, Table } from '@/entities/table';
import { useTables } from '@/features/table/model/hooks';
import { EditTableModal } from '@/features/table/edit';
import { useState } from 'react';
import { SvgSkeleton } from '@/shared/ui/svg-skeleton/SvgSkeleton';
import ImageToVideo from '@/shared/ui/image-to-video/ui/ImageToVideo';
import { PointerHighlight } from '@/shared/ui/pointer-highlight/PointerHighlight';
import { Button } from '@/shared/shadcn/ui/button';
import { Modal } from '@/shared/ui/modal';
import { CreateTableForm } from '@/features/table/create/ui/CreateTableForm';

interface TablesListProps {
  businessId: string;
  initialTables: Table[];
}

export const TablesList = ({ businessId, initialTables }: TablesListProps) => {
  const { data: tables, isLoading } = useTables(businessId, initialTables);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const yourSvg = `
  <svg width="440" height="473" viewBox="0 0 440 473" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M343.5 67.5001C368.1 107.3 373.986 151 387.186 204.5C400.386 258 446.5 308.668 439 359.968C431.5 411.268 387.4 460.068 336.4 470.268C285.4 480.368 227.3 451.868 170.8 427.668C114.3 403.368 59.4001 383.468 29.1001 343.268C-1.19993 303.068 -6.69994 242.668 8.00006 190.568C22.8001 138.468 57.9001 94.6682 100.1 57.8682C142.2 21.1682 177.4 2.00004 228 0.500039C278.6 -1.09996 318.9 27.7001 343.5 67.5001Z" fill="#10b981"/>
  </svg>
  `;

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
  };

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
      <div className="h-[calc(100dvh-96px)] pt-8 text-center flex items-center justify-center flex-col w-full">
        <div className='absolute top-0 left-0 dotted-background z-0 w-full h-[100dvh]'/>
        <div className='absolute top-0 left-0 bg-gradient-to-t from-white to-transparent z-0 w-full h-[100dvh]'/>
        <div className="w-[240px] h-[240px] sm:w-[300px] sm:h-[300px] flex items-center justify-center">
          <ImageToVideo
            loadingElement={
              <SvgSkeleton
                svg={yourSvg}
                isLoading={true}
                variant={'light'}
                color="#f1f1f1"
                size={250}
                responsive={{
                  default: {
                    width: 240,
                    height: 240
                  },
                  sm: {
                    width: 300,
                    height: 300
                  },
                  md: {
                    width: 300,
                    height: 300
                  },
                  lg: {
                    width: 300,
                    height: 300
                  },
                  xl: {
                    width: 300,
                    height: 300
                  }
                }}
              />
            }
            step={1}
            imageSrc="/robot.png"
            videos={[{
              src: "/robot4.mp4"
            }]}
            maskSrc={"/mask2.svg"}
            responsive={{
              default: {
                width: 240,
                height: 240
              },
              sm: {
                width: 300,
                height: 300
              },
              md: {
                width: 300,
                height: 300
              },
              lg: {
                width: 300,
                height: 300
              },
              xl: {
                width: 300,
                height: 300
              }
            }}
          />
        </div>
        <div className="z-[10] text-emerald-950 mx-auto max-w-lg mt-6 sm:mt-12 text-2xl font-semibold tracking-tight md:text-4xl">
          На данный момент
          <PointerHighlight
            containerClassName={'-mt-0.5'}
            rectangleClassName="bg-emerald-500 border-none"
            pointerClassName="text-emerald-500"
          >
            <span className="relative z-10 text-emerald-950">столики отсутствуют</span>
          </PointerHighlight>
        </div>

        <Modal
          dialogStyle="max-w-4xl rounded-t-[48px]"
          title="Создать новый столик"
          description="Заполните информацию о столике"
          trigger={
            <Button className='bg-forest-200 mt-5 text-forest-800 hover:bg-forest-300 z-50'>
              Создать столик
            </Button>
          }
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
        >
          <CreateTableForm businessId={businessId} onSuccess={handleCreateSuccess} />
        </Modal>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full max-w-7xl mt-8">
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
