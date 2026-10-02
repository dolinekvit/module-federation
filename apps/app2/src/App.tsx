import { Link, Route, Routes } from "react-router";
import { useNotification, useUser } from "@mfe/contracts";

function Overview() {
  const user = useUser();
  const { notify, notifications } = useNotification();
  const latest = notifications.at(-1);

  return (
    <>
      <p>{user ? `Signed in as ${user.name}` : "Not signed in"}</p>
      <p>{latest ? `Latest message: ${latest}` : "No messages yet"}</p>
      <p>
        <button
          type="button"
          onClick={() =>
            notify(`Hello from App 2 at ${new Date().toLocaleTimeString()}`)
          }
        >
          Notify shell
        </button>
      </p>
      <Link to="history">Message history</Link>
    </>
  );
}

function History() {
  const { notifications } = useNotification();

  return (
    <>
      <h3>Message history</h3>
      {notifications.length === 0 ? (
        <p>No messages yet</p>
      ) : (
        <ol>
          {notifications.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ol>
      )}
      <Link to="..">Back to overview</Link>
    </>
  );
}

export default function App() {
  return (
    <section>
      <h2>App 2</h2>
      <Routes>
        <Route index element={<Overview />} />
        <Route path="history" element={<History />} />
      </Routes>
    </section>
  );
}
