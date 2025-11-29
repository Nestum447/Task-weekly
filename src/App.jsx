import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function App() {
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState("");
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState({});

  // Cargar tareas al iniciar
  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  // Manejar selección de fecha
  const handleDateClick = (d) => {
    const formatted = d.toISOString().split("T")[0];
    setSelectedDate(formatted);
  };

  // Agregar tarea
  const addTask = () => {
    if (task.trim() === "" || selectedDate === "") return;

    const updated = {
      ...tasks,
      [selectedDate]: [...(tasks[selectedDate] || []), task],
    };

    setTasks(updated);
    localStorage.setItem("tasks", JSON.stringify(updated));
    setTask("");
  };

  // Borrar tarea usando botón ❌
  const deleteTask = (date, index) => {
    const updated = { ...tasks };
    updated[date].splice(index, 1);

    if (updated[date].length === 0) {
      delete updated[date];
    }

    setTasks(updated);
    localStorage.setItem("tasks", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">Calendario con Tareas</h1>

      {/* Calendario */}
      <Calendar
        onChange={setDate}
        onClickDay={handleDateClick}
        value={date}
      />

      {/* Fecha seleccionada */}
      {selectedDate && (
        <h2 className="text-xl font-semibold mt-4">
          Fecha seleccionada: {selectedDate}
        </h2>
      )}

      {/* Agregar tarea */}
      <div className="mt-4 flex gap-2">
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Nueva tarea"
          className="border rounded px-3 py-1"
        />

        <button
          onClick={addTask}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Agregar
        </button>
      </div>

      {/* Lista de tareas */}
      {selectedDate && tasks[selectedDate] && tasks[selectedDate].length > 0 && (
        <div className="mt-6 w-full max-w-md">
          <h3 className="text-lg font-bold mb-2">
            Tareas del {selectedDate}
          </h3>

          {tasks[selectedDate].map((t, index) => (
            <div
              key={index}
              className="bg-white shadow p-3 my-2 rounded flex justify-between items-center"
            >
              <span>{t}</span>

              {/* Botón ❌ */}
              <button
                onClick={() => deleteTask(selectedDate, index)}
                className="bg-red-500 text-white px-2 py-1 rounded text-sm"
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
