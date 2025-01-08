// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./routes";
import { UserProvider } from "./contexts/UserContext";

export default function App() {
  return (
    <Router>
      <UserProvider>
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))}
        </Routes>
      </UserProvider>
    </Router>
  );
}