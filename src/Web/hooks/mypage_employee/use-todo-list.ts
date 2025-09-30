"use client"

import { useState, useCallback } from "react"
import { useLocalStorage } from "./use-local-storage"
import { getCurrentDateString } from "@/lib/mypage_employee/date-utils"
import type { TodoItem, TodoPriority } from "@/types/mypage_employee"

const INITIAL_TODOS: TodoItem[] = [
  {
    id: "1",
    title: "이력서 업데이트",
    description: "최신 프로젝트 경험 추가",
    isCompleted: false,
    priority: "높음",
    category: "이력서",
    dueDate: "2024-03-20",
    createdAt: "2024-03-15",
  },
  {
    id: "2",
    title: "포트폴리오 사이트 개선",
    description: "반응형 디자인 적용",
    isCompleted: true,
    priority: "보통",
    category: "포트폴리오",
    createdAt: "2024-03-10",
  },
  {
    id: "3",
    title: "네트워킹 이벤트 참석",
    description: "개발자 밋업 참가",
    isCompleted: false,
    priority: "낮음",
    category: "네트워킹",
    dueDate: "2024-03-25",
    createdAt: "2024-03-12",
  },
]

export function useTodoList() {
  const [todos, setTodos] = useLocalStorage<TodoItem[]>("mypage-todos", INITIAL_TODOS)
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")
  const [sortBy, setSortBy] = useState<"date" | "priority" | "category">("date")

  const addTodo = useCallback(
    (title: string, description?: string, priority: TodoPriority = "보통", category = "기타", dueDate?: string) => {
      const newTodo: TodoItem = {
        id: Date.now().toString(),
        title,
        description,
        isCompleted: false,
        priority,
        category,
        dueDate,
        createdAt: getCurrentDateString(),
      }

      setTodos((prev) => [...prev, newTodo])
    },
    [setTodos],
  )

  const toggleTodo = useCallback(
    (id: string) => {
      setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo)))
    },
    [setTodos],
  )

  const updateTodo = useCallback(
    (id: string, updates: Partial<TodoItem>) => {
      setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo)))
    },
    [setTodos],
  )

  const deleteTodo = useCallback(
    (id: string) => {
      setTodos((prev) => prev.filter((todo) => todo.id !== id))
    },
    [setTodos],
  )

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((todo) => !todo.isCompleted))
  }, [setTodos])

  const getFilteredTodos = useCallback(() => {
    let filtered = todos

    // Apply filter
    switch (filter) {
      case "active":
        filtered = filtered.filter((todo) => !todo.isCompleted)
        break
      case "completed":
        filtered = filtered.filter((todo) => todo.isCompleted)
        break
      default:
        // "all" - no filtering needed
        break
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "priority":
          const priorityOrder = { 높음: 3, 보통: 2, 낮음: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case "category":
          return a.category.localeCompare(b.category)
        case "date":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })
  }, [todos, filter, sortBy])

  const getStats = useCallback(() => {
    const total = todos.length
    const completed = todos.filter((todo) => todo.isCompleted).length
    const active = total - completed
    const overdue = todos.filter(
      (todo) => !todo.isCompleted && todo.dueDate && new Date(todo.dueDate) < new Date(),
    ).length

    return { total, completed, active, overdue }
  }, [todos])

  return {
    todos: getFilteredTodos(),
    filter,
    sortBy,
    setFilter,
    setSortBy,
    addTodo,
    toggleTodo,
    updateTodo,
    deleteTodo,
    clearCompleted,
    stats: getStats(),
  }
}
