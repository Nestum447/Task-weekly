/**
 * App Tareas - 3 columnas (To do | Proceso | Delegadas)
 * Single-file React component using react-beautiful-dnd and TailwindCSS.
 * Touch-friendly (react-beautiful-dnd soporta dispositivos táctiles).
 *
 * Dependencias: react, react-dom, react-beautiful-dnd, tailwindcss
 * Instalación rápida:
 *  - npm install react-beautiful-dnd
 *  - Configura Tailwind o cambia clases por CSS propio.
 *
 * Pega este archivo como App.jsx en un proyecto creado con Vite / Create React App
 * y arranca la app. Funciona en móvil, permite arrastrar con el dedo entre columnas.
 */

import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const initialColumns = {
  todo: {
    name: 'To Do',
    items: [
      { id: 't1', content: 'Preparar informe mensual' },
      { id: 't2', content: 'Revisar inventario' },
    ],
  },
  proceso: {
    name: 'Proceso',
    items: [
      { id: 'p1', content: 'Empacar pedidos' },
    ],
  },
  delegadas: {
    name: 'Delegadas',
    items: [
      { id: 'd1', content: 'Contacto con proveedor' },
    ],
  },
};

export default function App() {
  const [columns, setColumns] = useState(initialColumns);

  function onDragEnd(result) {
    const { source, destination } = result;

    // Si no hay destino (ej. soltado fuera), no hacer nada
    if (!destination) return;

    // Si se soltó en la misma columna y misma posición -> nada
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceCol = columns[source.droppableId];
    const destCol = columns[destination.droppableId];

    // Mover dentro de la misma columna (reordenar)
    if (source.droppableId === destination.droppableId) {
      const newItems = Array.from(sourceCol.items);
      const [moved] = newItems.splice(source.index, 1);
      newItems.splice(destination.index, 0, moved);

      setColumns(prev => ({
        ...prev,
        [source.droppableId]: {
          ...sourceCol,
          items: newItems,
        },
      }));

      return;
    }

    // Mover a otra columna
    const sourceItems = Array.from(sourceCol.items);
    const [moved] = sourceItems.splice(source.index, 1);
    const destItems = Array.from(destCol.items);
    destItems.splice(destination.index, 0, moved);

    setColumns(prev => ({
      ...prev,
      [source.droppableId]: {
        ...sourceCol,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destCol,
        items: destItems,
      },
    }));
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="max-w-6xl mx-auto mb-4">
        <h1 className="text-2xl font-semibold">Tablero de Tareas — 3 columnas</h1>
        <p className="text-sm text-gray-600">Arrastra con el dedo o el cursor entre columnas: To Do • Proceso • Delegadas</p>
      </header>

      <main className="max-w-6xl mx-auto">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.entries(columns).map(([colId, col]) => (
              <Droppable key={colId} droppableId={colId}>
                {(provided, snapshot) => (
                  <section
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`rounded-lg p-3 shadow-sm min-h-[200px] flex flex-col bg-white ${
                      snapshot.isDraggingOver ? 'ring-2 ring-offset-2 ring-indigo-300' : ''
                    }`}
                  >
                    <h2 className="font-medium text-lg mb-2 flex items-center justify-between">
                      <span>{col.name}</span>
                      <span className="text-xs text-gray-500">{col.items.length}</span>
                    </h2>

                    <div className="flex-1 space-y-2">
                      {col.items.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(providedDr, snapshotDr) => (
                            <div
                              ref={providedDr.innerRef}
                              {...providedDr.draggableProps}
                              {...providedDr.dragHandleProps}
                              className={`p-3 rounded-md border shadow-sm bg-white flex items-center justify-between ${
                                snapshotDr.isDragging ? 'opacity-90 scale-105' : ''
                              }`}
                            >
                              <div className="text-sm">{item.content}</div>
                              <div className="text-xs text-gray-400">{item.id}</div>
                            </div>
                          )}
                        </Draggable>
                      ))}

                      {provided.placeholder}
                    </div>

                    <div className="mt-3">
                      <AddTask colId={colId} onAdd={(text) => {
                        const newTask = { id: `${colId}-${Date.now()}`, content: text };
                        setColumns(prev => ({
                          ...prev,
                          [colId]: { ...prev[colId], items: [...prev[colId].items, newTask] },
                        }));
                      }} />
                    </div>
                  </section>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </main>

      <footer className="max-w-6xl mx-auto mt-6 text-xs text-gray-500">
        Consejo: en móvil usa el dedo para arrastrar; si no funciona, intenta pulsar y mantener unos instantes.
      </footer>
    </div>
  );
}

function AddTask({ colId, onAdd }) {
  const [text, setText] = useState('');
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (!text.trim()) return; onAdd(text.trim()); setText(''); }} className="flex gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="+ nueva tarea"
        className="flex-1 px-2 py-1 border rounded text-sm"
      />
      <button className="px-3 py-1 bg-indigo-600 text-white rounded text-sm" type="submit">Agregar</button>
    </form>
  );
}
