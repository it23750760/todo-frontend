import { useEffect, useState } from "react";

const localApiUrl = "http://localhost:5000/api/todos";
const deployedApiUrl =
  "https://todo-backend-e2cde5and7atd4az.eastasia-01.azurewebsites.net/api/todos";

const resolvedApiUrl =
  import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? localApiUrl : deployedApiUrl);

export default function App() {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!resolvedApiUrl) {
      setError(
        "API URL is not configured. Set VITE_API_URL to your deployed backend before building the frontend."
      );
      return;
    }

    async function loadTodos() {
      try {
        const response = await fetch(resolvedApiUrl);

        if (!response.ok) {
          throw new Error("Failed to load todos.");
        }

        const data = await response.json();
        setTodos(data);
      } catch (loadError) {
        setError(loadError.message);
      }
    }

    loadTodos();
  }, []);

  function toggleTodoStatus(todoId) {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === todoId ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    );
  }

  function markAllDone() {
    setTodos((currentTodos) =>
      currentTodos.map((todo) => ({ ...todo, isCompleted: true }))
    );
  }

  function resetAll() {
    setTodos((currentTodos) =>
      currentTodos.map((todo) => ({ ...todo, isCompleted: false }))
    );
  }

  return (
    <main className="page">
      <section className="card">
        <p className="eyebrow">Lab 05</p>
        <h1>Todo App</h1>
        <p className="description">Simple React frontend connected to a .NET backend API.</p>

        {error ? <p className="error">{error}</p> : null}

        <div className="actions">
          <button type="button" className="action-button primary" onClick={markAllDone}>
            Mark All Done
          </button>
          <button type="button" className="action-button secondary" onClick={resetAll}>
            Reset All
          </button>
        </div>

        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.id} className="todo-item">
              <div className="todo-copy">
                <span>{todo.title}</span>
                <strong>{todo.isCompleted ? "Done" : "Pending"}</strong>
              </div>
              <button
                type="button"
                className="toggle-button"
                onClick={() => toggleTodoStatus(todo.id)}
              >
                {todo.isCompleted ? "Mark Pending" : "Mark Done"}
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
