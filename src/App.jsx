import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function App() {
  // ---------------------------
  //   LOCAL STORAGE: CARGAR
  // ---------------------------
  const loadTasks = () => {
    const saved = localStorage.getItem("tasks-week");
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
    localStorage.setItem("tasks-week", JSON.stringify(tasks));
  }, [tasks]);

  // ---------------------------
  //   DRAG & DROP
  // ---------------------------
  const handleDragEnd = (result) => {
    const sourceColumn = result.source.droppableId;

    if (!result.destination) return;

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
  //   AGREGAR TAREA (Siempre se agrega a LUNES por defecto)
  // ---------------------------
  const addTask = () => {
    if (!newTask.trim()) return;

    const newId = Date.now().toString();
    const newItem = { id: newId, text: newTask, done: false };

    setTasks({
      ...tasks,
      lunes: [...tasks.lunes, newItem],
    });

    setNewTask("");
  };

  // ---------------------------
  //   ELIMINAR TAREA
  // ---------------------------
  const deleteTask = (day, id) => {
    setTasks((prev) => ({
      ...prev,
      [day]: prev[day].filter((t) => t.id !== id),
    }));
  };

  // ---------------------------
  //   TOGGLE CHECKBOX
  // ---------------------------
  const toggleDone = (day, id) => {
    setTasks((prev) => ({
      ...prev,
      [day]: prev[day].map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      ),
    }));
  };

  // ---------------------------
  //   UI
  // ---------------------------
  const days = [
    { key: "lunes", label: "Lunes" },
    { key: "martes", label: "Martes" },
    { key: "miercoles", label: "Miércoles" },
    { key: "jueves", label: "Jueves" },
    { key: "viernes", label: "Viernes" },
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

          {days.map((day) => (
            <Droppable key={day.key
