import { BrowserRouter as Router,Routes,Route } from "react-router-dom"
import Beranda from "./pages/user/beranda"

export default function App() {
  return (
    <>
      <Router>
        <Routes>
            <Route path="/" element={<Beranda/>} />
        </Routes>
      </Router>
    </>
  ) 
}
