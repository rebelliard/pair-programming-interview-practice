import { createRoot } from "react-dom/client";
import { App } from "./App";
import { createApi, fetchTransport } from "./api";
import "./index.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Missing #root element");
}

createRoot(root).render(<App api={createApi(fetchTransport)} />);
