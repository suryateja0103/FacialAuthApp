"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProtectedRoute from "@/components/protected-route";

type Todo = {
  id: string;
  task: string;
  completed: boolean;
};

export const dynamic = "force-dynamic";

function TodoContent() {
  const searchParams = useSearchParams();
  const userId = `${searchParams.get("firstName")}.${searchParams.get("lastName")}`;

  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(`todos-${userId}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTodos(parsed);
          return;
        }
      } catch (err) {
        console.error("Error parsing todos from localStorage", err);
      }
    }

    const predefined: Todo[] = [
      { id: "1", task: "✅ Check-in at front desk", completed: false },
      { id: "2", task: "📸 Complete facial authentication", completed: false },
      { id: "3", task: "🧰 Collect safety gear", completed: false },
      { id: "4", task: "📋 Review work assignments", completed: false },
    ];
    setTodos(predefined);
    localStorage.setItem(`todos-${userId}`, JSON.stringify(predefined));
  }, [userId]);

  useEffect(() => {
    localStorage.setItem(`todos-${userId}`, JSON.stringify(todos));
  }, [todos, userId]);

  const addTodo = () => {
    if (!newTask.trim()) return;
    const newTodo: Todo = {
      id: Date.now().toString(),
      task: newTask,
      completed: false,
    };
    setTodos([...todos, newTodo]);
    setNewTask("");
  };

  const toggleComplete = (id: string) => {
    setTodos(todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Hello {userId}, your To-Do List 📝</h1>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="border p-2 rounded w-full"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a new task"
        />
        <button onClick={addTodo} className="bg-green-600 text-white px-4 py-2 rounded">
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center justify-between p-2 border rounded">
            <span className={todo.completed ? "line-through text-gray-500" : ""}>{todo.task}</span>
            <div className="flex gap-2">
              <button onClick={() => toggleComplete(todo.id)} className="text-blue-600">
                ✅
              </button>
              <button onClick={() => deleteTodo(todo.id)} className="text-red-600">
                🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function TodoPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProtectedRoute>
        <TodoContent />
      </ProtectedRoute>
    </Suspense>
  );
}
