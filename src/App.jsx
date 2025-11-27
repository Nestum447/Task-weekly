import { useState, useEffect } from "react";

export default function App() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startWeekday = firstDay.getDay(); // 0=Domingo

  const monthName = today.toLocaleString("es-ES", { month: "long" });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks-month");
    return saved ? JSON.parse(saved) : [];
  });

  const [dragTask, setDragTask] = useState(null);

  useEffect(() => {
    localStorage.setItem("tasks-month", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (day) => {
    const text = prompt("Nueva tarea:");
    if (!text) return;
    setTasks([...tasks, { id: Date.now(), text, day, done: false }]);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const toggleDone = (id) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const handleDragStart = (task) => {
    setDragTask(task);
  };

  const handleDrop = (day) => {
    if (!dragTask) return;
    setTasks(
      tasks.map((t) => (t.id === dragTask.id ? { ...t, day } : t))
    );
    setDragTask(null);
  };

  const gridDays = [];
  for (let i = 0; i < startWeekday; i++) gridDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) gridDays.push(d);

  return (
    <div className="p-6 font-sans">
      <h2 className="text-2xl font-bold mb-4 text-center capitalize">
        Calendario de {monthName} {year}
      </h2>

      <div className="grid grid-cols-7 gap-2 text-center font-semibold mb-2">
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((d) => (
          <div key={d} className="p-2">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {gridDays.map((day, index) => (
          <div
            key={index}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => day && handleDrop(day)}
            className="border rounded-lg min-h-[120px] p-2 bg-gray-100"
          >
            {day && (
              <div className="font-bold mb-2 flex justify-between">
                <span>{day}</span>
                <button
                  onClick={() => addTask(day)}
                  className="text-green-600 text-xl"
                >
                  +
                </button>
              </div>
            )}

            {tasks
              .filter((t) => t.day === day)
              .map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => handleDragStart(task)}
                  className={`bg-white p-2 mb-2 rounded shadow text-sm flex justify-between items-center ${task.done ? "line-through" : ""}`}
                >
                  <div
                    onClick={() => toggleDone(task.id)}
                    className="cursor-pointer flex items-center gap-2"
                  >
                    <input type="checkbox" checked={task.done} readOnly />
                    {task.text}
                  </div>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-500 text-lg"
                  >
                    🗑️
                  </button>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
