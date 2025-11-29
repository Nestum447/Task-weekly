import { useState, useEffect } from "react";

export default function App() {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const saved = localStorage.getItem("calendar-month");
    return saved ? JSON.parse(saved) : new Date().getMonth();
  });

  const [currentYear, setCurrentYear] = useState(() => {
    const saved = localStorage.getItem("calendar-year");
    return saved ? JSON.parse(saved) : new Date().getFullYear();
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks-month");
    return saved ? JSON.parse(saved) : [];
  });

  const [dragTask, setDragTask] = useState(null);

  useEffect(() => {
    localStorage.setItem("calendar-month", JSON.stringify(currentMonth));
    localStorage.setItem("calendar-year", JSON.stringify(currentYear));
  }, [currentMonth, currentYear]);

  useEffect(() => {
    localStorage.setItem("tasks-month", JSON.stringify(tasks));
  }, [tasks]);

  const date = new Date(currentYear, currentMonth);
  const monthName = date.toLocaleString("es-ES", { month: "long" });

  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startWeekday = firstDay.getDay();

  const addTask = (day) => {
    const text = prompt("Nueva tarea:");
    if (!text) return;

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text,
        day,
        month: currentMonth,
        year: currentYear,
        done: false,
      },
    ]);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const toggleDone = (id) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const handleDragStart = (task) => setDragTask(task);

  const handleDrop = (day) => {
    if (!dragTask) return;
    setTasks(
      tasks.map((t) =>
        t.id === dragTask.id
          ? { ...t, day, month: currentMonth, year: currentYear }
          : t
      )
    );
    setDragTask(null);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else setCurrentMonth(currentMonth + 1);
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else setCurrentMonth(currentMonth - 1);
  };

  const gridDays = [];
  for (let i = 0; i < startWeekday; i++) gridDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) gridDays.push(d);

  return (
    <div className="p-6 font-sans">
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="px-3 py-1 bg-gray-300 rounded">◀</button>
        <h2 className="text-2xl font-bold text-center capitalize">
          {monthName} {currentYear}
        </h2>
        <button onClick={nextMonth} className="px-3 py-1 bg-gray-300 rounded">▶</button>
      </div>

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
            className="border rounded-lg min-h-[110px] p-1 bg-gray-100 overflow-hidden"
          >
            {day && (
              <div className="font-bold mb-1 flex justify-between text-xs">
                <span>{day}</span>
                <button
                  onClick={() => addTask(day)}
                  className="text-green-600 text-lg"
                >
                  +
                </button>
              </div>
            )}

            {tasks
              .filter(
                (t) =>
                  t.day === day &&
                  t.month === currentMonth &&
                  t.year === currentYear
              )
              .map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  toggleDone={toggleDone}
                  deleteTask={deleteTask}
                  handleDragStart={handleDragStart}
                />
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function TaskItem({ task, toggleDone, deleteTask, handleDragStart }) {
  let pressTimer = null;

  const startPress = () => {
    pressTimer = setTimeout(() => {
      if (confirm("¿Borrar esta tarea?")) {
        deleteTask(task.id);
      }
    }, 600);
  };

  const cancelPress = () => clearTimeout(pressTimer);

  return (
    <div
      draggable
      onDragStart={() => handleDragStart(task)}
      onPointerDown={startPress}
      onPointerUp={cancelPress}
      onPointerLeave={cancelPress}
      className={`bg-white p-1 mb-1 rounded shadow text-[10px] flex justify-between items-center active:bg-gray-200 transition ${
        task.done ? "line-through" : ""
      }`}
    >
      <div
        onClick={() => toggleDone(task.id)}
        className="cursor-pointer flex items-center gap-1 w-full"
      >
        <input type="checkbox" checked={task.done} readOnly className="scale-75" />
        <span className="truncate w-20">{task.text}</span>
      </div>
    </div>
  );
            }
