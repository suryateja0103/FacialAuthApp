"use client"

export const dynamic = "force-dynamic"; // 👈 ADD THIS LINE

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import ProtectedRoute from "@/components/protected-route"
import { Suspense } from "react"

type Todo = {
  id: string
  task: string
  completed: boolean
}

// ...rest of your component stays the same


export default function TodoPage() {
  
  const searchParams = useSearchParams()
  const userId = `${searchParams.get("firstName")}.${searchParams.get("lastName")}`

  const [todos, setTodos] = useState<Todo[]>([])
  const [newTask, setNewTask] = useState("")

  // Load from localStorage or set predefined tasks
  useEffect(() => {
    const stored = localStorage.getItem(`todos-${userId}`)

    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTodos(parsed)
          return
        }
      } catch (err) {
        console.error("Error parsing todos from localStorage", err)
      }
    }

    // Default predefined tasks
    const predefined: Todo[] = [
      { id: "1", task: "✅ Check-in at front desk", completed: false },
      { id: "2", task: "📸 Complete facial authentication", completed: false },
      { id: "3", task: "🧰 Collect safety gear", completed: false },
      { id: "4", task: "📋 Review work assignments", completed: false },
    ]
    setTodos(predefined)
    localStorage.setItem(`todos-${userId}`, JSON.stringify(predefined))
  }, [userId])

  // Save todos to localStorage on change
  useEffect(() => {
    localStorage.setItem(`todos-${userId}`, JSON.stringify(todos))
  }, [todos, userId])

  const addTodo = () => {
    if (!newTask.trim()) return
    const newTodo: Todo = {
      id: Date.now().toString(),
      task: newTask,
      completed: false,
    }
    setTodos([...todos, newTodo])
    setNewTask("")
  }

  const toggleComplete = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
    <ProtectedRoute>
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
    </ProtectedRoute>
    </Suspense> 
  )
}

