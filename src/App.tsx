import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "@/components/Layout";
import Chat from "@/pages/Chat";
import Dashboard from "@/pages/Dashboard";

function App() {
  return (
    <div className="theme min-h-screen">
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="/dashboard" element={<Navigate replace to="/" />} />
            <Route path="/chat" element={<Chat />} />
          </Route>
          <Route
            path="*"
            element={<Navigate replace to="/" />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
