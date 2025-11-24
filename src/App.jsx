import { useState, useEffect } from "react";

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [dragTask, setDragTask] = useState(null);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    const text = prompt("Nueva tarea:");
    if (!text) return;
    setTasks([...tasks, { id: Date.now(), text, column: "lunes", done: false }]);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const toggleDone = (id) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, done: !t.done } : t
    ));
  };

  const handleDragStart = (task) => {
    setDragTask(task);
  };

  const handleDrop = (day) => {
    if (!dragTask) return;
    setTasks(tasks.map(t =>
      t.id === dragTask.id ? { ...t, column: day } : t
    ));
    setDragTask(null);
  };

  const weekDays = ["lunes", "martes", "miercoles", "jueves", "viernes"];

  const dayColors = {
    lunes: "#d5e8ff",
    martes: "#d5e8ff",
    miercoles: "#fff3c4",
    jueves: "#d6f5d6",
    viernes: "#d6f5d6"
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>Planificador Semanal</h2>

      <button
        onClick={addTask}
        style={{
          padding: "10px 20px",
          marginBottom: 20,
          background: "#4caf50",
          color: "white",
          border: "none",
          borderRadius: 6
        }}
      >
        + Agregar tarea
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 20
        }}
      >
        {weekDays.map((day) => (
          <div
            key={day}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(day)}
            style={{
              background: dayColors[day],
              padding: 10,
              borderRadius: 10,
              minHeight: "300px",
            }}
          >
            <h3 style={{ textTransform: "capitalize" }}>{day}</h3>

            {tasks
              .filter(t => t.column === day)
              .map(task => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => handleDragStart(task)}
                  style={{
                    background: "white",
                    padding: 10,
                    marginBottom: 10,
                    borderRadius: 8,
                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    textDecoration: task.done ? "line-through" : "none"
                  }}
                >
                  <div 
                    onClick={() => toggleDone(task.id)} 
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 10
                    }}
                  >
                    <input 
                      type="checkbox" 
                      checked={task.done} 
                      readOnly
                    />
                    {task.text}
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      onClick={() => deleteTask(task.id)}
                      style={{
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        fontSize: 18
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
