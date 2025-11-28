import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";

export default function TaskManager() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [open, setOpen] = useState(false);

  const addTask = () => {
    if (task.trim() === "") return;
    setTasks([...tasks, task]);
    setTask("");
  };

  const confirmDelete = (index) => {
    setDeleteIndex(index);
    setOpen(true);
  };

  const deleteTask = () => {
    const updated = tasks.filter((_, i) => i !== deleteIndex);
    setTasks(updated);
    setDeleteIndex(null);
    setOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <Card className="w-full max-w-md shadow-xl rounded-2xl p-4">
        <CardContent>
          <h2 className="text-2xl font-bold mb-4 text-center">Gestor de Tareas</h2>

          <div className="flex gap-2 mb-4">
            <Input
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Nueva tarea"
              className="rounded-xl"
            />
            <Button onClick={addTask} className="rounded-xl px-4">Agregar</Button>
          </div>

          <div className="space-y-3">
            {tasks.map((t, index) => (
              <div key={index} className="flex justify-between items-center bg-white p-3 rounded-xl shadow">
                <span>{t}</span>
                <Button
                  variant="ghost"
                  onClick={() => confirmDelete(index)}
                >
                  <Trash2 />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>¿Borrar tarea?</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">Esta acción no se puede deshacer.</p>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl">Cancelar</Button>
            <Button onClick={deleteTask} className="rounded-xl">Borrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
                                  }
