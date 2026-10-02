import { useState } from "react";
import { NavLink, Route, Routes } from "react-router";
import { UserContext, useNotification } from "@mfe/contracts";
import type { User } from "@mfe/contracts";
import { RemoteApp } from "./RemoteApp";
import { ToastProvider } from "./ToastProvider";
import { createRemoteLoader } from "./remoteLoader";

const loadApp1 = createRemoteLoader("app1", () => import("app1/App"));
const loadApp2 = createRemoteLoader("app2", () => import("app2/App"));

const demoUser: User = { id: "1", name: "Vít Dolínek" };

function Home() {
  return (
    <section>
      <h2>Shell</h2>
      <p>
        This page belongs to the shell. App 1 and App 2 are separate
        applications loaded at runtime when their route is visited.
      </p>
    </section>
  );
}

function NotFound() {
  return (
    <section>
      <h2>Page not found</h2>
    </section>
  );
}

function NotificationBadge() {
  const { notifications } = useNotification();

  return (
    <span className="badge" aria-label="Notifications">
      {notifications.length}
    </span>
  );
}

export function App() {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext value={user}>
      <ToastProvider>
        <div className="shell">
          <header className="shell-header">
            <strong>Shell</strong>
            <nav>
              <NavLink to="/" end>
                Home
              </NavLink>
              <NavLink to="/app1">App 1</NavLink>
              <NavLink to="/app2">App 2</NavLink>
            </nav>
            <NotificationBadge />
            <button
              type="button"
              onClick={() => setUser((current) => (current ? null : demoUser))}
            >
              {user ? `Sign out ${user.name}` : "Sign in"}
            </button>
          </header>
          <main className="shell-content">
            <Routes>
              <Route index element={<Home />} />
              <Route
                path="app1/*"
                element={<RemoteApp key="app1" name="App 1" load={loadApp1} />}
              />
              <Route
                path="app2/*"
                element={<RemoteApp key="app2" name="App 2" load={loadApp2} />}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </ToastProvider>
    </UserContext>
  );
}
