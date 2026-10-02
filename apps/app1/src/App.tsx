import { Link, Route, Routes, useParams } from "react-router";
import { useNotification, useUser } from "@mfe/contracts";

const items = [
  { id: "1", title: "First item" },
  { id: "2", title: "Second item" },
  { id: "3", title: "Third item" },
];

function List() {
  const user = useUser();
  const { notify } = useNotification();

  return (
    <>
      <p>{user ? `Signed in as ${user.name}` : "Not signed in"}</p>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <Link to={`details/${item.id}`}>{item.title}</Link>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() =>
          notify(`Hello from App 1 at ${new Date().toLocaleTimeString()}`)
        }
      >
        Notify shell
      </button>
    </>
  );
}

function Details() {
  const { id } = useParams();
  const item = items.find((candidate) => candidate.id === id);

  return (
    <>
      <h3>{item ? item.title : "Unknown item"}</h3>
      <p>Item id: {id}</p>
      <Link to="..">Back to list</Link>
    </>
  );
}

export default function App() {
  return (
    <section>
      <h2>App 1</h2>
      <Routes>
        <Route index element={<List />} />
        <Route path="details/:id" element={<Details />} />
      </Routes>
    </section>
  );
}
