import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { CreateBook } from "./pages/CreateBook";
import { MyLibrary } from "./pages/MyLibrary";
import { AvailableBooks } from "./pages/AvailableBooks";
import { Requests } from "./pages/Requests";

// ================= LAYOUT PÚBLICO =================
const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

// ================= ROTAS PROTEGIDAS =================
const ProtectedRoute = () => {
  const token = localStorage.getItem("token_biblioteca");

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* ================= ÁREA PÚBLICA ================= */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />

            {/* Catálogo Público */}
            <Route path="/catalog" element={<AvailableBooks />} />
          </Route>

          {/* ================= AUTENTICAÇÃO ================= */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ================= ÁREA PRIVADA ================= */}
          <Route element={<ProtectedRoute />}>
            <Route path="/books/create" element={<CreateBook />} />
            <Route path="/library" element={<MyLibrary />} />
            <Route path="/requests" element={<Requests />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;