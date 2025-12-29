'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Plus, Trash2, Copy, Square, Circle, Maximize2, ZoomIn, ZoomOut, Move } from 'lucide-react';
import { Button } from '@/shared/shadcn/ui/button';
import Image from 'next/image';

interface Table {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  shape: 'square' | 'circle' | 'rectangle';
  seats: number;
  number: number;
}

interface Floor {
  id: string;
  name: string;
  tables: Table[];
}

const RestaurantFloorEditor: React.FC = () => {
  const [floors, setFloors] = useState<Floor[]>([
    { id: '1', name: 'Первый этаж', tables: [] },
  ]);
  const [currentFloorIndex, setCurrentFloorIndex] = useState(0);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1.5);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [swapTarget, setSwapTarget] = useState<string | null>(null);
  const [draggedTableOriginalPos, setDraggedTableOriginalPos] = useState<{ x: number; y: number } | null>(null);
  const [swapTargetOriginalPos, setSwapTargetOriginalPos] = useState<{ x: number; y: number } | null>(null);
  const [animatingTables, setAnimatingTables] = useState<Set<string>>(new Set());

  const canvasRef = useRef<HTMLDivElement>(null);
  const swapInProgressRef = useRef(false);
  const GRID_SIZE = 20;

  const currentFloor = floors[currentFloorIndex];

  const addTable = (shape: 'square' | 'circle' | 'rectangle') => {
    const newTable: Table = {
      id: Date.now().toString(),
      x: 200,
      y: 200,
      width: shape === 'rectangle' ? 120 : 80,
      height: 80,
      shape,
      seats: shape === 'rectangle' ? 6 : 4,
      number: currentFloor.tables.length + 1,
    };

    const updatedFloors = [...floors];
    updatedFloors[currentFloorIndex].tables.push(newTable);
    setFloors(updatedFloors);
    setSelectedTable(newTable.id);
  };

  const deleteTable = (id: string) => {
    const updatedFloors = [...floors];
    updatedFloors[currentFloorIndex].tables = updatedFloors[currentFloorIndex].tables.filter(
      t => t.id !== id
    );
    setFloors(updatedFloors);
    setSelectedTable(null);
  };

  const duplicateTable = (id: string) => {
    const table = currentFloor.tables.find(t => t.id === id);
    if (!table) return;

    const newTable: Table = {
      ...table,
      id: Date.now().toString(),
      x: table.x + 20,
      y: table.y + 20,
      number: currentFloor.tables.length + 1,
    };

    const updatedFloors = [...floors];
    updatedFloors[currentFloorIndex].tables.push(newTable);
    setFloors(updatedFloors);
    setSelectedTable(newTable.id);
  };

  const updateTable = (id: string, updates: Partial<Table>) => {
    setFloors(prevFloors => {
      const updatedFloors = [...prevFloors];
      const tableIndex = updatedFloors[currentFloorIndex].tables.findIndex(t => t.id === id);
      if (tableIndex !== -1) {
        updatedFloors[currentFloorIndex].tables[tableIndex] = {
          ...updatedFloors[currentFloorIndex].tables[tableIndex],
          ...updates,
        };
      }
      return updatedFloors;
    });
  };

  const addFloor = () => {
    const newFloor: Floor = {
      id: Date.now().toString(),
      name: `Этаж ${floors.length + 1}`,
      tables: [],
    };
    setFloors([...floors, newFloor]);
    setCurrentFloorIndex(floors.length);
  };

  const deleteFloor = (index: number) => {
    if (floors.length === 1) return;
    const updatedFloors = floors.filter((_, i) => i !== index);
    setFloors(updatedFloors);
    setCurrentFloorIndex(Math.max(0, index - 1));
  };

  const snapToGrid = (value: number) => {
    return Math.round(value / GRID_SIZE) * GRID_SIZE;
  };

  const isOverlapping = (table1: Table, table2: Table, threshold = 0.4) => {
    const centerX1 = table1.x + table1.width / 2;
    const centerY1 = table1.y + table1.height / 2;
    const centerX2 = table2.x + table2.width / 2;
    const centerY2 = table2.y + table2.height / 2;

    const distanceX = Math.abs(centerX1 - centerX2);
    const distanceY = Math.abs(centerY1 - centerY2);

    const avgWidth = (table1.width + table2.width) / 2;
    const avgHeight = (table1.height + table2.height) / 2;

    return distanceX < avgWidth * threshold && distanceY < avgHeight * threshold;
  };

  const handleMouseDown = (e: React.MouseEvent, tableId?: string) => {
    if (e.button === 1 || e.button === 2 || (e.button === 0 && e.shiftKey)) {
      e.preventDefault();
      setIsPanning(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      return;
    }

    if (tableId) {
      setSelectedTable(tableId);
      setIsDragging(true);
      swapInProgressRef.current = false;
      const table = currentFloor.tables.find(t => t.id === tableId);
      if (table) {
        setDraggedTableOriginalPos({ x: table.x, y: table.y });
        setDragStart({
          x: (e.clientX - pan.x) / zoom - table.x,
          y: (e.clientY - pan.y) / zoom - table.y,
        });
      }
    } else {
      setSelectedTable(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    } else if (isDragging && selectedTable && draggedTableOriginalPos && !swapInProgressRef.current) {
      const newX = (e.clientX - pan.x) / zoom - dragStart.x;
      const newY = (e.clientY - pan.y) / zoom - dragStart.y;

      updateTable(selectedTable, {
        x: snapToGrid(newX),
        y: snapToGrid(newY),
      });

      const draggedTable = currentFloor.tables.find(t => t.id === selectedTable);
      if (!draggedTable) return;

      const virtualDraggedTable = {
        ...draggedTable,
        x: snapToGrid(newX),
        y: snapToGrid(newY),
      };

      let foundSwapTarget: string | null = null;
      for (const table of currentFloor.tables) {
        if (table.id !== selectedTable) {
          const tableToCheck = (table.id === swapTarget && swapTargetOriginalPos)
            ? { ...table, x: swapTargetOriginalPos.x, y: swapTargetOriginalPos.y }
            : table;

          if (isOverlapping(virtualDraggedTable, tableToCheck)) {
            foundSwapTarget = table.id;
            break;
          }
        }
      }

      if (foundSwapTarget && foundSwapTarget !== swapTarget) {
        const targetTable = currentFloor.tables.find(t => t.id === foundSwapTarget);
        if (targetTable) {
          setSwapTarget(foundSwapTarget);
          setSwapTargetOriginalPos({ x: targetTable.x, y: targetTable.y });

          setAnimatingTables(prev => {
            const newSet = new Set(prev);
            newSet.add(foundSwapTarget);
            return newSet;
          });

          updateTable(foundSwapTarget, {
            x: draggedTableOriginalPos.x,
            y: draggedTableOriginalPos.y,
          });

          setTimeout(() => {
            setAnimatingTables(prev => {
              const newSet = new Set(prev);
              newSet.delete(foundSwapTarget);
              return newSet;
            });
          }, 250);
        }
      } else if (!foundSwapTarget && swapTarget && swapTargetOriginalPos) {
        const previousTarget = swapTarget;
        const previousTargetPos = swapTargetOriginalPos;

        setAnimatingTables(prev => {
          const newSet = new Set(prev);
          newSet.add(previousTarget);
          return newSet;
        });

        updateTable(previousTarget, {
          x: previousTargetPos.x,
          y: previousTargetPos.y,
        });

        setTimeout(() => {
          setAnimatingTables(prev => {
            const newSet = new Set(prev);
            newSet.delete(previousTarget);
            return newSet;
          });
        }, 250);

        setSwapTarget(null);
        setSwapTargetOriginalPos(null);
      }
    }
  };

  const handleMouseUp = () => {
    if (swapTarget && draggedTableOriginalPos && swapTargetOriginalPos && selectedTable) {
      swapInProgressRef.current = true;

      setAnimatingTables(prev => {
        const newSet = new Set(prev);
        newSet.add(selectedTable);
        return newSet;
      });

      updateTable(selectedTable, {
        x: swapTargetOriginalPos.x,
        y: swapTargetOriginalPos.y,
      });

      setTimeout(() => {
        setAnimatingTables(prev => {
          const newSet = new Set(prev);
          newSet.delete(selectedTable);
          return newSet;
        });
        swapInProgressRef.current = false;
      }, 250);
    }

    setIsDragging(false);
    setIsPanning(false);
    setSwapTarget(null);
    setDraggedTableOriginalPos(null);
    setSwapTargetOriginalPos(null);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.min(Math.max(0.5, prev * delta), 3));
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev * 0.8, 0.5));
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedTable && (e.key === 'Delete' || e.key === 'Backspace')) {
        deleteTable(selectedTable);
      }
      if (selectedTable && e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        duplicateTable(selectedTable);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTable]);

  const selectedTableData = currentFloor.tables.find(t => t.id === selectedTable);

  return (
    <div className="flex h-screen bg-gray-50 select-none relative">
      {/* Top mode buttons */}
      <div className="absolute z-50 w-[340px] rounded-full h-min flex p-1.5 left-1/2 -translate-x-1/2 top-6 gap-1.5 bg-white">
        <Button className="flex-1 px-6 py-3 rounded-full bg-emerald-500 text-white font-medium text-sm transition-all hover:bg-emerald-600">
          Упрощенный
        </Button>
        <Button className="flex-1 px-6 py-3 rounded-full bg-transparent text-gray-600 font-medium text-sm transition-all hover:bg-gray-100">
          Продвинутый
        </Button>
      </div>

      {/* Zoom controls */}
      <div className="absolute top-6 right-6 flex gap-2 bg-white rounded-3xl p-1.5 z-10">
        <Button
          onClick={handleZoomOut}
          className="p-3 hover:bg-gray-100 rounded-2xl transition"
          title="Отдалить"
        >
          <ZoomOut size={20} className="text-gray-700" />
        </Button>
        <span className="px-4 py-3 text-sm font-semibold text-gray-700">{Math.round(zoom * 100)}%</span>
        <Button
          onClick={handleZoomIn}
          className="p-3 hover:bg-gray-100 rounded-2xl transition"
          title="Приблизить"
        >
          <ZoomIn size={20} className="text-gray-700" />
        </Button>
        <Button
          onClick={handleResetView}
          className="p-3 hover:bg-gray-100 rounded-2xl transition"
          title="Сбросить вид"
        >
          <Move size={20} className="text-gray-700" />
        </Button>
        <Button
          onClick={() => setShowGrid(!showGrid)}
          className={`p-3 rounded-2xl transition ${showGrid ? 'bg-emerald-500 text-white' : 'hover:bg-gray-100 text-gray-700'}`}
          title="Показать сетку"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <rect x="0" y="0" width="9" height="9" opacity="0.3"/>
            <rect x="11" y="0" width="9" height="9" opacity="0.3"/>
            <rect x="0" y="11" width="9" height="9" opacity="0.3"/>
            <rect x="11" y="11" width="9" height="9" opacity="0.3"/>
          </svg>
        </Button>
      </div>

      {/* Sidebar */}
      <div className="w-96 flex-shrink-0 bg-white p-6 overflow-y-auto text-base">

        {/* Floor selector */}
        <div className="mb-8">
          <label className="block text-base font-bold text-gray-800 mb-4">Этажи</label>
          <div className="space-y-2.5">
            {floors.map((floor, index) => (
              <div key={floor.id} className="flex items-center gap-2.5">
                <Button
                  onClick={() => setCurrentFloorIndex(index)}
                  className={`flex-1 px-5 py-3.5 rounded-2xl text-base font-semibold transition ${
                    currentFloorIndex === index
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {floor.name} ({floor.tables.length})
                </Button>
                {floors.length > 1 && (
                  <Button
                    onClick={() => deleteFloor(index)}
                    className="p-3.5 text-red-500 hover:bg-red-50 rounded-2xl transition"
                  >
                    <Trash2 size={20} />
                  </Button>
                )}
              </div>
            ))}
            <Button
              onClick={addFloor}
              className="w-full px-5 py-3.5 bg-gray-800 text-white rounded-2xl text-base font-semibold hover:bg-gray-900 transition flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Добавить этаж
            </Button>
          </div>
        </div>

        {/* Add table buttons */}
        <div className="mb-8">
          <label className="block text-base font-bold text-gray-800 mb-4">Добавить столик</label>
          <div className="grid grid-cols-3 gap-3">
            <Button
              onClick={() => addTable('square')}
              className="flex flex-col items-center justify-center p-6 bg-gray-100 rounded-2xl hover:bg-emerald-500 hover:text-white transition text-gray-700"
            >
              <Square size={28} />
            </Button>
          </div>
        </div>

        {/* Table properties */}
        {selectedTableData && (
          <div className="mb-8 p-5  rounded-3xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Столик #{selectedTableData.number}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Количество мест</label>
                <input
                  type="number"
                  min="2"
                  max="12"
                  value={selectedTableData.seats}
                  onChange={(e) => updateTable(selectedTableData.id, { seats: parseInt(e.target.value) })}
                  className="w-full px-4 py-3.5 text-base bg-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Номер столика</label>
                <input
                  type="number"
                  min="1"
                  value={selectedTableData.number}
                  onChange={(e) => updateTable(selectedTableData.id, { number: parseInt(e.target.value) })}
                  className="w-full px-4 py-3.5 text-base bg-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => duplicateTable(selectedTableData.id)}
                  className="flex-1 px-4 py-3.5 bg-white rounded-2xl text-sm font-semibold hover:bg-gray-100 transition flex items-center justify-center gap-2"
                >
                  <Copy size={16} />
                  Дублировать
                </Button>
                <Button
                  onClick={() => deleteTable(selectedTableData.id)}
                  className="flex-1 px-4 py-3.5 bg-red-500 text-white rounded-2xl text-sm font-semibold hover:bg-red-600 transition flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                  Удалить
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Controls info */}
        <div className="text-sm text-gray-600 space-y-2.5 p-5 bg-gray-100 rounded-3xl">
          <p className="font-bold text-gray-800 mb-3">Горячие клавиши:</p>
          <p><span className="font-semibold text-gray-800">Колесико мыши:</span> Масштаб</p>
          <p><span className="font-semibold text-gray-800">Shift + ЛКМ:</span> Перемещение</p>
          <p><span className="font-semibold text-gray-800">Ctrl + D:</span> Дублировать</p>
          <p><span className="font-semibold text-gray-800">Delete:</span> Удалить</p>
          <p className="pt-3"><span className="font-semibold text-emerald-600">💡 Свап:</span> Наведите столик на центр другого</p>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative">
        <div
          ref={canvasRef}
          className="w-full h-full overflow-hidden cursor-move"
          onMouseDown={(e) => handleMouseDown(e)}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onContextMenu={(e) => e.preventDefault()}
        >
          <div
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '0 0',
              width: '2000px',
              height: '2000px',
              position: 'relative',
            }}
          >
            {/* Grid */}
            {showGrid && (
              <svg className="absolute inset-0 pointer-events-none" width="2000" height="2000">
                <defs>
                  <pattern id="grid" width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse">
                    <path d={`M ${GRID_SIZE} 0 L 0 0 0 ${GRID_SIZE}`} fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="2000" height="2000" fill="url(#grid)" />
              </svg>
            )}

            {/* Tables */}
            {currentFloor.tables.map((table) => {
              const isBeingDragged = selectedTable === table.id && isDragging;
              const isSwapTarget = swapTarget === table.id;
              const shouldAnimate = animatingTables.has(table.id);

              return (
                <div
                  key={table.id}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    handleMouseDown(e, table.id);
                  }}
                  style={{
                    position: 'absolute',
                    left: table.x,
                    top: table.y,
                    width: table.width,
                    height: table.height,
                    cursor: 'move',
                    transition: shouldAnimate ? 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                    transform: isSwapTarget ? 'scale(1.05)' : 'scale(1)',
                  }}
                  className={`${
                    selectedTable === table.id
                      ? 'z-50'
                      : isSwapTarget
                        ? 'z-40'
                        : ''
                  }`}
                >
                  <div
                    className={`w-full  h-full bg-transparent relative ${
                      table.shape === 'circle' ? 'rounded-full' : 'rounded-3xl'
                    } ${
                      selectedTable === table.id
                        ? 'ring-4 ring-forest-500'
                        : isSwapTarget
                          ? 'ring-4 ring-forest-400 opacity-50'
                          : ''
                    } overflow-hidden`}
                  >
                    <Image src={'/table.png'} width={196} height={196} alt={'table'} draggable={false}/>
                  </div>

                  <div className=" mt-1 flex items-center justify-center text-white text-center pointer-events-none">
                    <div className={'flex flex-col items-center justify-center gap-1'}>
                      <div className="text-lg bg-white px-2 py-0.5 rounded-full font-semibold">Стол {table.number}</div>
                      <div className="text-xs bg-forest-100 text-forest-700 px-2 w-max py-0.5 rounded-full font-medium opacity-90">{table.seats} мест</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {currentFloor.tables.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center text-gray-400">
              <Square size={48} className="mx-auto mb-3 opacity-40" />
              <p className="text-lg font-semibold">Добавьте первый столик</p>
              <p className="text-sm">Выберите форму в боковой панели</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantFloorEditor;