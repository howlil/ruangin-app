// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./routes";

export default function App() {
  return (
    <Router>
      <Routes>
        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={route.element}
          />
        ))}
      </Routes>
    </Router>
  );
}