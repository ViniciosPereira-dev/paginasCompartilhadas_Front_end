import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { CreateBook } from "./pages/CreateBook";
import { MyLibrary } from "./pages/MyLibrary"; 


// LAYOUT COM MENU (Navbar/Footer) para as páginas institucionais
const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      <main>
        <Outlet /> 
      </main>
      <Footer />
    </div>
  );
};

// 2. COMPONENTE DE PROTEÇÃO (GUARDA DE TRÂNSITO DAS ROTAS)
const ProtectedRoute = () => {
  const token = localStorage.getItem("token_biblioteca");

  // Se o token existir, renderiza a página interna (através do <Outlet />)
  // Se não existir, cancela a ação e chuta o usuário para o /login
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
          </Route>

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/books/create" element={<CreateBook />} />
            <Route path="/library" element={<MyLibrary />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
