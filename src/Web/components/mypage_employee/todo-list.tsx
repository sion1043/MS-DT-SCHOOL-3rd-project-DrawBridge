"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Plus, X } from "lucide-react"

interface Todo {
  id: number
  text: string
  completed: boolean
  xp: number
}

interface TodoListProps {
  todos: Todo[]
  setTodos: (todos: Todo[]) => void
}

export function TodoList({ todos, setTodos }: TodoListProps) {
  const [newTodo, setNewTodo] = useState("")

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: newTodo,
          completed: false,
          xp: Math.floor(Math.random() * 50) + 20,
        },
      ])
      setNewTodo("")
    }
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            TO DO LIST
            <Badge variant="secondary">{todos.filter((t) => !t.completed).length}개 남음</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-6">
            <Input
              placeholder="새로운 할일을 입력하세요..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTodo()}
            />
            <Button onClick={addTodo} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-3">
            {todos.map((todo) => (
              <div key={todo.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Checkbox checked={todo.completed} onCheckedChange={() => toggleTodo(todo.id)} />
                  <span className={`${todo.completed ? "line-through text-muted-foreground" : ""}`}>{todo.text}</span>
                  <Badge variant="outline" className="text-xs">
                    +{todo.xp}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
