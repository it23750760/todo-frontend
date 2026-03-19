import { useEffect, useState } from "react";

const localApiUrl = "/api/todos";
const deployedApiUrl = "todo-backend-e2cde5and7atd4az.eastasia-01.azurewebsites.net";

const resolvedApiUrl =
  import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? localApiUrl : deployedApiUrl);

export default function App() {
  const [todos, setTodos] = useState([]);
  const [sourceTodos, setSourceTodos] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [lastSyncedAt, setLastSyncedAt] = useState("");

  async function loadTodos() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(resolvedApiUrl);

      if (!response.ok) {
        throw new Error("Failed to load todos.");
      }

      const data = await response.json();
      setTodos(data);
      setSourceTodos(data);
      setLastSyncedAt(new Date().toLocaleTimeString());
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!resolvedApiUrl) {
      setError(
        "API URL is not configured. Set VITE_API_URL to your deployed backend before building the frontend."
      );
      setLoading(false);
      return;
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

  const completedCount = todos.filter((todo) => todo.isCompleted).length;
  const backendConnected = !loading && !error && sourceTodos.length > 0;
  const hasLocalChanges = todos.some(
    (todo, index) => todo.isCompleted !== sourceTodos[index]?.isCompleted
  );
  const sourceLabel = import.meta.env.DEV ? "Local API" : "Azure API";

  return (
    <main className="page">
      <section className="card">
        <div className="hero">
          <div>
            <p className="eyebrow">Lab 05</p>
            <h1>Todo Control Panel</h1>
            <p className="description">
              This UI starts from backend data. If the API is unavailable, the app has nothing to
              manage.
            </p>
          </div>

          <div className={backendConnected ? "status-pill status-pill--ok" : "status-pill"}>
            {loading ? "Connecting..." : backendConnected ? "Backend Connected" : "Backend Required"}
          </div>
        </div>

        <section className="stats-grid">
          <article className="stat-card stat-card--accent">
            <span className="stat-label">Source</span>
            <strong className="stat-value">{sourceLabel}</strong>
            <span className="stat-note">{resolvedApiUrl}</span>
          </article>
          <article className="stat-card">
            <span className="stat-label">Last sync</span>
            <strong className="stat-value">{lastSyncedAt || "Not synced yet"}</strong>
            <span className="stat-note">
              {hasLocalChanges ? "Local changes differ from backend snapshot" : "Matches backend snapshot"}
            </span>
          </article>
          <article className="stat-card">
            <span className="stat-label">Progress</span>
            <strong className="stat-value">
              {completedCount}/{todos.length}
            </strong>
            <span className="stat-note">Completed tasks in current session</span>
          </article>
        </section>

        {error ? <p className="error">{error}</p> : null}

        <div className="info-banner">
          <strong>Backend role:</strong> the todo list is fetched from the API, and reload pulls the
          original server snapshot back into the UI.
        </div>

        <div className="actions">
          <button
            type="button"
            className="action-button primary"
            onClick={loadTodos}
            disabled={loading}
          >
            {loading ? "Loading..." : "Reload From API"}
          </button>
          <button
            type="button"
            className="action-button secondary"
            onClick={markAllDone}
            disabled={loading || todos.length === 0}
          >
            Mark All Done
          </button>
          <button
            type="button"
            className="action-button secondary"
            onClick={resetAll}
            disabled={loading || todos.length === 0}
          >
            Reset Local
          </button>
        </div>

        {todos.length === 0 && !loading ? (
          <div className="empty-state">
            <strong>No backend data available</strong>
            <span>Start the API or redeploy it, then reload this frontend.</span>
          </div>
        ) : (
          <ul className="todo-list">
            {todos.map((todo) => (
              <li key={todo.id} className="todo-item">
                <div className="todo-copy">
                  <span className="todo-title">{todo.title}</span>
                  <strong className={todo.isCompleted ? "todo-state todo-state--done" : "todo-state"}>
                    {todo.isCompleted ? "Done" : "Pending"}
                  </strong>
                </div>
                <button
                  type="button"
                  className="toggle-button"
                  onClick={() => toggleTodoStatus(todo.id)}
                  disabled={loading}
                >
                  {todo.isCompleted ? "Mark Pending" : "Mark Done"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
