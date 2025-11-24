import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function App() {
  // ---------------------------
  //   LOCAL STORAGE: CARGAR
  // ---------------------------
  const loadTasks = () => {
    const saved = localStorage.getItem("tasks-board");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  };

  const [tasks, setTasks] = useState(
    loadTasks() || {
      lunes: [],
      martes: [],
      miercoles: [],
      jueves: [],
      viernes: [],
    }
  );

  const [newTask, setNewTask] = useState("");

  // ---------------------------
  //   LOCAL STORAGE: GUARDAR
  // ---------------------------
  useEffect(() => {
    localStorage.setItem("tasks-board", JSON.stringify(tasks));
  }, [tasks]);

  // ---------------------------
  //   BORRAR TAREA
  // ---------------------------
  const deleteTask = (id) => {
    setTasks((prev) => {
      const newState = { ...prev };
      for (const col in newState) {
        newState[col] = newState[col].filter((t) => t.id !== id);
      }
      return newState;
    });
  };

  // ---------------------------
  //   MARCAR / DESMARCAR COMPLETADA
  // ---------------------------
  const toggleComplete = (id) => {
    setTasks((prev) => {
      const newState = { ...prev };
      for (const col in newState) {
        newState[col] = newState[col].map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        );
      }
      return newState;
    });
  };

  // ---------------------------
  //   DRAG & DROP
  // ---------------------------
  const handleDragEnd = (result) => {
    const sourceColumn = result.source.droppableId;

    if (!result.destination) {
      setTasks((prev) => ({
        ...prev,
        [sourceColumn]: prev[sourceColumn].filter(
          (t, index) => index !== result.source.index
        ),
      }));
      return;
    }

    const destColumn = result.destination.droppableId;

    const sourceTasks = Array.from(tasks[sourceColumn]);
    const destTasks = Array.from(tasks[destColumn]);

    const [movedTask] = sourceTasks.splice(result.source.index, 1);
    destTasks.splice(result.destination.index, 0, movedTask);

    setTasks({
      ...tasks,
      [sourceColumn]: sourceTasks,
      [destColumn]: destTasks,
    });
  };

  // ---------------------------
  //   AGREGAR TAREA (SIEMPRE A LUNES)
  // ---------------------------
  const addTask = () => {
    if (!newTask.trim()) return;

    const newId = Date.now().toString();
    const newItem = { id: newId, text: newTask, completed: false };

    setTasks({
      ...tasks,
      lunes: [...tasks.lunes, newItem],
    });

    setNewTask("");
  };

  // ---------------------------
  //   UI
  // ---------------------------
  const columnas = [
    { id: "lunes", titulo: "Lunes", color: "blue" },
    { id: "martes", titulo: "Martes", color: "yellow" },
    { id: "miercoles", titulo: "Miércoles", color: "green" },
    { id: "jueves", titulo: "Jueves", color: "purple" },
    { id: "viernes", titulo: "Viernes", color: "red" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Agenda Semanal</h1>

      {/* Input para nueva tarea */}
      <div className="flex justify-center mb-6 gap-2">
        <input
          type="text"
          className="border border-gray-400 rounded p-2 w-64"
          placeholder="Nueva tarea..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button
          onClick={addTask}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Agregar
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

          {columnas.map((col) => (
            <Droppable droppableId={col.id} key={col.id}>
              {(provided) => (
                <div
                  className="bg-white p-4 rounded shadow min-h-[300px]"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h2
                    className={`text-xl font-semibold mb-3 text-${col.color}-700`}
                  >
                    {col.titulo}
                  </h2>

                  {tasks[col.id].map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          className={`flex items-center justify-between p-3 bg-${col.color}-100 rounded mb-2 shadow cursor-grab active:cursor-grabbing`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleComplete(task.id)}
                            className="mr-2"
                            onClick={(e) => e.stopPropagation()}
                          />

                          <span
                            className={
                              task.completed
                                ? "line-through text-gray-600"
                                : ""
                            }
                          >
                            {task.text}
                          </span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteTask(task.id);
                            }}
                            className="text-red-600 text-xl ml-2"
                          >
                            🗑️
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}

        </div>
      </DragDropContext>
    </div>
  );
}
