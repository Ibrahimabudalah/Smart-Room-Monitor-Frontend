import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected with Layout */}
        <Route
          path="/dashboard"
          element={
            // <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
            // </ProtectedRoute>
          }
        />

        <Route
          path="/chat"
          element={
            // <ProtectedRoute>
            <Layout>
              <Chat />
            </Layout>
            // </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
