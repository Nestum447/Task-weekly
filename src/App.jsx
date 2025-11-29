import React, { useState } from "react";
import { Trash2 } from "lucide-react";

export default function TodoCalendar() {
  const [tasks, setTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (!newTask.trim()) return;
    const id = Date.now();
    setTasks([...tasks, { id, text: newTask }]);
    setNewTask("");
  };

  const deleteSelectedTask = () => {
    if (!selectedTaskId) return;
    setTasks(tasks.filter((t) => t.id !== selectedTaskId));
    setSelectedTaskId(null);
  };

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-bold">Tareas</h1>

      {/* Input */}
      <div className="flex gap-2">
        <input
          className="border rounded-xl px-3 py-2 w-full"
          placeholder="Nueva tarea"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button
          onClick={addTask}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow"
        >
          Añadir
        </button>
      </div>

      {/* Button delete selected (always visible, small icon on mobile) */}
      <button
        onClick={deleteSelectedTask}
        disabled={!selectedTaskId}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl shadow border w-fit
        ${selectedTaskId ? "bg-red-600 text-white" : "bg-gray-300 text-gray-500"}
      `}
      >
        <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" />
        <span className="hidden sm:block">Borrar selección</span>
      </button>

      {/* Task List */}
      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => setSelectedTaskId(task.id)}
            className={`p-3 rounded-xl border shadow cursor-pointer flex justify-between items-center
              ${selectedTaskId === task.id ? "bg-blue-100 border-blue-400" : "bg-white"}`}
          >
            <span>{task.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
